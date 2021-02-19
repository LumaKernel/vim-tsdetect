let s:did_configured = 0

function! tsdetect#coc#auto#switch_deno() abort
  doautocmd User tsdetect#coc#auto#swtich#deno#before
  let s:did_configured = 1
  let g:tsdetect#coc#auto#switched_deno = 1
  let g:tsdetect#coc#auto#switched_node = 0
  call coc#config('deno.enable', v:true)
  call coc#config('tsserver.enable', v:false)
  CocRestart
  doautocmd User tsdetect#coc#auto#swtich#deno#after
endfunction

function! tsdetect#coc#auto#switch_node() abort
  doautocmd User tsdetect#coc#auto#swtich#node#after
  let s:did_configured = 1
  let g:tsdetect#coc#auto#switched_deno = 0
  let g:tsdetect#coc#auto#switched_node = 1
  doautocmd User tsdetect#coc#auto#swtich#node#after
endfunction

function! tsdetect#coc#auto#switch_deno_if_necessary() abort
  if s:did_configured
    return
  endif
  call tsdetect#coc#auto#switch_deno()
endfunction

function! tsdetect#coc#auto#switch_node_if_necessary() abort
  if s:did_configured
    return
  endif
  call tsdetect#coc#auto#switch_node()
endfunction

function! tsdetect#coc#auto#switch() abort
  if !exists('b:tsdetect_is_node')
    return
  endif
  if b:tsdetect_is_node
    call tsdetect#coc#auto#switch_node_if_necessary()
  else
    call tsdetect#coc#auto#switch_deno_if_necessary()
  endif
endfunction
