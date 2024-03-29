import type { ExtensionContext } from 'coc.nvim';
import { workspace, commands } from 'coc.nvim';
import { autoInitializeWorkspace, manualInitializeWorkspace } from '../commands';
import { EXTENSION_NS, getSettings } from '../settings';

const initialize = async (_context: ExtensionContext): Promise<void> => {
  const settings = getSettings();
  const proms: Promise<unknown>[] = [];

  proms.push(workspace.nvim.call('tsdetect#coc#setup_switch', [settings.mode]));

  if (settings.mode === 'auto') {
    proms.push(workspace.nvim.call('tsdetect#coc#auto#switch'));
  }

  await Promise.all(proms);
};

export const activate = async (context: ExtensionContext): Promise<void> => {
  // Setup vim runtime settings as vim plugin.
  const rtp = await workspace.nvim.getOption('runtimepath');
  if (typeof rtp !== 'string') throw new Error('[coc-tsdetect] Failed to get runtimepath.');
  const paths = rtp.split(',');
  if (!paths.includes(context.extensionPath)) {
    await workspace.nvim.command(`execute 'noautocmd set runtimepath^='.fnameescape('${context.extensionPath}')`);
  }
  await workspace.nvim.command('runtime plugin/tsdetect.vim');

  // Setup manual commands.
  (['deno', 'node'] as const).forEach((target) => {
    context.subscriptions.push(
      commands.registerCommand(`${EXTENSION_NS}.manual.${target}.initializeWorkspace`, () =>
        manualInitializeWorkspace(target),
      ),
    );
  });

  // Re-initialize every time configurations are changed.
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async (evt) => {
      if (evt.affectsConfiguration(EXTENSION_NS)) {
        await initialize(context);
      }
    }),
  );

  // Setup commands for automatic configuration.
  (['deno', 'node'] as const).forEach((target) => {
    context.subscriptions.push(
      commands.registerCommand(`${EXTENSION_NS}.internal.${target}.initializeWorkspace`, () =>
        autoInitializeWorkspace(target),
      ),
    );
  });

  // Initialize after launched coc-tsdetect.
  await initialize(context);
};
