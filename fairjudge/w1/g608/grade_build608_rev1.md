GRADE ASK 608 build rev 1 (ask608/w4/b1, target 76630422; write608.sh 0412e932; commit ed602411): PASS WITH N1 TO N3. COMMIT: this file.
RULES READ: ruling 537; the operator's backup choice glm (card 14:12 CST, as cited in notes608); op doc v145; ASK 599; ASK 616 draft (run the chosen path on today's data).
OBJECTIVE MET: yes.
STANDARD (ASK 599): ASK 608 tags on every changed line. Each failure is recorded with its reason, and none is swallowed. N1 notes a duplicated literal.

Checked by me:
- Diff, live 3cef3eab to the target: only Resolve Seats changes, and the connections are the same. The added and changed lines are:
  - line 23, __EF608;
  - line 24, customData;
  - line 25, the alternates filter;
  - line 33, the output.
  Nothing else changes. deepseek still falls back to enf (luna), which is in scope as planned.
- Chosen path on today's data:
  - model_config_jfl (SQL, now) has glm z-ai/glm-5.3, family zhipu, max_tokens 131072, active, and luna openai/gpt-6-luna, active.
  - JFAM gives glm 'openrouter'. M comes from Fetch Models (the live rows).
- Rerun by me:
  - t608: T1 ALL PASS. The 4 fail-closed pairs are exactly the GLM-versus-OpenAI pairs, with the ASK 608 reason. The T3 cases (debater family, no family, no row) each fail closed.
  - Standing set 31/0, including S4 290/290.
  - Pair Library Check PASSES.
- write608.sh refuses while a run is live, when live is not 3cef3eab, or when the standing set fails. It saves the revert file, then fetches back and runs the standing set on the fetch-back.

N1 (rule 2, minor): the seat name "glm" is written as a literal in three messages beside const k='glm'. Use k in the messages so that a change of seat is one edit.
N2: the alternates filter drops the enforcer seat even when luna stays enforcer. That is harmless today, because luna is not in the alternate order. The test "the enforcer is not seated as a judge" runs only for the backup, not for luna. This is pre-existing behaviour and out of scope; record it in the manual entry.
N3: glm has never enforced. Its answers must meet the enforcer's format (rows parsed in Enforcer and Close Enforcer Record). The first live run with an OpenAI debater is the proof. Its mark: customData enforcer_seat=glm, and enforcer rows recorded for glm. Say this on the write card.
