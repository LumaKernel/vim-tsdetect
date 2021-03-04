function! tsdetect#coc#setup_switch(mode) abort
  augroup tsdetect#coc#setup_switch
    autocmd!
    if a:mode == 'auto'
      autocmd User tsdetect#detect ++nested if get(g:, 'coc_enabled', 0) | call tsdetect#coc#auto#switch() | endif
    endif
  augroup END
endfunction
