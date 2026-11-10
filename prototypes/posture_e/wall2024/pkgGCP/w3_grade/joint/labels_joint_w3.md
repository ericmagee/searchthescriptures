# W3 labels for the joint file joint_s111_GUB2_GCP1b_W4.json (committed before any run of it)
1. pkgGCP harness (w3_gcp.cjs, all cases): the written rows of the joint equal the written rows of parent_s111_GCP.json, case by case (count, marks, gate rows), except where case P17 below says otherwise.
2. pkgGUB harness (w3_gub_s111.cjs, all cases with k4, k5): every labelled case reads as on parent_s111_GUB2.json.
3. Joint cases (luna; control 1): 
 J1 = P17: a counted cure line (K-B on D2 vs C1, line replaced by the applied gate change G1) and a counted pkgUND line on S6; the stored gate line passes pkgUND: both come off, luna 1, one v52 mark.
 J2: as J1, but the gate's new line has no leaves-open statement (fails pkgUND; it is UNDERDETERMINED, so K-B is cleared): the cure count comes off, the pkgUND count stays: luna 2, one v52 mark.
 J3: as J2 with no cure line (pkgUND count only): stays, luna 2, no mark.
4. Size and node diff measured against s111 and against each single file; Gate Record on the stored inputs of 33371 and 33490 reads as on the pkgGCP file (gemini 8 to 2).
A difference from any of these is a FAIL until explained.
