declare module 'coc.nvim' {
  import type { ConfigurationTarget } from './coc_internal';

  export namespace workspace {
    export function getConfigFile(target: ConfigurationTarget): string | undefined;
  }
}
