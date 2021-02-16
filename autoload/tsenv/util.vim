function! tsenv#util#find_node() abort
  let l:path = empty(expand('%')) ? '.' : '%:p:h'
  return empty(finddir('node_modules', l:path . ';'))
endfunction
