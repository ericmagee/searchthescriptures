# Dry regrade of 34108: what the record must show for pkgR1 and pkgCSS (W1, 11:08 CST 11-10)

Mark each line MET, NOT MET or NOT REACHED. Version under test: live at the time of the run (s110 or later; record the version id and node count).
Both packages are live and unproven (two clean runs needed). Earlier list for items A and C: dryregrade_34108_checklist_W1.md (written for s94-era code; A2 there is the same D6 pair as S3 below).

## pkgR1 (12 three-copy nodes became Shared Library stubs; no source text changed)
- R1.1 No node fails with "rebuilt source is N bytes, expected M" or any stub error. The 12: Send Back Build, Send Back Record, Judge Enforcer Build, Judge Enforcer Record, each with its Alt and R2 Alt copy.
- R1.2 Each of the 12 that ran: its output equals the live full source run on the same input. W1 checks this offline after the run: rerun each node's s106 full source and its stub on the execution's own inputs (pkgR1/test_R1.cjs method), byte-equal required. A difference is a FAIL of pkgR1 whatever the verdict.
- R1.3 Nodes not reached are listed by name (R2 Alt copies run only on a second send-back; none ran in any stored debate). Not reached is not a pass.
- R1.4 Judge Enforcer Record rows and Send Back rows reach debate_enforcer_log in the run's one insert, same fields as before s107.
- R1.5 Run time per stub node: within a few ms of the pre-R1 runs (measured offline +0.49 ms per library node run). Record total execution time against 34299.

## pkgCSS rev 2 (closing enforcer called once per side; Record judges each side alone)
- S1 Close Enforcer Build gives two items, defender and challenger, each with only that side's candidates and four rounds; the Call node runs twice.
- S2 Each call's prompt is one side only: about 77,000 characters on average in the stored set (live single call was about 143,000). Record both sizes.
- S3 **The defender call returns CONFIRMED for DEFENDER LINK 6**: EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." against CLOSING [CR4] "Christ had no biological father." This is the pair the package was built for (34299 missed it with one combined call). W4's live test of pkgRLF2 replayed the stored 34108 defender replies and both confirm D6; the dry regrade must show it from a fresh call.
- S4 Close Enforcer Record: one row per side. A NONE writes NONE FOUND for that side; a failed call or a reply with no CLOSE-CONTRADICTION line writes NOT CHECKED naming that side, with an error. "none" is true only when both sides answered NONE.
- S5 With pkgRLF/pkgRLF2: round labels in the Record rows read as the side's own rounds ([3] = CR3 for the defender). A bare "[3]"/"[4]" is not lost.
- S6 If S3 is MET: the break follows. D6 reads DEFENDER LINK BROKEN in all 3 panel bodies and in the single judge's body; counts and verdict are recomputed (probe expectation HELD to BROKEN, RESULT CHALLENGER WINS); a send-back does not undo it.
- S7 W3 hand-reads every CONFIRMED closing line (ASK 10 option 1) and labels each true or false before the run is called clean. A false CONFIRMED that breaks a link is a wrongful removal on the scoreboard.
- S8 The challenger call: record what it returns. The stored 34108 record holds no challenger pair I would call a contradiction (my reading, not a check); a CONFIRMED there goes to S7.
- S9 DeepSeek enforcer fix note for this run (refresh rule): name it, or note that none exists.

## Pass for these two packages on this run
pkgR1: R1.1 and R1.2 MET for every node reached. pkgCSS: S1 to S4 MET, S3 MET, S7 with no false CONFIRMED. One clean dry regrade is not the two clean runs; it is the first.
