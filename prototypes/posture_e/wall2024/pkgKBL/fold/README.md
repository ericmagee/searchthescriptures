# pkgKBL fold: capitalized meaning in the Strong's-number [L2] form (W1, 11-09)

Source: W3 grade of pkgKBL (Wall 3490, note a). This is inside the operator-approved Strong's-number [L2] form (option 1, 01:19 CST 11-09).
`[L2] synerchomai (G4905, Cohabit conjugally)` read no layer, because the meaning had to start with [a-z].

Change: the pkgKBL lb.strong line in every lbFoot. The meaning's first letter is `[a-z]` -> `[A-Za-z]`, in both orders
(`word (G1234, Meaning)` and `word (Meaning, G1234)`). The transliterated word itself stays lowercase-first, so a name such as "Jesus (G2424, Saviour)" still adds no layer.
Nothing else changes.

Base: live s74 (restacked 11-09, Wall 3519). Library strip_JGR_HAIKU equals the s74 Shared Library ee9abc8f0ef1. Non-library nodes come from fetchback_live_s74.
- Build: `node pkgKBL/fold/build_KBF.cjs`. It writes pkgLIB/strip_KBF (30 files), pkgKBL/fold/patched (12 nodes) and plan_KBF.json (45 substitutions, all in the lb.strong line).
- Pack: `LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_KBF` -> pkgLIB_KBF (Shared Library ee9abc8f0ef1 -> 1f4e158042e0).
- E4 rebase: `FB=.../fetchback_live_s74.json node pkgLIB/e4_rebase.cjs pkgLIB_KBF`. Alternate Build db5f46588890 -> c3d712ec590e, Early Alternate Build 1b52f7008e96 -> 99276c3f433b; every stub rebuilds.
- Non-library nodes (live s74 -> fold): see plan_KBF.json. Panel Build 7075b0381165 -> c9e994d97ecd, BIV 5d8223502977 -> cd87164eb013.

Tests:
- `node pkgKBL/fold/probe_KBF.cjs`: 7 OK (probe_KBF.txt).
- `node pkgKBL/fold/test_KBF_lib.cjs`: 928 node runs over 46 saved runs, 928 byte-equal, 0 K-B changes, 0 cure flips (test_KBF_lib.log). No saved judge line uses the capitalized form, so this closes a coverage gap only.

JGR rev 7 (s74) and WLD rev 2e (s73) are already under this base.
