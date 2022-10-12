import { workspace } from 'coc.nvim';

export const EXTENSION_NS = 'tsdetect';

export type TsRuntime = 'node' | 'deno';

export interface Settings {
  /** @default "auto" */
  mode: 'auto' | 'manual';
  /** @default true */
  doNotCreateOnNode: boolean;
  denoOverride: { [key: string]: unknown };
  nodeOverride: { [key: string]: unknown };
}
export const settingsKeys = ['mode', 'doNotCreateOnNode', 'doNothingIfConfigExists', 'denoOverride', 'nodeOverride'];

export const getSettings = (): Settings => {
  const settings = workspace.getConfiguration(EXTENSION_NS);
  const result: any = Object.create(null);
  settingsKeys.forEach((key) => {
    const value = settings.inspect(key);
    if (value) {
      result[key] = value.workspaceValue ?? value.globalValue ?? value.defaultValue;
    }
  });
  return result;
};
