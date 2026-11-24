# ASK 583 plan, draft 1: the engine manual is held in parts

Planner: W3. Grader: W1. Builder of the database objects: W4 (W3 does not build what W3 planned and W1 grades). Writer of the manual text: W3. Operator's order, 20:22 CST 2026-11-23, W3 thread: "that's not much. move forward with breaking the manual into smaller pieces". Before it, 20:06 CST: "the engine manual is growing out of control... we will need to break it up like the project manual".

## 1. OBJECTIVE
A seat reads and writes only the part of the engine manual its task touches. No part is larger than 40,000 characters. Nothing in the text changes at the cut.

## 2. SCOPE (one line)
Storage and access of the engine manual only: where its text is kept, how it is read and how it is written. No sentence of the manual is reworded, moved or removed by this ASK, except section 0 (how to read and revise), whose new text is in 6.4 and goes on the card.

## 3. SEARCH (what exists, read 20:22 to 20:35 CST 2026-11-23)
3.1 engine_manual: one row per version, the whole text in one column (v240 743,498; v241 draft 707,670 after ASK 582). Triggers trg_engine_manual_audit and trg_engine_manual_immutable (function engine_manual_guard). Written only by engine_manual_apply (whole-text pairs). Map: engine_manual_toc() (lists "#" headings with character offsets; the reader then cuts by offset). Log: engine_manual_log (209 rows), map engine_manual_log_toc().
3.2 Where the size is (v241 draft): section 9 Enforcers 338,848, of which one bullet "RULES WRITTEN AFTER s82" is 252,412 with 141 rule entries; section 11 89,164, of which one bullet is 84,253 with 41 entries; section 17 59,936, of which one bullet is 53,969 with 97 entries; sections 8, 10 and 12 are 38,000 to 40,000 each; the other 13 are under 25,000 each.
3.3 How the operational doc is held: operational_doc is one row per version (v143, 125,933). The table operational_doc_sections (53 rows) is a cut of version 24 and no function reads it; it is not kept in step. So there is no working parts model in the database to copy; this plan makes one.
3.4 Readers and writers that assume one document:
 a. Database functions whose code reads or writes the table: engine_manual_apply, engine_manual_toc, engine_manual_guard. engine_manual_log_toc reads only the log.
 b. Database functions that only name it in a comment or a message (no read): debate_results_write_guard, judgment_result_word, record_integrity_scan.
 c. n8n: the Daily Drive Sync mirrors engine_manual to Drive (named in section 0; W4 to read the node and state what it selects).
 d. Manual text: engine manual section 0 and section 18; operational_doc, three sentences that name engine_manual (one says "written only through engine_manual_apply"). the_wall_manual, tandem_manual and blackboard_manual do not name it (count 0 each).
 e. Seats: each seat's md_notes and the project memory files engine-manual-versions and feedback-read-manual-section0-before-write; the coordinator's refresh list does not include the engine manual.
 f. Repo scripts: mrb.cjs (the readback), and the build and test files that quote manual text (W4 to list those that SELECT content).
3.5 Not found: any view over engine_manual; any grant to anon or authenticated beyond SELECT.

## 4. DESIGN
4.1 New table engine_manual_parts: id, part (text, for example '09.3'), order_index (int), title (text), version (int), content (text), summary (text), created_at. One row per part per version of that part. Insert only; the same guard and audit trigger as engine_manual (no update, no delete, an audit row per insert with card and session).
4.2 One version counter for the whole manual: a write to any part takes version = (the highest version in engine_manual and engine_manual_parts) + 1. So "SELECT max(version)" keeps its meaning, and each log row still has one version number.
4.3 The log stays engine_manual_log, with one new nullable column part. Rows before the cut keep part NULL.
4.4 New functions:
 a. engine_manual_part_apply(p_part, p_base_version, p_base_md5, p_pairs, p_expect_md5, p_expect_len, p_title, p_summary, p_log, p_write): the logic of engine_manual_apply on one part (base = that part's latest version; each old text once; preview, then write with the expected md5 and length; it writes the log row with the part).
 b. engine_manual_part(p_part) returns the latest text of one part.
 c. engine_manual_full() returns every part's latest text joined in order_index order, with nothing between. For any reader that needs the whole.
 d. engine_manual_toc() rewritten: one line per part (part, title, version, characters, first heading or first rule name), then how to read one part. No character offsets.
4.5 engine_manual keeps every row as the record. After the cut engine_manual_apply refuses with: "the engine manual is held in parts since version N; use engine_manual_part_apply". One last whole row is written whose text is only a pointer (4 lines: the manual is in parts; SELECT engine_manual_toc(); SELECT engine_manual_part('<part>'); SELECT engine_manual_full()), so that a reader that still selects the newest whole row gets the pointer and not a stale manual.
4.6 The first cut (prototype manual1123/w3/a583/split583.py, run on the v241 draft: 31 parts, largest 39,934): one part per "## " section; a section over 40,000 is cut before its top-level bullets, and a top-level bullet over 40,000 before its second-level bullets; neighbours are packed up to 40,000. Part names are section number, dot, piece number ('09.0' to '09.8', '11.0' to '11.2', '17.0', '17.1'). The cut is at entry boundaries only; no entry is split.
4.7 This first cut is by size and order, not by subject. Grouping the 141 section 9 entries by enforcer (close enforcer, gate, answer check, key word, K-UNX, anti-cheat, layers and barred moves, library and housekeeping) and moving the engine entries that now sit under section 11's snapshot bullet to their home is a second ASK: it moves text, so each move is listed, graded and shown to the operator. It is not in this build.

## 5. DEFINITION OF DONE (each can pass or fail; "found nothing" is not a pass for C1 to C3)
C1. Lossless: md5(engine_manual_full()) equals the md5 of the last whole version (v241 after ASK 582; else v240), and the lengths are equal. Population: one text.
C2. Size: no part's latest content exceeds 40,000 characters. Population: every part (31 on the draft).
C3. Write path: on a scratch copy (rolled-back transaction) engine_manual_part_apply previews and writes one pair on part '18.0'; the version is max+1; the log row carries the part; a second pair whose old text occurs twice is refused; a base md5 that is not the part's is refused; engine_manual_apply refuses with the pointer message.
C4. Guard: UPDATE and DELETE on engine_manual_parts are refused; an insert writes its audit row with card and session.
C5. Map: engine_manual_toc() lists every part once, in order, with its length equal to length(engine_manual_part(part)).
C6. Readers of 3.4: each is either changed, or shown to need no change, with the evidence named (W4 for c and f; W3 for d and e).
C7. One grader reads section 0's new text and part '09.3' in full from the database after the cut, for sense.

## 6. STEPS (in order; * marks a step that cannot be undone by the revert in 7)
6.1 W3: this plan to the Wall; W1 grades.
6.2 Card to the operator (build approval) with the design in plain words and the new section 0 text.
6.3 W4: migration file (table, trigger, column part, the four functions, grants as engine_manual: owner only for the apply function), tested in a rolled-back transaction against C3 to C5; W1 grades the file; W4's write card.
6.4 W3: the cut. In one transaction: insert the 31 part rows from the last whole version by the split rule (done in SQL from the stored text, so no text passes through a seat's hands); check C1 and C2 inside the transaction and raise if either fails; then the pointer row and the section 0 pair. New section 0 text replaces only the lines that name the read and write method: the active text is engine_manual_full(); the map is engine_manual_toc(); a part is read with engine_manual_part(part); to revise call engine_manual_part_apply on the one part; the history is engine_manual_log. On W3's card.
6.5 W1 reads back (C1, C2, C5, C7).
6.6 W4: the Daily Drive Sync reads engine_manual_full() (n8n change, W4's card). * until then the Drive mirror would receive the pointer row.
6.7 W3: the operational doc sentences of 3.4 d, as exact pairs, on their own card (the operator approves each operational doc change).
6.8 Each seat corrects its note; W3 corrects the two memory files.

## 7. REVERT
Before 6.4 nothing reads the new objects: drop them. After 6.4: engine_manual_apply is restored from its saved definition, and one whole row is written with engine_manual_full() as its text (the whole document again, at a new version); the parts table is left as the record. Nothing is deleted in either case.

## 8. THIS PLAN IS WRONG IF
The parts joined do not give back the source. Checked before posting (split583.py): on the v241 draft the 31 parts joined equal the source (md5 d0e9efda3280624ce987050bc9568197, 707,670); on a known-bad copy with one character removed the join does not equal the source. Second wrong-if, not yet measured: a seat's task usually needs more than three parts at once, in which case the cut by size does not serve the objective and the grouping of 4.7 must come first. Measure: for the 10 engine ASKs written on 2026-11-23, count the parts each touched in the manual (W3, before the card).

## 9. LIMITS
- A part of 40,000 characters is still long. The cap is a guess at a readable size, not a measured one.
- Parts named by number and order carry no subject until 4.7 is done.
- The split rule depends on the bullet layout; a future entry written at the wrong indent would not be cut there. The parts are rows after the cut, so this matters only for the first cut.
- ASK 578 and 579 entries and the second history pass (v242 of ASK 582) are written after the cut, each into its part.
