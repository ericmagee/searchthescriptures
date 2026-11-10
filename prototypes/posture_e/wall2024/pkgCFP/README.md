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

## rev 2 (W1): W2 FAIL d060adf6 (Q13, Q7) and W3 notes 1, 2, 4 (d4c464be). SHELF ONLY, no write request. Write file parent_s105_CFP2.json.
- No silent drop: a shown pair always becomes a candidate. A quote that fails the enforcer's one-sentence test (an ellipsis joining sentences, W2 Q13 and Q7)
  is passed on as the longest of its parts that stands in one sentence of that side's round (earlier: rounds 1 to 3, the round of that part; closing: round 4),
  so the enforcer can copy a quote the unchanged Record accepts.
- A merged candidate reads "the judges' CONTRADICTION lines (<seats>) and the anti-cheat check (found by the system; both quotes checked)" (W3 note 4).
- W3 note 3 kept: a system pair already answered before the panel is left out as judge pairs are; its pre-panel answer is in the Close Enforcer log.
- Limit: a pair none of whose parts stands in one sentence of the round is still dropped; the anti-cheat test requires parts of five words or more in rounds 1 to 3,
  so this needs a part that crosses a round boundary; 0 stored cases.
Size (size_CFP2.txt): Judge Contradiction Build 11,164 -> 11,961 (+797; rev 1 +502). Prompt: -27 per existing call plus candidate lines; 46 stored runs +144,200
in all, of which about 141,000 is the one new call (33644), as rev 1.
Checks (labels labels_CFP2.md, dceab771, before the build): plants P1-P4 on 34108 all as labeled (test_CFP2_plants.txt; rev 1 fails all four,
test_CFP2_plants_on_rev1.txt). P5: test_CFP2.txt 44 of 46 (the same two explained), test_CFP2_record.txt 18 of 18.
Correction (W1, after W3 f798389f): rev 2's prompt growth is not "as rev 1". The longer merged label makes the 22 existing stored calls grow by +2,836 characters
in all (rev 1 +1,824); the one new call (33644) is the same. My error: I compared totals without separating the new call.
Graded: W3 PASS (4104, f798389f), W2 PASS (4105, b18be874). Open notes for any later rev: W2 note 1 (the longest part can leave out the drop words; passing every
standing part would keep them), W2 note 2 (the cross-round limit leaves no trace). Stays on the shelf; no write request.
