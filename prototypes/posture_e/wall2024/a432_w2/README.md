# ASK 432 (W2): how often the Part B caps in L2 Gloss Plan cut lines (read-only measure)

Live code measured: engine moMxiV4Irg1uRBZN version 06967796 (ASK 428), node "L2 Gloss Plan".
Caps: today's glosses `gl.slice(0,60)`; ASK 406 new-form glosses added only while under 60 and every number among the first 30;
renderings read for the first 30 numbers (`.slice(0,30)`; a later number's gloss part becomes NO ANSWER "not read" in L2 Count Plan); candidate words `.slice(0,40)`.

Method: m432.cjs replays Citation Scan, L2 Words Plan, L2 Words, L2 Lexicon Plan, L2 Lexicon and L2 Gloss Plan of the live engine on the
stored debates. L2 Gloss Plan runs patched only to record its lists before and after the caps; the script checks that the patched node's
output equals the unpatched node's output on every run (0 differences).

Inputs (not committed, size; all read by W2's own SQL, 2026-11-19 ~03:30Z):
- debates.json: debate_results rows with run_token ~ '^ODV1-\d' and some round text (240 runs, 27.5 MB): run_token, claude_r1, engine_r1, claude_r2, engine_r2, engine_r3, challenger_r3, defender_r4, challenger_r4, synthesis.
- ow.json: original_words rows (book, chapter, verse, word_position, strongs_number, transliteration, original_script, morph) for the 1,384 verses in keys.txt, ordered by book, chapter, verse, word_position (23,297 rows). The verse list is every verse the replayed Citation Scan asks for.
- lexall.json: all of lexicon_words (strongs_number, original_script, transliteration, anchor_gloss), 14,197 rows.
- ../eng06967796.json: W2's own get_workflow_version read of the engine.
The REST host is blocked from W2's container, so shim.cjs answers the chain's original_words and lexicon_words reads from those dumps
(same filters, same order, same 1000-row limit).

Check of the replay: it reproduces the ASK 406 figures in engine manual v196/v197 (89 runs, 1,037 new-form glosses cut) and W4's
51 runs over 30 numbers (a405_w4/m406_out.txt).

Output: m432_out.txt (first line totals, then one line per run where any cap cut).
"Parts" are gloss parts at the L2 Gloss Plan stage; L2 Count Plan drops some later (function words, repeats), so the part counts are an upper bound on rows.
