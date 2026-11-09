# pkgKNL rev 5 (W2): FORCED none-line reader, closing parenthesis made an allow-list

Answers the FAIL grades of rev 4 by W4 (Wall 3829) and W3 (Wall 3831). Base: live s90 (418 nodes; library = pkgLIB_VP1_s84, unchanged since s89). Graders W3 and W4; W4 writes after two PASS grades.

## Change from rev 4
In knlNone2024, the closing parenthesis on a FORCED none line was read by a deny-list (link codes, quotes, except, but, ...). Rev 5 accepts a parenthesis only when the whole of it is one fixed form:
- `Commitment N`, or
- `no | none | nothing | not any`, then optionally `[of the] link(s) | line(s) | collision(s) | premise(s)`, then optionally `is | are`, then optionally `graded`, then optionally `forced | broken | link broken | graded [forced|broken]`, with an optional closing period.
Anything else in the parenthesis makes the line a checked FORCED line. Everything else in rev 4 (the five phrasings from W1 3790) is unchanged.

## Build
    node pkgKNL5/build_KNL5.cjs strip
    FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_KNL5 pkgLIB_KNL5
    FB=/mnt/project-files/wall2024/fetchback_live_s90.json node pkgKNL5/build_KNL5.cjs parent   -> pkgKNL5/parent_s90_KNL5.json
The parent step refuses unless the live library equals pkgLIB_VP1_s84. 32 nodes change (Shared Library, 30 stubs, Early Alternate Build); 418 nodes; connections unchanged.

## After pkgSTB (stub form 3) is live
The parent step above refuses on a form 3 base, as it should. Then: pack strip_KNL5 with form 3 (gate/STUBV holds 3) on the live fetch-back, and build with `node pkgSTB/build_STB.cjs <live fetch-back> pkgLIB_KNL5 <out>`. Only the Shared Library node changes (W2 grade of pkgSTB, Wall 3832). If pkgFUK rev 3 is written first, its strip carries the K-S3 edit; apply knl5_fn.js to that strip (same function swap) before packing.

## Proof
- test_KNL5_fn: 48 OK, 0 FAIL. The 17 rev 4 none lines plus 5 parenthesis forms still accepted; the 14 rev 4 checked lines plus W4's 5 and W3's 7 plants now checked.
- W4's w4_plant_KNL4.cjs run on knl5_fn.js: 15 OK, 0 FAIL.
- knl5_34108 (W1's test on run 34108, library strip_KNL5): 9 OK, 0 FAIL.
- probe_KNL on strip_KNL5: 30 OK. probe_KNL_w4 on strip_KNL5: 33 OK.
- gate/replay on the s90 fetch-back: gate_KNL5.txt.
- No log row is added or changed.

## Engine manual part
FORCED none line (pkgKNL): a FORCED line that says no link is forced raises no K-F or K-CMT item. Accepted forms: none / no / nothing / zero / N/A, "none of the collisions/links", "there are no forced links", with an optional FORCED LINES head, a dash or colon lead, and a closing parenthesis only of the form "Commitment N" or "no/none/nothing/not any [links] [is/are] [graded] [forced/broken]". Any other text makes it a checked FORCED line.
