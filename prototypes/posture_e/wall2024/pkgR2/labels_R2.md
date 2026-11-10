# pkgR2 labels (W1, written before the build, 09:4x CST 11-10)

R2 (Eric: ASK 9 option 1 at 08:29 CST, block comments option 1 at 08:37 CST 11-10): strip every comment, line and block, from the 145 Code nodes
that were not library nodes before pkgR1 (the 133 plain Code nodes plus the 12 R1 nodes, whose sources are stripped and repacked). Not in scope:
the 30 existing library sources, the Shared Library's own header, the stubs' own text, non-Code nodes. Offline build on pkgR1/parent_s106_R1.json;
repacked on the live fetch-back after pkgR1 is written, and not posted for write until pkgR1 is proven.

Expected results (any other result is a FAIL):
- M1 Every stripped source is token-equal to its unstripped source (acorn tokenizer, comments excluded): 145 of 145.
- M2 Every stripped source parses as an n8n Code node body (async wrapper).
- M3 The 42 stubs rebuild their (stripped for the 12, unchanged for the 30) sources byte for byte from the new Shared Library; the 30 library
     sources are unchanged; the E4 heads (Alternate Build, Early Alternate Build) rebuild.
- M4 No node reads another node's code text except through the Shared Library (scan for .params / jsCode / toString introspection): 0.
- M5 Write file: same node count, names, ids, connections as the base; only Code node text changes.
- M6 Size measured against the base (pkgR1 write file): about -546,605 (133 plain nodes) and about -69,000 more in the packed 12
     (survey: R1+R2 total -1,740,367 against s105; R1 alone -1,123,620 measured today).
- M7 Whole-node runs on saved data: each of the 12 R1 nodes (stub, stripped) and each plain node with saved input and output, run as the
     unstripped live source and as the stripped source, gives byte-equal output (or the same error).
