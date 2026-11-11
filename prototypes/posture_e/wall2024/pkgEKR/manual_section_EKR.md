## pkgEKR (W2): E-KEY and E-RES are not asked about a break that rests on a confirmed closing contradiction
Where: Shared Library lines of the three enforcer builders (Judge Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build). Needs pkgECS (it uses pkgECS's confirmed set __cc). Built on the joint parent PCS+ECS+RRT.
What: the confirmed set is the links the engine broke on a confirmed closing contradiction (Close Enforcer Record, Judge Contradiction Record).
- E-KEY: a KEYSTONE line graded BROKEN on a link in the set (D<n> for the defender, C<n> for the challenger) is not sent to DeepSeek.
- E-RES: a RESULT line "CHALLENGER WINS" whose reason names a contradiction is not sent when the set holds a defender break (the engine then gives BROKEN-1, which gives CHALLENGER WINS).
- Each line set aside is written by code as a row "NOT ASKED (code, pkgEKR): ...", cure_status null; it counts toward nothing.
Why: DeepSeek was not told the contradiction rule and called such lines wrong (35173: grok's keystone, luna's RESULT, which was then sent back).
Size: code +1,864, prompt 0 (measured). DeepSeek input falls where it applies (35173: -5,655 characters).
Limits: the E-RES test reads the word "contradict" in the reason, not which link it names; a keystone graded other than BROKEN on a confirmed link is still asked.
