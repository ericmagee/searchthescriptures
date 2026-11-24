# ASK 611 list (W4, draft 1, 11-24): where the debaters' rounds are carried
Read from the code of live engine ff7ab4cf and child ecdc6218 (scan611.cjs; scan611.json). Nothing was run and no execution data was read.
Sizes come from run 42234 (rounds 223,175 characters). "Measured" means built offline from the stored row (aar/w4/m42234, Wall 11606). Every other size is an estimate from the code.

KEY POINT: memory is held by what a step OUTPUTS, not by what it reads. n8n keeps every step's output until the run ends. A step that reads the rounds and puts out only a short result costs little. The load is in steps that put out whole requests, each with the transcript inside.

## A. Hold the rounds once, and are needed (keep)
| Step | Holds | Needed? | If removed |
|---|---|---|---|
| D1, C1B, D2B ... C4B Extract (each round's reply) | each round once, 223k in all | yes: the round itself | the debate is lost |
| Final Output | all 8 rounds once, about 223k | yes: every later step reads it | the judging has no rounds |
| Build Save Body | the saved row, about 223k plus notes | yes: writes debate_results | nothing is saved |

## B. Debater requests (needed by the debaters)
| Step | Holds | Needed? | If removed |
|---|---|---|---|
| D2 Build ... C4 Build, the xB re-call builds, the xG press re-calls | each request carries the earlier rounds as the conversation; by round 4 a request is close to the whole transcript (est. 150k to 220k each, about 16 requests) | yes: a debater answers the earlier rounds | the debate breaks. Only a re-call's resend can be trimmed, and that is ASK 604, not here |

## C. Judging and enforcing: the target
| Step | Holds (42234) | Needed? | If removed or passed by reference |
|---|---|---|---|
| Panel Build | 3 judge requests, 887,555 (measured) | the judges must read the rounds (ruling 383) | keep once, or build at the send |
| QR Ask Build, QR Follow Build | questions to the judges built on the judge request: est. about 3 x 300k each | the judge asks from the transcript | could send by reference to the Panel Build copy |
| QR Answer D/C Build, QR Follow D/C Build | requests to the debaters with the questions: carry the rounds (est. up to 220k each) | the debater answers from its rounds | keep; small count |
| QR Merge | the 3 judge requests AGAIN, with the questions and answers added: est. about 900k | NO, a copy | emit only the question-and-answer text; rebuild at the send. Nothing breaks if the send step adds it |
| Panel Judges Prep | the 3 requests AGAIN, as sent: est. about 900k | NO, a copy | build inside the send, or send by reference |
| Webhook wall2024-panel-judge-call | 3 executions, each holding its request: est. about 900k | the call itself | by reference (debate_id plus seat), with the webhook reading the row |
| Close Enforcer Build | 4 requests, 955,244 (measured); copy 2 is copy 1 with another temperature | one copy per side is needed | copy 2 could reuse copy 1's text: saves about 478k |
| Close Group Batch Build | the 4 close requests AGAIN, plus the assumption check: est. about 1M | NO, a copy | carry an index to the Build step's item |
| Assume Check Build, Judge Contradiction Build (2 copies), Enforcer Build (panel enforcer), Anticheat Build, Build Independent Verdict, Reserve Build (only when a reserve sits) | each carries round text in its request; not measured | yes, each checks the rounds | keep. Their copies could also go by reference later |

## D. Child (second alternate pass)
Regrade Load and Final Output (the child's copy of the rounds) and the alternates' requests sit in a separate execution, which releases them when it ends. Not counted here.

## What helps, in plain words
Removing the rounds from a judge's or enforcer's own request would break the judging, because they must read the debate. What can go are the COPIES:
- QR Merge;
- Panel Judges Prep;
- Close Group Batch Build;
- close copy 2.
Together these are about 3.3M characters on 42234's sizes. They are estimates, except the close copy, which is measured. Second step: send the judge requests by reference, which removes about 900k more.
None of this touches reasoning text, prompts or model settings.
