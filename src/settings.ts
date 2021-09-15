import { workspace } from 'coc.nvim';
import assert from 'assert';

export const EXTENSION_NS = 'tsdetect';

export type TsRuntime = 'node' | 'deno';

export interface Settings {
  /** @default "auto" */
  mode: 'auto' | 'manual';
  /** @default true */
  doNotCreateOnNode: boolean;
  /** @default true */
  doNothingIfConfigExists: boolean;
  denoOverride: { [key: string]: unknown };
  nodeOverride: { [key: string]: unknown };
}
export const settingsKeys = ['mode', 'doNotCreateOnNode', 'doNothingIfConfigExists', 'denoOverride', 'nodeOverride'];

export const getSettings = (): Settings => {
  const settings = workspace.getConfiguration(EXTENSION_NS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = Object.create(null);
  settingsKeys.forEach((key) => {
    const value = settings.inspect(key);
    assert(value);
    result[key] = value.workspaceValue ?? value.globalValue ?? value.defaultValue;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
};
