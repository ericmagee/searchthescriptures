# pkgKQG (W1): an E-ANS KEEP that quotes only the bare flagged answer is not a cure

Assignment: coordinator 23:25Z 11-09, from W1 Wall 3806 (VP3 rev 2 regrade, case 4). Graders W3, W4. Base live s90 (418 nodes).
Reader built by pkgEC2 (enf428Cure, commit f0a87dc4), not by W1.

## Gap
enf428Cure reads an E-ANS send-back KEEP as CURED when its reason quotes 6 words in a row of the answering side's rounds. A KEEP that quotes only the flagged answer itself (the answer DeepSeek called bare) passes, though it names no fuller answer. The CHANGE TO MEETS path already refuses the same thing ("quotes the flagged answer again").

## Change (3 nodes: Send Back Record, Alt Send Back Record, R2 Alt Send Back Record; the E-ANS KEEP line of enf428Cure only)
When the flagged ANSWER is bare (every sentence a grant: I grant / concede / accept / allow / affirm, granted, conceded, with no so/because/for/but/yet/therefore/thus/hence/since after it; or a deferral of 15 words or fewer: under LINK n, in [CRn], I answer it fully ...), the KEEP must quote 6 words in a row of the side's rounds that are not inside that flagged answer. Otherwise UNCURED: "KEEP whose reason quotes only the bare flagged answer itself (...), not a fuller answer from the answering side's rounds (pkgKQG)". A flagged answer with any other sentence reads as live. E-ANS cure_status is record-only (ruling 428; VP1 part 1), so no seat is removed by this change; pkgVP3 reads it.

## Proof
- probe_KQG.cjs: 11 OK 0 FAIL. Run 33798, terra, E-ANS Job 14:1 [CR3], whole node: KEEP quoting only "I grant it is said of all men." reads UNCURED (live CURED), on planted bare rounds and on the stored rounds; KEEP with no quote UNCURED (as live); KEEP quoting the CR2 fuller answer CURED; KEEP quoting the bare grant then the CR3 Galatians 4:4 answer CURED; every other field equal; 34108 terra KEEP quoting CR3 LINK 4 CURED, row byte-equal.
- replay_KQG.cjs: 42 replayable node runs on the stored send-back calls (16 older runs not replayable on s90 code, as in pkgVP3), 68 E-ANS KEEP rows on live. 40 node runs byte-equal; 2 differ only in the 6 words quoted in a CURED reason (33490 Luke 2:48, 33617 Matthew 11:11). 0 cure_status changes: no right cure turns UNCURED.
  A first version without the bare test turned 2 stored KEEPs UNCURED (33605 Acts 16:13, 33482 Romans 1:3) whose flagged answers carry a second sentence of substance; the bare test keeps them CURED.
- Rolled-back insert of 2 rows (panel UNCURED with the new reason; alternate CURED) through record_enforcer_log: rows 2, recorded true, rolled back.

## Build
node pkgKQG/build_KQG.cjs [fetch-back] [out]; one anchor per node, refuses if enf428Cure is in any other node. Stacking: pkgVP3 rev 2 changes the same 3 nodes elsewhere in the code; whichever is written second is rebuilt on the first (each build anchors its own lines).

## Engine manual part (for W3)
Send-back cure reading, E-ANS KEEP (pkgEC2, pkgKQG): a KEEP is read CURED when its reason quotes 6 words in a row of the answering side's rounds. When the flagged answer is bare (only grants, or a short deferral), those 6 words must come from outside the flagged answer: quoting the bare answer back is not a fuller answer.

## Rev 2 (W1, answering W3's FAIL, Wall 3820)
Build: `node pkgKQG/build_KQG2.cjs` -> parent_s90_KQG2.json (Send Back Record, Alt Send Back Record, R2 Alt Send Back Record; connections unchanged).
Fix: when the flagged answer is bare, a six-word window counts only if it is not inside the flagged answer AND it is found in a round with the flagged answer cut out, so a window that takes words from the answer and its neighbour (W3's "said of all men luke 2", "and full of trouble i grant") no longer counts.
Proof: probe_KQG2.cjs 17 OK (rev 1 cases plus W3's two straddles UNCURED, and a KEEP quoting the grant then six words wholly outside it CURED). replay_KQG2.cjs: 42 node runs, 68 KEEP rows, 0 status changes (same 2 rows as rev 1 differ only in the quoted words). Rolled-back insert of two rows (panel UNCURED with the new reason, panel CURED) through record_enforcer_log: accepted, rows 2.
Not covered (W3's note, live reader): a KEEP quoting six words of a verse the side itself quoted still reads CURED.
