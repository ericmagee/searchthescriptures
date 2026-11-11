## pkgECS: E-COL is not asked about a break the engine already made by a confirmed closing contradiction

Where: the three enforcer builders (Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build), through the Shared Library.

What changed: before the DeepSeek E-COL items are built, a LINK BROKEN collision line (not a FORCED line) is set aside when it grades a link that the Close Enforcer or the Judge Contradiction check CONFIRMED broken by a closing contradiction for that side. The builders use the same test the send-back uses (pkgECB, lines __cc and __ecC). A line that is set aside is not sent to DeepSeek. Each judge who wrote it gets a code row (rule E-COL, kind enforcer_check) with the reason "NOT ASKED (code, pkgECS): the line grades a link the engine broke by a confirmed closing contradiction; E-COL does not apply to that break, as the send-back does not send it (pkgECB)". The three stubs now name Close Enforcer Record and Judge Contradiction Record, so the task runner sends those two nodes.

Why: E-COL asks whether the judge's break rests on an answer that cannot agree with a pressed meaning. When the engine has broken the link by the operator's contradiction rule, DeepSeek reads the break as having no such ground and answers DISAGREE (right: STANDS). In the 12 stored exports this happened on 42 lines and an AGREE came back on 3. The send-back already refuses to send these rows (pkgECB), so they were wrong records and wasted enforcer input.

Size (measured): Shared Library +1,371 characters (two reused library lines added to three node maps, the loop test, the code row); the three stubs +59 each; all Code nodes +1,548; prompt instruction text 0; enforcer input smaller in every stored run that has such lines (run 35173: -6,503 characters; run 35067: -49,237 characters and one call fewer).

Limits: a FORCED line on the same link is still asked. The code rows are counted in enf428.code_violations with the other code rows. A judge's other ground on such a line (a pressed witness) is no longer checked; it changes nothing, because the link is broken by the rule either way, but 3 correct AGREE rows in run 34726 would no longer be written.
