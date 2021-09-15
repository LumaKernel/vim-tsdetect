import { commands, window, workspace } from 'coc.nvim';
import { ConfigurationTarget } from './coc_internal';
import { setConfigWorkspace } from './set_config';
import type { Settings, TsRuntime } from './settings';
import { getSettings } from './settings';

const configure = async (runtime: TsRuntime, settings: Settings): Promise<void> => {
  await setConfigWorkspace('tsserver', 'enable', runtime === 'node');
  await setConfigWorkspace('deno', 'enable', runtime === 'deno');
  await commands.executeCommand('editor.action.restart');
  const override = runtime === 'node' ? settings.nodeOverride : settings.denoOverride;

  /* eslint-disable no-restricted-syntax,no-await-in-loop,no-continue */
  for (const key of Object.keys(override)) {
    const ns = key.split('.');
    const nsKey = ns.pop();
    if (typeof nsKey !== 'string') {
      await window.showWarningMessage(`Override key '${key}' does not include any dots.`);
      continue;
    }
    await setConfigWorkspace(ns.join('.'), nsKey, override[key]);
  }
  /* eslint-enable no-restricted-syntax,no-await-in-loop,no-continue */
};

export const manualInitializeWorkspace = async (runtime: TsRuntime): Promise<void> => {
  await setConfigWorkspace('tsdetect', 'mode', 'manual');
  const settings = getSettings();

  await configure(runtime, settings);

  await commands.executeCommand('editor.action.restart');

  await window.showInformationMessage(`${runtime === 'node' ? 'Node' : 'Deno'} workspace settings configured!`);
};

export const autoInitializeWorkspace = async (runtime: TsRuntime): Promise<void> => {
  const workspaceConfigFile = workspace.getConfigFile(ConfigurationTarget.Workspace);
  const settings = getSettings();
  const exists = typeof workspaceConfigFile === 'string';

  if (settings.doNothingIfConfigExists && exists) return;
  if (settings.doNotCreateOnNode && runtime === 'node' && !exists) return;

  const tsserverConfig = workspace.getConfiguration('tsserver');
  const denoConfig = workspace.getConfiguration('deno');

  if (exists && tsserverConfig.get('enable') && runtime === 'node') return;
  if (exists && denoConfig.get('enable') && runtime === 'deno') return;

  await configure(runtime, settings);
  await commands.executeCommand('editor.action.restart');
  await workspace.nvim.command(`doautocmd User tsdetect#coc#auto#switch#${runtime}#after`);
};
