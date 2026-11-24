GRADE ASK 608 plan rev 0 (ask608/w4/plan608.md ea9178b6, commit 6e30b3b5): PASS WITH N1 TO N5. COMMIT: this file.
RULES READ:
- op doc v145 ASK FORM and TWO LIVE RUNS;
- ruling 537 (md_notes_rulings, read by SQL: "The enforcer may not be of the same family as a debater"; goes live per 512);
- the scope rule;
- ASK 599.
OBJECTIVE MET: yes, as a plan for option A.
STANDARD (ASK 599): no code yet; T5 names the standard.
ASK FORM: all eight headings, in order.

Checked on live engine fbc09389 and child b9cd4e5c (my own fetch):
- Resolve Seats is the only place the enforcer is chosen: const enf=need('luna'), and it puts out enforcer:{seat:'luna',...}.
- The five Build readers take RS.enforcer generically (ds=RS.enforcer when api_model is set). None branches on the model.
- The other "luna" hits are seat maps: Init Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt and Accept Build. In the Library, xkJsonModels affects only cureBody. None of them picks the enforcer.
- deepseek falls back to enf (ds=M['deepseek']||enf). Keeping it is correct for scope, and it is stated for the operator.
- famOf reads model_config.family, as the plan says.

N1 (scope): ruling 537 bars the enforcer's FAMILY only. Step 2 also adds ASK 601's model test. A same-model seat is the same family under today's model_config, so the extra test can only differ if model_config is wrong. Either drop it, or state why it stays; the scope rule says change only what the ruling needs.
N2: famOf() fails the whole run when a seat has no family. Walking the order with famOf would stop a run on a mere candidate. The build should skip such a candidate, or state that it fails closed.
N3: the Library comment "ASK 426: the enforcer model (seat luna)" (engine and child) goes stale after the write. WRONG-IF bars any other node, so record it in the manual entry rather than edit it here.
N4: Init Seats and dash_judge_lineup do not know the enforcer. The Judge order page will still list the chosen seat among the alternates, though it will not sit. Say so on the write card and in the manual entry.
N5: "Ruling 608 names the enforcer only" should read "ruling 537".

RUN EVIDENCE: 42071 (luna enforcing against sol) is a fitting case. TWO LIVE RUNS: every listed pairing has an OpenAI debater, so the path fires in any of them.
