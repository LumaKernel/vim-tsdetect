# vim-tsdetect

[![npm](https://img.shields.io/npm/v/coc-tsdetect?style=flat-square)](https://www.npmjs.com/package/coc-tsdetect)
[![Luma Style Guide](https://img.shields.io/badge/styled%20with-luma-%23c5ebeb?style=flat-square)](https://github.com/luma-dev/luma-style-guide#readme)
[![GitHub Workflow Status - CI](https://img.shields.io/github/workflow/status/LumaKernel/vim-tsdetect/CI?style=flat-square)](https://github.com/LumaKernel/vim-tsdetect/actions/workflows/ci.yml?query=branch%3Amain)
[![Codecov](https://img.shields.io/codecov/c/github/LumaKernel/vim-tsdetect?style=flat-square)](https://app.codecov.io/gh/LumaKernel/vim-tsdetect)

`vim-tsdetect`/`coc-tsdetect` provides [vim](https://github.com/vim/vim)/[neovim](https://github.com/neovim/neovim) and [`coc.nvim`](https://github.com/neoclide/coc.nvim) extension to initialize workspace automatically for [`coc-tsserver`](https://github.com/neoclide/coc-tsserver) and [`coc-deno`](https://github.com/fannheyward/coc-deno).

## Installation

Run `:CocInstall coc-tsdetect` in vim/neovim or install `vim-tsdetect` with your favorite plugin manager and build with `pnpm install && pnpm run build`. It is enough to install one of them.

## How does this detect TS environments?

Checking following in order.

1. If buffer name starts with `deno:/` -> **deno**  
2. If buffer name ends with `.js`, `.ts`, `.tsx` -> check following in order  
    a. Shebang is present and including `node` -> **node**  
    b. Shebang is present and including `deno` -> **deno**  
    c. `node_modules/` directory is found in ancestors of (following) -> **node**  
        - If buffer name is not empty, search from that path.  
        - Otherwise, search from current working directory.  
    d. Otherwise. -> **deno**  
3. -> Check following in order  
    a. Shebang is present and including `node` -> **node**  
    b. Shebang is present and including `deno` -> **deno**  
4. Otherwise, nothing is detected.  

## When does this try to detect?

This tries to detect when following events occurred.

- `FileType javascript,javascriptreact,typescript,typescript.tsx,typescriptreact`
- `BufEnter,BufNewFile,BufWritePost *`

## Options

Please configure following if necessary by `:CocConfig`.

### `tsdetect.mode`

Set this `"manual"` to disable auto initialization. Variable `b:tsdetect_is_node` remains available.

Values: `"auto" | "manual"`

Default:

```json
{
  "tsdetect.mode": "auto"
}
```

### `tsdetect.doNotCreateOnNode`

By default, in Node.js environment, tsdetect does not create a workspace configuration (`.vim/coc-settings.json`). Set this `false` to create configuration file whether the configuration exists.

Values: `boolean`

Default:

```json
{
  "tsdetect.doNotCreateOnNode": true
}
```

### `tsdetect.doNothingIfConfigExists`

By default, tsdetect does not touch a workspace configuration (`.vim/coc-settings.json`) originally there. Set this `false` to touch configuration even though the configuration already exists. This is suitable for switching frequently `node` and `deno` without touching configuration manually.


Values: `boolean`

Default:

```json
{
  "tsdetect.doNothingIfConfigExists": true
}
```

### `tsdetect.nodeOverride`

Workspace configuration to be set in Node.js environment. If you want to extend original configuration, you need to include default ones. Not recommended to touch `deno.enable` and `tsserver.enable`.

Values: `object`

Default:

```json
{
  "tsdetect.nodeOverride": {
    "deno.lint": false,
    "coc.source.file.trimSameExts": [
      ".js",
      ".ts"
    ],
    "prettier.disableLanguages": []
  }
}
```

### `tsdetect.denoOverride`

Workspace configuration to be set in Deno environment. If you want to extend original configuration, you need to include default ones. Not recommended not to touch `deno.enable` and `tsserver.enable`.

Values: `object`

Default:

```json
{
  "tsdetect.denoOverride": {
    "deno.lint": true,
    "coc.source.file.trimSameExts": [],
    "prettier.disableLanguages": [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact"
    ]
  }
}
```

## Events

### `tsdetect#detect`

Fired when the tsdetect detects TypeScript environment in the flow shown in above.

### `tsdetect#detect#node`

Fired when `tsdetect#detect` is fired and environment was detected as node.

### `tsdetect#detect#deno`

Fired when `tsdetect#detect` is fired and environment was detected as deno.

### `tsdetect#coc#auto#switch#node#after`

Fired after the automatic switch to node triggered and finished.

### `tsdetect#coc#auto#switch#deno#after`

Fired after the automatic switch to deno triggered and finished.

## Variables

### `b:tsdetect_is_node`

Set when `tsdetect#detect` is fired.

## Limitations

- Not recommended to include `deno.enable` and `tsserver.enable` settings in user configuration (`~/.vim/coc-settings.json` that can be opened by `:CocConfig`).
- To prevent `.vim/` directory being committed by VCS, you can globally ignore `.vim/`, or ignore one by one using `git update-index --skip-worktree .vim` for git projects.

## Example Configurations

Example for deno.cache on save if deno environment is detected:
```vim
function! s:my_coc_tsdetect_buf_write_post() abort
  if !get(g:, 'coc_enabled', 0)
    return
  endif
  if exists('b:tsdetect_is_node') && !b:tsdetect_is_node
    CocCommand deno.cache
  endif
endfunction

augroup my-coc-tsdetect
  autocmd!
  autocmd BufWritePost * call <SID>my_coc_tsdetect_buf_write_post()
augroup END
```

## LICENSE

[MIT](./LICENSE)

## Author

[Luma](https://github.com/LumaKernel)
