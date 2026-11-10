# pkgQRD (W2): item C option 1, redirect a repeated contradiction question. NOT WRITTEN. Runs only in the question round (question_trial, dry regrades).
Operator: "1." at 10:45 CST 11-10 (W2's thread), answering item C. Labels labels_QRD.md (commit 8a03cc76, before the build). Graders W1 and W3.
Base live s110 (rebased from s109 after pkgACM; QR Check and QR Final byte-equal to the s109 build). Build: node pkgQRD/build_QRD.cjs /mnt/project-files/wall2024/fetchback_live_s110.json pkgQRD/parent_s110_QRD.json
What changes (QR Check, QR Final):
- QR Check: after the three judges' first questions, a passing contradiction question to a debater that names the same closing and earlier
  rounds as an earlier judge's (seat order), with one quote inside the other, returns that judge once with one sentence:
  "Another judge already asks the <side> about the contradiction between <earlier> and <closing>. If you see a different contradiction in that
  debater's closing round, ask about it instead; if you see none, keep your question." A judge returned for a fault gets the sentence too.
- QR Final: a side returned only to redirect uses the second question if it passes and keeps the first if it fails (never dropped); a side not
  at fault keeps its first question when the return was only a redirect. Faulted sides follow today's rule. The record carries "redirect".
Size measured (rev 2): code QR Check 6,026 -> 7,308 (+1,282), QR Final 7,842 -> 8,116 (+274): +1,556 code. Rev 2: an earlier judge counts only when its first reply has no fault on either side (W3 4196). Prompt text: the sentence is 213 characters (a redirect-only return is 321 characters with its head and last line),
sent only to a returned judge, only when questions repeat; nothing added to any first ask, debater prompt or judge prompt.
Cost: each redirected judge's return is a full judge call (the conversation resent) instead of today's no-op call; in 34299 the first asks were
75,177 to 76,590 prompt tokens (measured), so 34108 would add two such calls.
Tests test_QRD.cjs (output test_QRD_out.txt), ALL OK. Stored data: only one stored question round exists (dry regrade 34299); it gives luna
standing and chatgpt and sol returned on the defender side (CR3/CR4). The second replies are planted (a relay send would need the operator).
Engine manual part: Question round (pkgQRD): when a judge's contradiction question repeats an earlier judge's (same debater, same rounds,
overlapping quotes), that judge is returned once and asked for a different contradiction if it sees one; a failing second question leaves the first.
