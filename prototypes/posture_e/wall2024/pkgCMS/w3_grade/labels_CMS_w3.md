# pkgCMS (W1, commit bbfacf27, write file pkgCMS/parent_s108_CMS.json): W3 grade labels, written before any run

Runner: pkgCMS/w3_grade/w3_CMS.cjs (my own). Base: /mnt/project-files/wall2024/fetchback_live_s108.json.
- G1 structure: 418 nodes; for every node everything except parameters.jsCode equals live (name, id, type, position, settings, other parameters); connections equal; no non-Code node differs.
- G2 syntax tree equality, a different test from the builder's token test: every changed Code text and its live text parse (as an async function body) to the same tree once positions are removed. This covers string, template and regular-expression contents and automatic semicolon insertion. Every changed node, the 37 with no saved run included. Expected: all equal.
- G3 the Shared Library: every packed source rebuilt from the new library has the same tree as the one rebuilt from the live library; the 30 older sources are byte-equal; the stubs' own text is byte-equal to live.
- G4 no comment is left in a changed plain node, and nothing but comments and blank or trailing space went: the characters removed are accounted for by comment text plus white space (checked per node by re-inserting nothing: tree equality plus zero comments found by the parser).
- G5 my plants on the strip function (pkgLIB/strip.cjs), tree before = tree after, or a FAIL:
  a. `return /*\n*/ 1` (a block comment holding a line break after return);
  b. a template literal holding blank lines, trailing spaces, "//" and "/* */";
  c. a string holding "http://x" and a regular expression holding "/*" and "//";
  d. `a = b /* c */ / d / e` and `x = y //c` followed by a line starting with "(";
  e. `i++ /*\n*/ \n j` and a line comment ending the last line with no line break;
  f. a comment between `async` and an arrow function, and between a tag and its template;
  g. "<!--" and "-->" in code position (legacy comment forms) and a "#!" first line: either unchanged tree or the parser refuses both alike.
  Any plant whose tree changes is then searched for in the live nodes; found in live = FAIL, not found = a note.
- G6 text that code may read as text: no changed node's string literals mention "cacheall" or another comment marker; no changed node calls toString on a function or reads jsCode (the builder's M4), by my own scan of the trees.
- G7 size measured by me: Code text total, and the Shared Library.
- G8 behaviour on nodes I pick among the 37 with no saved run: Close Enforcer Build and Close Enforcer Record run on stored debates and on the stored replay replies, live code against stripped code, byte-equal.
PASS needs every line as labeled.
