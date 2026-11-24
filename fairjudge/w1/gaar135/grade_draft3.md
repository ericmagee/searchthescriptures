# W1 grade: aar/w3/aar_rows_135_142_corrections_draft3.sql (md5 1fb4e14a, commit 3f4b67d3)
VERDICT: PASS.
D1 met: eight ask_aar_builders inserts, each after its snapshot insert, snapshot_id found by prior_row and rev, builder_seats and sources copied from the latest builder row of the prior snapshot, written_by = truth.session_id (required by ask_aar_builders_before_insert). Columns and NOT NULLs checked against information_schema.
N1 met: the 11146 element is gone from the 562 grades; 11146 stays in sources.
N2 met: 11191, 11192, 11193 in the sources of the 549 and 561 rows.
Diff against draft 2 read in full: no other change. 42 jsonb literals parse. All draft 2 verifications stand.
