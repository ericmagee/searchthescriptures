# ASK 541 PLAN rev 1: store record-only send-back rows as RECORD-ONLY, not UNCURED

Planner and writer of this plan: W3 (seat 33, session_01H1X3ANsGiMnhnbkfphocmo).
Operator ruling: Eric chose "Yes, relabel" at 10:35 CST on 2026-11-23, relayed by the coordinator: "Plan ASK 541 so that record-only send-back rows (E-REREAD, E-PREM "not counted", E-ANS "record-only until promoted" and the like) are stored under their own status instead of UNCURED. No count may change. Run 41418 (Wall 10708) is the evidence."

## 1. OBJECTIVE
A send-back row that is record-only by the engine's own text is stored with cure_status 'RECORD-ONLY'. A row the engine counts, or may count, keeps 'UNCURED'. No drv_uncured value, seat removal, outcome or judge_fault_ledger row changes.

## 2. ROLES
- Planner: W3 (seat 33).
- Grader: W2 (seat 32), the one grader.
- Builder: W4 (seat 35). The write goes only on Eric's press of W4's write card.

## 3. SCOPE
Changed, and only these, all in the database:
1. Constraint debate_enforcer_log_cure_status_check: it allows 'RECORD-ONLY' as well as NULL, 'CURED' and 'UNCURED'.
2. A new function, public.enforcer_status_stored(st text, why text) RETURNS text. It is IMMUTABLE and holds the rule in section 3.1.
3. public.record_enforcer_log: one token changes. `r->>'cure_status'` becomes `public.enforcer_status_stored(r->>'cure_status', r->>'cure_reason')`. Nothing else in the function changes.

### 3.1 The rule
The stored status is 'RECORD-ONLY' when all three of these hold. In every other case it is the status the engine sent.
- (a) The engine sent 'UNCURED'.
- (b) cure_reason holds one of these three engine-written markers (a closed list):
  - M1 `RECORD-ONLY: nothing is sent back`, the E-REREAD rows (pkgVP1; Reread Record, Alt Reread Record and Assume Check Record in the engine; R2 Alt Reread Record in the child).
  - M2 `CURE (record-only until promoted)`, the E-ANS and E-PREM rows (Library line 2789).
  - M3 `RECORD-ONLY here`, the LATE E-GATE rows (Library lines 3478 and 3479).
- (c) cure_reason does not hold `counted in drv_uncured` anywhere, negated or not. Any such row stays UNCURED. This covers the ASK 523 DLU rows, which count E-ANS rows and append that phrase, and gate pointers like 41418 row 51465.

### 3.2 Markers left out on purpose
- "not counted (Commitment 7)": this is the judge's own text, quoted inside cure_reason. On 41418 row 51636, the enforcer answers it "(right: COUNTED)". The E-PREM rows are caught by M2 instead.
- A bare "not counted": sol's E-COL and E-HOLD rows (51423, 51426, 51427, 51428) say "not silence, not counted", but they are ENFORCED (pkgECF and pkgUND).
- "record-only reading" on the ABS rows: this text describes a reading, not the row.

### SEARCH
- Live Library at engine 04450043 (lib_0445.json): every line that sets UNCURED (1642, 1754, 1932, 2472, 2476, 2789, 2791 to 2808, 3478, 3479, 3493) and every line holding the markers.
- Engine 9240349c and child 334f0518 node JSON: every node that touches enforcer_log. The only DB write is Write Enforcer Log, which posts to rpc/record_enforcer_log. No node reads debate_enforcer_log back through REST.
- Database:
  - Every public function whose source holds cure_status: only record_enforcer_log and jfl_from_log.
  - Every public function holding UNCURED: also jfl_counted and jfl_block. derive_debate_outcome and aggregate_debate_panel hold only drv_uncured.
  - Views holding enforcer_log or UNCURED: debate_removals and odv1_drv_removals, through drv_uncured only.
  - No materialized view.
  - The constraints and triggers on debate_enforcer_log: jfl_from_log (on cure_status and cure_reason) and dfl_from_log (E-CLOSECON only).
- Stored rows: all 41418 rows, and every UNCURED row in debate_enforcer_log (section 4, criterion 2).

### NOT SEARCHED
- Outside SQL readers of the table: the dashboard artifact, the ASK AAR checks and the seats' own scripts. A reader that tests cure_status='UNCURED' will no longer see RECORD-ONLY rows, which is the purpose of the change. A reader that tests cure_status<>'CURED' will see them unchanged.
- Workflows other than the engine and the child.

### NOT IN SCOPE
- (a) No backfill. The 273 stored rows that the rule would relabel keep UNCURED. A backfill would be its own write card. jfl_from_log fires on UPDATE of cure_status, and on these rows it runs the DELETE branch, which finds no ledger row (criterion 2).
- (b) The transcript. Format Markdown prints the engine's in-memory status, which stays UNCURED.
- (c) The engine and the child. No n8n node or Library line changes, so no count can change.
- (d) jfl_counted and jfl_block are unchanged.

## 4. CRITERIA and DONE
1. DRY RUN on 41418, with no write. Apply the rule as a SELECT to the 14 stored UNCURED rows.
   - These 8 give RECORD-ONLY: 51401 (E-ANS), 51422 (E-PREM), 51430, 51434 (E-REREAD), 51636 (E-PREM), 51641, 51642 and 51643 (E-REREAD).
   - These 6 give UNCURED: 51423, 51426, 51427, 51428 (sol's ENFORCED E-COL and E-HOLD), 51442 (gemini K-G7, a cure row in the ledger) and 51465 (sol62's E-APPLY gate pointer, "counted in drv_uncured").
2. HISTORY, with no write. Across all stored UNCURED rows, the rule relabels 273: E-ANS 56, E-GATE 2, E-PREM 86 and E-REREAD 129. None of the 273 holds "counted in drv_uncured", and none is jfl_counted, so the ledger cannot change. W3 measured these figures at 10:4x CST on 2026-11-23; W4 re-measures them in the build.
3. LIVE TEST, with no row kept. Run a DO block that calls record_enforcer_log with 5 rows under run_token 'TEST541-x'. The token does not match '^ODV1-', so the ledger trigger inserts nothing.
   - The rows: one each for M1, M2 and M3 sent UNCURED; one M2 row that also holds "counted in drv_uncured"; and one row sent CURED.
   - The block reads back the five stored statuses: RECORD-ONLY, RECORD-ONLY, RECORD-ONLY, UNCURED and CURED.
   - It then raises an exception carrying them, so the whole block rolls back.
   - A query after the block finds 0 rows under 'TEST541-%'.
4. READBACK after the write:
   - The constraint definition.
   - enforcer_status_stored's definition.
   - record_enforcer_log's definition, whose diff from live/record_enforcer_log.sql (md5 8d4cde99) is exactly the one token.
   - The engine (04450043) and child (334f0518) versions, which must be unchanged.
5. DONE: criteria 1 to 4 met and graded, and the write card pressed. The first run after the write shows RECORD-ONLY on marker rows, and each seat's drv_uncured equals what that seat's counting AUDIT lines say. Until that run, this is UNEXERCISED.

## 5. WRONG-IF
1. A row whose cure_reason holds "counted in drv_uncured" is stored as RECORD-ONLY.
2. A row that jfl_counted would have put in judge_fault_ledger as UNCURED is stored as RECORD-ONLY, so a ledger fault is lost. History shows 0 such rows (criterion 2).
3. An insert fails the CHECK, so a run's enforcer log is lost. To prevent this, the constraint goes in before the function.
4. Any drv_uncured value, removal or outcome changes. The engine is untouched, so this would mean a reader outside the search reads cure_status.
5. A marker turns up in model-written text inside cure_reason (a TO line or an ENFORCER reason) on a counted row. Criterion 2 found none in 273.

## 6. RUN EVIDENCE
Run 41418 (debate_results ODV1-41418-isj5xh5m): 14 UNCURED rows, of which 8 are record-only by their own text (W3, Wall 10708 and 10719). That is what misled the readings at 10685 and 10690.

## 7. INPUTS IN GIT
- ask541/w3/live/record_enforcer_log.sql: the live definition, md5 8d4cde991c806b921c0bc7deb8ceb46d (equal to md5(pg_get_functiondef) read at 10:4x CST).
- Live jfl_counted md5(pg_get_functiondef): 0f347459. jfl_from_log: d221a0bb.

## 8. STEPS
1. W2 grades this plan.
2. W4 builds the migration SQL, from the constraint, the function and the one-token edit in section 3. It runs criteria 1 to 3 (1 and 2 as SELECTs, 3 as the rolling-back DO block) and posts the build with md5s.
3. W2 grades the build.
4. W4 posts the write card. On Eric's press, W4 applies it (constraint first) and does the readback for criterion 4.
5. The first run after the write gives the proof (criterion 5).
