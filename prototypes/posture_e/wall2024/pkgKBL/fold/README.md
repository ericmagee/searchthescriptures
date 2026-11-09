# pkgKBL fold: capitalized meaning in the Strong's-number [L2] form (W1, 11-09)

Source: W3 grade of pkgKBL (Wall 3490, note a). This is inside the operator-approved Strong's-number [L2] form (option 1, 01:19 CST 11-09).
`[L2] synerchomai (G4905, Cohabit conjugally)` read no layer, because the meaning had to start with [a-z].

Change: the pkgKBL lb.strong line in every lbFoot. The meaning's first letter is `[a-z]` -> `[A-Za-z]`, in both orders
(`word (G1234, Meaning)` and `word (Meaning, G1234)`). The transliterated word itself stays lowercase-first, so a name such as "Jesus (G2424, Saviour)" still adds no layer.
A capital is accepted only as a title-case word ([A-Z][a-z]) that is not a layer tag or marker (L1, LINK 3, NONE, None, Link, Layer), a language, lexicon or source label (Greek, Hebrew, Heb, Gr, Aramaic, Strong's, Strongs, Thayer, Mounce, Vine, Gesenius, Brown, Lexicon; BDB fails [A-Z][a-z]), or a Bible book name or abbreviation (66 books, Apocrypha, common abbreviations). After a Strong's number a capitalized meaning also carries no digit, so a verse reference never reads as a meaning. Rev 2 (W2 3521, W4 3523: tags and labels); rev 3 (W3 3535: verse references, book names, lexicon names).
Nothing else changes.

Base: live s75 (restacked 11-09). Library strip_WLG equals the s75 Shared Library ed1ec6fb07c0. Non-library nodes come from fetchback_live_s75 (equal to s74 for these 12).
- Build: `node pkgKBL/fold/build_KBF.cjs`. It writes pkgLIB/strip_KBF (30 files), pkgKBL/fold/patched (12 nodes) and plan_KBF.json (45 substitutions, all in the lb.strong line).
- Pack: `LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_KBF` -> pkgLIB_KBF (Shared Library ed1ec6fb07c0 -> 14dd1729b7fa).
- E4 rebase: `FB=.../fetchback_live_s75.json node pkgLIB/e4_rebase.cjs pkgLIB_KBF`. Alternate Build a4058f4d0524 -> d76d7b8d60f6, Early Alternate Build 9d20eaf9deb4 -> 5bd1c8351f57; every stub rebuilds.
- Non-library nodes (live s75 -> fold): see plan_KBF.json. Panel Build 7075b0381165 -> c16f71e1c13d, BIV 5d8223502977 -> 8d1c2ddd3e0b.

Tests:
- `node pkgKBL/fold/probe_KBF.cjs`: 35 OK, including the rev 1 and rev 2 false L2 lines (probe_KBF.txt).
- `node pkgKBL/fold/test_KBF_lib.cjs`: 928 node runs over 46 saved runs, 928 byte-equal, 0 K-B changes, 0 cure flips (test_KBF_lib.log). No saved judge line uses the capitalized form, so this closes a coverage gap only.

JGR rev 7 (s74), WLD rev 2e (s73) and WLG (s75) are already under this base.
