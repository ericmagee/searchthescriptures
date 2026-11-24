# W1 GRADE: ASK 590 build rev 0 (single closing check, with the send-back)

GRADE: PASS. COMMIT 56ffa5ed (W4 build rev 0). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Not the builder.
RULES READ: ruling 428 (the judge keeps the decision), ruling 512 (features planned live), ruling 516 ("Build it, with the send-back"), the scope rule, "never touch reasoning unless I instruct it", ruling 383.
OBJECTIVE MET: yes. The anti-cheat turn is merged into the closing contradiction check as one check, with a send-back to the judge, live on every run. Nothing is staged as a trial.

## What I checked
1. Base: base_eng.json and base_child.json equal my own live fetches of engine 9bec145c and child 2d5bdc94, node for node (type, typeVersion, parameters, credentials, onError, retryOnFail, disabled, position) and sorted connections: 0 differences.
2. Rebuild: build590.cjs then build590_l2.cjs on the live base gives engine 91de1679 and child fd127191, equal to W4's targets node for node, connections equal.
3. Tests rerun by me: t590 26 PASS, t590s 25 PASS, t590rec 6 PASS, t590r 9 PASS; syn590s 379 parts, 0 errors; Library Check pair passes (LIB 7faddc0afce9b839, MAP 80ed449e96a14972).
4. Scope: 8 engine nodes change, jsCode only (Build Independent Verdict, Panel Build, Send Back Build, Alt Send Back Build, Shared Library, Close Enforcer Build, Close Enforcer Record, Close Group Batch Build). This matches the notes' "7 plus Shared Library". No model, prompt-of-reasoning or settings change.
5. Wiring: Check Save output 0 and Regrade After Quotes? true now go to Panel Build in place of Anticheat Resume; Close Enforcer Build goes to Assume Check Build in place of Anticheat Build. The six Anticheat nodes keep no connection and nothing reaches them. Panel Build's parents are [Check Save, Regrade After Quotes?].
6. Git: every build and test file in a590_w4/build (including finder_port.js and ovs_port.js) equals the copy in /mnt/project-files/ask590/w4/build by md5. Notes 755d4d9b.

## Rulings asked
- R1, the send-back form (notes 2.5): ACCEPTED. The send-back is not counted against any seat; the judge reads the item and keeps the decision. That is ruling 428 and Eric's press. It runs on every live run, so ruling 512 is met. Wording: say "not counted" in place of "record-only" on the card and in the manual, so it is not read as a trial stage.
- R2, E-REVCLOSE matcher breadth (notes 2.3, 8 words, judge answers KEEP or CHANGE): ACCEPTED, because a match counts nothing and the judge decides. The card must state the breadth and that a wide match costs a judge turn, not a verdict.
- R3, the two guard changes (notes 1.1 and 1.2, the other-side-words guard): ACCEPTED. They meet plan S1 and S5(g); t590s covers both.

## Notes for the card (not faults)
- N1: the enforcer request grows to about 190k characters per read (luna, max_tokens 64,000). State it as cost.
- N2: (a), (c) and (e) of the plan cannot be measured without live reads. Say "not shown by a run".
- N3: run 42071 holds 1 confirmed closing contradiction, not 3; the card should carry the corrected count.

## Mistakes
None of mine found in this grade.
