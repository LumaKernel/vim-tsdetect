import { workspace } from "coc.nvim";
import { ConfigType } from "./settings";

export const setConfigEphemeral = async (
  ns: string,
  key: string,
  value: unknown,
) => {
  await workspace.nvim.call("coc#config", [`${ns}.${key}`, value]);
};

export const setConfigUser = async (
  ns: string,
  key: string,
  value: unknown,
) => {
  const config = workspace.getConfiguration(ns);
  config.update(key, value, true);
};

export const setConfigWorkspace = async (
  ns: string,
  key: string,
  value: unknown,
) => {
  const config = workspace.getConfiguration(ns);
  config.update(key, value);
};

export const getSetConfig = (configType: ConfigType) => {
  switch (configType) {
    case "ephemeral":
      return setConfigEphemeral;
    case "workspace":
      return setConfigWorkspace;
    case "user":
      return setConfigUser;
    default:
      throw new Error("Illegal configType.");
  }
};
