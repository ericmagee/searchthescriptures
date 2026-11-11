# W1 grade of pkgRRT (W2, Wall 4979): PASS WITH LIMITS
Parent parent_s141_RRT.json sha256 f3dd061042bbd2b2 (checked) against fetchback_live_s141.json. Claim and plants: Wall 4982. Scripts rrt_diff.cjs, rrt_r7.cjs; output rrt_out.txt.
- R8: 418 nodes; only the 6 named nodes differ (each Build +400, each Record +126 = +1,578, equal to W2); connections equal; all compile. The three Builds are equal under the name mask.
- 35173 Alt Reread Build: the old Build reproduces the stored request exactly; new: ids 14 to 10, request 55,341 to 48,852 characters; no RETRACTED line is sent; the 4 retractions (grok S8, S10, S12, S14) go to not_checked with the pkgRRT reason.
- R7: with only the 4 retractions flagged, the Build skips and the new Record writes 4 rows (old Record: 0, dropped).
- Plants (the Build's own test): set aside "RETRACTED: D1 vs C3", "RETRACTED: D1 vs C3 -- reason", "retracted: D1 vs C3", "**RETRACTED:** D1 vs C3". Asked: "D1 vs C3: STANDS ... RETRACTED: ..." (correct), "RETRACTED -- D1 vs C3" (R4), a bare "RETRACTED", "- RETRACTED: D1 vs C3".
- LIMITS: R4, a bare "RETRACTED" and a bulleted "- RETRACTED:" are still sent (how often stored lines take these forms is NOT measured by me; W4 found 8 retraction rows, all set aside). On the skip path the rows carry judge_model null (no model map is read there). Alternate Records write seat_role panel, as before the package.
