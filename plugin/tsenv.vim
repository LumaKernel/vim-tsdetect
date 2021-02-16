if exists('g:tsenv_vim_loaded')
  finish
endif
let g:tsenv_vim_loaded = 1

autocmd FileType javascript,javascriptreact,typescript,typescript.tsx,typescriptreact ++nested
      \ execute "let b:is_node_detected = tsenv#util#find_node()"
      \ | doautocmd User tsenv#detected
autocmd BufRead,BufNewFile *.ts,*.js ++nested
      \ execute "let b:is_node_detected = tsenv#util#find_node()"
      \ | doautocmd User tsenv#detected
