import { workspace, commands, window } from "coc.nvim";

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
