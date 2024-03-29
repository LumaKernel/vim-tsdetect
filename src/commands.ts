import { commands, window, workspace } from 'coc.nvim';
import { setConfigWorkspace } from './set_config';
import type { Settings, TsRuntime } from './settings';
import { getSettings } from './settings';

const configure = async (runtime: TsRuntime, settings: Settings): Promise<void> => {
  await setConfigWorkspace('tsserver', 'enable', runtime === 'node');
  await setConfigWorkspace('deno', 'enable', runtime === 'deno');
  const override = runtime === 'node' ? settings.nodeOverride : settings.denoOverride;

  for (const key of Object.keys(override)) {
    const ns = key.split('.');
    const nsKey = ns.pop();
    if (typeof nsKey !== 'string') {
      await window.showWarningMessage(`Override key '${key}' does not include any dots.`);
      continue;
    }
    await setConfigWorkspace(ns.join('.'), nsKey, override[key]);
  }
  await commands.executeCommand('editor.action.restart');
};

export const manualInitializeWorkspace = async (runtime: TsRuntime): Promise<void> => {
  await setConfigWorkspace('tsdetect', 'mode', 'manual');
  const settings = getSettings();

  await configure(runtime, settings);

  await window.showInformationMessage(`${runtime === 'node' ? 'Node' : 'Deno'} workspace settings configured!`);
};

export const autoInitializeWorkspace = async (runtime: TsRuntime): Promise<void> => {
  const configuration = workspace.getConfiguration();
  const settings = getSettings();
  const exists = configuration.has('tsserver.enable');

  if (settings.doNotCreateOnNode && runtime === 'node' && !exists) return;

  const tsserverConfig = workspace.getConfiguration('tsserver');
  const denoConfig = workspace.getConfiguration('deno');

  if (exists && tsserverConfig.get('enable') && runtime === 'node') return;
  if (exists && denoConfig.get('enable') && runtime === 'deno') return;

  await configure(runtime, settings);

  await workspace.nvim.command(`doautocmd User tsdetect#coc#auto#switch#${runtime}#after`);
};
