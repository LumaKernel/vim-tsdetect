import { workspace, ExtensionContext, commands } from "coc.nvim";
import assert from "assert";
import { initializeDenoWorkspace, initializeNodeWorkspace } from "../commands";

const EXTENSION_NS = "tsdetect";

export interface Settings {
  mode: "auto" | "auto_user_config" | "auto_workspace_config" | "manual";
}
export const settingsKeys = ["mode"];

const getSettings = (): Settings => {
  const settings = workspace.getConfiguration(EXTENSION_NS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = Object.create(null);
  settingsKeys.forEach((key) => {
    const value = settings.inspect(key);
    assert(value);
    result[key] =
      value.workspaceValue ?? value.globalValue ?? value.defaultValue;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
};

export const switchUseConfig = async (
  target: "node" | "deno",
  mode: "auto_workspace_config" | "auto_user_config",
) => {
  const tsserverConfig = workspace.getConfiguration("tsserver");
  tsserverConfig.update(
    "enable",
    target === "node",
    mode === "auto_user_config",
  );

  const denoConfig = workspace.getConfiguration("deno");
  denoConfig.update("enable", target === "deno", mode === "auto_user_config");

  await commands.executeCommand("editor.action.restart");
};

const initialize = async (_context: ExtensionContext) => {
  const settings = getSettings();
  const proms: Promise<unknown>[] = [];

  const setup = workspace.nvim.call("tsdetect#coc#setup_switch", [
    settings.mode,
  ]);

  if (
    settings.mode === "auto_user_config" ||
    settings.mode === "auto_workspace_config"
  ) {
    proms.push(
      workspace.nvim.call("tsdetect#coc#auto_config#switch", [settings.mode]),
    );
    proms.push(setup.then(() => workspace.nvim.call("tsdetect#init", [0])));
  } else if (settings.mode === "auto") {
    proms.push(workspace.nvim.call("tsdetect#coc#auto#switch"));
    proms.push(setup.then(() => workspace.nvim.call("tsdetect#init", [1])));
  } else {
    proms.push(setup);
  }

  await Promise.all(proms);
};

export const activate = async (context: ExtensionContext) => {
  const rtp = await workspace.nvim.getOption("runtimepath");
  assert(typeof rtp === "string");
  const paths = rtp.split(",");
  if (!paths.includes(context.extensionPath)) {
    await workspace.nvim.command(
      `execute 'noautocmd set runtimepath^='.fnameescape('${context.extensionPath}')`,
    );
  }
  await workspace.nvim.command("runtime plugin/tsdetect.vim");
  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NS}.deno.initializeWorkspace`,
      initializeDenoWorkspace,
    ),
  );
  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NS}.node.initializeWorkspace`,
      initializeNodeWorkspace,
    ),
  );
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async (evt) => {
      if (evt.affectsConfiguration(EXTENSION_NS)) {
        await initialize(context);
      }
    }),
  );
  (["auto_user_config", "auto_workspace_config"] as const).forEach((mode) => {
    (["deno", "node"] as const).forEach((target) => {
      context.subscriptions.push(
        commands.registerCommand(
          `${EXTENSION_NS}.${mode}.${target}.initializeWorkspace`,
          () => switchUseConfig(target, mode),
        ),
      );
    });
  });
  await initialize(context);
};
