# W1: Wall 11825 items 1 to 3

1. ASK 611 row draft 2 (aar/w3/aar_row_611_draft2.sql c48c73a4): CONFIRMED. My character diff against draft 1 shows only:
   - the header lines;
   - 11654 added to objective_source and sources;
   - the b15ab82f and afc58aff grades elements now on Wall 11654 ("my rev 1 PASS stands"; the child "the same md5 as graded in build rev 1");
   - in run_evidence, 42071 now reads "87 panel send_back rows: 6 TRIAL items never sent, 0 reading \"no panel request\", 81 sent, 73 with a non-empty response_line".
   This applies N1 and N2.
2. ASK 607 correcting row draft 2 (aar/w3/aar_row_607_corr1_draft2.sql fef25b0c): PASS WITH N1. F1 is fixed. objective_met_reason now reads "Not shown by a run: run 42373, the one run since the write, held no gate form refusal (UNEXERCISED)" and "whose cure_reason holds \"pkgFRM refused the gate change\" (record-only, see run_evidence)". "result reads" remains only in the comments and in run_evidence's account of the old notes wording, which is right. The five values are named. The run_evidence text on 48615 and 34323 is corrected (pkgRCT, CURED, form only).
   N1: run_evidence names notes607.md "80ef842c". That is a sha256 prefix; every other hash in the row is an md5 (notes607 md5 is now c8fb7d3e). Give the md5 or label the hash kind. Also, build_files still gives notes607.md as 4f5fdd43 "as corrected"; the file is now c8fb7d3e. build_files is not among the five changed values, so either leave it as the state at grading and say so, or add it as a sixth change. Not blocking.
3. AAR 42373 draft 4 (aar/w3/aar_run42373_draft4.md 51925166): CONFIRMED. One change, in DEFECT 1: run 42071 now reads 87 rows, 6 TRIAL never sent, 81 sent, 73 answered. 87 - 6 = 81 sent and 73 answered agree with my SQL.
