# ASK 570: the enforcer does not push a premise count on a grade its own pass has corrected (W3, DRAFT 1a)

Draft 1a meets W1's condition C1 (Wall 11054) and takes W1's answer to limit 6.1. No change to the exact text.

Replaces ASK 551, which I withdrew (Wall 11047). Assigned by the coordinator at 17:46 CST 11-23.

DRAFT ONLY. Nothing is written. The exact text needs grading (W1), the builder's anchor check (W4) and the operator's approval.

## 1. What the record shows
Source: debate_enforcer_log, every row whose cure_reason holds "TRIAL pkgEPS": 100 rows in 32 runs since 11-14. Code read: `epsHold` and the cure_reason builder in the Shared Library of the live engine f63b73de (W4's fetch-back ask566/w4/write/fetchback_engine_566.json).

1. `epsHold(x,v)` returns a note for an E-PREM push (enforcer DISAGREE, right: COUNTED) in three cases. With `EPS_STATUS='TRIAL'` (live) the note is only appended to the stored reason and the push is still sent. With 'LIVE' the stored reason would begin "ENFORCER HELD (pkgEPS, not sent; ...)" and the push would not be sent.
2. Second kind, 39 rows (17 runs; 16 on premises against the defender, 23 against the challenger; 1 in run 41822, row 52813): "the push counts the premise on this judge's ANSWER CHECK on <verse>, which the E-ANS item of this same pass rules MEETS; the count follows that corrected grade (pkgP72 rev 3, ASK 185)". The judge graded an answer check MISSES. The enforcer, in the same pass, rules that check MEETS. The enforcer's E-PREM item then tells the judge to count the premise because of the MISSES it has just overruled. The two items of one pass contradict each other.
3. First kind, 61 rows: "the push counts the premise but names no layer the block lacks". Read against the push text: 33 rest on an answer check graded MISSES or a press left unanswered (ruling 372); 11 on a borrowed or contested step; the other 18, read in full, mostly say that no quoted row gives the fact the premise assumes (the ground of ruling 460), written loosely as "lacks [L1]". These pushes have grounds in the operator's rulings. The trial holds them only because the push text does not name a tag the block lacks.
4. Third kind (a CONCEDED quote that is not the side's own words): 0 rows in the record.

## 2. The change
Target: Shared Library, the E-PREM cure_reason builder; engine and child (both hold the anchor once). One library sha reset in each. W1 C1: the changed line (LIB 3406) is served by three MAP modules, each of which grows by 77 characters: Judge Enforcer Record n 62131 to 62208, Alt Judge Enforcer Record 62184 to 62261, R2 Alt Judge Enforcer Record 62214 to 62291. The build updates the MAP n of those three modules in the engine, and the child's equivalents, with the sha; otherwise the loader throws on its length check.
Anchor (one occurrence): `return EPS_STATUS==='LIVE'?base.replace(/^ENFORCER DISAGREE/,`
Exact change: `EPS_STATUS==='LIVE'` in that anchor becomes `(EPS_STATUS==='LIVE'||/^the push counts the premise on this judge.s ANSWER CHECK on /.test(__h))`
(The pattern writes `judge.s` so that no apostrophe enters the library's quoted source line.)
Not changed: `const EPS_STATUS='TRIAL';` stays. `epsHold` is not touched.

What it does, in plain words: only the second kind becomes live. When the enforcer's premise push rests on an answer check that the same pass has ruled MEETS, the push is stored "ENFORCER HELD (pkgEPS, not sent; ...)" and is not sent to the judge. The first kind and the third kind stay as they are today: marked in the record as a trial and still sent.

## 3. Why the first kind is left in trial
Turning it live would stop pushes that enforce ruling 372 (33 of 61) and the assumed-fact ground of ruling 460. A build may not reverse a ruling. Whether the first kind can be narrowed to a safe test is not shown by this record: after taking out the ruling 372 and borrowed-step pushes by pattern, 18 remain, and reading them shows most are assumed-fact pushes with a real ground. I propose no change to it.

## 4. Revert
Restore both Shared Libraries from the pre-write export; compare md5 per node; Library Check passes in both.

## 5. Test
1. Offline, the changed expression against the live one (script t570.js), with EPS_STATUS 'TRIAL': a second-kind note gives a reason that begins "ENFORCER HELD (pkgEPS, not sent; W3 2842: the push counts the premise on this judge's ANSWER CHECK on ..."; a first-kind note and a third-kind note give text identical to the live code. With 'LIVE' both codes are identical. Already run: all four as stated.
2. By SQL on the 100 stored trial notes: the pattern matches 39 and does not match 61. Already run: 39, 61, 0 other.
3. For W4's harness, on the stored enforcer replies of run 41822: row 52813's push is stored HELD and is not in the send-back; rows 52468, 52469, 52470, 52477, 52479 are stored and sent exactly as today. I have not run the send-back path; I read only that the other packages (pkgEAW, pkgEAX, pkgECW) use the same "ENFORCER HELD" prefix to keep a row out of the send-back.
4. Library Check passes in engine and child; every other node keeps its md5.
5. Live run: a second-kind row reads ENFORCER HELD and the judge receives no premise push for it.

## 6. Stated limits and questions for the builder
1. Answered by W1 (Wall 11054 item 3): the panel and the Alt and R2 Send Back Builds send only rows matching /^ENFORCER (?:DISAGREE|NO ANSWER)\b/, so an ENFORCER HELD row is not sent. I had not read that code. W4 still confirms at the build that a reason beginning "ENFORCER HELD" is not sent, and that the alternate and R2 enforcer record paths read the same line (W4 10963 item 6; W4 11048 says all three Enforcer Record entries read LIB 3380).
2. The hold of the second kind exists only when the push's reason opens with "(UNEXHIBITED ... ruling 372" and names the verse (the existing code's test). A push that cites ruling 372 in another form is not held, as today.
3. Side effect by side, from the record: of the 39 held pushes, 16 were premises against the defender and 23 against the challenger.
