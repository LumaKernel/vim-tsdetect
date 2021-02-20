import { workspace, ExtensionContext, commands } from "coc.nvim";
import assert from "assert";
import { getSetConfig } from "../set_config";
import {
  configSwitch,
  initializeDenoWorkspace,
  initializeNodeWorkspace,
} from "../commands";
import { ConfigType, EXTENSION_NS, getSettings } from "../settings";

const initialize = async (_context: ExtensionContext) => {
  const settings = getSettings();
  const proms: Promise<unknown>[] = [];

  const setup = workspace.nvim.call("tsdetect#coc#setup_switch", [
    settings.mode,
    settings.configType,
  ]);

  if (settings.mode === "auto") {
    proms.push(
      workspace.nvim.call(`tsdetect#coc#auto#switch_${settings.configType}`),
    );
    proms.push(
      setup.then(() =>
        workspace.nvim.call("tsdetect#init", [
          settings.configType === "ephemeral",
        ]),
      ),
    );
  } else {
    proms.push(setup);
  }

  await Promise.all(proms);
};

export const activate = async (context: ExtensionContext) => {
  // Setup vim runtime settings as vim plugin.
  const rtp = await workspace.nvim.getOption("runtimepath");
  assert(typeof rtp === "string");
  const paths = rtp.split(",");
  if (!paths.includes(context.extensionPath)) {
    await workspace.nvim.command(
      `execute 'noautocmd set runtimepath^='.fnameescape('${context.extensionPath}')`,
    );
  }
  await workspace.nvim.command("runtime plugin/tsdetect.vim");

  // Setup manual commands.
  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NS}.manual.deno.initializeWorkspace`,
      initializeDenoWorkspace,
    ),
  );
  context.subscriptions.push(
    commands.registerCommand(
      `${EXTENSION_NS}.manual.node.initializeWorkspace`,
      initializeNodeWorkspace,
    ),
  );

  // Re-initialize every time configurations are changed.
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async (evt) => {
      if (evt.affectsConfiguration(EXTENSION_NS)) {
        await initialize(context);
      }
    }),
  );

  // Setup commands for automatic configuration.
  (["ephemeral", "workspace", "user"] as const).forEach(
    (configType: ConfigType) => {
      (["deno", "node"] as const).forEach((target) => {
        context.subscriptions.push(
          commands.registerCommand(
            `${EXTENSION_NS}.internal.${configType}.${target}.initializeWorkspace`,
            () => configSwitch(target, getSetConfig(configType)),
          ),
        );
      });
    },
  );

  // Initialize after launched coc-tsdetect.
  await initialize(context);
};
