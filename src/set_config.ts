/* eslint-disable import/prefer-default-export */
import { workspace } from 'coc.nvim';

export const setConfigWorkspace = async (ns: string, key: string, value: unknown): Promise<void> => {
  const config = workspace.getConfiguration(ns);
  config.update(key, value);
};
/* eslint-enable import/prefer-default-export */
