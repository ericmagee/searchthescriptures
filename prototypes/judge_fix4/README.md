# judge_fix4: fixes to ORACLE_DEBATE_V1 from the run 32266 reviews (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version d9ec1e19, read by GET on 2026-11-02 (data/workflow_live.json; all 67 code nodes in
  data/live_code/, equal to judge_fix3/new by md5). base/ holds the live code of the 29 nodes changed. new/<node>.js is built by `python3 patch.py`
  (anchored replacements; it refuses when an anchor count is wrong). No node is added, no connection changed.
- write_package.py: one guarded PUT of the 29 code nodes (guards: base md5 of each, the connections and node count of the base read). Run only
  with --dry here: write_dry.txt. sql/: empty; no DDL or function change is needed (derive_debate_outcome and judgment_result_word read the
  rewritten RESULT line, the columns and a CORRECTED RESULT line as they are).
- The database was read with SELECT only (data/run32266.json, data/enforcer_log_32255.json and _32266.json in full, data/kjv_rows.json).

## Changes
- F1 (14 cure nodes; applied in Panel Cure Check, Alternate Merge, Cure Check): cureRecompute/cureRewrite. After a cure that retracts or regrades
  a collision line or corrects a count, the seat's counts, standings, verdict and RESULT are recomputed from the cured lines by engine_manual v85 s8
  (STANDINGS incl. K-G3; VERDICT DEFINITIONS; RESULT), written to the payload fields and into the stored text (RESULT, STANDING, count, CLAUSE and
  the retracted/regraded collision lines replaced; JSON fields too); the original values and lines stay in "[AUDIT v25: RECOMPUTED AFTER CURE ...]".
  A verdict-word change also writes a DB-readable CORRECTED RESULT line first. The single judge's text and fields likewise (no vote).
- F2 (17 nodes): K-DG8 removed: dg8Lines, its constants, its mark, its cure item and branch, and the CURE_RULE_G clause ("the record holds ...").
- F3 (14 cure nodes): a RETRACTED line opening with the item label (rule name allowed) is read whatever follows; its regrade and reason are read
  from it (a regrade to LINK BROKEN is no retraction); a retraction with its regrade serves as that collision's restated line; each item reports
  its own malformed line (cureOwn), never the first one found.
- F4 (17 nodes): K-C, K-S, K-S2, K-U, K-SC read drvGround: the text after the last GROUND: (else after the label), quotes masked, and runs of six or
  more words of a DECLARED CHAIN link (drvLinks, from the judge prompt) masked. The answering-round test still reads the whole line; netMask kept.
  K-N already reads its tag outside quotes and tests the quoted words as the side's words (unchanged). netKeeps (K-C cure) reads the same clause.
- F5: C4P extended (ofD/noteD: [CR4] verses no earlier round of either side names, "NEW IN CLOSE, NOT COUNTED"; renum/noteR: a close that states its
  own numbering or names D/C numbers above the declared ones). Notes under [CR4]/[DR4] in Panel Build, Build Independent Verdict, Build Synthesis,
  Format Markdown; review lines in Build Save Body; new_in_close/renumbered on D4 Extract, renumbered on C4 Extract; CLOSE ROUNDS rule (judges and
  the reader's copy): [CR4] counts only as an answer to a witness already pressed, a [CR4] sentence grading a challenger link is disregarded, both
  closes keep the declared numbering; D4 Build and C4 Build prompts ask for it.
- F6: the ledger (PWL in Panel Build, BIV, D4 Build, C4 Build: namedIn reads scoped; isNamed no longer accepts a bare reference with no book) and
  K-G4 (cureRefs(t,true) in kg4Answered): a bare chapter:verse names a verse only with its book earlier in the same sentence. Ledger header says so.
- F7: Quote Compare matches a quotation inside a bracketed 1611 margin note, or the verse read with the note's reading: MATCHES (MARGIN); Quote
  Report, Panel Build, BIV and Format Markdown treat it as a match.
- F8: UNEXHIBITED "(no footing offered, or a pressed witness left unanswered)" in both itemization copies of Panel Build and BIV and in Format
  Markdown's copy; "How to read this debate" prints ruling 372.
- F9: Format Markdown prints the S-A to S-E lines from review_notes under the Synthesis.
- F10: Quote Compare `const SHORTENED_CHECK=false;` (one line): when true, a matching quotation that is a strict part of the cited text is SHORTENED,
  NOT COUNTED, both sides alike. The operator has since ruled ("as long as the verse if properly cited, writing partial of okay"): it stays OFF.
- R3 (that ruling): every judge, cure (14), synthesis, Format Markdown rule copy and both debater frames (Init with Guards) now read: a verse counts only
  when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or
  misquoted words do not count ("quoted fully and correctly" and "paraphrased, shortened or misquoted" are gone).

## Tests (test/)
- compile_out.txt: 29 new files compile. unit4_out.txt: 134 fixtures, 0 bad (F1-F10, R3; each on every node that carries the code).
- replay4_out.txt: 32212, 32228, 32255, 32266, every panel seat, the alternate where one sat, the single judge; base vs new items, uncured, fields,
  RESULT, recompute, panel outcome (ported aggregate, d5 outcome and tie rule, judgment_result_word); and F1 alone on the stored 32266 panel.
- enf4_out.txt: all 62 enforcer rows of 32255 and 32266 re-checked on the seat's stored reply. cite4_out.txt: citation chain on 32255 and 32266.
- Limits: 32212/32228 predate the enforcer log (replies rebuilt from the stored report, +R); 32228's removed seat (drv_removed) was not replayed;
  the Find Words read is emulated from data/kjv_find.json (base and new alike); judge prompts are rebuilt (the stored prompts are not kept).

## Judge-facing text that still carries corpus material (not changed)
- Panel Build and BIV: "the stating-verse test DG-61 retires" and "(DG-61)" name a drift guard in the judge rulebook; Isaiah 28:10 is cited as the
  framework's method (CHAIN SCOPE, DEBATE RULE VIOLATION, THE FRAMEWORK IS NOT A COMBATANT). Neither states doctrine on the topic.
- Format Markdown and Build Save Body keep "K-DG8" in their flag-key regexes, to read older rows only.
