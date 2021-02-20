function! tsdetect#init(once) abort
  function! s:detect_filetype() abort closure
    let b:tsdetect_is_node = tsdetect#util#is_node()
    if a:once
      autocmd! tsdetect#init
    endif
    doautocmd User tsdetect#detect
  endfunction

  function! s:detect_buffer(amatch) abort closure
    if a:amatch =~? '^deno:/\|\.tsx\?\|\.js$'
      let b:tsdetect_is_node = tsdetect#util#is_node()
      if a:once
        autocmd! tsdetect#init
      endif
      doautocmd User tsdetect#detect
    else
      let l:is_node_shebang = tsdetect#util#is_node_shebang()
      if l:is_node_shebang != v:null
        let b:tsdetect_is_node = l:is_node_shebang
        if a:once
          autocmd! tsdetect#init
        endif
        doautocmd User tsdetect#detect
      endif
    endif
  endfunction

  augroup tsdetect#init
    autocmd!
    autocmd FileType javascript,javascriptreact,typescript,typescript.tsx,typescriptreact ++nested call <SID>detect_filetype()
    autocmd BufEnter,BufNewFile,BufWritePost * ++nested call <SID>detect_buffer(expand('<amatch>'))
  augroup END

  call s:detect_buffer(expand('%'))
endfunction
