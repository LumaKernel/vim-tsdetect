import { workspace, ExtensionContext } from "coc.nvim";
import assert from "assert";
import { dump } from "../debug";

const EXTENSION_NS = "tsenv";

export interface Settings {
  mode: "auto" | "deno" | "node" | "manual";
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

export const activate = async (context: ExtensionContext) => {
  const rtp = await workspace.nvim.getOption("runtimepath");
  assert(typeof rtp === "string");
  const paths = rtp.split(",");
  if (!paths.includes(context.extensionPath)) {
    await workspace.nvim.command(
      `execute 'noautocmd set runtimepath^='.fnameescape('${context.extensionPath}')`,
    );
  }
  await workspace.nvim.command("runtime plugin/tsenv.vim");
  const settings = getSettings();
  dump(9);
  dump({ settings });
  try {
    await workspace.nvim.call("tsenv#coc#setup_switch", settings.mode, true);
  } catch (e: unknown) {
    dump(e);
  }
  dump(10);
};
