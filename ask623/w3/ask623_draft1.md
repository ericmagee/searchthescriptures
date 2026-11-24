# ASK 623: Gemini 4 Neon and Gemini 4 Hydrogen join the debate as debaters and as judges (ASK FORM draft 1, for W1's grade)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 14:4x CST 2026-11-24. On the operator's order of 14:35 CST 11-24 in the project chat (message cmsg_017ZQamDMHrS6fqMHnQDVo583JBgHp41ueZcxcvSQQiwti): "create an ASK nbr to add google/gemini-4-neon  and google/gemini-4-hydrogen  to debate as debater and judge." Number by the coordinator. Builder W4. This is an ASK DRAFT: it is not a plan to done, and nothing is built, written or carded.

RULES READ: ASK FORM and TWO LIVE RUNS (op doc v145); the build rule (no model settings changed by a build); the family rule and NO JUDGE RUNS A DEBATER'S MODEL (engine manual part 10.0, ASK 601); ruling 537 with ASK 608 (the enforcer); ruling 512 (features go live); the note of the ASK 487 mistake (check a card against his prior rulings first); "NEVER TOUCH REASONING. UNLESS I INSTRUCT IT." (this ASK adds no reasoning or effort field to any call).

WHAT THE RECORD HOLDS TODAY (my SQL on model_config, 14:36 CST):
- Seat `hydrogen`: google/gemini-4-hydrogen, family google, openrouter, ACTIVE, max_tokens 65536. Its note: "alternate only", added 11-12 (ASK 145). It is NOT in the saved judge order (panel sol, sol62, spark; alternates chatgpt, qwen4max, gemini, argon, sonnet).
- Seat `gemini_deb`: google/gemini-4-hydrogen, INACTIVE, 64000. Its note: ASK 487, "the gemini DEBATER's own row ... Not a judge seat". So Hydrogen was once the model behind the gemini debater.
- Seat `gemini`: google/gemini-3.8-flash, active (judge seat, and the gemini debater's row now). Seat `argon`: google/gemini-4-argon, active (alternate).
- NO row holds google/gemini-4-neon.
- Whether OpenRouter serves the id google/gemini-4-neon is NOT VERIFIED by me (I have no OpenRouter read). W4 verifies it before anything else.

## 1. OBJECTIVE
The operator can choose Gemini 4 Neon or Gemini 4 Hydrogen as either debater, and can place each as a panel judge or an alternate on the Judge order page. Expected effect: two more debaters and two more judge seats, each under every rule that binds the present seats: no judge of a debater's family, no judge running a debater's model, the enforcer never of a debater's family, a panel of exactly three.

## 2. ROLES
Planner: W4 (the code search decides the scope), from this draft. Builder: W4. Grader: W1. Manual entry and AAR row: W3, drafted with the build (ASK 620). Card: W4's thread; the engine, the database rows and functions, and the dashboard go live on that card or on cards it names.

## 3. SCOPE, with the SEARCH that must set it
NOT YET SEARCHED; the list below is where the record says a seat lives, for W4 to confirm or correct by search in the engine, the child and every workflow they reach:
a. model_config and model_config_jfl: one row per new seat (a new `neon` row; the `hydrogen` row exists).
b. Init Seats: the engine map `ENG` (which debater engines are accepted and which model row each reads), the free-seat lists, the family map `FAM_PANEL` and the OpenRouter seat list.
c. Resolve Seats and the child's copies; the Shared Library, engine and child, wherever a seat name is listed.
d. Database: `odv1_judge_order` (only the operator's Save places a seat), `dash_judge_lineup`, `odv1_record_panel_alternates`, and `odv1_record_panel_substitution`, whose fixed seat list stopped a run for qwen4max until ASK 594.
e. The dashboard: the debater choices at launch and the seats offered on the Judge order page.
f. The Accept Models call list (every seat is asked the agreement).
g. The price list behind call_costs, so a new seat's calls are not stored as "no price".
h. Any text that names the Gemini seats to a model (a prompt that lists judges or debaters). If the search finds one, it is named in the plan and NOT changed without the operator's word.

## 4. CRITERIA and DONE
C1. OpenRouter serves both ids; one check call per model returns a complete answer (as the argon row's check did), with no reasoning or effort field added.
C2. The all-pairings test (t1_601, t608; ASK 615 step 1) is rerun with the two new debaters: 12 debaters make 132 pairings where there were 90. EVERY pairing either seats exactly three judges or stops with a stated reason, and the list of pairings that stop, or that have no reserve, is shown to the operator BEFORE the write card. Today, with a Google debater, the judges gemini and argon are already dropped; with Neon and Hydrogen in the order as judges they are dropped too.
C3. On the 90 present pairings the seats are equal before and after, until the operator saves a new order.
C4. Neon against Hydrogen, both ways: no Google judge sits; no judge runs a debater's model; the enforcer is luna (no OpenAI debater).
C5. A Google debater against an OpenAI debater: the enforcer is glm (ASK 608, once it is written), and the panel still has three seats or the run stops with its reason.
C6. The dashboard's line-up for each new pairing equals the engine's (the T5 check of ASK 601).
C7. The substitution recorder and the alternates recorder accept both new seats (the ASK 594 case).
C8. ASK 612's compile-all passes on the target; the standing set passes.
DONE: built, graded, written on the card, read back, the manual entry written, and each new seat seen in a live run in each role it is given (TWO LIVE RUNS applies to each path).

## 5. WRONG-IF
- OpenRouter does not serve google/gemini-4-neon under that id (then the ASK returns to the operator with what is served).
- A seat list exists that the search missed (the qwen4max fault of ASK 594).
- Adding two Google seats as judges changes who sits on a present pairing without the operator having saved a new order.
- A Google debater leaves too few non-Google, non-debater-family judges for a panel of three on some pairing, and this is found by a run instead of by C2.

## 6. RUN EVIDENCE
For each new debater: a run whose debate_results row names it as defender or challenger, with all eight rounds and a judgment. For each new judge seat: a run whose JUDGE ORDER line seats it and whose debate_judgments holds its row. Registry entry (ASK 417): W4 names the case and mark in the plan.

## 7. INPUTS IN GIT
This draft: ask623/w3/ask623_draft1.md. For the builder: ask601/w4/b1 (t1_601), ask608/w4/b1 (t608, data_608.json), fairjudge/w1/g601 (T5).

## 8. STEPS
1. W1 grades this draft. 2. The operator answers the questions below (one card, mine, after the grade). 3. W4 verifies the ids (C1) and searches (section 3), then posts the plan. 4. W1 grades the plan; W4 builds; W1 grades the build with C2's list. 5. W4's write card, carrying C2's list. 6. Readback; W3 writes the manual entry on its own card. 7. The operator saves the judge order he wants on the page. 8. Live runs.
ORDER AGAINST OTHER WORK: after the run that proves ASK 611 and 601, and after ASK 608 is written, since this ASK changes the same seat code (Init Seats, Resolve Seats). ASK 614 and 615 (one view, one seat-test function) would make this ASK smaller if they went first; that is a choice for the coordinator and the operator.

## QUESTIONS THE OPERATOR MUST ANSWER BEFORE A PLAN (not yet put to him; the team first)
Q1. HYDROGEN'S ROW. The seat `hydrogen` is active at max_tokens 65536 and marked alternate only; his standing word for debaters and judges is "set all to 64k". Does Hydrogen debate and judge from that one row as it stands, or at 64000? A build may not change a model setting without his word.
Q2. NEON'S ROW. A new row `neon`, google/gemini-4-neon, family google, openrouter, 64000 by the same standing word. Confirm, or name another limit.
Q3. PLACE IN THE JUDGE ORDER. The build only makes the two seats available; the order is his to save on the Judge order page. Until he saves, do the new seats stay out of the order (my recommendation, so no present pairing changes), or does he name their places now?
Q4. THE OLD gemini_deb ROW (inactive; Hydrogen as the gemini debater, ASK 487). Left as it is unless he says otherwise; named here so that two rows on one model do not surprise anyone.
These are four points, but ONE card can carry them as "build as drafted" against "change", with the draft's defaults stated: Hydrogen from its present row unchanged; Neon at 64000; both out of the order until he saves.
