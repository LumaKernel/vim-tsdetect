let s:ephemeral_did_configured = 0

let s:ephemeral_condition = "if s:ephemeral_did_configured"
let s:permanent_condition = "if get(g:, 'tsdetect#coc#auto#switched_%s_%s', 0)"

for [s:config_type, s:condition] in [
  \   ["ephemeral", s:ephemeral_condition],
  \   ["workspace", s:permanent_condition],
  \   ["user", s:permanent_condition],
  \ ]
  for [s:node, s:deno] in [["node", "deno"], ["deno", "node"]]
    execute join([
    \   printf("function! tsdetect#coc#auto#switch_%s_%s() abort", s:config_type, s:node),
    \   printf("  doautocmd User tsdetect#coc#auto#swtich#%s#%s#before", s:config_type, s:node),
    \   s:config_type == 'ephemeral' ? "let s:ephemeral_did_configured = 1" : "",
    \   printf("  let g:tsdetect#coc#auto#switched_%s_%s = 1", s:config_type, s:node),
    \   printf("  let g:tsdetect#coc#auto#switched_%s_%s = 0", s:config_type, s:deno),
    \   printf("  CocCommand tsdetect.internal.%s.%s.initializeWorkspace", s:config_type, s:node),
    \   printf("endfunction"),
    \   printf(""),
    \   printf("function! tsdetect#coc#auto#switch_%s_%s_if_necessary() abort", s:config_type, s:node),
    \   s:config_type == 'ephemeral' ? s:ephemeral_condition : printf(s:permanent_condition, s:config_type, s:node),
    \   printf("    return"),
    \   printf("  endif"),
    \   printf("  call tsdetect#coc#auto#switch_%s_%s()", s:config_type, s:node),
    \   printf("endfunction"),
    \ ], "\n")
  endfor
  execute join([
  \   printf("function! tsdetect#coc#auto#switch_%s() abort", s:config_type),
  \   printf("  if !exists('b:tsdetect_is_node')"),
  \   printf("    return"),
  \   printf("  endif"),
  \   printf("  if b:tsdetect_is_node"),
  \   printf("    call tsdetect#coc#auto#switch_%s_node_if_necessary()", s:config_type),
  \   printf("  else"),
  \   printf("    call tsdetect#coc#auto#switch_%s_deno_if_necessary()", s:config_type),
  \   printf("  endif"),
  \   printf("endfunction"),
  \ ], "\n")
endfor
