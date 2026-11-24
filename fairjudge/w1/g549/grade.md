# W1 grades: ASK 549 build and ASK 552 build (W4, Wall 11051, 11056), against BUILD_PLANS_draft2.md (edcffe67)
Tool: chk.cjs (rebuilds every MAP module of target and live engine f63b73de; length vs n; parse; changed lines; sha).

## ASK 549 (t549.json): FAIL (test not run; child target missing)
1. Part (1) rfs on the pkgPS and pkgSGA pushes: MET (LIB 1430, 1440).
2. Part (2) gate cure loop: MET by reading (LIB 1826, 1830, 1843): rfs only when not cured and the answer is CHANGE; reason text as planned; live:false.
3. Part (3): MET by existing code: LIB 1641 writes every E-APPLY item UNCURED "not counted on this row ..." with the refusal reason (W4 11056). Note N1: the row also says "if left uncured there it is counted in drv_uncured", which is no longer true for an rfs item after part (2).
4. Packing: 49 MAP modules rebuild to n and parse; 13 modules change; sha header 489fe495c0b318a6 equals the computed sha; only Shared Library changes; connections equal.
5. TEST (plan): sol62 gate answers of 41822, rows 52585 and 52586 RECORD-ONLY, drv_uncured not raised, count stays 1; controls silent item and pkgRCT refusal. NOT RUN (W4 11051 2f). Criterion not met.
6. Child: the child MAP serves Gate Build/Record, Alt and R2 Alt copies, Late Gate Builds and Alternate Merge modules; no child target was built.

## ASK 552 (t552.json): PASS WITH TWO CONDITIONS
1. Change (1) derivation: MET; test552.js rerun by W1: ALL PASS (argon derived STANDS; controls).
2. Change (2) code row, (3) mismatch item: MET in Judge Enforcer Build, Alt and R2 Alt copies.
3. Packing: 49 modules rebuild to n and parse; 20 modules change; sha header 30c4f128661d7228 equals computed; only Shared Library changes; target carries 547's lines (1286, 3035, 3090).
4. C1: build the one combined 547+548+552 library on the live base and its child target (child MAP serves Judge Enforcer Build, Alt and R2 Alt Judge Enforcer Build), and read back both.
5. C2: stored KEYSTONE words: STANDS 472, BROKEN 123, WITHDRAWN 50 (last judgment 828). The derived word is never WITHDRAWN, so a WITHDRAWN keystone would always be a mismatch and its item would lose today's own lines (often to "(none)"). A judge word other than STANDS or BROKEN keeps today's path unchanged.
