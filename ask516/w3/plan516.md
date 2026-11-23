# ASK 516 plan (W3, seat 33), rev 3, 2026-11-20

Operator: "Work on 516" (13:13 CST, project-chat card). Builder: W4. Base: engine 1b20b067, child c9db9777, library 6f2ae36f19303a92 (ASK 515 rev 7).
Rev 1 and rev 2 (per-pair block harvest) are withdrawn. W4's replays (replay516_41117.md, replay516r2.md) showed that a harvest keyed on link names and on the verses the judges cited cannot reach rows whose verses the judges did not cite. Those are the unweighed rows that RULE ONE VERSE is about. Rev 2 is kept as plan516_rev2.md.

## Objective
Each enforcer call is given every round of both sides, whole, so that every row either side laid on any point is before the enforcer. It is general and either side alike. The code names no verse, topic or phrase.

## Change (W4's option ii)
C1. In each judge enforcer call (Judge, Alt and R2 Alt Judge Enforcer Build), the user message becomes:
  RULES, then THE ROUNDS (whole), then the per-call part (the POINTS AT ISSUE entries, rev 7 Map), then the items.
  THE ROUNDS section:
  - heading: "THE ROUNDS IN FULL (pkgREC, ASK 516; taken by the system from the debate record, not from any judge's text; every row here counts as given to you for every item in this call):";
  - then [CR1], [DR1], [CR2], [DR2], [CR3], [DR3], [CR4], [DR4] in round order, each tagged, exactly as stored.
C2. The per-pair harvest of 515 (chain line plus LINK blocks; the "THE DEFENDER'S OWN ROWS FOR D<n>" lists) is removed. THE ROUNDS replaces it. The POINTS AT ISSUE part stays.
C3. For prompt caching, the rounds text is the same, byte for byte, in every enforcer call of a run, and sits right after RULES. Everything that varies goes after it. W4 checks that the system message (SYS plus __JAGR) is also identical across the calls of one build. If it is not, report it; do not change it in this ASK.
C4. A harvest that throws shows "(rounds not available: <message>)" in place of the section, never an empty section.
C5. Packing is unchanged (MAX_CALLS 10, CALL_CHARS 40000). The rounds sit outside CALL_CHARS, as the 515 record did.

## Not changed
RULES text (the record section's heading says the rounds count as given to every item, so RULE ONE VERSE's "the item gives you" covers them), ESR_BASE, item texts, cure code, all other nodes.

## Checks (W4, then W3 grade)
1. Replay 41117 and 41090: the largest whole prompt per call, in characters and estimated tokens, against luna's context. Total characters per run, before and after.
2. Caching: confirm the shared prefix (system message, RULES and THE ROUNDS) is byte-identical across the calls of one build, and give its length. After the first live run, read the cached-token counts in the enforcer usage if the log holds them.
3. Coverage, as a test only: the four 41117 and the 41090 lines holding "John 3:6" each stand in every call's prompt.
4. All stubs parse; only planned lines change; declaration order as in 515.
5. A cost note for the operator: added input characters per run, and the share expected to be cached.
