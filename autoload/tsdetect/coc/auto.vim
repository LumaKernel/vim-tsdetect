for [s:node, s:deno] in [["node", "deno"], ["deno", "node"]]
  execute join([
  \   printf("function! tsdetect#coc#auto#switch_%s() abort", s:node),
  \   printf("  let g:tsdetect#coc#auto#switched_%s = 1", s:node),
  \   printf("  let g:tsdetect#coc#auto#switched_%s = 0", s:deno),
  \   printf("  CocCommand tsdetect.internal.%s.initializeWorkspace", s:node),
  \   printf("endfunction"),
  \   printf(""),
  \   printf("function! tsdetect#coc#auto#switch_%s_if_necessary() abort", s:node),
  \   printf("  if get(g:, 'tsdetect#coc#auto#switched_%s', 0)", s:node),
  \   printf("    return"),
  \   printf("  endif"),
  \   printf("  call tsdetect#coc#auto#switch_%s()", s:node),
  \   printf("endfunction"),
  \ ], "\n")
endfor

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
