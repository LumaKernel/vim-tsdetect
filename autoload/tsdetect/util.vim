function! tsdetect#util#is_node_shebang() abort
  let l:first_line = getline(1)

  " Shebang is used and 'deno' is included
  if l:first_line =~# '^#!.*\<deno\>'
    return 0
  endif

  " Shebang is used and 'node' is included
  if l:first_line =~# '^#!.*\<node\>'
    return 1
  endif

  return v:null
endfunction

function! tsdetect#util#is_node() abort
  let l:is_node_shebang = tsdetect#util#is_node_shebang()
  if l:is_node_shebang != v:null
    return l:is_node_shebang
  endif

  let l:bufname = expand('%')

  " The buffer is deno lsp virtual file
  if l:bufname =~# '^deno:/'
    return 0
  endif

  " Directory node_modules/ is found recursively
  let l:path = empty(l:bufname) ? '.' : expand('%:p:h')
  return !empty(finddir('node_modules', l:path . ';'))
endfunction
