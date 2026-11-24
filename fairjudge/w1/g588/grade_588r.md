# W1 grade: ASK 588 R, the question round record (W4 Wall 11403; commit e3e84ce4; target 28168cf1; migration mig588r.sql 5619fdb8)

GRADE: PASS. RULES READ: build rule (touched nodes only, no model settings); scope rule; my 11393 and 11401.

1. The mistake is confirmed. On the live graph, Build Save Body runs before QR Merge (t588r T1.1 control). My 11393 grade missed this, because t588 marks nodes executed by name and never tests the order. I count it as my miss too.
2. Base: W4's base (79e88f53, versionId 06ba53ad) equals my own fetch of live 06ba53ad node for node, connections equal. Settings: executionOrder v1.
3. Rebuild: build588r.cjs gives a target equal to W4's 28168cf1 node for node, apart from the ids. No existing node changes; 2 new (QR Record Build, QR Record). t588r: 11 PASS on W4's target.
4. The path:
   - QR Merge feeds both Panel Judges Prep and QR Record Build.
   - Under executionOrder v1 the upper branch runs first. QR Record Build sits at y -660, above Panel Judges Prep at y 304, so the record is written before the judges are seated, and a later stop in the run does not lose it.
   - QR Record Build catches its own faults, giving a SKIPPED record, and is set to continueRegularOutput.
   - QR Record continues on error.
   - run_token comes from Init Seats. On a regrade it is the original run's token (TOK = regrade_run_token). Init Seats outputs regrade and dry.
5. Migration:
   - one new table with RLS on, and one security-definer insert function;
   - no drop, update or delete;
   - execute for service_role and lab_seat only, which matches record_debate_row_tokens (Write Tokens' RPC: prosecdef true, execute {service_role, lab_seat}, checked in SQL);
   - QR Record uses the same Supabase credential as Write Tokens;
   - the table does not exist yet (to_regclass null), so the migration is not applied.
6. N1 (for the card and for W3's 14.0 entry): a DRY regrade now writes one row to odv1_question_round_log, marked dry=true. Manual 14.0 says a dry regrade writes only debate_replay_judgments. The card and the manual must say this.
7. N2: the dead Build Save Body line stays (scope). The card says it never fires.

OBJECTIVE MET: yes. The questions and answers are stored on every run in which the round runs, live and regrade.
