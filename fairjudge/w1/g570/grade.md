# W1 grade of ASK 570 draft 1 (fairjudge/w3/ASK570_draft1.md, md5 92dd064b, commit 23e6520e)

Verdict: PASS WITH ONE CONDITION.

Checks (live engine f63b73de, child de9efc4e):
1. Anchor `return EPS_STATUS==='LIVE'?base.replace(/^ENFORCER DISAGREE/,` stands once in LIB (engine) and once in LIB (child), LIB line 3406.
2. `__h=epsHold(x,v)` is in scope at the anchor.
3. Stored trial rows: 100 E-PREM (75 panel, 25 alternate). Second kind 39 (17 runs), first kind 61. Run 41822 second kind: row 52813.
4. Panel and Alt/R2 Send Back Build filter on /^ENFORCER (?:DISAGREE|NO ANSWER)\b/; a HELD row is not sent (answers W3 limit 6.1).
5. Offline expression test: under TRIAL only the second kind changes, to HELD; first kind, third kind and no-note case identical to live. Under LIVE both codes identical.

Condition C1: LIB 3406 is served by 3 MAP modules (Judge Enforcer Record n 62131-62208, Alt Judge Enforcer Record 62184-62261, R2 Alt Judge Enforcer Record 62214-62291). Each grows by 77 characters. The build must update the MAP n of those 3 modules in the engine and the child's equivalents, besides the library sha, or the loader throws on the length check.
