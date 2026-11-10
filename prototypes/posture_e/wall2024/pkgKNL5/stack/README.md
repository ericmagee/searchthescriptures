# Stacked library on live s94: pkgFUK rev 3 + pkgFCD + pkgKNL rev 5 (W2, 11-09 CST)
All three change only the Shared Library. Writing them one at a time needs a rebuild after each write; this is the one-write form.
Build: `node pkgKNL5/stack/build_stack.cjs` (strip_FCD with knlNone2024 replaced by knl5_fn.js; refuses unless every file's FCD-base function equals the KNL5-base function and strip_KNL5 is exactly base + knl5_fn),
then `cp -r pkgLIB/strip_FCDKNL5 pkgLIB/strip_FCDKNL5S; FB=<fb s94> node gate/pack.cjs pkgLIB/strip_FCDKNL5S pkgLIB_FCDKNL5S; node pkgFUK/parent_on.cjs <fb s94> pkgLIB_FCDKNL5S pkgLIB/strip_FCDKNL5 pkgKNL5/stack/parent_s94_FCDKNL5.json`.
Result: 418 nodes, only Shared Library changed against live s94, connections equal, 30 sources byte-equal to strip_FCDKNL5.
Tests on the stacked library: test_KNL5_fn 48 OK; knl5_34108 9 OK; probe_FCD 25 OK; W2 FCD plants 7 OK.
Not run: the 767-run gate on the stack (each part passed it alone: gate_KNL5.txt, pkgFCD/gate_FCD_s90.txt).
Needs two non-builder grades (not W2) before W4 writes it. If graders prefer, write the parts in order instead with a rebuild between.
