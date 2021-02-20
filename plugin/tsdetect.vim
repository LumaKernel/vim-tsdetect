if exists('g:vim_tsdetect_loaded')
  finish
endif
let g:vim_tsdetect_loaded = 1

call tsdetect#init()

function! s:detect() abort
  if b:tsdetect_is_node
    doautocmd User tsdetect#detect#node
  else
    doautocmd User tsdetect#detect#deno
  endif
endfunction

augroup vim_tsdetect_augroup
  autocmd!
  autocmd User tsdetect#detect ++nested call <SID>detect()
augroup END
