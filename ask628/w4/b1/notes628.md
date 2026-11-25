# ASK 628 BUILD (W4) on live engine 560f01fb / child b1d5a5bf (fetched 00:23:53Z 11-25; base_eng f1f793b4, base_child fb8a9e62, sha256 prefixes)
Plan rev 1 ../plan628.md 42c75705 (W1 PASS WITH N1-N3). Operator chose "Both" 18:18 CST.

## CHANGES (nothing deleted except the audit's inline reader, which moved to the Library unchanged)
1. Shared Library (engine and child, equal): new entry PRESS LIST (presslib628.js 1cc0676e, 7 lines): the reader of verses under PRESSED WITH and of the close's ANSWER lines, as it was in Build Save Body. Header reset (sha 027c8c4a71282403, 3858 lines).
2. Build Save Body: the CLOSE PRESS LIST audit reads through PRESS LIST, rounds gr1, gr2, dr3, dr4 as before. Output byte-equal (C1).
3. D4 Build (Oracle defender only): the close prompt gains "THE VERSES PRESSED AGAINST YOU -- computed by the system, not by a model: every verse the challenger carried under PRESSED WITH in its rounds 1 to 3 (<n>): <list>. Write one ANSWER line for each of them in this close, in the ANSWER form above."
4. D4B Build (Oracle only): verses on that list (rounds 1 to 3) with no ANSWER line are a third reason for the one existing re-call; the note adds "PRESSED VERSES WITH NO ANSWER LINE -- computed by the system, not by a model: the challenger carried these verses under PRESSED WITH in its rounds 1 to 3, and your close has no ANSWER line for them (<n>): <list>. Write your whole close again, the same case, with one ANSWER line for each of them in the ANSWER form your instructions give. Return the whole round; this is the only request of its kind." Output gains press_open; why gains the count.
5. Panel Build and Build Independent Verdict (Oracle only): the PRESSED-WITNESS LEDGER is followed, when any verse is still open after the close, by "PRESSED VERSES WITH NO ANSWER LINE IN THE DEFENDER'S CLOSE [CR4] -- computed by the system from the transcript text, not by a model: the challenger carried these verses under PRESSED WITH in its rounds 1 to 3 ([L1] and [L3] lines alike), and the close has no ANSWER line for them (<n>): <list>." No instruction to the judges is added or changed. Alternates take their request from Panel Build (no other judge builder calls judgeBlock).
Lists for 3, 4, 5 never read dr4 (W1 N2). The audit keeps dr4, as today.

## TESTS t628.cjs 95429419 on fx/r42373.json 9d7540fe (rounds of debate e7f6922f, read 00:24Z): out_t628.txt ALL PASS (29 checks; corrected 19:04 CST 11-24 from "30": the file holds 29 PASS lines, W1 Wall 11845)
- C1 audit byte-equal old/new/stored; 31 pressed, 20 open.
- C2 Oracle prompt carries the 31; other profiles unchanged; a dr4-only press changes nothing (C2b).
- C3 whole D4B node: live does not re-call the 42373 close ("no barred move harvested"); new re-calls it naming the 20, one request; all answered adds nothing; other profiles same as live.
- C4 judges get the 20 on the 42373 close; nothing when all answered or not Oracle.
- C5 only the six engine nodes and the child Library change; 73 MAP entries rebuild the same; all compile; standing 31/0 (out_standing_628.txt); pair PASSES lib 027c8c4a71282403 map 771e35cfe3e3b51b (out_pair_628.txt); every change tagged ASK 628.
- WRONG-IF margin: the Opus defender row allows 64,000 output tokens; the 42373 close was 28,325 characters with 22 ANSWER lines, so 31 answers stay far inside it.
Targets: target_engine_628.json 79a7c0ec, target_child_628.json 90275694. Build b628.cjs d981d3b7 (+ ask579 fixhdr579.js). Write ../write/write628.sh 1327c00e.
## COST
When it fires: one more Opus close call (the close request is about 50k tokens in, 7k to 10k out: about $0.40 at list rates).
