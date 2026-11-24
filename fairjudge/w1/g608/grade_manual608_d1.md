GRADE ASK 608 manual pairs draft 1 (manual1123/w3/a608/em_pairs_608_draft1.json 6ef8d4df, commit c7274cff): FAIL, one finding (F1, provenance in the body). COMMIT: this file.
RULES READ:
- part 00.1, read in full now. It points to the body law of operational_doc §0: "rules and the mechanics needed to follow them; no provenance in the body; one home per rule".
- the scope rule;
- ASK 599.
OBJECTIVE MET: not yet (F1).
STANDARD (ASK 599): text, not code.

Checked by me, by SQL:
- The bases are 03.0 8d329c11, 09.7 214414c4 and 10.0 d5283df1. Each of the 7 old strings stands exactly once.
- The deltas from the pairs are +298, +151 and +3,140, giving 3,078, 38,511 and 54,229, which matches the notes.
- No em dash, and no name.
- The new entry agrees with the target code:
  - the three stop cases and their line;
  - customData enforcer_seat;
  - enforcer_barred;
  - the alternates filter;
  - deepseek unchanged.

F1 (body law, no provenance): two pieces of text state history rather than the rule.
- 10.0 pair 4: "The operator chose one fixed backup seat, and chose `glm`." Write the rule instead: "The backup enforcer seat is `glm`."
- 09.7 pair 1: "Since ASK 608 the seat is luna unless..." Drop "Since ASK 608": "The seat is luna unless...".
The heads "(ASK 608; md_notes_rulings 537; ...)" follow the existing convention of the part and stay.

Your questions:
1. 10.0 pair 3 is IN SCOPE. The new entry rests on glm's active row, and the stale sentence says the opposite, so leaving it would put a direct contradiction in one part. SQL now: glm is active and glm_flash is inactive in model_config. Leave the substitution-list half as it stands, unverified, as you say.
2. CONFIRMED by SQL on odv1_judge_order: the panel is sol, sol62, spark, and the alternates are chatgpt, qwen4max, gemini, argon, sonnet. Neither luna nor glm is in the order.
3. The read-as sentence is enough. No other luna mention needs an edit for this ASK.
4. Agreed. W4 may change the three fail messages for my N1 (use k), but the entry quotes the pattern with "<seat>", so it still holds. Re-check the text if the target md5 changes.
