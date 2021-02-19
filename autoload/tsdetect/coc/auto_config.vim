function! tsdetect#coc#auto_config#switch_deno(mode) abort
  execute printf('doautocmd User tsdetect#coc#%s#swtich#deno#before', a:mode)
  execute printf('let g:tsdetect#coc#auto_config#%s_switched_deno = 1', a:mode)
  execute printf('let g:tsdetect#coc#auto_config#%s_switched_node = 0', a:mode)
  execute printf('CocCommand tsdetect.%s.deno.initializeWorkspace', a:mode)
endfunction

function! tsdetect#coc#auto_config#switch_node(mode) abort
  execute printf('doautocmd User tsdetect#coc#%s#swtich#node#before', a:mode)
  execute printf('let g:tsdetect#coc#auto_config#%s_switched_deno = 0', a:mode)
  execute printf('let g:tsdetect#coc#auto_config#%s_switched_node = 1', a:mode)
  execute printf('CocCommand tsdetect.%s.node.initializeWorkspace', a:mode)
endfunction

function! tsdetect#coc#auto_config#switch_deno_if_necessary(mode) abort
  if get(g:, printf('tsdetect#coc#auto_config#%s_switched_deno', a:mode), 0)
    return
  endif
  call tsdetect#coc#auto_config#switch_deno(a:mode)
endfunction

function! tsdetect#coc#auto_config#switch_node_if_necessary(mode) abort
  if get(g:, printf('tsdetect#coc#auto_config#%s_switched_node', a:mode), 0)
    return
  endif
  call tsdetect#coc#auto_config#switch_node(a:mode)
endfunction

function! tsdetect#coc#auto_config#switch(mode) abort
  if !exists('b:tsdetect_is_node')
    return
  endif
  if b:tsdetect_is_node
    call tsdetect#coc#auto_config#switch_node_if_necessary(a:mode)
  else
    call tsdetect#coc#auto_config#switch_deno_if_necessary(a:mode)
  endif
endfunction
