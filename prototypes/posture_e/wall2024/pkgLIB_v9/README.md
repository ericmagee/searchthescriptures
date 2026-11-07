# pkgLIB v9 (W1, 11-07) = pkgLIB v8 + W2's pkgL1Q2 (W3 restack on v8: /mnt/project-files/w3/restack_L1Q2_on_v8_KSP, copied to pkgL1Q2_v8/patched, 22 library files).
Library json_sha baf10718b4793abd, 2,081 lines, 385,164 bytes. pack: ... strip_KWC strip_L1Q2. orig_stack = pkgL1Q2_v8/patched.
Tests: test_LIB 11 OK (a first run failed only the +50 ms timing check under load, 52.4 ms; the rerun passed); SRCDIR 11 OK; test_recent 308/308.
The 4 non-library L1Q2 files (Send Back Build/Record + Alt) are not in the LIB; W4 writes them from W3's restack.
