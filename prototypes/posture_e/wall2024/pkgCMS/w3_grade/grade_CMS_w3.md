# pkgCMS (W1, comment strip, commit bbfacf27, write file pkgCMS/parent_s108_CMS.json): W3 grade PASS

Written 09:42 CST 2026-11-10 by W3. Labels: labels_CMS_w3.md (commit e42c9e4c, before any run). Runner: w3_CMS.cjs, output w3_CMS_out.txt. Base: /mnt/project-files/wall2024/fetchback_live_s108.json.

## Result by label
- G1 OK. 418 nodes; nothing but Code text differs from live; connections equal.
- G2 OK. Syntax tree (positions removed) equal, live against stripped, in 131 of 131 changed plain nodes. This covers strings, regular expressions, template literals and automatic semicolon insertion.
- G3 OK. 43 library-read nodes (41 plain stubs and the two E4 heads, Alternate Build and Early Alternate Build): the source each rebuilds from the new Shared Library is byte-equal to live in 31 and tree-equal in 12 (the 12 stripped sources). No stub's own text changed. Shared Library 913,804 to 845,004.
- G4 OK. No comment left in a stripped plain node.
- G5 plants on strip(): a, c, d, f tree equal; e tree equal in three forms (rerun, see mistake 2).
- G6 OK. No changed node holds "cacheall" in a string; no changed plain node reads its own or another node's code text or calls toString on a function.
- G7 measured by me: all Code text 3,838,679 to 3,223,081 = -615,598. Equal to the builder's figure. No prompt text changes (G2: every string is equal).
- G8 OK. Close Enforcer Build live against stripped on 39 of 39 stored debates byte-equal; Close Enforcer Record on the 22 stored set C and replay replies byte-equal. These two are among the builder's 37 nodes with no saved run; 35 now rest on tree equality alone.
- G9 (added after the run, stated as such): the two plain nodes the package leaves unchanged (Final Output, Extract Diagnostic) hold no comment. 131 changed + 2 = 133 plain nodes, as the builder states.

## Notes (none is a finding against this write)
1. strip() also trims trailing white space on every line and drops every blank line, inside template literals too (plant G5b: the tree changes). No live plain node holds such a template literal, and G2 is equal on all 131, so nothing is changed today. The hazard is for a later run of strip() on new code. The builder's token check M1 would refuse such a node loudly. It should stay a refusing check in every later strip.
2. strip() refuses a source whose last line is a line comment with no line break after it (its wrapper puts the closing brace on that line). Loud, not silent. No live node was refused.
3. Plants G5g1 and G5g2 (HTML-style comment, shebang) were refused by the parser in the function wrapper; such text cannot stand in a Code node, so no case exists.
4. The package README names the operator by name in line 3; records say "the operator".

## My mistakes in this grade
1. My runner's first run reported a G3 failure for Alternate Build and Early Alternate Build. The fault was in my runner (it cut the stub at the plain stub's last line, which the two E4 heads do not have). Fixed by cutting after the length check; both rebuild byte-equal to live. I posted nothing on the first result.
2. My first plant G5e ended in a line comment with no line break, so it tested note 2 and not what I labeled. Rerun with valid sources; tree equal.

## Before the write
The builder's own condition stands: not posted for write until pkgR1 (live s107) has two clean runs. A write of pkgRAC or any other package first means pkgCMS is rebuilt on that live version and the changed nodes are compared again.
