# pkgCMS (R2: strip line and block comments). Built on live s108 (fetchback_live_s108.json = s107 + pkgRLF). Offline; no write until pkgR1 is proven.

Approval: Eric 08:37 CST 11-10 (ASK 9b option 1, R2 strips line and block comments); posted for write only after pkgR1 has two clean runs.
What changes: comments only. 133 plain Code nodes and the 12 R1 library sources are stripped (pkgLIB/strip.cjs, acorn comment ranges);
the Shared Library is repacked from the stripped sources. No prompt text, no model call, no log field, no node, name, id, setting or connection change.

Build: node pkgCMS/build_CMS.cjs /mnt/project-files/wall2024/fetchback_live_s108.json pkgLIB/strip_R1 pkgCMS/parent_s108_CMS.json
Write file: pkgCMS/parent_s108_CMS.json (418 nodes).

Checks (labels_CMS.md)
- M1 token-equal after the strip: 145 of 145.  M2 every stripped source parses.  M3 42 stubs rebuild their sources from the new Shared Library.
- M4 no plain Code node reads another node's code text.  M5 nodes, names, ids, settings, connections equal the base; only Code text changes.
- M6 size (measured): all Code text 3,838,679 -> 3,223,081 = -615,598 (-16.0%); plain nodes -546,798; Shared Library 913,804 -> 845,004 (-68,800).
  With pkgR1: about -1,739,000 against s106.
- M7 replay (test_CMS_out_0..3.txt, four shards): 102 changed nodes with saved runs, 3,562 node runs, all byte-equal (base code vs stripped code), 0 FAIL.
  37 changed nodes have no saved run (incl. Close Enforcer Build and Record); they rest on M1 token equality only.
