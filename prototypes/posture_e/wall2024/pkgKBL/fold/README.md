# pkgKBL fold: capitalized meaning in the Strong's-number [L2] form (W1, 11-09)

Source: W3 grade of pkgKBL (Wall 3490, note a). This is inside the operator-approved Strong's-number [L2] form (option 1, 01:19 CST 11-09).
`[L2] synerchomai (G4905, Cohabit conjugally)` read no layer, because the meaning had to start with [a-z].

Change: the pkgKBL lb.strong line in every lbFoot. The meaning's first letter is `[a-z]` -> `[A-Za-z]`, in both orders
(`word (G1234, Meaning)` and `word (Meaning, G1234)`). The transliterated word itself stays lowercase-first, so a name such as "Jesus (G2424, Saviour)" still adds no layer.
Nothing else changes.

Base: live s72 (pkgKBL). Library strip_KBL equals the s72 Shared Library c277aee01799. Non-library nodes come from fetchback_live_s72.
- Build: `node pkgKBL/fold/build_KBF.cjs`. It writes pkgLIB/strip_KBF (30 files), pkgKBL/fold/patched (12 nodes) and plan_KBF.json (45 substitutions, all in the lb.strong line).
- Pack: `LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_KBF` -> pkgLIB_KBF (Shared Library 87d759e625d8).
- E4 rebase: `FB=.../fetchback_live_s72.json node pkgLIB/e4_rebase.cjs pkgLIB_KBF`. Alternate Build dde2d8ed8bcd -> 96a2e37357bf, Early Alternate Build 16658c6e8630 -> d9a6d9bd1043; every stub rebuilds.
- Non-library nodes (live s72 -> fold): see plan_KBF.json. Panel Build 179b18436edb -> c961a767597d, BIV 2047b6cc87c0 -> fae4c324fd6d.

Tests:
- `node pkgKBL/fold/probe_KBF.cjs`: 7 OK (probe_KBF.txt).
- `node pkgKBL/fold/test_KBF_lib.cjs`: 928 node runs over 46 saved runs, 928 byte-equal, 0 K-B changes, 0 cure flips (test_KBF_lib.log). No saved judge line uses the capitalized form, so this closes a coverage gap only.

Stacking: JGR rev 7 and WLD rev 2e also change Panel Build and BIV on s72. Whichever is written later is rebuilt on the earlier one.
The JGR library (strip_JGR_HAIKU) also changes Alternate Build and R2 Alternate Build; rerun build_KBF on that strip if JGR is written first.
