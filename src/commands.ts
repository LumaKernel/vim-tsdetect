import { commands, window } from "coc.nvim";
import { setConfigWorkspace } from "./set_config";
import { getSettings, Settings } from "./settings";

const createTrimSameExts = (settings: Settings, target: "node" | "deno") => {
  return [
    ...settings.controlTrimSameExtsBase,
    ...(target === "node"
      ? settings.controlTrimSameExtsNode
      : settings.controlTrimSameExtsDeno),
  ];
};

export const manualInitializeWorkspace = async (target: "node" | "deno") => {
  const settings = getSettings();
  await setConfigWorkspace("tsdetect", "mode", "manual");

  if (target === "node") {
    await setConfigWorkspace("tsserver", "enable", true);
    await setConfigWorkspace("deno", "enable", false);
  } else {
    await commands.executeCommand("deno.initializeWorkspace");
  }

  await commands.executeCommand("editor.action.restart");

  await window.showInformationMessage(
    `${target === "node" ? "Node" : "Deno"} workspace settings configured!`,
  );

  if (settings.controlTrimSameExts) {
    await setConfigWorkspace(
      "coc.source.file",
      "trimSameExts",
      createTrimSameExts(settings, target),
    );
  }
};

export const configSwitch = async (
  target: "node" | "deno",
  setConfig: (ns: string, key: string, value: unknown) => Promise<void>,
) => {
  const settings = getSettings();
  await setConfig("tsserver", "enable", target === "node");
  await setConfig("deno", "enable", target === "deno");
  if (settings.controlTrimSameExts) {
    await setConfig(
      "coc.source.file",
      "trimSameExts",
      createTrimSameExts(settings, target),
    );
  }
  await commands.executeCommand("editor.action.restart");
};
