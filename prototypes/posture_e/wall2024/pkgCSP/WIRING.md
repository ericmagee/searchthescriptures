# pkgCSP (B8): the stored concession count split

Gap: conceded_links / challenger_conceded_links store one number that adds the side's own grants (CONCEDED, WITHDRAWN) to the premises
the judge found not exhibited (UNEXHIBITED). Read alone it says "the Oracle concedes". On 201 stored panel judgments the stated counts
total 289: 69 granted, 217 unexhibited, 3 not named. In 33218 every counted item (gemini premise 5; chatgpt premises 4 and 5) is UNEXHIBITED.

Fix (record only; no count, grade, outcome or seat changes):
- Alternate Merge: every final judgment body (what Write Judgment 1-3 posts) gets payload.conceded_split.
- Build Save Body: saveBody (what Save to DB posts) gets conceded_split for the single judge.
- conceded_split = {reader:'pkgCLR', defender:{stored, stated, granted, unexhibited, unnamed, granted_items, unexhibited_items}, challenger:{...}},
  read from the final verdict text by W1's pkgCLR/clr.cjs (embedded in its own scope, so a later pkgCLR copy cannot collide).
- Each node is wrapped whole: its own code runs unchanged inside an arrow function, so every return path is covered.

Shas (live s12 d5375c6e base): Alternate Merge aa05732f -> 6a20f5d2; Build Save Body e1bc41bb -> 7549355c.
On the graded-ahead outputs: Alternate Merge on pkgSGA2 18368591 -> 34fdeb5c; Build Save Body on pkgPMR 15819950 -> 95b107bb.
W4 writes whichever matches the live base at the gap (plan_CSP.json; patched/on_*.js).

Storage: record_debate_judgment and record_debate_row keep only keys that are real columns, so the key is dropped harmlessly until the
column exists. Until then the split is still visible in W4's saved inputs (inputs/<run>_Alternate_Merge.json). DDL for Eric's approval:
  ALTER TABLE public.debate_judgments ADD COLUMN conceded_split jsonb;
  ALTER TABLE public.debate_results ADD COLUMN conceded_split jsonb;
Not at a run (W3 rule 2653).

Tests (test_CSP.txt): 9 OK. 33218 real nodes: base reproduces the saved Alternate Merge bodies; patched equals base except the key;
granted+unexhibited equals the stored count on every body; the hand-read split matches. 201 stored judgments: 0 reader errors.
Revert: base/*.js.
Not included: hermes 2's K-W grant-sentence count beside the link counts (separate item).
