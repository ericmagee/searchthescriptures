# pkgKBL fold: capitalized meaning in the Strong's-number [L2] form (W1, 11-09)

Source: W3 grade of pkgKBL (Wall 3490, note a). This is inside the operator-approved Strong's-number [L2] form (option 1, 01:19 CST 11-09).
`[L2] synerchomai (G4905, Cohabit conjugally)` read no layer, because the meaning had to start with [a-z].

Change: the pkgKBL lb.strong line in every lbFoot. The meaning's first letter is `[a-z]` -> `[A-Za-z]`, in both orders
(`word (G1234, Meaning)` and `word (Meaning, G1234)`). The transliterated word itself stays lowercase-first, so a name such as "Jesus (G2424, Saviour)" still adds no layer.
A capital is accepted only as a title-case word ([A-Z][a-z]), never a layer tag or marker (L1, LINK 3, NONE, None, Link, Layer) or a language/source label (Greek, Hebrew, Aramaic, Strong's): rev 2, after W2 3521 and W4 3523 found those read as L2 in rev 1.
Nothing else changes.

Base: live s74 (restacked 11-09, Wall 3519). Library strip_JGR_HAIKU equals the s74 Shared Library ee9abc8f0ef1. Non-library nodes come from fetchback_live_s74.
- Build: `node pkgKBL/fold/build_KBF.cjs`. It writes pkgLIB/strip_KBF (30 files), pkgKBL/fold/patched (12 nodes) and plan_KBF.json (45 substitutions, all in the lb.strong line).
- Pack: `LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_KBF` -> pkgLIB_KBF (Shared Library ee9abc8f0ef1 -> db86ddf149c5).
- E4 rebase: `FB=.../fetchback_live_s74.json node pkgLIB/e4_rebase.cjs pkgLIB_KBF`. Alternate Build db5f46588890 -> 7002fd44bba8, Early Alternate Build 1b52f7008e96 -> e2be05a512e0; every stub rebuilds.
- Non-library nodes (live s74 -> fold): see plan_KBF.json. Panel Build 7075b0381165 -> bdd5fd237b6b, BIV 5d8223502977 -> 9a943420005f.

Tests:
- `node pkgKBL/fold/probe_KBF.cjs`: 18 OK, including the five rev 1 false L2 lines (probe_KBF.txt).
- `node pkgKBL/fold/test_KBF_lib.cjs`: 928 node runs over 46 saved runs, 928 byte-equal, 0 K-B changes, 0 cure flips (test_KBF_lib.log). No saved judge line uses the capitalized form, so this closes a coverage gap only.

JGR rev 7 (s74) and WLD rev 2e (s73) are already under this base.
