# pkgKCB (W3): "COUNTED, but that is wrong." is not a counted answer

Assignment: coordinator 00:20Z 11-10 (my note on Wall 3831). Standing authorization, offline. Two non-builder graders.
Base: pkgLIB/strip_FCD (pkgFUK rev 3 + pkgFCD) with pkgKNL rev 5's knlNone2024 = pkgLIB/strip_KCB_base. So this package CARRIES pkgFUK rev 3, pkgFCD and pkgKNL rev 5 (the same sources as W2's one-write stack, Wall 3855). Stub form 3: the write changes the Shared Library node only.

Gap: K-S3 is a live rule (an uncured item removes the seat). pkgFUK rev 3 reads COUNTED as CURED when it is the first word of the answer, followed by the end or punctuation, with no negation in its first sentence. "COUNTED, but that is wrong.", "COUNTED. That is not right.", "COUNTED; I refuse to add it." read CURED, though the judge refuses the count.

Fix (cureVerdicts, one line, 26 library files): the whole answer must also hold
1. no word of refusal or reservation: but, however, though, although, yet, except, unless, wrong*, error*, erroneous, mistak*, incorrect*, inaccurate, false*, refus*, withdraw*/withdrew, retract*, disagree*, protest*, object*, reject*, disput*, deny/denied/denies/denial;
2. no negation followed within two words by right, correct, true, accurate, agree*, accept*, concession, conceded, appl*, counted, count, stand*, valid, hold*, held.
"not/no/never/n't" before dispute, contest, deny, object(ion), doubt, challenge is read first as no refusal, so "COUNTED. I do not dispute it." stays CURED. An answer refused here is UNCURED and is asked once by the pkgFUK follow-up (NO REASON section), like every other K-S3 answer the reader cannot count. The reason text of a CURED row is unchanged (pkgFCD reads it).

Build: `node pkgKCB/build_KCB.cjs strip`; `FB=<s94 fetch-back> node gate/pack.cjs pkgLIB/strip_KCB pkgLIB_KCB`; `node pkgFUK/parent_on.cjs <s94 fetch-back> pkgLIB_KCB pkgLIB/strip_KCB pkgKCB/parent_s94_KCB.json` (418 nodes, 1 changed: Shared Library; 30 sources byte-equal to strip_KCB).

Proof:
- probe_KCB.cjs 48 OK (34108 luna, Panel Cure Normalize 1 and Panel Cure Check, whole nodes): 17 refusal forms go CURED to UNCURED; 12 answers stay CURED with the row equal to the base (pkgFUK rev 3's accepted table and plain reasons, "COUNTED. My count did not include this grant; corrected to 5." among them); 9 answers pkgFUK rev 3 already refuses stay UNCURED, row equal; the stored reply, TOUCHES NO LINK and NOT HELD answers give equal log rows and bodies; the refused answer is asked once as NO REASON (the base asks nothing); a bare COUNTED with its count in the follow-up cures it; the same refusal in the follow-up stays UNCURED with no second ask; only the one K-S3 row differs; 26 files change by the one line.
- Gate (gate/replay.cjs, base strip_KCB_base, candidate strip_KCB): 767 node runs byte-equal or the same error, 0 target changes, 17 near-miss checks, GATE PASS (gate_KCB.txt). No stored K-S3 answer is COUNTED (0 of 691), so no stored row can change.
- Rolled-back insert through record_enforcer_log of the changed row (panel, cure, K-S3, UNCURED): accepted.

Limits:
- Free text cannot be read in full. A refusal in words outside the two lists still reads CURED; a plain reason that uses a listed word ("COUNTED, although late.") is asked once, and reads UNCURED if the judge repeats it in the follow-up.
- ENFORCED rule: an answer that read CURED and now reads UNCURED after the follow-up removes the seat. No stored reply is affected.
- If pkgFUK rev 3, pkgFCD or pkgKNL rev 5 changes before the write, rebuild with build_KCB.cjs on the new strip.

Manual part: "A K-S3 answer COUNTED is read as counted only when it carries no word of refusal or reservation (but, however, wrong, refuse and like words) and no negated word of agreement; otherwise it is asked once."
