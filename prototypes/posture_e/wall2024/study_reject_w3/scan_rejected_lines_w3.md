# Lines of the DeepSeek enforcers that the live record steps do not read: W3's independent scan (second reading)

Written 10:27 CST 2026-11-10 by W3, before reading W2's scan. Offline; no call, no change. Live code = fetchback_live_s108.json. Every stored reply in /mnt/project-files/wall2024/inputs/ was run through the live record step of its enforcer. Runners and outputs in this folder: acx_scan, enf_scan, enf_scan2, enf_scan3, enf_plants.

## Covered
| Enforcer | Stored debates | Reply lines | Not read by the live code |
|---|---|---|---|
| Anti-cheat check (Anticheat Record) | 38 | 3,778 | 4 |
| Debater enforcer, rules K-W and K-S3 (Enforcer Record) | 37 | 1,804 | 0 |
| Judge enforcer, the E- rules (Judge Enforcer Record) | 37 | 7,502 | 8 |
| Alternate judge enforcer (Alt Judge Enforcer Record) | 24 | 1,669 | 0 |
Not covered: the closing enforcer (W2's part; my findings are in pkgRAC/check34108/). No stored reply on the mount: judge contradiction check, reread, assume check, second alternate judge enforcer. Those cannot be scanned offline.

## Findings
1. ANTI-CHEAT, 4 real lines not read, two forms. All four answered CONSISTENT, so nothing was lost in these debates. Each is logged NO ANSWER.
   - A period after the last quote mark (33389 X34, X36; 33617 X75): `-- EARLIER: "..." .`
   - The EARLIER quotation without quote marks (33389 X73).
   Plants on a real REVERSED line (33218 X57): with a period after the last quote mark, with EARLIER unquoted, with single quote marks, with a note after the last quote, or with the answer in lower case, the line is NOT READ, logged NO ANSWER, and the pair is not shown to the judges. A reversal written in one of the two real forms would be lost that way. Bold markers around ANTICHEAT are read.
2. JUDGE ENFORCER, 3 real lines without the "ENFORCER:" head (33815: "Y6.1 -- DISAGREE -- RIGHT: OVERSTATED -- ...", Y7.1, Y8.1). Not read. In that stored run three ids were uncovered, so the retry asked again and the rows were filled from the second reply; the first reply's DISAGREE on Y6.1 is not in any row.
   Plant on a real DISAGREE line (34108, B3.1, rule E-ANS): without the head, or with a list dash before it, the row reads NO VERDICT. One uncovered id does not start the retry (it needs two or more), so a single headless DISAGREE is lost: no send-back for that judge line. Logged as NO VERDICT, so not silent.
3. JUDGE ENFORCER, 5 real lines that answer "TRUE" with no AGREE or DISAGREE (33222, rule E-SYN: "ENFORCER: Y1.1 -- TRUE -- ..."). Read as NO VERDICT. All five agree with the synthesis line, so nothing was lost; E-SYN is record-only.
4. Forms the live code DOES read, checked row by row (verdict equal, and seat equal where the line names one): "G2/A2.1" (35 lines, 33506); a seat name in place of the id ("ENFORCER: sol -- ...", 32 lines, 33389 and 33371); "P1.1 (gemini)", "B70.1 (chatgpt)", "grok (H1)" and the like (102 lines, 33249, 33389, 33411); ids without the part after the point ("B12", 33442, 33461). Plants: bold head, lower case verdict, no RIGHT field, en dash or single hyphen separators are read.
5. Replies with lines missing altogether (not a form fault): rows left NO VERDICT because the reply was empty or short: debater enforcer 33482 (67) and 33705 (61), judge enforcer 33222 (89, one empty call), 33430 (25), 33218 (1), 33461 (1), alternate 33299 (47). The retry step added since (pkgMER) resends when two or more ids are uncovered; the stored runs predate it or hold no retry reply.

## What is worth fixing (smallest first; none built)
A. Judge enforcer and debater enforcer line pattern: accept a line that starts with the id when the "ENFORCER:" head is missing, and a leading list mark. Code only. Real case: 33815. Size not measured (the pattern is in the Shared Library since pkgR1).
B. Anti-cheat pattern: allow a period or other closing mark after the last quote mark, and read REVERSED case-insensitively. Code only. Real cases: 4 lines, all CONSISTENT. An unquoted EARLIER cannot be checked against the rounds safely; leave it NO ANSWER.
C. "TRUE" without AGREE: leave. Record-only rule, 5 lines in one early debate.
Both A and B add no prompt text. Neither real case changed a grade in the stored runs; the risk is a lost DISAGREE or REVERSED in a later run.
