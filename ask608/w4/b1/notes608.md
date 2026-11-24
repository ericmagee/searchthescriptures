# ASK 608 BUILD rev 0 (W4): the enforcer is never of a debater's family (ruling 537)
Base: live engine fbc09389 (ask611/w4/write/fetchback_eng611.json); child b9cd4e5c untouched.
Operator choices: "One fixed backup seat" (card cmsg_017ZQamDMHrS6fqMHnQDVo585h3QxnoJeayZcfDYzKhu7a, 13:36 CST). The seat itself is on card cmsg_017ZQamDMHrS6fqMHnQDVo583Yf5QjhZGmhXT6VgaKq3Yr (hy4 recommended). The build takes the seat from B608K, default hy4; re-cut if he picks another.
The earlier option A (next seat in the judge order) was dropped: it fails closed on 12 of 34 OpenAI pairings, including all four listed (Wall 11660).

Change, Resolve Seats only:
- New __EF608, before the alternates. If luna's family is not a debater's family, the enforcer stays luna, and the output is byte-equal to today's.
- If luna is barred, the enforcer is the backup seat. It fails closed before any call, with the reason, if that seat has no active OpenRouter row, has no family or a debater's family, or sits as a judge, the reserve or the single judge. When the backup is used, customData enforcer_seat is set.
- The alternates list drops the enforcer seat.
- The output's enforcer is {seat, api_model, max_tokens} of the chosen seat, plus enforcer_barred {seat:'luna', why} when it was replaced.
- RS.deepseek (Independent Verdict, Diagnostic) still falls back to luna, unchanged (out of scope).
W1 N1: the model test is dropped. N2 does not apply to a fixed seat: a seat with no family fails closed (T3). N3: the Library comment "the enforcer model (seat luna)" goes stale; it goes to W3's manual entry. N4: the Judge order page still lists the enforcer seat if it is in the order. hy4 is not in the order, so it is not listed there. N5 is fixed.

Tests (data_608.json: judge order v2 and active model_config_jfl rows, read 13:2x CST 11-24):
- T1 (t608.cjs, out_t608.txt): 90 pairs.
  - 56 have no OpenAI debater: byte-equal.
  - 34 have an OpenAI debater: all get hy4. Everything else is equal, except that hy4 drops from the alternates (it was never in them), and customData is set.
  - 0 fail closed. T1 ALL PASS.
- T3: the backup has a debater's family, has no family, or has no row: each fails closed with the ASK 608 reason.
- Standing set 29/0 (out_standing_608.txt). Pair Library Check PASSES (out_pair_608.txt; the Library is untouched).
- Only Resolve Seats changes; connections are equal.
