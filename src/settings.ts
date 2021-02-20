import { workspace } from "coc.nvim";
import assert from "assert";

export const EXTENSION_NS = "tsdetect";

export type ConfigType = "ephemeral" | "user" | "workspace";

export interface Settings {
  mode: "auto" | "manual";
  configType: ConfigType;
  controlTrimSameExts: boolean;
  controlTrimSameExtsBase: string[];
  controlTrimSameExtsNode: string[];
  controlTrimSameExtsDeno: string[];
}
export const settingsKeys = [
  "mode",
  "configType",
  "controlTrimSameExts",
  "controlTrimSameExtsBase",
  "controlTrimSameExtsNode",
  "controlTrimSameExtsDeno",
];

export const getSettings = (): Settings => {
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
