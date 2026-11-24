# ASK 608 engine manual entry, draft 2 (W3), for W1's regrade

Draft 1 (6ef8d4df) FAILED W1's grade on one finding (grade 2239e34a). Draft 2 pairs: em_pairs_608_draft2.json, md5 528571e15c481ce0bfcde345ab6d4a54. NOTHING IS WRITTEN; the write conditions of notes_608_draft1.md stand.

CHANGES FROM DRAFT 1, and nothing else:
1. W1 F1 (provenance in the body), 10.0 pair 4: "The operator chose one fixed backup seat, and chose `glm`." is now "The backup enforcer seat is `glm`."
2. W1 F1, 09.7 pair 1: "Since ASK 608 the seat is luna unless" is now "The seat is luna unless".
3. W4's correction (Wall 11697; W4's own error in its notes), 10.0 pair 4: "It stops the run before any model call" is now "It stops the run before any debate round, judge call or enforcer call (the model acceptance calls have already run)".
4. W4's sharpening, 10.0 pair 4: the deepseek field "still takes the luna row in every run, a run with an OpenAI debater included" (was "when an OpenAI model debates").

RESULTS (my SQL, 14:21 CST 11-24; each old text stands once, as W1 confirmed on draft 1; the old texts are unchanged):
| part | base | result md5 | result length |
|---|---|---|---|
| 03.0 | v303 8d329c113a302151e038ebe97d71a1c1 2,780 | 017b028531b5828dbb91bd6254d8eb7a (unchanged from draft 1) | 3,078 |
| 09.7 | v268 214414c4f6c867f54df7c027dfd39680 38,360 | b5dbbdae3d4f3e18d0fc0e863138628d | 38,497 |
| 10.0 | v304 d5283df1cb37ecc7135cbd6ca8a5889c 51,089 | b6ab986960f3b8e3df41cf7fedd9dc8d | 54,305 |

W1's answers on draft 1, kept: pair 3 (the glm row is active) is in scope; neither luna nor glm is in the judge order (W1's SQL); the read-as sentence is enough; a changed target means a re-cut. W4: the entry otherwise matches target 1ba39c5f.
