# ASK 607 PLAN rev 0 (W4): a gate change the engine cannot read is recorded, not counted

Ruling: the operator pressed "Record-only, as ASK 549" at 15:33 CST 11-24 (W3's card cmsg_017ZQamDMHrS6fqMHnQDVo58X84T7LagpgxuCC7LtcFUJw; Wall 11730). The option's words: "W4 plans it: the refusal is stored with its reason, the judge's line stays as it was, and nothing counts toward removing the seat." This approves a plan only. Base: live engine 94b682a0, child b9cd4e5c, LIB 802077b0878612c9.

## 1. OBJECTIVE
When a judge answers a NOT APPLIED item at the gate with a CHANGE TO that the engine cannot read as any line form, the refusal is stored with its reason, and the judge's line before the change stands. The item is recorded only (live false); it is not counted in drv_uncured and does not count toward removing the seat. This is the same treatment ASK 549 gives the pkgPS and pkgSGA refusals.

Expected effect: the 11 luna rows of debate 36499348 (enforcer log 29285 to 29295; gate reply "CHANGE TO: NONE", meant to withdraw a grant line) would read UNCURED and RECORD-ONLY with the engine's reason, and count 0 instead of 11.

## 2. ROLES
- Planner and builder: W4.
- Grader: W1.
- Write card: W4's thread.
- Manual entry and AAR row: W3, drafted with the build.

## 3. SCOPE, with SEARCH
Search: the live engine 94b682a0 and the child b9cd4e5c Shared Library (joined sources, as the engine runs them), for "no line form the engine reads", "rfs", "__rfs549" and "ASK 549".

Found:
- **One push site.** In sbApply2024, the S13 apply step: `if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads'+__rtH,to,lines:[o]});continue;}`. This is the only place the reason is written.
- **The ASK 549 reader** in gateCure2024 (NOT APPLIED branch): `if(!cured&&a.ans==='CHANGE')__rfs549=((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rfs)||null;`. When found, why becomes "<rfs> refused the gate change; the judge's line before the change stands (recorded, no seat removed): <reason>", and the result gets `live:false`.
- **The rfs mark** is set today only by pkgSGA (two sites) and pkgPS (one site). No other reader of `.rfs` exists.

Change (Shared Library, engine and child, same LIB; MAP n recomputed for every touched entry; Library Check pair):
1. At the one push site, add `rfs:'pkgFRM'` to the item, with an ASK 607 tag. No other text changes.
2. Nothing else changes. The gate prompt sentence "An item that is not answered, is kept, or is still raised after your change counts ..." is prompt text, and it is NOT changed without the operator's word. A silent item, and a KEEP on a NOT APPLIED item, stay as they are.

Effect, by reading:
- The mark is read only by the gate's NOT APPLIED branch, so only a gate change on a NOT APPLIED item becomes record-only.
- At the send-back stage the mark is carried and not read, so the send-back item list and its counts are unchanged.

### NOT IN THE CLASS (named for the operator)
- **Row 31511** (luna, debate 26d9f86b, "the flagged line is not in the judge text"). This is a placement refusal, not a form refusal, and the ruling does not cover it. It is unsettled without the judgment text (W1, W3 agreed).
- **A form refusal of a gate change that answers an item of another kind** (for example a RULE K item). The ASK 549 reader sits only in the NOT APPLIED branch, so such a refusal still counts, exactly as a pkgPS or pkgSGA refusal of that kind does today. The build counts these in stored rows: E-GATE, UNCURED, counted, kind other than NOT APPLIED, with the form reason in cure_reason. If the count is above 0, they go to the operator as a question; they are not folded in.
- **Engine-made fragments.** The 7 chatgpt rows of debate b610093d (7218 to 7224) flagged a bare grade word. They are a separate defect and not this ruling.

## 4. CRITERIA and DONE
- C1. Replay the 11 luna rows (29285 to 29295) through the built gateCure2024, old against new, with the stored gate reply.
  - Each must read UNCURED, live false, and why starting "pkgFRM refused the gate change; the judge's line before the change stands", with the engine's reason. Counted: 11 before, 0 after.
  - The judge text is debate_judgments for luna in 36499348 if stored. If it is not stored, the minimal-text form of r607b is used and named as such.
- C2. Controls, unchanged old against new:
  - a KEEP on a NOT APPLIED item;
  - a silent item;
  - an applied gate change;
  - a pkgPS refusal and a pkgSGA refusal (still record-only, with their own rfs names);
  - row 31511 (placement refusal, still counted).
- C3. Send-back stage: sbApply2024 on judgment 1272 with gemini's S1 to S17 (the r607 harness). The applied list, the item kinds and the result are byte-equal old against new, except the added rfs field on a form-refused item.
- C4. The stored-row count of section 3 is posted, with its SQL.
- C5. Library Check pair passes. ASK 612 compile-all passes on engine and child. The standing set passes (31/0).
- C6. Coding standard ASK 599: no dead code; ASK 607 tag on the changed line.
- DONE: built, graded, written on the card, read back, and the manual entry written. Then one live run where a gate form refusal occurs and is recorded RECORD-ONLY, or the path is reported UNEXERCISED. TWO LIVE RUNS applies.

## 5. WRONG-IF
- The replay of the 11 rows still counts any of them (the mark is not reached on that path).
- Any control in C2 changes.
- A send-back item or count changes (C3).
- The 31511 placement refusal becomes record-only.

## 6. RUN EVIDENCE
- Registry case: "ASK 607 gate form refusal".
- Mark: an E-GATE row whose cure_reason begins "GATE CHANGE TO" and whose result reads "pkgFRM refused the gate change ... (RECORD-ONLY)".
- Gate form refusals are rare (none since 11-11 apart from the engine-made 53202), so the first runs are likely UNEXERCISED.

## 7. INPUTS IN GIT
- ask607/w4/r607.cjs and out_r607.txt (row 53202 replay).
- ask607/w4/r607b.cjs, rows607b.json and out_r607b.txt (30-row probe).
- ask586/w4/build/gatefn.cjs and data/ (judgment 1272, gemini send-backs).
- The build adds b1/ with the build script, targets, tests and the stored-row count.

## 8. STEPS
1. This plan to W1 for grade (Wall root 11613).
2. Build on a fresh live fetch (engine and child): C1 to C6. W1 grades the build.
3. Write card in W4's thread ("Write it" / "Hold"), showing the one changed line and C1's 11-to-0 table.
4. On the press: run gate, PUT engine then child, fetch back, Library Check pair, audit, Wall, W1 readback. W3 writes the manual entry and the AAR row.
Order against the ASK 623 build and the run that proves 611, 601 and 608: the coordinator's.
