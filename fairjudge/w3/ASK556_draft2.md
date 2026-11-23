# ASK 556: the close is checked against the press list, restated for Build Save Body (W3, DRAFT 2a)

Draft 2a meets W1's condition C1 (Wall 11049): the press reader of draft 2 read 738 of the 1,519 stored PRESSED WITH lines (149 runs). The line below is W1's corrected text, fairjudge/w1/g556/line_c1.js (md5 ae006603, commit 28878ba0), taken byte for byte. It also finds a header in mid-line, takes the references on the header line up to the first quotation mark, and lets a line under the header open with a layer tag. Run 41822 is unchanged. No other change from draft 2 (md5 d0cdce17).

DRAFT ONLY. Nothing is written. The exact text needs grading (W1), the builder's anchor check (W4) and the operator's approval.

Basis: proposal P14 step 1 (fairjudge/w3/PROPOSALS_rev1.md); plan draft 2a (BUILD_PLANS_draft2.md, md5 edcffe67, PASS Wall 10966).
My mistake that this draft repairs: the plan named D4 Extract as the node that stores the audit line. D4 Extract writes no review notes (W4, Wall 10998); review notes are built only in Build Save Body. It is the same fault as ASK 557 Change C, repaired there by ASK 563. I found it on re-reading the plan before the operator's card (Wall 11036 B) and held ASK 556 off that card.

## 1. What the record shows (W4's fetch-back of the live engine f63b73de, ask566/w4/write/fetchback_engine_566.json)
1. Build Save Body (80,899 characters) holds the challenger's four rounds as d.gr1, d.gr2, d.dr3, d.dr4 and the stored close as d.cr4 (saveBody: engine_r1:d.gr1, engine_r2:d.gr2, challenger_r3:d.dr3, defender_r4:d.cr4, challenger_r4:d.dr4).
2. `const RN=FF.length?FF.join(' '):null;` stands once. The names __RF, __PR, __AN, __NO, __on, __h, __q and __m do not occur in the node, and __r does not occur as a whole name (counts in section 6).
3. In run 41822 the PRESSED WITH blocks stand only in the challenger's second round (6 blocks, 21 different references). DR1, DR3 and DR4 hold none.

## 2. The change (record-only)
Target: Build Save Body, engine only. One line added. No other node; no prompt.
Anchor: `const RN=FF.length?FF.join(' '):null;` (one occurrence). ASK 563 inserts its own line before the same anchor; the two lines are independent and may stand in either order.
Exact change: insert this line, as its own line, directly before the anchor:
`try{if(d.cr4){const __RF='((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)* \\d+:\\d+)';const __PR=[];let __on=false;for(const l of [d.gr1,d.gr2,d.dr3,d.dr4].map(x=>String(x||'')).join('\n').split('\n')){const __h=l.search(/PRESSED WITH\s*:/i);if(__h>=0){__on=true;const __r=l.slice(__h).replace(/^PRESSED WITH\s*:/i,'');const __q=__r.search(/["“]/);for(const __m of (__q>=0?__r.slice(0,__q):__r).matchAll(new RegExp(__RF,'g')))if(__PR.indexOf(__m[1])<0)__PR.push(__m[1]);continue;}const m=__on&&l.match(new RegExp('^[\\s>*_#-]*(?:\\[L[1-4]\\][\\s*:]*)?'+__RF));if(m){if(__PR.indexOf(m[1])<0)__PR.push(m[1]);}else __on=false;}const __AN=String(d.cr4).split('\n').map(l=>l.match(new RegExp('^[\\s>*_#-]*ANSWER\\s*:\\s*'+__RF,'i'))).filter(Boolean).map(m=>m[1]);const __NO=__PR.filter(r=>__AN.indexOf(r)<0).sort();FF.push('[AUDIT: CLOSE PRESS LIST (record-only) -- PRESSED: '+__PR.length+'; NO ANSWER LINE IN THE CLOSE: '+(__NO.length?__NO.join(', '):'none')+']');}}catch(e){}`
What it does, in plain words: when a close is stored, it reads the challenger's four rounds, finds each "PRESSED WITH:" header, takes the references written on the header line itself (up to the first quotation mark) and every line directly under it that begins with a book, chapter and verse (a layer tag may stand first), and lists each such reference once. It then takes the reference on every line of the stored close that begins "ANSWER:". It appends one line to review_notes giving the number of pressed references and those with no ANSWER line in the close. Nothing is sent back, and nothing is counted in any result.
Not gated on the Oracle profile: the count describes the stored close whoever the defender is.

## 3. Revert
Restore Build Save Body from the pre-write export; compare the node's md5.

## 4. Test (all run offline with the exact line above, on run 41822's stored rounds; script t556.js)
1. Run 41822: `[AUDIT: CLOSE PRESS LIST (record-only) -- PRESSED: 21; NO ANSWER LINE IN THE CLOSE: Esther 2:7, Isaiah 7:14, John 1:14, John 6:42, Luke 2:49]`. Already run: exactly this line.
2. No stored close: no line is added; review_notes identical to today's. Already run.
3. Forms, already run (t556c.js): a header-line list "**PRESSED WITH:** Luke 3:23; Acts 16:13; Numbers 1:18" gives 3; a mid-line header gives its 2; tagged lines "- [L1] Matthew 1:19: ..." give 2 and a blank line ends the block; a header with a quotation takes only the reference before the quotation mark.
3a. A close with no challenger PRESSED WITH line: `PRESSED: 0; NO ANSWER LINE IN THE CLOSE: none`. Already run.
4. Every other node: md5 unchanged.
5. Live run: the line stands once in review_notes.

## 5. Stated limits
1. A pressed reference is read from the header line or from a line directly under it that begins with the reference; a blank line or any other line ends the block. A press written in another form is not counted.
1a. On a header line, a capitalised word that stands directly before a book name is read into the reference ("Later Luke 9:9"); such a reference would then show as unanswered. Found in my test; not seen in run 41822.
1b. "Luke 1:32, 34" is read as Luke 1:32 only (W1 11049).
2. A reference is matched as written. "Luke 2:48-49" under PRESSED WITH is read as "Luke 2:48".
3. An ANSWER line counts as an answer whatever stands under it; ASK 567 (live) checks its layers.
4. This is the challenger's presses against the defender's close. It is not the GAPS LEFT OPEN list of ASK 537, which is the Oracle's own presses (the correction stated in draft 2a).

## 6. Name counts in the live Build Save Body
__RF: 0; __PR: 0; __AN: 0; __NO: 0; __on: 0; __h: 0; __q: 0; __m: 0; d.gr1: 7; d.gr2: 11; d.dr3: 9; d.dr4: 8; d.cr4: 9; CLOSE PRESS LIST: 0; __r as a whole name: 0 (the two raw hits are inside longer names)
