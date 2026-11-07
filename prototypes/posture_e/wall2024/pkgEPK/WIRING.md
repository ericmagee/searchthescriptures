# pkgEPK (W1 Wall 2758; scope W3 2759): E-PREM count pushes and other judges' words in send-back reasons

Enforcer fix, TRIAL, side-neutral.
- Nodes: Send Back Build, Alt Send Back Build.
- Base: live s25 (396a2d54). It does not touch pkgLOG's node, so the two can be written in either order.

## The gap

In 33261, gemini first counted 0. The DeepSeek E-PREM check then pushed "(right: COUNTED)" for premises 1 and 5 (S27, S31). The S31 reason quoted chatgpt's own count words. gemini's gate change G12 applied the push with no ground at all. 33249 sol S28 took the same path.

## What it does

No push is stopped (ruling 428). The engine adds the following to the push it sends.

(a) The K-UNX note. It applies when all three hold:
- the push is an E-PREM "(right: COUNTED ...)" on a premise listed against either side;
- that premise's answering block (CR3 or DR3) exhibits 2 or more layer kinds;
- the reason names no layer the block lacks (unxLack).

The note reads:

"THE COUNT RULE (K-UNX, TRIAL, pkgEPK): A count of UNEXHIBITED must name the layer the block lacks (K-UNX). A failure of fit is graded at the collision (a FORCED line, ruling 411), not counted. You keep the decision."

(b) Cutting another judge's words from the reason. A run of 6 words is cut from the reason sent when it:
- is found in another judge's text (a seat other than this one),
- and is not in this judge's own text,
- and is not in the debate record (the judge's request text).

Further rules for (b):
- A cut is 3 words or more.
- Words that belong to a 6-word run of the record, or of the judge's own text, are never cut.
- Quote marks are not part of a word.
- The sent reason shows "[words from another judge's line cut: record words only (pkgEPK)]".
- The item records reason_full and xcut.

Readers: ciRounds, lbBlockText, lbFoot, unxLack and gatePromptText2024, with what they use (9 declarations), are copied byte for byte from the base Gate Record by lib_extract.cjs, using acorn. The build fails if a target node already declares one of them.

## Tests

Run test_EPK.cjs on real nodes and saved inputs. It gives 14 OK.

| Test | Run | Result |
|---|---|---|
| A1 to A4 | 33261 gemini | S27 and S31 get the note. S31's chatgpt words "does not meet the pressed causal meaning" are cut and recorded. BASE sent them. The same items are sent. |
| B1, B2 | 33249 | sol S28 gets the note; item sets unchanged. |
| C1 | Negative control | A reason naming a missing layer gets no note. |
| C2 | Negative control | A reason quoting 12 words of the [DR3] round is sent as written. |
| D1, D2 | 33218 | The same items are sent. One cut: sol S4, "does not engage the pressed exclusion", which is chatgpt's words. Other bodies are byte-equal. |
| F | Alt Send Back Build | Same items on 33222, 33249 and 33261. Notes: grok S35 to S38 (33222), grok S4 (33249). |
| E1 | Built prompt | The prompt for 33261 gemini S31 is in prompt_33261_gemini_S31.txt. |

## Build

Setup and build: `npm ci --prefix pkgEPK; node pkgEPK/build_EPK.cjs [fetch-back]`

The build writes:
- patched/ (committed);
- plan_EPK.json;
- out/workflow_EPK.json.
