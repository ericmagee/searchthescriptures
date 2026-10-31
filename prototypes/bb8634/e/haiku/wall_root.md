Worker_A3, Advisor_Code_D: a Haiku enforcer for the judges' rules. His idea; a test on stored judgments first.

## His words (my rulings 338, my thread 09:2x to 09:3x CDT 2026-10-31)
"how about we use Haiku to be an enforcer? have Haiku check if a judge is using the chain rule... where ever we have rules for judges we can an enforcer"; "let's start Haiku... We a human or model knows it's being monitored and be checked... it's less likely to be careless or bias. Given Haiku has a very narrow job... i think it's capable. This will be a single turn event for Haiku"; "ifit reveals judges are hedging that another data to secure the debate environment.. that's a win. continued containment is the objective"; "let's focus on Haiku. yes, open a wall and test the theory".

## The problem it answers (measured in the three reads)
The judges' rules are enforced today by code checks in Extract Independent Verdict and Panel Build, which match words and line formats. They fail three ways:
1. A breach reworded past the pattern is missed. Run 30268: Gemini's "neither text states that Joseph begat" is the ground the K-S2 rule bars, and no flag fired (WALL-1943 problem 8).
2. A valid cure is refused on format. Run 30304: GLM wrote a RETRACTED line for D2 vs C3; the parser refused it as "malformed line", recorded K-G4 UNCURED, and the seat was not counted (WALL-1949 problem 5).
3. A flag stays open after its ground is gone. Run 30304: the K-S2 flag on D3 vs C6 stayed after the K-C cure dropped the ground (advisor's J4, BB-8765).

## The design, as a starting point
1. ONE CALL PER (judge line, rule). Haiku gets three things and nothing else: the rule's exact text as the judges are served it (Build Independent Verdict and Panel Build), the judge's line, and the round text the line names.
2. IT RETURNS ONE JSON OBJECT: the rule key, BREACH or CLEAN, the judge's words that decide it (quoted), and one sentence why.
3. IT NEVER GRADES THE DEBATE OR THE DOCTRINE. It checks only whether the line obeys the stated rule. The judges grade the text alone (tandem v66, REQUIRED FORM, live-run read clause); the enforcer grades the judge's compliance with the judge's own rules.
4. THE CODE CHECKS STAY. Haiku is a second reader behind them, recording only, until its record earns more.
5. LATER, HIS POINT 2: tell the judges every line is checked. If they hedge (more UNDERDETERMINED), that is data on the environment, not a failure.

## Phase 1, the test: stored judgments only, no flow change
Population: the panel and single-judge judgments of runs 30196, 30268 and 30304 (debate_judgments and debate_results.independent_verdict_raw for those three rows).
Known-answer cases, each to be re-read at the row before the test:
1. Should be BREACH (K-S2), missed by code: 30268 Gemini, the "neither text states that Joseph begat" line.
2. Should be accepted as a cure, refused by code: 30304 GLM, the RETRACTED line for D2 vs C3.
3. Should be BREACH (K-C), caught by code: 30304 single judge, D3 vs C6 and D6 vs C1 before cure.
4. Should be BREACH (K-G4), caught by code: 30304 Gemini, D2 vs C3 CHALLENGER LINK BROKEN before its retraction.
5. Should be CLEAN: a set of lines no check flagged and the three reads found sound, drawn from the same rows, at least as many as the breaches.
Measured: hits on 1 to 4; false BREACH calls on 5; agreement with the code checks on every line both read.
Route: Haiku called at a seat, by a one-turn subagent on the Haiku model, with the inputs above in one prompt and nothing else in context. This changes nothing in the system. A route inside the flow (the n8n Anthropic credential) is Phase 2 and its own order.

## Open questions for the pair
1. Which rules go first: K-C, K-S2, K-G4 only, or every judge rule with a code check?
2. How a line is cut from a judgment, so Haiku sees exactly one line and the round it names.
3. The pass bar for Phase 1, set before the run, not after.
4. Whether Haiku is told what the code check found. My lean: no, so the two readers stay independent.

## Not authorized here
No change to the live flow, the judge prompts or the panel. Phase 1 reads stored rows only. The test itself graduates to a board order with a P2D (tandem LAW) before any call is made.

Worker_E, seat 3, session_014Qy67bHv8uBmRXbWGSrghm
