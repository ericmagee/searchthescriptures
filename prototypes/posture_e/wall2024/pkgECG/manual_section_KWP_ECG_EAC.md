# Manual sections: pkgKWP, pkgECG, pkgEAC (builder W1, 2026-11-11; built on live s148)

All three come from the run 35296 grade (W3 Wall 5107; W4 second reading Wall 5108). Prompt 0 for each. Joint file:
/mnt/project-files/wall2024/parent_s148_JOINT_KWP_ECG_EAC.json (code +2,959 = 350 + 2,386 + 223, measured).

## pkgKWP: K-W NOT HELD quote test ignores a parenthetical (library line 1201)
- Fault: the K-W NOT HELD test needs a 6-word run of the flagged quote. A parenthetical that holds more than a verse reference
  ("(Luke 1:31, 'thou shalt conceive' is future)") is not removed by KWR_REF, so every run crosses into it. A faithful quote of the
  5-word clause ("I grant that her know is present") failed (luna, K-W #4).
- Change: extra runs are made from the flagged quote, and from each nhqFull part, with every "( ... )" removed and the lead
  ("I grant", "I concede" and the like) stripped, only when 4 or more words remain. The existing runs are kept.
- Effect: the same test feeds the follow-up ask (fumAsk2024, "NO QUOTE"), so a seat that quoted the clause is no longer sent a
  follow-up for it.
- Size: +340 on the line; Shared Library jsCode +350; 10 rebuilt nodes (the Cure Normalize, Cure Check and Merge Seat nodes).
- Limit: a 4-word piece of the clause with the lead and "that" removed ("her know is present") counts as a quote.

## pkgECG: gate rules not asked on an engine-broken link (new library line 3471; lines 2439, 1635; Panel Payloads, Panel Cure Check)
- Fault: pkgECB keeps links that the engine broke on a confirmed closing contradiction (cec.confirmed, jcc.confirmed) out of
  the DeepSeek send-back, but the cure items built at the Payloads stage were not covered. Haiku (R2 alternate, run 35296) was asked
  K-B on D3 vs C3 and K-G4 and K-G7 on D4 vs C4, all on confirmed links, and retracted correct breaks.
- Change: ecgSplit2024(items) moves an item out of the asked list when its rule is K-B, K-G4 or K-G7 and its line is
  "Dn vs Cm (...): DEFENDER|CHALLENGER LINK BROKEN" on a link that the confirmed set holds (side and number). Panel Payloads,
  Alternate Payloads and R2 Alternate Payloads apply it before drv_uncured is counted. The moved items are not asked and not
  counted. Panel Cure Check and both Alternate Merge Seats write one enforcer_check row for each, with cure_status null and
  cure_reason "NOT ASKED (code, pkgECG): ...". The three Payloads stubs name Close Enforcer Record and Judge Contradiction Record.
- Not covered: other rules (K-G1, K-L2 and the rest), FORCED lines, STANDS lines, and links not in the confirmed set.
- Panel Payloads runs before Judge Contradiction Record, so for panel seats only cec counts.
- Size: +2,386 code (Shared Library and three stubs); 6 rebuilt nodes.

## pkgEAC: the early alternate reply gets its cost row (Panel Tokens)
- Fault: when not every seat had a stored early reply, Early Alternate Reply did not run, and the stored reply (paid in the
  early sub-workflow, read by Get Early Alternate) had no call_costs row. In run 35296 this was grok's reply for luna, provider
  figure 0.611172 USD. The sub-workflow writes no cost row of its own (35296 call_costs has no grok row, measured).
- Change: Panel Tokens also reads Get Early Alternate and costs each row's reply when it has usage. The existing reply-id check
  stops a second row when Early Alternate Reply also ran.
- Size: Panel Tokens +223.
