# pkgVP3 rev 2 (W4): answers W1 FAIL 3798 and W2 3795

Base now live s90 (33f5fd30, 418 nodes). Write file parent_s90_VP3.json (node build_VP3.cjs <live fetch-back> <out>). Same 3 nodes.
Changes from rev 1:
(a) WOULD REMOVE only when the row's live cure reading (cure_status written by the live readers: enf428Cure / pkgUND / VP1 part 1) is UNCURED. A CURED or empty live reading is noted "not listed: the live cure reading is ...".
(b) The side's whole answer is read: the item's round and the side's later rounds. Every line naming the verse must be a bare answer line; a layer line, a NARROWED TO head, another verse's answer that cites it, or any other line naming it is substance (code does not agree). A deferral is followed: the LINK block it names, in the same round, must hold no [Ln] tag and fewer than 25 words. An answer block now ends at a bold or LINK heading.
(c) Rerun of the 11 rev 1 listings: 0 remain. Each now reads (probe_VP3_multi_s90.txt): 34108 Luke 1:34 E-ANS x3, the deferral to LINK 4 names an answer of 480 words with layers; 34108 D1 vs C1 E-HOLD, Luke 1:34 named again in [CR1]; 33461 Matthew 1:18, named again in the LINK 1 NARROWED TO head; 33798 Job 14:1, named again in the Galatians 4:4 answer; 34016 Matthew 1:25, named again in the Luke 2:5 answer; 34016 Luke 2:44, its own [L3] row. All 42 replayable node runs: 0 two-reader agreements, 0 listings; rows otherwise byte-equal to live.
Proof: probe_VP3.cjs 36 OK, 0 FAIL (rev 2 unit cases: deferral to a layered LINK, NARROWED TO head, later-round layer line, live CURED / UNCURED / empty). Rolled-back insert of two rev 2 rows (panel and alternate): accepted.
What this means for the trial: on the saved runs the code half now never agrees with a DeepSeek DISAGREE, so a trial run is expected to list no seat. A listing, if one appears, is a bare grant or a short deferral with nothing else said of that verse by that side from that round on, and a live reader that already reads the reply UNCURED.

# Rev 1 (W4, failed: W1 3798): P3, E-ANS and E-HOLD where two readers agree. TRIAL, record-only

Ruling: operator 15:11 CST 11-09 (md_notes_rulings 459), P3 of Wall 3708 as changed by Wall 3711; split Wall 3729 (builder W4, graders W1 and W2).
Base: live s89 (6ac6a994, 414 nodes). Changes 3 nodes: Send Back Record, Alt Send Back Record, R2 Alt Send Back Record. No node added, no connection changed.

## What it does
For each send-back item whose DeepSeek reading is DISAGREE, on E-ANS (right: MISSES) or E-HOLD (right: BROKEN), the code half reads the
answering side's answer to that witness from its round:
- E-ANS: the verse and round named in the item ("ANSWER CHECK Luke 1:34 [CR3]").
- E-HOLD: a collision witness named in the DeepSeek reason; the side named in the reason (defender = CR rounds, challenger = DR rounds); the round(s) the reason names, else every round of that side.
The answer is a bullet or ANSWER line headed by the verse (a bullet labelled by several bold verses counts as an answer too, read whole). A PRESSED WITH line (" -- MEANS:") and an [Ln] footing line are not answers.
The code agrees when every answer found is bare: it holds no [L1]-[L4] tag of its own, runs 60 words or fewer, and each sentence is either a grant
("I grant/concede/accept/allow ...", "granted", "conceded", with no "so/because/for/but/yet/therefore/thus/hence/since/this supports" after it)
or a short deferral (15 words or fewer: "under LINK n", "in [CR4]", "I answer it fully ..."). No answer found, or any answer with substance: no agreement, not an item.

Where both readers agree, the judge's reply is read:
- E-ANS cured: CHANGE TO a line graded MISSES or FAILS, or RETRACTED.
- E-HOLD cured: CHANGE TO the pressed side's link BROKEN (DEFENDER LINK BROKEN for CR, CHALLENGER LINK BROKEN for DR), a FORCED line, RETRACTED or WITHDRAWN. A kept UNDERDETERMINED line does not cure, even with a counted [L1].
- KEEP, CHANGE TO a line that keeps the grade: uncured. A silent seat is already counted by the silence rule and is not listed again.

## What it writes (TRIAL)
Nothing is counted and no seat is removed. Each E-ANS / E-HOLD DeepSeek DISAGREE send-back row gets one note appended to cure_reason:
- "TRIAL pkgVP3: TWO READERS AGREE on <verse> (...) -- WOULD REMOVE <seat>: ..." or "-- CURED by the reply (...)"
- "TRIAL pkgVP3: code check does not agree, not an item -- ..." or "TRIAL pkgVP3: NOT CHECKED -- <why>".
The node output's sendback object gains vp3_trial {status, checked, agree, would_remove{seat:[items]}}.
Run report: list each row with "WOULD REMOVE" (query cure_reason LIKE '%pkgVP3: TWO READERS AGREE%WOULD REMOVE%') and grade each by hand before P3 is enforced.
cure_status and every other field are unchanged. Log rows keep seat_role panel, kind send_back (rolled-back insert through record_enforcer_log: 2 rows accepted).

## Proof
- probe_VP3.cjs on run 34108's stored node outputs (live s89 code against the package): 29 OK, 0 FAIL. Rows change only by the appended note; all else byte-equal.
  34108 result: would remove terra (E-ANS Luke 1:34, KEEP) and sol (E-ANS Luke 1:34, CHANGE TO MEETS; E-HOLD D1 vs C1, kept UNDERDETERMINED); luna cured (CHANGE TO MISSES). terra Isaiah 7:16 [CR4]: code does not agree.
- probe_VP3_multi.cjs over every saved run with a stored send-back call: 42 node runs replayed (16 older runs not replayable on s89 code), all equal except the notes; 17 two-reader agreements, 11 would-remove listings, in runs 33461 (Matthew 1:18), 33798 (Job 14:1), 34016 (Matthew 1:25, Luke 2:44), 34108 (Luke 1:34). Each quoted answer is in probe_VP3_multi_s89.txt for the graders' hand count.

## Build
node build_VP3.cjs <live fetch-back> parent_s89_VP3.json  (three anchors per node; refuses a node that already has pkgVP3).

## Engine manual part (for W3)
Send-back, P3 TRIAL (pkgVP3): an E-ANS or E-HOLD DeepSeek DISAGREE is a two-reader item when a code check finds the answering side's answer to the same witness bare (no layer of its own; only a grant and/or a deferral to another link or round). For one run it is record-only: each such send-back row notes whether the judge's reply cured it (E-ANS: regraded MISSES or FAILS; E-HOLD: regraded the pressed side's link BROKEN or FORCED) or WOULD REMOVE the seat. The run report lists every WOULD REMOVE row. Enforcement (an uncured two-reader item counted in drv_uncured, then the existing alternate and fail-closed path) needs the operator's approval after the trial.
