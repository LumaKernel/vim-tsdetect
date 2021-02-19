function! tsdetect#coc#setup_switch(switch_mode) abort
  augroup tsdetect#coc#setup_switch
    autocmd!
    if a:switch_mode == 'auto'
      autocmd User tsdetect#detect ++nested call tsdetect#coc#auto#switch()
    elseif a:switch_mode == 'auto_workspace_config'
      autocmd User tsdetect#detect ++nested call tsdetect#coc#auto_config#switch('auto_workspace_config')
    elseif a:switch_mode == 'auto_user_config'
      autocmd User tsdetect#detect ++nested call tsdetect#coc#auto_config#switch('auto_user_config')
    endif
  augroup END
endfunction
