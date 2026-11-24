GRADE ASK 607 plan rev 0 (ask607/w4/plan607.md 34db6c5d, commit 55a51fcc): PASS WITH N1. COMMIT: this file.
RULES READ: ruling 546 (operator 15:33 CST 11-24, "Record-only, as ASK 549"; Wall 11730); ASK 549 (record-only refusals); op doc v145 §29 ASK FORM and TWO LIVE RUNS; ASK 599; the gate prompt sentence (unchanged, as the plan says).
OBJECTIVE MET: yes, as a plan. One mark at one push site, read by the existing ASK 549 reader; it matches the option's words (refusal stored with its reason, the judge's line stays, nothing counts).
STANDARD (ASK 599): plan; C6 binds the build.

Checked on my saved live fetches (engine 94b682a0, child b9cd4e5c):
- "no line form the engine reads" occurs once in each: the sbApply2024 push `if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',...,lines:[o]});continue;}`. Matches.
- "rfs:" occurs three times (pkgSGA twice, pkgPS once), each on an items.push in the same function with sid:x.sid. "pkgFRM" occurs nowhere.
- The reader in gateCure2024: `if(!cured&&a.ans==='CHANGE')__rfs549=((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rfs)||null;`, then why "<rfs> refused the gate change; the judge's line before the change stands (recorded, no seat removed): ..." and live:false. ".rfs" is read only there. So by reading, a form-refused gate change takes the same path as pkgSGA and pkgPS. C1 proves it at the build.
- Rows 29285 to 29295: item "G<n> NOT APPLIED", reply "CHANGE TO: NONE", engine reason "no line form", UNCURED, counted. They are in the class.

N1: the change's reach is wider than the 11 luna rows. The 7 chatgpt rows of debate b610093d (7218 to 7224), which the plan calls engine-made and "not this ruling", also carry gate replies refused as "no line form". Their CHANGE TO lines are full judge lines (e.g. "D2 vs C4 (Matthew 1:19): CHALLENGER LINK BROKEN (Commitment 5) ..."). Any such refusal on a NOT APPLIED item becomes record-only under this change, whoever caused it. That fits the ruling's words, but the card should say so. Replay those 7 in C1 too, old against new, and state their counts before and after.

31511 rightly stays out (placement, not form). The other-kind form refusals are rightly counted and sent to the operator as a question, not folded in.
