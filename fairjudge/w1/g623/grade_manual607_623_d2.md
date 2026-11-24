GRADE engine manual entries ASK 607 and ASK 623, draft 2 (manual1123/w3/a607_623/em_pairs_607_623_draft2.json 6721facf, notes 2f11423d, commit 6e76af04): PASS WITH N1, N2. COMMIT: this file.
RULES READ: section 0, part 00.1 v247 5bc72deb (body law: rules and mechanics, no provenance, one home per rule and per changeable value; preview before write; readers preview the same pairs); the ASK 549 entry in 11.2; my build grades and readback of 607 and 623 (7a040c29, 457b39ed); Wall 11744 to 11746.
OBJECTIVE MET: yes. Both entries say what the live writes do, what is unchanged, what is shown offline and what a run must still show.
STANDARD (ASK 599): not code; not applicable.

Preview, my own (pairs applied in SQL to the live parts, each old text counted before its replace):
- 11.2 v242 6b4d83aa (14,690): 1 pair, count 1, to 6338737261e957a56d5927b5c2889587, 16,684. Equals W3.
- 10.0 v308 b2c1b6de (54,641), draft 1: 5 pairs, 1,1,1,1,1, to 2bedb185..., 58,558. Draft 2: 5 pairs, 1,1,1,1,1, to 990527b69689bc65eee56201bf8bedeb, 58,677. Both equal W3. Draft 2 differs from draft 1 only by one sentence in the 623 Judges item.

Facts checked line by line against live:
- 607 item 1: the refusal push and tag, as in my readback; pkgPS, pkgSGA x2 are the three ASK 549 names. Item 2: reader unchanged, Gate Record, Alt Gate Record, R2 Alt Gate Record carry it (MAP entries touched). Items 3, 4, 5: as C1 to C4, which I re-ran (luna 1122, rows 29285 to 29295, 11 to 0; 25 counted, none on another kind).
- 623: live Init Seats ENG holds hydrogen and neon (mc of own name); the refusal list is built from Object.keys(ENG), so the quoted list (pair 3) is what the node prints. FAM_PANEL neon google; JFAM_I and JFAM neon openrouter in the five nodes. 12 debaters, 132 pairings, 128/4, twelve pairs with spark, qwen4max, sonnet and enforcer glm, neon v hydrogen enforcer luna: all in out_t623.txt, which I reproduced. dash_launch_odv1 reads dash_debaters. odv1_record_panel_alternates admits an active openrouter engine row and refuses by family (G1), so neon is admitted and refused under a Google debater, as written. Token figures equal ask623/w4/chk summaries (10,870 of 14,453; 11,922 of 16,582). The added sentence (alternates reached with no save) is right and answers W4's correction.

N1: 607 item 4 states a changing count, "25 counted form refusals". Its home is the table. Keep "the stored record holds none" and drop the count, or say "at the write".
N2: the Seats item states provider, role and active of the neon row, values whose home is model_config, while the notes leave the token limit out for that same reason. Either drop them or accept them as the row's identity; be consistent.
Neither changes a rule; both may be done at the write card without a new grade if the md5 is re-previewed by me.
