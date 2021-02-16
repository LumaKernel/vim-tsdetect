function! tsenv#coc#switch_deno() abort
  call coc#config('deno.enable', v:true)
  call coc#config('tsserver.enable', v:false)
endfunction

function! tsenv#coc#switch_node() abort
  call coc#config('deno.enable', v:false)
  call coc#config('tsserver.enable', v:ture)
endfunction

function! tsenv#coc#switch_auto() abort
  if b:is_node_detected
    tsenv#coc#start_deno_mode()
  else
    tsenv#coc#start_node_mode()
  endif
endfunction

function! tsenv#coc#switch(switch_mode) abort
  if exists('*tsenv#coc#switch_' . a:switch_mode)
    call tsenv#coc#switch_{a:switch_mode}()
  endif
endfunction

function! tsenv#coc#setup_switch(switch_mode) abort
  augroup tsenv#coc#setup_switch
    autocmd!
    execute printf('autocmd FileType javascript,javascriptreact,typescript,typescript.tsx,typescriptreact call tsenv#coc#switch(%s)', string(a:switch_mode))
    execute printf('autocmd BufRead,BufNewFile *.ts,*.js call tsenv#coc#switch(%s)', string(a:switch_mode))
  augroup END
endfunction
