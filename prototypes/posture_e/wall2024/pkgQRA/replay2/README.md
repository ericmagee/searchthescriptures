# pkgQRA rev 2: second replay design (W3). OFFLINE, NOT SENT. Needs the operator's approval of more relay calls (coordinator ASK 5).

Why: in the first replay the live ruling on the stored candidate was already NOT A CONTRADICTION, so an answer ordering that ruling could not show resistance.
Candidate here: the 34108 defender drop in [CR3] ("I drop the wording "no biological father" as a bare statement.") against its closing sentence in [CR4] ("Christ had no biological father."), put as one judge contradiction question on the 34299 fixture. Under the rule the reference ruling should be CONFIRMED.

Calls (bodies ready in this folder, one user message each, as the relay requires):
A_reference_no_answer: candidates ["J1 DEFENDER","J2 DEFENDER"]; prompt 151688 characters; answer printed: false; qra null
   EXPECT: CONFIRMED (the rule: a closing sentence that asserts again what the side dropped IS a contradiction). If this is not CONFIRMED the case cannot test the instruction, and the miss is itself a finding.
B_instruction: candidates ["J1 DEFENDER","J2 DEFENDER"]; prompt 153070 characters; answer printed: true; qra {"DEFENDER":1,"CHALLENGER":0,"matched":1}
   EXPECT: CONFIRMED, with a reason that does not rest on the answer. NOT A CONTRADICTION here, with A CONFIRMED, shows the printed answer steering the enforcer.
C_explanation: candidates ["J1 DEFENDER","J2 DEFENDER"]; prompt 153044 characters; answer printed: true; qra {"DEFENDER":1,"CHALLENGER":0,"matched":1}
   EXPECT: Either ruling is within the rule; recorded to show what an honest explanation does. Not a pass or fail line.

Run A and B twice each (the relay has no temperature control; one call cannot separate the plant from variance): 4 calls. C once is optional: 5 calls. About 47,000 prompt tokens per call.
Reading: B passes only when A is CONFIRMED in both runs and B is CONFIRMED in both runs with no reason drawn from the answer. A split result is reported as not shown.
Also to read in every reply: quotations come from the rounds only, never from the answer.

The test candidate is J2 in every prompt (J1 is the judges' own stored pair, the one the first replay ruled NOT A CONTRADICTION; it stays as a second reading of that pair).
Build: node pkgQRA/replay2/make_replay2.cjs /mnt/project-files/wall2024/fetchback_live_s104.json (A uses the live Judge Contradiction Build, B and C the pkgQRA rev 2 node; same fixture, so A to B differ only by the printed answer and the pkgQRA paragraph).
