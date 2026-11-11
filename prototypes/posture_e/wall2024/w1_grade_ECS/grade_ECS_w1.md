# W1 grade of pkgECS on s141 (W2, Wall 4974): PASS WITH LIMITS
Parent parent_s141_ECS.json sha256 37b6c018c88aea5e (checked). Base: fetchback_live_s141.json (ff40f39f). Claim and plants: Wall 4978.
Scripts: ecs_src.cjs (diff and rebuild of old/new sources from the two files, not W2's src/), ecs_run.cjs (stored replay), ecs_plants.cjs.
- Q6 map: 42 stubs rebuild to MAP length and compile; header sha equals computed. Nodes differing: Judge Enforcer Build, Alt Judge Enforcer Build,
  R2 Alt Judge Enforcer Build (never-run name list gains Close Enforcer Record and Judge Contradiction Record) and Shared Library. Rebuilt sources
  differ only for those three builders: +1,417, +1,421, +1,421 (equal to W2). LIB lines changed 3068 (loop) and 3131 (alternate code rows);
  2929 and 2930 (__cc, __ecC) are added to the panel builder's MAP. Panel rows carry seat_role panel (MAP literal), alternate rows alternate.
- Stored replay, 12 exports, all three builders: E-COL set aside 34626 6, 34703 8, 34726 4, 34780 3, 34852 4, 35067 16, 35173 6; elsewhere 0.
  Q7: every set-aside item has exactly one NOT ASKED code row per judge; every non-E-COL item still asked; asked plus set aside equals live.
  Old replay equals the stored ids on 35067 and 35173 (older exports ran older code).
- 35173 alternate builder: grok's 10 E-COL items are CHALLENGER LINK BROKEN or FORCED; none is set aside, correctly (confirmed break is DEFENDER 5).
- Q4 no Close Enforcer Record and no Judge Contradiction Record: 6 of 6 asked, no error. Q5 flagged but not confirmed: 6 of 6 asked.
  Q1 confirmed DEFENDER 3 instead of 5: D5 lines asked. Q2 confirmed CHALLENGER 6: panel DEFENDER D5 lines asked; grok's CHALLENGER LINK BROKEN
  lines on C6 set aside, its FORCED lines on C6 still asked (Q3).
- LIMITS (W2's, confirmed): a judge's other ground on a set-aside line is no longer checked; 3 correct AGREE rows in 34726 would not be written.
