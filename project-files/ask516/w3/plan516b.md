# ASK 516 lower-memory plan (W3, seat 33), rev 6, 2026-11-23. Replaces rev 5 (88cc418b, kept as plan516b_rev5.md), on W4's FAIL at Wall 10354 (the three Reread calls were not named as senders). Changed headings: SCOPE, CRITERIA and DONE, STEPS. Rev 5 replaced rev 4 (ee8901d5, kept as plan516b_rev4.md), on W2's PASS-with-conditions at Wall 10344. Rev 4 replaced rev 3 on W2's FAIL at 10341. Rev 3 replaced rev 2 on W4's FAIL at 10335. A PLAN ONLY; nothing is written.

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
  - Reread senders (added in rev 6, W4 10354): Reread Call openrouter and Alt Reread Call openrouter (engine), R2 Alt Reread Call openrouter (child). Each Reread Build takes RULES from Judge Enforcer Build's messages[1] (the slice up to the first "\n\nITEM"). Under 516 that slice held THE ROUNDS IN FULL, so the reread message carried them, and it must still carry them. Under L1 the slice holds the placeholder. Each Reread Build stamps on its body the bt of the Build it sliced, plus that Build's rounds_len and rounds_md5. Its call fills the rounds the same way as the other senders. The rereads keep the rounds; this is no design change from 516.
  - Sender count: 12 (9 above, plus the 3 Reread calls).
- Readers of the build output (placeholder only; they must not need the rounds text). The three Reread Builds pass the placeholder on to their calls, which fill it:
  - engine: Reread Build, Alt Reread Build, Judge Enforcer Resume, Judge Enforcer Record, Alt Judge Enforcer Record, Send Back Build, Alt Send Back Build, Reread Record, Alt Reread Record, Judge Enforcer Call openrouter (a Code node that maps replies), Enforcer Call openrouter (Code);
  - child: R2 Alt Reread Build, R2 Alt Judge Enforcer Record, R2 Alt Send Back Build, R2 Alt Reread Record.
- Pass-through IF nodes, found by W3 in the fetch-back connections (W2 counted 9; this list has 13, and W4 confirms at build). json.rounds516 on item 0 rides through them, so all are counted in C2 and the WRONG-IF:
  - engine, sender path: Enforcer Group Batch Needed?, Judge Enforcer Needed?, Alt Judge Enforcer Needed?, Judge Enforcer Retry Needed?, Alt Judge Enforcer Retry Needed?, Judge Enforcer Resend Needed?, Alt Judge Enforcer Resend Needed?;
  - child, sender path: R2 Alt Judge Enforcer Needed?, R2 Alt Judge Enforcer Retry Needed?, R2 Alt Judge Enforcer Resend Needed?;
  - reader path: Reread Needed?, Alt Reread Needed? (engine), R2 Alt Reread Needed? (child).
- Log: Write Enforcer Log (HTTP; L2 trims prompt_sent).
- Searched, not in scope: Enforcer Retry Call openrouter and Enforcer Resend Call openrouter. Their builds do not use pkgREC; W4 is to confirm at build.
- NOT SEARCHED: the workflows c7366RPLb8vdMQg6 (cure call wrapper) and SX4ZWtgHNs96uBOo (Early Alternate Start). Neither is reported free of the bodies until W4 reads them.

CHANGE.
- L1. The rounds go once per Build node run, as json.rounds516 on the first output item. Every body carries the fixed placeholder line instead. Each sender's body is "={{ <fill>($json.body, rounds of the build named by the body's bt) }}". The fill is a library function: it replaces the placeholder inside the JSON-serialized messages, so the escaping is the same as the live 516 body.
- L2. prompt_sent stores the placeholder plus "[THE ROUNDS IN FULL: <n> characters, md5 <8>; the same in every call of this run]".
- L3. Evidence per sent call, taken in two places:
  - (a) At the Build. The Build computes rounds_len and rounds_md5 of json.rounds516 once, and stamps both, with bt, on every body item it makes. These are small fields. The Batch copies them per body. The sender's fill reads the rounds from the same Build output that the stamp was computed from.
  - (b) At the Record nodes, from the response. OpenRouter's usage.prompt_tokens for that call is the provider's count of what was sent.
  - The Record nodes write both to the log line: the stamped rounds_len and md5 from the body item they answer (paired item), and prompt_tokens. Where the log has no column, they go on prompt_sent's marker line.
- Nothing else changes.

## 4. CRITERIA and DONE
- C1: for every call in replays of 41155 and 41117, through all 12 senders (the Reread calls included), the serialized HTTP request body (the JSON string the sender sends) equals the live 516 request body, byte for byte.
- C2: the rounds are stored once per Build node run. Batch, Retry, Resend, Reread, Resume, Record and Send Back outputs hold only the placeholder. The held total passes the WRONG-IF on both replays, with the IF "Needed?" nodes counted.
- C3: prompt_sent carries the marker and no rounds copy.
- C4: a live run on the operator's word, with at least one alternate seated (as in 41155), completes without an out-of-memory error. It reports its enforcer prompt total next to 41155's 5.8M. "Found nothing" is not a pass. A run that seats no alternate, or does not reach the enforcer, does not test C4.
- DONE: C1 to C4 pass.
- DONE 3 evidence: for every judge enforcer call in the C4 run, the Reread calls included, (i) the stamped rounds_md5 equals the md5 of that run's rounds; and (ii) usage.prompt_tokens is at least the 515 rev 7 prompt estimate for that call plus the rounds' token estimate. The threshold "rounds characters divided by 4, less 10 percent" is a GUESS: 41117 holds no usage figures to measure it on (W4, 10324). W4 measures the ratio at build with a tokenizer count of 41117's rounds. If the ratio is off by more than 10 percent, the threshold is set from that count, and the grade names it. Reading (ii) shows the rounds were actually sent, not only meant to be.

## 5. WRONG-IF
Restated for rev 5: the IF nodes are now counted, and both cases are re-measured at build (step 4) with them. The measure is as W4 graded it at 10335, with the IF nodes added. It is wrong if the held characters do not come down: on the 41155 shape, the total held by the Build, Batch, Retry, Resend, Reread and IF "Needed?" nodes plus the log body must be no more than what 515 rev 7 holds on the same shape, plus one rounds copy per Build node run.
- Known-bad: the 516 build as written (about 10.5M held plus 5.8M logged) must fail.
- Known-good: 515 rev 7 on 41117 must pass.
- If it passes and a C4 run still crashes, the rounds were not the cause. Then 516b is reverted.

## 6. RUN EVIDENCE
NO PROBE in the ASK 417 registry yet: no case or mark exists for this path. The per-call rounds_len and rounds_md5 from L3 are the run evidence. W4 adds a registry case at build, mark "rounds516 sent", if the registry takes one.

## 7. INPUTS IN GIT
The plan files (plan516b.md rev 3, with revs 1 and 2) are committed on claude/untitled-9jle0o; the commit is on the Wall post. W4's build inputs, scripts and replays are committed at build, and the build post names that commit.

## 8. STEPS
1. Done: W4's trace (10332).
2. Plan grade, rev 6. Waits on: W4 (and W2).
3. The operator names the build. Waits on: the operator's word via the coordinator.
4. W4 builds, replays C1, C2 and C3, re-measures the WRONG-IF on both cases with the IF nodes counted, and measures the token ratio. Waits on: step 3.
5. Two grades. Waits on: W3 and W2.
6. The write. Waits on: the operator's card in W4's thread. It can be undone with the revert files.
7. The C4 run. Waits on: the operator's release.
8. The manual entry. Waits on: the operator's card in W3's thread.
