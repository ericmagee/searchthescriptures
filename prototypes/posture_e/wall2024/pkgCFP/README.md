# pkgCFP rev 1 (W1): the anti-cheat check's pairs go to the post-panel enforcer (W3 enforcer gaps study, Proposal 1, anti-cheat part)
SHELF ONLY. W3's study ranks this as the fallback, to be used only if set C (operator ASK 6) shows the closing enforcer misses what the anti-cheat call finds.
No write request.

What it closes: the anti-cheat check's confirmed pairs (REVERSED, both quotes found) are only printed to the judges ("is DISREGARDED"); no enforcer
receives them, and in stored debates judges did not act on them. With pkgCFP, Judge Contradiction Build adds each SHOWN pair as a candidate for the
post-panel DeepSeek enforcer, which answers it and names its link; Judge Contradiction Record (unchanged) confirms by code; a confirmed pair breaks
the link under the operator's contradiction rule (14:42 CST 11-09), as any post-panel contradiction does.
Not included: the close-round reversal check's pairs (2 of 42 stored debates). They exist only as text inside Panel Build's prompt; carrying them as
data needs a Panel Build change, left out to keep this to one node.

Change: one node, Judge Contradiction Build (build_CFP.cjs on fetchback_live_s105.json; write file parent_s105_CFP.json).
- A1: after the judges' lines, each shown anti-cheat pair is added with its earlier round found by the Record's own quote test (rounds 1 to 3 of that side).
  A pair a judge also named merges into one candidate that names both.
- A2: such a candidate is described to the enforcer as "the anti-cheat check (found by the system; both quotes checked)".
- A3: one prompt sentence shortened: "each was named by a judge after it read the debate." -> "each names who found it."

Size (size_CFP.txt):
- Code: Judge Contradiction Build 11,164 -> 11,666 characters (+502).
- Prompt: -27 characters in every call; plus each added candidate line. Over 46 stored runs: +1,824 characters in 22 existing calls (-27 to +988 each).
- One new DeepSeek call where judges named no closing contradiction but the anti-cheat check did (33644: 1 of 46 stored runs, about 141,000 characters).

Checks (labels labels_CFP.md, 073a49a5 and amendment, before each run)
- test_CFP.txt: 46 stored runs, 44 OK. Runs with no shown pair: output equal to live except the shortened sentence (L2, L4).
  Runs with shown pairs: every distinct pair is a candidate, merged with a judge's where both named it (L1, L3).
  Two not OK, neither a code fault:
  33846: 6 shown rows are 3 distinct quote pairs (the same pair recorded under three verses); 3 candidates is right. My label counted rows, not pairs.
  33530: the saved Panel Payloads holds no bodies; live s105's build fails on it the same way; untestable from stored data.
- test_CFP_record.txt (L5): Judge Contradiction Record, unchanged, confirms a planted CONFIRMED answer to each of 18 anti-cheat candidates in 8 runs by code.
Not tested: what DeepSeek answers to these candidates (needs relay calls; set C or a replay would show it).
