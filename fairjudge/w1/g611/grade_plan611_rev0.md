GRADE ASK 611 plan rev 0 (ask611/w4/plan611.md d5114641, commit bee9f13b): FAIL, one finding. COMMIT: this file.
RULES READ: op doc v145 THE ASK FORM and TWO LIVE RUNS; ASK 597 (no words cut); standing rule on reasoning text.
OBJECTIVE MET: not yet. The direction is right, but one reader of the QR Merge judge bodies is missing, and removing the body would change what the alternates' judges are sent.
STANDARD (ASK 599): a plan carries no code; the build will be graded against the 10 rules.
Checked on the live engine ff7ab4cf and child ecdc6218 (rb3/live_*.json), by code search.

ASK FORM: all eight headings present, in order. PASS.

F1 (FAIL). Alternate Pass Call is a reader of QR Merge judges[].body and is not in the plan's list.
- Alternate Pass Call (executeWorkflow to the child) builds its "Panel Build" input as
  Object.assign({}, i.json, { judges: $("QR Merge").first().json.judges, qa588: ... }) when qr_ok is true.
- The child's Shared Library reads Panel Build judges[].body (46 sites, e.g. J.find(q=>q.seat===seat)||J.find(q=>q&&q.body); return j&&j.body?...).
- If QR Merge drops body, the child gets judges with no body, and the alternate path's requests change or fail. This breaks WRONG-IF 1 and 3, and the plan puts the child out of scope.
- Fix: add Alternate Pass Call to the reader list, with the rebuild (QRJ.body) in its expression so the child receives byte-equal judges; add the child input to T1 (md5 of the Panel Build items passed, old against new).

N1 (note, must be handled in the build). Close Enforcer Record DOES read copy 2's body: it logs prompt = (b.body.messages[1]).content for every Close Enforcer Build item, copy 2 included (2 sites). The plan's "the build confirms none" branch is closed; the Record must use the rebuild, and T1 must show the log rows equal.

Checked and correct:
- Panel Judges Poll, Done?, Fetch read only ppj_nonce and ppj_t0; Collect reads no body. Panel Judges Parallel posts ={{ $json }}.
- Close Group Batch Build puts out {bt,k,body}; Close Group Batch Call jsonBody is ={{ $json.body }}; Close Group Retry Build reads P[i].body (the plan names it). Anticheat, Close Enforcer and Assume Check Call read P by index.
- Panel Check, Reserve Build and the Shared Library (3 wrappers) merge QR Merge judges into Panel Build; Panel Judges Prep reads __m.judges[k-1].body. All named.
- The other 26 QR Merge references are if(false) dependency stubs or read qa/qr_ok/record only (Judge Contradiction Build, Replay Rows, QR Record Build, Build Save Body, QR Follow Build/Final).
- No prompt or reasoning text changes; nothing a model reads is cut (ASK 597).
- RUN EVIDENCE names what the first live run must show; DONE names two clean live runs. Add one check: the child's alternate judges, if seated, are sent the same requests (follows from F1).

On a rev 1 that adds Alternate Pass Call (and N1 in T1), I expect to PASS.
