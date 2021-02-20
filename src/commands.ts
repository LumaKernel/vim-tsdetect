import { workspace, commands, window } from "coc.nvim";
import { ConfigType, getSettings } from "./settings";

export const initializeDenoWorkspace = async () => {
  const config = workspace.getConfiguration("tsdetect");
  config.update("mode", "manual");

  await commands.executeCommand("deno.initializeWorkspace");

  await commands.executeCommand("editor.action.restart");

  await window.showInformationMessage("Node workspace settings configured!");
};

export const initializeNodeWorkspace = async () => {
  const config = workspace.getConfiguration("tsdetect");
  config.update("mode", "manual");

  const tsserverConfig = workspace.getConfiguration("tsserver");
  tsserverConfig.update("enable", true);

  const denoConfig = workspace.getConfiguration("deno");
  denoConfig.update("enable", false);

  await commands.executeCommand("editor.action.restart");

  await window.showInformationMessage("Deno workspace settings configured!");
};

export const configSwitch = async (
  target: "node" | "deno",
  setConfig: (ns: string, key: string, value: unknown) => Promise<void>,
) => {
  const settings = getSettings();
  await setConfig("tsserver", "enable", target === "node");
  await setConfig("deno", "enable", target === "deno");
  if (settings.controlTrimSameExts) {
    await setConfig("coc.source.file", "trimSameExts", [
      ...settings.controlTrimSameExtsBase,
      ...(target === "node"
        ? settings.controlTrimSameExtsNode
        : settings.controlTrimSameExtsDeno),
    ]);
  }
  await commands.executeCommand("editor.action.restart");
};
