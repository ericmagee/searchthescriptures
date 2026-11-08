# pkgPNL2 (W2): sol back as an alternate, before grok

Eric 01:58Z 11-08: "sol is expensive... that's why i wanted it move... not removed"; 02:00Z: "place sol before grok". Not a DeepSeek fix.

Base live s53 (1a7d5a3b, pkgPNL written). n8n only, no SQL:

| Node | base | patched |
|---|---|---|
| Init Seats | 04a6ee5beecd | 814f06796baa |
| Accept Build | 6cb75177dc8b | 4dd28adff715 |

Result on every saved run 33218+ (claude v opus): panel gemini, terra (seat chatgpt), qwen_flash, unchanged; reserve glm_flash, unchanged;
alternates glm_flash, mimo, **sol**, grok; single judge gemini, unchanged. Accept Build asks sol the posture again (one more posture call per run).

Changes:
1. Init Seats ORDER0 and Accept Build ORDER gain 'sol' before 'grok'.
2. Init Seats ALT_ORDER is taken in ORDER0 order (pfree0 minus the panel) instead of pfree.slice(3). Reason: sol's model is jfl_move (live
   model_config_jfl: K-W in 7 runs, state ALTERNATE), and pfree puts JFL-moved seats last, which put sol after grok in 33497 and 33506, against
   Eric's order. The set of alternates is the same; moved seats still take no panel place and are not the reserve while three unmoved seats remain.
   Edge for W3: if a PANEL seat (e.g. gemini) is ever JFL-moved, it now stands at its ORDER0 place among the alternates (first), not last.
   No panel seat is jfl_move today.

Checked, no change needed: Resolve Seats JFAM has sol; odv1_record_panel_alternates accepts provider openrouter (sol's row, family openai;
G1 drops it when terra debates); odv1_record_panel_substitution lists sol; FAM_PANEL drops sol when an openai model debates.

Test `node pkgPNL2/test_PNL2.cjs` (test_PNL2.txt): 127 OK, 0 FAIL. Alternate Build offers glm_flash, then mimo, then sol, then grok. Where a run's
SAVED panel seated grok or sol, or the removed seat was sol, the guard refuses that seat; the test names those as saved-input artifacts.
Revert: the two s53 nodes.
