# Step 11b (Worker_E): verify of Worker_A3's 11a ground table (BB-7371, git 0957a13)

Read at the rows, 2026-10-21 about 17:15-17:30 CDT, stored text only, no model call.
Rows: debate_results 8fec5e2e-3e5d-4e45-828a-0c35ceffd26b (defender = record's reading: claude_r1 [CR1], claude_r2 [CR2], engine_r3 [CR3 link round]; challenger: engine_r1 [DR1], engine_r2 [DR2], challenger_r3 [DR3]); debate_judgments 784 (gemini), 785 (grok).
Live rule text: ODV1 version 5fd3b03c-4e9d-4e16-8eeb-a89f199f75cc, nodes Build Independent Verdict and Panel Build (get_workflow_version, saved by tool).
No doctrinal judgement made: checks are presence of references, verbatim quotes, and which round holds them.

## Facts checked
- CR3 (engine_r3) reference counts: Luke 3:23 0, Matt 1:25 0, Gen 4:1 0, Matt 1:18 1. Its one 1:18 sentence, verbatim: "Matthew 1:18's clause states the womb's consecration and states no exclusion." It sits under "LINK 4 [premise 2]".
- CR3 link labels: LINK 4 [premise 1], LINK 4 [premise 2], LINK 2 [premise 3], LINK 2 [premise 4], LINK 5 [premise 5] (footing Matt 1:16 egennethe), LINK 3 [premise 6].
- CR2 (claude_r2) headings "Answer to C1" (Matt 1:18-25) and "Answer to C4" (Luke 3:23, nomizo) exist; Gen 4:1 and Matt 1:25 are addressed in CR2 text.
- DR1 (engine_r1) holds "On the defender's reading Joseph begat Jesus, yet the text says he did not know her before the birth" (position 1915).
- D5's own footing in CR1 includes Matt 1:25 "knew her not till".
- Judges: 784 gemini BROKEN, lines D3 vs C4 and D5 vs C1 DEFENDER LINK BROKEN; 785 grok BROKEN, lines D5 vs C1 and D6 vs C1. Layers on each line as A3 states (gemini D3 L1+L2 after cure G3543; grok D5 L1+L2+L3; grok D6 L1+L2+L3).
- Gemini CONCEDED LINKS: "Premises 1, 2, 3, 5, 6: SUPPORTED". Gemini stays k=1 without D5 (D3 remains), so BROKEN-1 either way; panel 2-1 unchanged.
- Rule words, verbatim in both judge nodes: "is ANSWERED only when this link round quotes it or names it by reference and shows from the text why it does not overturn the link"; "Grade a link BROKEN when ... the broken side's link round left any of those witnesses UNANSWERED (COUNTING RULE)"; "Grade UNDERDETERMINED only when the link round answered every such witness".

Result: every fact in 7371 holds at the rows.

## Counters on the classification (for 11c)
1. Items 1, 3, 4 (gemini D3 vs C4; grok D5 vs C1; grok D6 vs C1). The rule does not leave these grades open: "ANSWERED only when this link round quotes it" closes them as BROKEN once CR3 omits the witness, though CR2 answered it. 7356's class (c) reads "the rule itself leaves the grade open"; these are a different case, the rule compels the grade. The facts are A3's; the label matters because the design target is the rule (whether an answer given in round 2 counts), not the judge.
2. Item 2 (gemini D5 vs C1). "Gemini names no unanswered witness" is true of the collision line alone, but Gemini's own K-G4 cure statement (RESULT: CURED) supplies a SHORT line quoting the CR3 sentence and saying it "fails to answer how the timing clause ... does not contradict". So Gemini did ground the break, and it turns on "shows from the text why it does not overturn the link", a judgement the rule leaves open: (c) by 7356's literal wording. Against that, the same judgment marks premise 5 SUPPORTED, and CR3 carries premise 5 as LINK 5 (that LINK 5 is D5 is my reading of the numbering, not checked): a tension inside the judgment that reads as (b). I hold it CONTESTED (b)/(c). Panel unchanged either way.

NOT CHECKED: whether CR2's answers are adequate as argument (a doctrinal judgement, not made); the other 22 collision lines; glm (783).
