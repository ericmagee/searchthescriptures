# pkgQRA rev 2 (W3): the question-round answers reach the judge contradiction enforcer

Built offline; rev 2 on live s103 (ba4a8db5; Judge Contradiction Build is the same in s102 and s103). NOT WRITTEN: the write waits on the operator (coordinator 02:29Z 11-10). Source: dry regrade finding 9 (Wall 3958, /mnt/project-files/w3/dryregrade_34299_w3_findings.md).

## Gap
The debaters' answers in the question round (item C, pkgQRC) were read by no enforcer. The closing enforcer runs before the question round. The judge contradiction check runs after it, and a judge's contradiction question is one of its candidates, but its prompt held the eight rounds only: DeepSeek answered the candidate without the debater's own answer to that question.

## Change (one node: Judge Contradiction Build)
1. When the question round ran and holds an answer to a contradiction question (both passages quoted, the later one in that side's closing round), each such answer is printed after that side's rounds, under the two passages it was asked about, the judge who asked, and the id of the candidate it belongs to.
2. The prompt gains one paragraph, placed before the reply form. It restates the rule already served to the judges in Commitment 9 ("Its answer cannot withdraw either passage"):
   "After the closing rounds the judges put contradiction questions to the debaters, and the debater asked answered. Those answers are printed after that debater's rounds, each under the two passages it was asked about. Read the answer before you answer its candidate: it may show how the two passages can both be true. Read it only as an explanation of the two passages: anything beyond them, and any verse not already cited in the rounds, is disregarded. An answer cannot withdraw either passage, and it does not undo a contradiction made in the closing round: where the two passages as they stand in the rounds cannot both be true, the candidate is CONFIRMED whatever the debater says afterwards. Quote only from the rounds, never from an answer."
3. The node's output gains `qra` (answers printed per side, and how many matched a candidate).

With no such answer the prompt is byte-equal to live (probe P4 to P7, P12, P15). Candidates, the code confirmation in Judge Contradiction Record, the log rows and every other node are unchanged. No new log row, so no new insert shape.

## Safeguards
- An answer cannot break or save a link by itself: the Record still confirms a CONFIRMED line only when both quotations stand word for word in the rounds (P3b: a line quoting an answer as the closing passage reads NOT CONFIRMED (form)).
- Text in an answer that imitates a round header, a section bar or a CLOSE-CONTRADICTION line is defanged before printing (P8). An answer over 6,000 characters is cut and marked (P11).

## Limits
- A NEW contradiction made inside an answer (an answer against a round) is still no candidate: candidates close in round 4 only. Not built; it would change the Record and the recompute.
- Answers to plain explanation questions are not printed.
- NOT TESTED OFFLINE: how DeepSeek answers with the answers in view. The patched prompt for the stored debate is pkgQRA/prompt_patched_34299.txt (live 151,483 characters, patched 157,685). It should be replayed to DeepSeek by W4 before the write; in the stored debate the live reply to candidate J1 is the comparison.

## Files
build_QRA.cjs (refuses a base that is not 418 nodes or already carries pkgQRA); parent_s103_QRA.json; make_fixture.cjs, fixture_34299.json (from execution 34299); probe_QRA.cjs, probe_QRA.txt (23 OK).
  node pkgQRA/build_QRA.cjs /mnt/project-files/wall2024/fetchback_live_s103.json pkgQRA/parent_s103_QRA.json
  node pkgQRA/probe_QRA.cjs /mnt/project-files/wall2024/fetchback_live_s103.json pkgQRA/parent_s103_QRA.json

## Manual section (for engine_manual, when written)
Judge contradiction check: when a judge's contradiction question was answered in the question round, the enforcer is given the debater's answer with the candidate. The answer may show that the two passages agree; it cannot withdraw either passage or undo the contradiction, and the enforcer may quote only from the rounds.

## Rev 2
Rev 1 FAILED W2's grade (Wall 3962; W1 agreed, 3968) on the paragraph's wording only: it told the enforcer the answer "may show how the two passages can both be true" without Commitment 9's limit, so an answer given after the close could bring a new verse or argument. Rev 2 adds W2's sentence word for word ("Read it only as an explanation of the two passages: anything beyond them, and any verse not already cited in the rounds, is disregarded.") and corrects "each debater answered" to "the debater asked answered". No code path changed. W4's code checks of rev 1 (3964) stand for the code; the DeepSeek replay is still not done (W4: no path without a system change).
