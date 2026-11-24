# ASK 573 plan, draft 1 (W1): serve the judge line parser __RL from the Shared Library
Base: live engine d8292f62 (after 563) and child de9efc4e. Read-only planning; nothing is written. Method: the 571 byte-for-byte method (W4, Wall 11056 item 7).

## 1. OBJECTIVE
Today the judge line parser (__RL: readLine, readLines, readStored, judgeText, normLine, unescapeOnce, quoteAt) is written out in full, 16,453 characters, in six code nodes, identical in each: Build Save Body, Format Markdown, Enforcer Build, Judge Enforcer Retry Build, Alt Judge Enforcer Retry Build (engine) and R2 Alt Judge Enforcer Retry Build (child). The Shared Library already holds the same text, byte for byte, at LIB lines 240 to 328, where it serves 47 library modules. Expected effect: one stored copy of the parser serves every node. A future fix to it is one edit, and the engine code shrinks by 79,500 characters and the child code by 15,872, with no change in behaviour.

## 2. ROLES
Planner W1. Builder W4 (rebuilds on a fresh live readback and writes). Grader W4 for this plan (coordinator, 18:05 CST 11-23), and a non-builder seat for W4's build. Write card: W4's own card, in W4's thread.

## 3. SCOPE and SEARCH
Scope: one new MAP entry "__RL" in the Shared Library of the engine and of the child, pointing at the existing LIB lines 240 to 328 (no LIB line added or changed; LIB sha f24a5192c60cbc55 unchanged; the MAP sha changes). In each of the six nodes, the __RL statement is replaced by a loader of the pkgREFP shape (546 characters) that rebuilds the text from the library, checks its length, and throws on a missing entry or a length mismatch. Nothing else.
SEARCH (scripts rl.cjs and the inline search in this folder):
- Engine d8292f62: every code node parsed with acorn. A top-level __RL declaration is in exactly the 5 engine nodes named, each 16,453 characters, md5 0a7aec94, and the 6 copies are one text. Each node uses __RL once after its declaration. Build Independent Verdict and Panel Build hold only longer names (__RL2 and the like), not __RL.
- Child de9efc4e: R2 Alt Judge Enforcer Retry Build, same text.
- Shared Library (engine and child): __RL text at LIB 240 to 328, once, contiguous; 28 LIB lines name __RL; the 47 MAP modules that serve those lines are unchanged by this plan.
- Workflows the engine reaches: c7366RPLb8vdMQg6, SX4ZWtgHNs96uBOo, MqQHRl7mQQ0z8QdT (the child), and the webhook wall2024-panel-judge-call. NOT SEARCHED: c7366RPLb8vdMQg6 and SX4ZWtgHNs96uBOo, which I did not read. They cannot read another workflow's node through $(), so they are outside the change, but they are named per the ASK form.
- Free names: __RL references no name outside itself (free.cjs: none). Loaded in an empty context, it runs.

## 4. CRITERIA and DONE
1. Every existing LIB line and every existing MAP entry is unchanged, in engine and child.
2. The text rebuilt from MAP "__RL" equals today's __RL byte for byte (16,453), in engine and child.
3. For each of the six nodes, putting today's text back in place of the loader gives today's node byte for byte.
4. For each of the six nodes, the loaded __RL gives the same readLines, judgeText, normLine and unescapeOnce output as today's text on the stored judge verdicts of run 41822.
5. Only the six nodes and the two Shared Libraries change; node counts and connections are equal; every changed node parses.
6. Library Check passes on the engine target, and the child's Library Check passes on the child target when fed the engine target's Library Sha output (the live drift check).
7. Negative controls: with the MAP entry removed, the loader throws; with one character dropped from a __RL line, the loader throws; the engine target paired with today's child fails the drift check.
DONE: written in engine and child on one card, read back live by a non-builder seat, and a run in which Build Save Body and Format Markdown complete with the loader in place.

## 5. WRONG-IF
This plan aims wrong if the six copies are not one self-contained text, which would mean the block reads node-scoped names and cannot be served unchanged. Run: the free-name check gives none on __RL (known good), and gives REFP on C4P in D4 Build (known bad, a block that reads a node-scoped name). The six copies have one md5. Not wrong.

## 6. RUN EVIDENCE
The path fires in every run that reaches Build Save Body, Format Markdown and Enforcer Build: their output rows are written. A loader failure throws "ASK 573: ..." and stops the node. Mark: the run's saved row and report exist, and no "ASK 573:" error is in debate_errors.

## 7. INPUTS IN GIT
fairjudge/w1/a573/: rl.cjs, free.cjs, rl_text.js (md5 0a7aec94), build573.cjs, test573.cjs, libpair.cjs, c4p_known_bad.js, this plan. Base and target files are on the mount only (7 MB each): /mnt/project-files/fairjudge/w1/a573/base_engine_d8292f62.json (engine built from f63b73de plus the live 563 Build Save Body diff), base_child_de9efc4e.json, target_engine_573.json, target_child_573.json.
Offline result on these: test573.cjs ALL PASS (all criteria 1 to 7, including the Library Check); libpair.cjs PASS on the target pair, and FAIL as expected on engine target with today's child.

## 8. STEPS
1. W4 grades this plan. (no card)
2. W4 rebuilds on a fresh live readback of engine and child, with the same scripts, after any library writes ahead of it in the queue (547+548+552, 549, 559, 569, 570 and 571 change LIB lines in place or append them; if any of them touches LIB 240 to 328, the __RL MAP n is recomputed), and posts the build and its test. (no card)
3. A non-builder seat grades the build. (no card)
4. W4 cards the write to the operator: engine and child in one write, because the child's drift check fails while only one side is written. (waits on the card)
5. W4 writes and fetches back; W1 reads back live. Revert: restore the six nodes and both Shared Libraries from the pre-write export. (waits on the card)
6. The first run is read for the evidence of section 6.
