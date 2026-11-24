# ASK 608 engine manual entry, draft 1 (W3), for W1's grade

DRAFT ONLY. Nothing is written. The write waits on (1) W4's ASK 608 engine write on the operator's card and W1's readback, (2) W1's grade of these pairs, (3) the operator's press on my own card, (4) no run live. Drafted now, with the build, under the practice of ASK 620.

Pairs: em_pairs_608_draft1.json, md5 6ef8d4dffc60eebe3164947fffa0a938. Seven pairs in three parts, against manual version 304 (746,428 characters).

| part | base version, md5, length | pairs | each old text stands | result md5 | result length |
|---|---|---|---|---|---|
| 03.0 | v303, 8d329c113a302151e038ebe97d71a1c1, 2,780 | 2 | once | 017b028531b5828dbb91bd6254d8eb7a | 3,078 |
| 09.7 | v268, 214414c4f6c867f54df7c027dfd39680, 38,360 | 1 | once | 9e376abcb606fd75e62d8786e85644fe | 38,511 |
| 10.0 | v304, d5283df1cb37ecc7135cbd6ca8a5889c, 51,089 | 4 | once | 09c77d104df9bdb6c6d700b4897e2759 | 54,229 |

The result md5s and lengths are from my own SQL (the pairs decoded from base64 and applied in order to engine_manual_part of each part, 14:2x CST 11-24), not from engine_manual_part_apply. The function's own preview is checked in the write call.

WHAT EACH PAIR DOES
- 03.0 pair 1: request rule 2, "the enforcer model is luna, §9" gains "or the backup seat when a model of luna's family debates" with the entry's name.
- 03.0 pair 2: the Resolve Seats line gains one sentence: when a model of luna's family debates, the backup seat's row is required and the run stops when that seat cannot enforce.
- 09.7 pair 1: THE ENFORCER MODEL IS LUNA, "What it does", gains one sentence pointing to the new entry.
- 10.0 pair 1: the pointer "(NO JUDGE RUNS A DEBATER'S MODEL, the last entry of this section)" becomes "(the entry NO JUDGE RUNS A DEBATER'S MODEL in this section)", because the new entry is now the last.
- 10.0 pair 2: "the enforcer model is luna (§9)" gains the backup clause and the pointer.
- 10.0 pair 3, A CORRECTION OF A STALE FACT, FOR W1 TO RULE IN OR OUT OF SCOPE: the manual says "The model_config rows `glm_flash` and `glm` are inactive". By SQL at 14:1x CST the `glm` row is active in model_config and in model_config_jfl (z-ai/glm-5.3, zhipu, openrouter, 131072); `glm_flash` is inactive. The new entry rests on glm's active row, so I correct the sentence here. The rest of that sentence ("`glm` is out of `odv1_record_panel_substitution`'s seat list") is kept and NOT re-verified by me.
- 10.0 pair 4: the new last entry, THE ENFORCER IS NEVER OF A DEBATER'S FAMILY (2,996 characters): the rule; what Resolve Seats does; the three stops and their line; the alternates list; what is unchanged; what was shown offline; limits.

SOURCES: ask608/w4/b1/notes608.md and build608.cjs (the three fail texts, the output fields, the alternates filter, read by me); out_t608.txt (90 pairs: 56 equal, 34 with an OpenAI debater, 30 glm, 4 stops; T3); ruling row 537 ("Bar it"); W1's N2 to N4 as W4 relayed them (thread note 14:16 CST).

BODY LAWS KEPT: no card, time, md5 or audit id in the text; "the operator", no name; no em dash.

QUESTIONS FOR W1
1. Is 10.0 pair 3 in scope? If not I cut it and raise it as its own item.
2. The entry says "Luna and glm are not in the judge order today". Luna: W4's notes. glm: W4's notes ("glm is not in the order"). Please check against odv1_judge_order.
3. The entry leaves the other "luna" mentions of sections 4, 9 and 17 as they are, under the sentence "Where this manual says "luna" of the enforcer model, read the seat RS.enforcer holds for the run." Say if any of them must be edited instead.
4. If W4's target changes before the write (a new revision), the entry is re-cut and regraded before it is written.
