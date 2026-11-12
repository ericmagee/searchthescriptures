# ASK 122: measured diff of the two contradiction prompts (live s160)

Source: fetchback_live_s160.json. Texts extracted from the node code: w2_grades/prompt_diff/ (C_PROMPT.txt, J_eff.txt, C_SYS.txt, word_diff.txt).

## Sizes (MEASURED, characters)
- System message: the same 256-character text in both nodes.
- Close Enforcer Build prompt: 1,615. Judge Contradiction Build prompt (after its own replace step): 1,741.
- Close Enforcer Build carries the pkgCRB CLOSING BLOCK in code (3 references) and in the prompt (the "So / Therefore / Thus" sentence, 294 characters). Judge Contradiction Build has neither (0 references).

## What differs
1. Scope. The close enforcer is sent one debater's four rounds per call. The judge step is sent both sides in one call ("Read each side's closing round against that side's own earlier rounds"), and its candidates are named by the judges.
2. The CLOSING BLOCK sentence (pkgCRB) is only in the close enforcer: "Read each candidate's closing sentence together with the rows of its CLOSING BLOCK: a closing sentence that draws its point from a row ("So", "Therefore", "Thus") asserts what that row says, so if the earlier sentence withdrew, dropped or rested nothing on that row, the close asserts it again." The judge step's candidates come with no closing block.
3. Link rule. The judge step adds: "The defender's links are the numbers of its DECLARED CHAIN in [CR1]; the challenger's links are the numbers of its LINK blocks in [DR3]." The close enforcer does not need it (one side per call, links given with each block).
4. Wording only (same meaning): "of the same side", "(those are read under their own rules)", "states the other side's position or quotes it", "one line per candidate", "reply with the one line".
5. Same in both: the contradiction definition, the NOT-a-contradiction list, the reply line format, the NONE line.

## Shared rule text if approved
Definition, NOT-a-contradiction list, CLOSING BLOCK sentence, reply format and NONE line: about 1,150 characters (ESTIMATE). Each node keeps its own head (scope, who named the candidates) and the judge step keeps its link rule.

## What the operator rules
Whether judge-named candidates get the CLOSING BLOCK (the rows of the closing block under each candidate, plus the sentence). If yes, the judge step's input changes: the sentence adds 294 characters per call (MEASURED); the rows add about 900 to 1,700 characters per judge-named candidate (ESTIMATE from the close-enforcer side; not measured on the judge path). No stored run's result changed for want of it (Wall 5334).
