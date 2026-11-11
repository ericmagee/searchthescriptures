# W1: DeepSeek enforcer rules (s142/s143 library lines 3204-3214) against the judges' rules

Sources: rules142.txt (DeepSeek RULES, 12,838 chars); the judges' agreement JAGR (library line 2974, 13,787 chars, sent to DeepSeek as its system message); the judges' system prompt from 35173 Panel Build (judges.0.body.messages.0.content).
Stored rows: rows.cjs collects every Enforcer Record row of the 12 exports (6,566 rows, 4,835 after dedup by run, seat, rule, line, reason). scan1.txt, scan2.txt hold the scans.

1. E-ANS lacks "FAILS: ... or its quotation is marked NOT COUNTED" and the CITATION CHECK rule "a line marked NOT COUNTED is ... not an answer for any link". Absent from RULES and JAGR (grep). Stored: 34780 luna, Hebrews 2:16 [CR3], one line asked twice; DeepSeek DISAGREE (right: MEETS) "the NOT COUNTED citation label does not make the answer MISSES". The mark was right: the defender's quotation put "[margin: taketh hold of ... the seed of Abraham]" inside the quotation marks; kjv_verses Hebrews 2:16 margin reads "[took not...: Gr. taketh not hold of angels, but of the seed of Abraham he taketh hold]". The answer's other support, Romans 1:3, is a reference with no quotation. CONFIRMED (second reading of W2 Wall 5006 item 3). No other stored E-ANS row turns on the mark (7 other rows use "not counted" in other senses).
2. E-PREM (pkgEPS sentence) against the judges' ruling 372 path. Judges: UNEXHIBITED "or when a witness pressed against that premise ... was left unanswered (ruling 372)", and "An answer that MISSES or FAILS leaves the witness unanswered (372)". The same judges' clause also says "when its layers are there and you judge that its answer does not fit, grade that at its collision with a FORCED line and do not count it" (K-UNX). DeepSeek carries only the second. Stored: 6 E-PREM DISAGREE rows, right SPARED, on a judge's UNEXHIBITED for a witness its answer did not meet: 33371 chatgpt P2 and P5, 33371 grok P2, 34852 haiku P2 and P4, 35067 luna challenger P1. A conflict inside the judges' own prompt. CANDIDATE.
3. Gaps with no stored wrong reading found: E-VOID lacks the no-verbatim-quote VOID ground and "a verse carried under PRESSED WITH: is a witness, never a charge, and never voids a premise" (2 E-VOID DISAGREE rows, both on the beyond-the-quote ground). E-COL lacks "a press labelled UNPROVEN carries no answering burden" (E-HOLD has it; 0 rows). E-ANS and E-COL lack the citation clauses (quotation at another verse still [L1]; a citation error never counts for or against the other side; an answer in substance without its reference does not answer); 3 DISAGREE rows mention citation, none turns on them. E-ANS lacks NEW IN CLOSE ([CR4] material counts only as an answer to a witness already pressed); 0 rows.
4. Note: the engine reads FAILS as MISSES (form note, W3 2283 rule 1), so DeepSeek is told "judge wrote MISSES" on a FAILS line.
5. JAGR reaches DeepSeek. The ASSUMES/INFERS clause is in it; in 34726 and 34780 DeepSeek followed RULE E-VOID over it (W2's pkgA21 still fits, qualified).

## AGREE-row scan (coordinator 22:26Z) and W2 Wall 5031 E-COL second reading

AGREE rows, per clause (judge prompts per run: jp.cjs, jp2.cjs; rows ag.cjs, unp.cjs):
- NOT COUNTED: every citation-check NOT COUNTED line of the 12 runs (11 lines) traced to its rows (ag_out.txt). No AGREE row grades an answer resting on a marked quotation; the marked quotations sit in rounds the graded answers do not use (R1, R2, R4), except 34726/34780 Hebrews 2:16 R3, which has no AGREE row.
- No verbatim quote: PRE-CHECK says "no verbatim quote found" for 33497 challenger items 1-6 and 35067 challenger item 5. All 7 quotes are in the defender's rounds verbatim (33497 [CR1]; 35067 line 730 of the judge record). The judges' SPARED and DeepSeek's AGREE are right; the PRE-CHECK finder missed them ("The defender wrote:" list form; ASSUMES form).
- PRESSED WITH verse as a charge: 0 of the E-VOID AGREE rows rest on one.
- UNPROVEN: 18 E-COL AGREE rows; none rests on a verse the ledger marks UNPROVEN for that link.
- ARE AT (33490 Luke 1:31 words at Luke 1:35): 6 AGREE rows, all treat it as footing, which is the rule.
- NOT NAMED (33149 Jeremiah 18:8, against the challenger): judge counted UNEXHIBITED (the rule); DeepSeek NO VERDICT. Not both wrong.
- NEW IN CLOSE (33497 Luke 1:37): 0 AGREE rows touch it.
Result: 0 rows where judge and DeepSeek were both wrong under these six clauses.

Wall 5031 E-COL (col7.txt; challenger DR3 blocks read in the judge record):
- 33149 gemini D3 vs C2 (Matthew 1:25): answer reads "till" from the taking: [L1] Matthew 1:25 quoted, [L3] Matthew 1:24 "took unto him his wife" and Deuteronomy 20:7 quoted under the 1:18 answer. No [L2] on "till". CONFIRMED, limit: thin footing.
- 33490 gemini D3 vs C3 line and FORCED (Matthew 1:18): answer P3.1 reads the coming together as the taking: [L1] Matthew 1:18, [L2] paralambano, [L3] Matthew 1:24, 1:19, 1:20 quoted. CONFIRMED. The FORCED also quotes the challenger's own [DR2] sentence as MEANS.
- 33490 grok D6 vs C3 line and FORCED: the ground is "of the Holy Ghost" as source. The answer's layers foot the timing reading only; on the source it says only "That row names the son of David as the husband of the house." No layered rival reading of the source. NOT CONFIRMED.
- 35173 grok D3 vs C6 line and FORCED (Luke 1:35): answer P6.2 reads the "therefore" back to v.32 with [L1] Luke 1:35, [L2] eperchomai with Acts 1:8, [L2] episkiazo with Luke 9:34, Acts 5:15, [L3] Hebrews 10:5, 2:14, 2:16, 2:17. CONFIRMED.
Judges' rule for the confirmed rows: "Grade a link BROKEN when it cannot agree ... and the broken side shows no fit"; "You weigh only the meaning the debaters show and add none of your own".
