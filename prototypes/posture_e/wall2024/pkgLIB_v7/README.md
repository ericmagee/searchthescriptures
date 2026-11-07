# pkgLIB v7 (W1, 11-07) = pkgLIB v6 (v5 + pkgKSP EIV) + pkgKWT (19 nodes). Library json_sha a89979f6732274ae, 2,081 lines, 384,508 bytes.
pack: strip_s45 strip_L1Q strip_TRM strip_DEC strip_V18 strip_CRW strip_KSP strip_KWT. orig_stack = v6 orig_stack + pkgKWT/patched.
Tests here: test_LIB 11 OK; SRCDIR=orig_stack 11 OK; test_recent 13 runs x 22 = 286/286. If KWT passes for the same gap, write v7 instead of v5/v6.
