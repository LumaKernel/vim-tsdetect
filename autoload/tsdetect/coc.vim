function! tsdetect#coc#setup_switch(mode, config_type) abort
  augroup tsdetect#coc#setup_switch
    autocmd!
    if a:mode == 'auto'
      execute printf("autocmd User tsdetect#detect ++nested call tsdetect#coc#auto#switch_%s()", a:config_type)
    endif
  augroup END
endfunction
