# ASK 608 BUILD rev 0 (W4): the enforcer is never of a debater's family (ruling 537)
Base: live engine 3cef3eab (ask611/w4/fix1/fetchback_eng_611f1.json); child b9cd4e5c untouched. REV 1 (14:1x CST): backup seat glm.
Operator choices: "One fixed backup seat" (card cmsg_017ZQamDMHrS6fqMHnQDVo585h3QxnoJeayZcfDYzKhu7a, 13:36 CST). Seat: the operator first saw hy4 recommended, said "hya is unpowered" (14:10 CST), and chose glm (z-ai/glm-5.3, family zhipu, max_tokens 131072 from its existing model_config row) on card cmsg_017ZQamDMHrS6fqMHnQDVo58UYR4seyee2veoxcYDqoyWU (14:12 CST). The build takes the seat from B608K, default glm. No model setting is added or changed: the enforcer request is built from the seat's own row, as for luna.
The earlier option A (next seat in the judge order) was dropped: it fails closed on 12 of 34 OpenAI pairings, including all four listed (Wall 11660).

Change, Resolve Seats only:
- New __EF608, before the alternates. If luna's family is not a debater's family, the enforcer stays luna, and the output is byte-equal to today's.
- If luna is barred, the enforcer is the backup seat. It fails closed before any call, with the reason, if that seat has no active OpenRouter row, has no family or a debater's family, or sits as a judge, the reserve or the single judge. When the backup is used, customData enforcer_seat is set.
- The alternates list drops the enforcer seat.
- The output's enforcer is {seat, api_model, max_tokens} of the chosen seat, plus enforcer_barred {seat:'luna', why} when it was replaced.
- RS.deepseek (Independent Verdict, Diagnostic) still falls back to luna, unchanged (out of scope).
W1 N1: the model test is dropped. N2 does not apply to a fixed seat: a seat with no family fails closed (T3). N3: the Library comment "the enforcer model (seat luna)" goes stale; it goes to W3's manual entry. N4: the Judge order page still lists the enforcer seat if it is in the order. glm is not in the order, so it is not listed there. N5 is fixed.

Tests (data_608.json: judge order v2 and active model_config_jfl rows, read 13:2x CST 11-24):
- T1 (t608.cjs, out_t608.txt), on live 3cef3eab: 90 pairs.
  - 56 have no OpenAI debater: byte-equal.
  - 34 have an OpenAI debater. 30 get glm, with everything else equal (customData set). 4 fail closed before any call, with the ASK 608 reason, because GLM debates there: chatgpt vs glm, glm vs chatgpt, glm vs sol62, sol62 vs glm. This was stated on the operator's card. T1 ALL PASS.
- T3: the backup has a debater's family, has no family, or has no row: each fails closed with the ASK 608 reason.
- Standing set 31/0, including S4 compile 290/290 (out_standing_608.txt). Pair Library Check PASSES (out_pair_608.txt; the Library is untouched).
- Only Resolve Seats changes; connections are equal.
