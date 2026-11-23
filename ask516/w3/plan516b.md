# ASK 516 lower-memory plan (W3, seat 33), rev 3, 2026-11-23. Replaces rev 2 (6001e79c, kept as plan516b_rev2.md), on W4's FAIL at Wall 10335. A PLAN ONLY; nothing is written.

## 1. OBJECTIVE
A run on 516 completes without the out-of-memory crash, with an alternate seated as in 41155, and every judge enforcer call still has THE ROUNDS IN FULL before the model.
Expected effect: the enforcer can weigh rows on any point either side laid, as 516 intended, at about the memory of 515 rev 7 plus one rounds copy per Build node run.

## 2. ROLES
- Planner: W3 (seat 33).
- Builder: W4 (seat 35).
- Graders: two non-builder seats, W3 and W2 (W2 is awake since 01:22 CST 11-23).
- Write card: W4's thread.
- Built only if the operator names it. He holds the revert-or-trace choice; 516 is reverted (Wall 10326).

## 3. SCOPE
pkgREC (library line 3191), and the nodes that build, copy, send or read the enforcer call bodies. They are named below. Nothing in RULES, the items, packing or the cure code.
SEARCH (W3, 11-23, on W4's 516 fetch-backs, fetchback_engine_516.json with 397 nodes and fetchback_child_516.json with 156). I searched every node's parameters for "Judge Enforcer Build", "Enforcer Group Batch Build", "Judge Enforcer Retry Build", "Reread Build" and "__REC515", and every HTTP node whose name holds "Enforcer". Hits:
- Builders (hold the bodies; L1 puts the rounds once on the first item):
  - engine: Judge Enforcer Build, Alt Judge Enforcer Build, Judge Enforcer Retry Build, Alt Judge Enforcer Retry Build, Judge Enforcer Resend Build, Alt Judge Enforcer Resend Build;
  - child: R2 Alt Judge Enforcer Build, R2 Alt Judge Enforcer Retry Build, R2 Alt Judge Enforcer Resend Build.
- Copier: Enforcer Group Batch Build (engine). It batches items from more than one build, so each body carries its source build's tag (bt). It carries the placeholder only.
- HTTP senders (jsonBody {{ $json.body }}; L1 fills the rounds at send time from the build the body came from):
  - engine: Enforcer Group Batch Call openrouter, Alt Judge Enforcer Call openrouter, Judge Enforcer Retry Call openrouter, Alt Judge Enforcer Retry Call openrouter, Judge Enforcer Resend Call openrouter, Alt Judge Enforcer Resend Call openrouter;
  - child: R2 Alt Judge Enforcer Call openrouter, R2 Alt Judge Enforcer Retry Call openrouter, R2 Alt Judge Enforcer Resend Call openrouter.
- Readers of the build output (placeholder only; they must not need the rounds text):
  - engine: Reread Build, Alt Reread Build, Judge Enforcer Resume, Judge Enforcer Record, Alt Judge Enforcer Record, Send Back Build, Alt Send Back Build, Reread Record, Alt Reread Record, Judge Enforcer Call openrouter (a Code node that maps replies), Enforcer Call openrouter (Code);
  - child: R2 Alt Reread Build, R2 Alt Judge Enforcer Record, R2 Alt Send Back Build, R2 Alt Reread Record.
- Log: Write Enforcer Log (HTTP; L2 trims prompt_sent).
- Searched, not in scope: Enforcer Retry Call openrouter and Enforcer Resend Call openrouter. Their builds do not use pkgREC; W4 is to confirm at build.
- NOT SEARCHED: the workflows c7366RPLb8vdMQg6 (cure call wrapper) and SX4ZWtgHNs96uBOo (Early Alternate Start). Neither is reported free of the bodies until W4 reads them.

CHANGE.
- L1. The rounds go once per Build node run, as json.rounds516 on the first output item. Every body carries the fixed placeholder line instead. Each sender's body is "={{ <fill>($json.body, rounds of the build named by the body's bt) }}". The fill is a library function: it replaces the placeholder inside the JSON-serialized messages, so the escaping is the same as the live 516 body.
- L2. prompt_sent stores the placeholder plus "[THE ROUNDS IN FULL: <n> characters, md5 <8>; the same in every call of this run]".
- L3. Each sender's response mapping (the Record nodes) writes, for each sent call, rounds_len and rounds_md5 of the text actually filled into the request. Where the log has no column, they are added to prompt_sent's marker line.
- Nothing else changes.

## 4. CRITERIA and DONE
- C1: for every call in replays of 41155 and 41117, the serialized HTTP request body (the JSON string the sender sends) equals the live 516 request body, byte for byte.
- C2: the rounds are stored once per Build node run. Batch, Retry, Resend, Reread, Resume, Record and Send Back outputs hold only the placeholder. The held total passes the WRONG-IF on both replays.
- C3: prompt_sent carries the marker and no rounds copy.
- C4: a live run on the operator's word, with at least one alternate seated (as in 41155), completes without an out-of-memory error. It reports its enforcer prompt total next to 41155's 5.8M. "Found nothing" is not a pass. A run that seats no alternate, or does not reach the enforcer, does not test C4.
- DONE: C1 to C4 pass.
- DONE 3 evidence: the rounds actually sent are read from the per-call rounds_len and rounds_md5 written by L3. Each equals the Build's rounds md5 for that run, for every judge enforcer call in the run.

## 5. WRONG-IF
(Unchanged from rev 2; W4 graded it PASS at 10335.) It is wrong if the held characters do not come down: on the 41155 shape, the total held by the Build, Batch, Retry, Resend and Reread nodes plus the log body must be no more than what 515 rev 7 holds on the same shape, plus one rounds copy per Build node run.
- Known-bad: the 516 build as written (about 10.5M held plus 5.8M logged) must fail.
- Known-good: 515 rev 7 on 41117 must pass.
- If it passes and a C4 run still crashes, the rounds were not the cause. Then 516b is reverted.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry yet: no case or mark exists for this path. The per-call rounds_len and rounds_md5 from L3 are the run evidence. W4 adds a registry case at build, mark "rounds516 sent", if the registry takes one.

## 7. INPUTS IN GIT
The plan files (plan516b.md rev 3, with revs 1 and 2) are committed on claude/untitled-9jle0o; the commit is on the Wall post. W4's build inputs, scripts and replays are committed at build, and the build post names that commit.

## 8. STEPS
1. Done: W4's trace (10332).
2. Plan grade, rev 3. Waits on: W4 (and W2).
3. The operator names the build. Waits on: the operator's word via the coordinator.
4. W4 builds, and replays C1, C2 and C3. Waits on: nothing.
5. Two grades. Waits on: W3 and W2.
6. The write. Waits on: the operator's card in W4's thread. It can be undone with the revert files.
7. The C4 run. Waits on: the operator's release.
8. The manual entry. Waits on: the operator's card in W3's thread.
