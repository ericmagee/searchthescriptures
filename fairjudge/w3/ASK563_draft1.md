# ASK 563: the Oracle layers audit line, restated for Build Save Body (W3, DRAFT 1)

DRAFT ONLY. Nothing is written. The exact text needs grading (W1), the builder's anchor check (W4) and the operator's approval.

Basis: ASK 557 Change C, approved by the operator at 17:09 CST 11-23 in draft 5b (fairjudge/w3/ASK557_558_draft5.md, md5 7eb9a7c8), named D4 Extract. W4 found at the build (Wall 10998) that it cannot be built there. ASK 563 keeps the approved audit line word for word and changes only the node that writes it. ASK 557 Change C is withdrawn in favour of this ASK; Changes A, B and D and ASK 558 are not touched.

## 1. What the record shows (fetch-back of engine 5bc57e2a)
1. D4 Extract (45,363 characters) holds neither `review_notes` nor `AUDIT`. It writes no review notes.
2. The run's review notes are built in one place, Build Save Body (80,899 characters): lines are pushed to the array `FF`, then `const RN=FF.length?FF.join(' '):null;` (one occurrence) and `review_notes:RN` in `saveBody`.
3. D4 Extract reads the first close, before the D4B re-call. The stored close is `d.cr4` in Build Save Body (`defender_r4:d.cr4||null`). A count in D4 Extract would describe a text that may not be the stored one (W4 10998 item 2).
4. Build Save Body already reads the seats: `const d=$input.first().json;const S=$('Init Seats').first().json;`, and tests `S.defender&&S.defender.profile==='oracle'` elsewhere.
My mistake: draft 5b named D4 Extract for Change C without my reading where review notes are written.

## 2. The change (record-only)
Target: Build Save Body, engine only. One line added. No other node. D4 Extract is not touched.
Anchor: `const RN=FF.length?FF.join(' '):null;` (one occurrence).
Exact change: insert this line, as its own line, directly before the anchor:
`try{if(S.defender&&S.defender.profile==='oracle'&&d.cr4){const __A=String(d.cr4).split(/^(?=[\s>*_#-]*ANSWER\s*:)/im).filter(x=>/^[\s>*_#-]*ANSWER\s*:/i.test(x));FF.push('[AUDIT: ORACLE LAYERS (record-only) -- CLOSE ANSWERS: '+__A.length+'; WITH [L2]: '+__A.filter(x=>x.indexOf('[L2]')>=0).length+'; WITH [L4]: '+__A.filter(x=>x.indexOf('[L4]')>=0).length+']');}}catch(e){}`
What it does: when the defender is the Oracle and a close is stored, it cuts the stored close at each line that begins "ANSWER:", counts those blocks, and counts how many hold the tag [L2] and how many hold [L4]. It appends one line to review_notes. Nothing is sent back, nothing is counted in any result, and no prompt changes.
Stated limit: a block runs from its "ANSWER:" line to the next one, so the last block also holds whatever follows the last answer in the round.
`__A` does not occur in Build Save Body today (W4 to confirm at the anchor check).

## 3. Revert
Restore Build Save Body from the pre-write export; compare md5 of the node.

## 4. Test
1. Offline, the line's counting code on the stored close of run 41822 (defender_r4, 14,861 characters): CLOSE ANSWERS 24; WITH [L2] 0; WITH [L4] 0. Already run: 24, 0, 0; the round holds 24 lines that begin "ANSWER:".
2. Offline: a plain defender profile, or an empty close, adds no line; review_notes is byte-identical to today's.
3. Every other node: md5 unchanged.
4. Live run after ASK 557 is written: the line stands once in review_notes, and WITH [L2] and WITH [L4] show whether the layer form was kept in the close.

## 5. Order
After ASK 557 Changes A, B, D and ASK 558, or in the same write. ASK 557's release test (3) does not depend on it.
