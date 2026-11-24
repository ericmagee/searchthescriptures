# ASK 611 PLAN rev 1 (W4; W1 F1 and N1 of Wall 11645 folded in): stop the four extra copies of the debate in the judging

## OBJECTIVE
Lower what one run holds in memory during the judging by removing four steps' extra copies of requests that carry the debate. What each judge, enforcer and debater is sent stays the same, byte for byte.
- Operator's word, 12:05 CST 11-24, in W3's thread: "So basically, we're not losing anything. You're fixing a bug, is what you're saying." and "Okay, continue. Let me know when you need to run."
- W3 closed his card ("Approve ASK 611: plan removing the four extra copies of the rounds?") on "Plan it".
- This authorizes the plan only. The write goes on W4's own card.
- The by-reference sending to the judge webhook (about 0.9M) is NOT in this ASK. It is a later step.

## ROLES
- W4 plans, builds and writes on its own card.
- W1 grades the plan and the build, and does the readback.
- W3 drafts the manual entry and the AAR row.
- The coordinator relays.

## SCOPE, with SEARCH
Search: the code of live engine ff7ab4cf (ask611/w4/list611.md 4699b781, W1 PASS Wall 11641/11642), and who reads each copy.
1. QR Merge. It puts out the 3 judge requests again, each with the question-round text added (est. about 900k on 42234).
   Readers of its judges[].body: Panel Judges Prep, Panel Check, Reserve Build, Judge Contradiction Build, Replay Rows, Build Save Body, QR Record Build, and the Shared Library.
   Also (F1): Alternate Pass Call passes the QR Merge judges, with their bodies, to the CHILD as the Panel Build judges, and the child's Shared Library reads judges[].body. Its input expression rebuilds the bodies with QRJ.body before passing them, so the child receives exactly what it receives today. The child is not changed.
   CHANGE: QR Merge puts out the judges WITHOUT body, plus the question-round text it already emits (qa_text). One Library function, QRJ.body(k), rebuilds judge k's request as before: the Panel Build request plus the question-round text, by the same qrAdd. Every reader calls it in place of judges[k].body.
2. Panel Judges Prep. It puts out the 3 requests again as sent (est. about 900k). Panel Judges Parallel posts "$json".
   CHANGE: Prep puts out everything except body (slot, provider, seat, model, nonce, t0). The jsonBody of Panel Judges Parallel rebuilds the request at the moment of sending, by the same steps Prep takes today: the QR body or the Panel Build body, then the openrouter fix-up ORF.
   The request then exists only while it is sent; it is not kept as a step's output. Poll, Done?, Fetch and Collect read only the nonce, seat and provider, which stay.
3. Close Group Batch Build. It puts out the closing enforcer's 4 requests and the assumption check's request again (est. about 1M).
   CHANGE: it puts out {bt, k} only. The jsonBody of Close Group Batch Call openrouter, and the Retry Build that resends, fetch the request at send time from Close Enforcer Build or Assume Check Build by the same filter and index the Build uses today.
   The Call steps (Anticheat, Close Enforcer, Assume Check) read only bt and k, which stay.
4. Close Enforcer Build, copy 2. Copy 2 is copy 1 with temperature 0.6 (measured: 303,640 against 303,638).
   CHANGE: copy 2 carries no body, only {copy:2, temperature:0.6}. The send step builds it as copy 1's request with temperature 0.6.
   N1: Close Enforcer Record reads copy 2's body for the prompt in its log rows, so it uses the same rebuild (copy 1's request with temperature 0.6). Close Enforcer Resume is checked the same way in the build.

Out of scope:
- the judge webhook by reference;
- the panel enforcer's batch (Enforcer Group Batch Build, the same pattern, not asked);
- the debaters' requests;
- all prompt and reasoning text;
- model settings;
- the child (its input stays byte-equal; see F1).

## CRITERIA AND DONE
- What is SENT is unchanged: for every request (3 judges, the question-round asks and follow-ups, the closing enforcer's 4, the assumption check), the body sent after the change is byte-equal to the body sent before.
- What is RECORDED is unchanged: review_notes lines, judgment rows, enforcer rows and Format Markdown output come out equal on the same inputs.
- Tests, all offline on run 42234's stored row and 42071's (no n8n call):
  - T1: old against new for each changed step and each reader. The sent bodies are equal (md5 per request), and the readers' outputs are equal. This includes the child input from Alternate Pass Call (md5 of the input sent, old against new) and Close Enforcer Record's log rows.
  - T2: the size of the four steps' outputs, before and after. Expected: about 3.3M characters fewer on 42234.
  - T3: standing set 29/29; pair Library Check; fetch-back equals the target.
- Done means:
  - written on the card;
  - W1 readback MATCH;
  - two clean live runs (the two-live-runs rule).

## WRONG-IF
This plan is wrong if any of these holds:
- any request sent to a judge, enforcer or debater changes by one character;
- any record changes;
- a step that read a removed body still reads it and fails, or reads an empty value;
- the question round, the closing enforcer or the panel stops running;
- the run holds no less after the change.

## RUN EVIDENCE (ASK 417)
No ASK 417 registry entry was found for the judging's memory. What the FIRST LIVE RUN after the write must show:
1. The run finishes and writes an outcome (42234 did not).
2. The question-round log row is not SKIPPED (the QR fix's first proof too).
3. All three judges' verdicts are recorded.
4. The closing enforcer has rows for both sides, from both copies.
5. No "pkgPDS: no reply in the batch call" and no "no body" errors appear in review_notes.
The operator asked to be told when a run is needed: after the write and W1's readback, W4 says so on its own thread with the card.

## INPUTS IN GIT
- ask611/w4/list611.md (4699b781);
- aar/w4/m42234 (the measure harness, to be extended for T1 and T2);
- the live fetch-back ask601/w4/b1/base_eng.json (ff7ab4cf).
- If ASK 601 is written first, the build is re-cut on its fetch-back; the two touch different steps.

## STEPS, with their cards
1. Build the four changes and T1 to T3. Post them for W1's grade.
2. On PASS: ONE card to the operator, "Write the copy removal". It writes the engine only, when no run is live; the revert file is saved at write time.
3. After the write: fetch-back, audit row, Wall post, W1 readback, memory. Then tell the operator a run is needed, with the five checks above.
