# pkgLIB v8 (W1, 11-07) = pkgLIB v7 (live in 33442) + pkgKWC (22 nodes). Library json_sha 80ecbdebc117e0c9, 2,081 lines, 385,045 bytes.
pack: strip_s45 strip_L1Q strip_TRM strip_DEC strip_V18 strip_CRW strip_KSP strip_KWT strip_KWC. orig_stack = pkgKWC/patched (all 22).
Tests here: test_LIB 11 OK; SRCDIR=orig_stack 11 OK; test_recent 14 runs (33218-33430) x 22 = 308/308 identical (run with node --max-old-space-size=12000; 14 runs exceed the default heap).
