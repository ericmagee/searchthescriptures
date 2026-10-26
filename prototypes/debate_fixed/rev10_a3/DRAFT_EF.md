# BB-7397 rev 10 draft: items (e) and (f), exact text (Worker_A3, 26 Oct)

Nothing here is applied. Agreed on BB-7686 (items) and BB-7683 (Worker_A3 drafts, Worker_E measures).

## (e) The tie reads a cure-overturned seat's pre-cure RESULT line

Live: derive_debate_outcome(uuid), md5 450aebe1. Its tie branch and its F10 flag both read each seat's FIRST "RESULT:" word.
A seat whose cure overturned its verdict (deepseek in run 28427: BROKEN to HELD-1) keeps its pre-cure "RESULT: CHALLENGER WINS".

1. New function: `helper.sql` (md5 ab47eb71), `judgment_result_word(p_raw, p_seat, p_challenge_standing)`.
   For a seat carrying its own "[AUDIT v21: CORRECTED RESULT -- SEAT: s; ORIGINAL: a; COUNTED: b ...]" with a <> b, the word is the
   judge prompt's Line 2 rule on the counted verdict: BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS only if CHALLENGE STANDING
   is not SELF-SUPPORTED or a collision line not in RETRACTED is CHALLENGER LINK BROKEN; else UNDERDETERMINED. Any other seat: its RESULT line, unchanged.
2. In derive_debate_outcome, replace `e_old.txt` (md5 08f24b18; occurs exactly twice: the F10 flag and the tie count) with
   `e_new.txt` (md5 836c2a2c). Guard: function md5 450aebe1 and 2 occurrences. Patched function md5 c69444db (computed live, nothing written).

Measured read-only against every stored judgment (16:5x CDT): three seats carry an overturning CORRECTED RESULT line.
- cd8b6405 (run 28427): deepseek CHALLENGER WINS -> UNDERDETERMINED; HELD seats 2, UNDERDETERMINED 1 -> 2; outcome DEFENDER PREVAILS -> UNDERDETERMINED.
- fd6a5ca9: gemini -> UNDERDETERMINED; HELD 3, UNDERDETERMINED 2 -> 3; outcome UNDERDETERMINED unchanged; underdetermined_seats gains gemini:RESULT.
- 6b95a298: CONTESTED (no tie branch); outcome unchanged; underdetermined_seats gains gemini:RESULT.
W-D rewrites outcome and underdetermined_seats on its next call for these rows (they are live re-reads, not stamped).

## (f) A K-G6 statement cure drops a stated CORRECTED COUNT

Live: 14 nodes of a82b4d29 carry the shared cure library (list: kg6_files.txt). In it the K-G6 branch returns CURED on any statement
that quotes the transcript before CORRECTED COUNT is read, and cureSet then skips a side whose items are all statement cures.
Grok, run 28427, wrote "CORRECTED COUNT: DEFENDER 1" and "CORRECTED STANDING: DEFENDER PROP-DEPENDENT"; stored SELF-SUPPORTED, 0.

Patch: replace `f_old.txt` (md5 13f2acdd; once in each of the 14 nodes) with `f_new.txt` (md5 e8128175): when the reply carries a
CORRECTED COUNT for the item's side, the count path (kCount) decides the item; otherwise the statement path as before.
Expected on Grok's reply: needN 0 (its K-G6 premise is statement-quoted), count 1, L 6, want PROP-DEPENDENT, got PROP-DEPENDENT:
CURED "counted: DEFENDER COUNT 1, STANDING PROP-DEPENDENT"; cureSet then writes DEFENDER 1 / PROP-DEPENDENT. Not run: Worker_E to measure.
Node md5s before -> after: in NODES14.txt. Files after: new14/. node --check passes on all 14.
Run 28427's stored row does not change from (f); it applies to new runs.
