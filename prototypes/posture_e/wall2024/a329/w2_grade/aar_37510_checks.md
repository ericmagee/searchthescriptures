# W2 after-action checks for run 37510 (live 67e89720, saved 16:06:28Z). Prepared before the run ended, from stored rows and commits only.
No n8n read until the run ends. Debate executions: status-only reads. Everything else from debate_* rows.

A. Version. After the run, confirm 67e89720 equals a329 target_329 (W4 6991, which I graded on s220 b799dd0b). List any node that differs.
B. ASK 330. For each K-UNX item in the 37510 judgments:
   - the send-back uses the new assumed-fact wording (never "ASSUMES: <that fact> and quote the block's [L1]");
   - for any STATEMENT in STEP / ASSUMES / ROWS GIVE form, check the cure status by hand: STEP verbatim from the side's rounds, ROWS GIVE words in the cited verse (live KJV), ASSUMES one given fact;
   - list any AUDIT v55 line.
C. ASK 331. For every refused cure in debate_enforcer_log for this run:
   - an "OPTION A (ASK 331" reason appears only on a CHANGE TO whose grade word and count fields are identical (rerun __oa331 on the stored line pair);
   - no OPTION A on a gate row that was not applied, or on a K re-read item (item 8 limits);
   - drv_uncured per seat equals the counted rows minus the OPTION A rows;
   - list every seat removed and its removed_rules.
D. ASK 325. List every E-CLOSECON row. For each "NOT CONFIRMED (other side's words)", hand-check that the earlier quote is the other side's own words and that the flagged side only quoted or attributed it in the same sentence (P11 rule). For each CONFIRMED row, run r325c on the stored rounds: it stays CONFIRMED.
E. ASK 327. debate_removals rows for 37510: removed_rules equals my independent parse; alternates_tried parses; NULL only by the fail-safe.
F. ASK 328. alternate_reply rows for 37510: each failed row's reply_error ends with one USAGE line in the fixed form; success rows have NULL reply_error; the ALTERNATE TRIED line in verdict_raw keeps today's form.
G. ASK 329 TRIAL.
   - l2_trial is present; there is one AUDIT v56 line; the Format Markdown section is present when items exist.
   - Counted path untouched: l2.counts equals a PRE replay of L2 Count Plan (s220 code) on 37510's stored rounds.
   - Hand-check each NOT COUNTED / REVIEW / NUMBERING PAIR item against the 6988/6990 rule (B1-B6, R2, R2b, R3); the R2b reason must not say cross-language.
   - R3 (open limit): count the items whose reason says the pressed or [L1] verse was not read. If there are none, state that R3 is still unexercised. If there are any, hand-check each against Cited Verses.
   - Pair rows (open limit, traced 16:15 CST): 37372 rows 111, 115 and 116 do not print because the live check already marks them NOT COUNTED, and the trial reads COUNTED tags only. So NUMBERING PAIR can print only for a tag the live check counts (row 110). For 37510, list each H2029 or H2030 tag with its live status and its trial status.
   - (6994 row 116 Isaiah 8:3 finding WITHDRAWN at Wall 6995: the Isaiah 8:3 ANSWER tag is COUNTED on live; row 116 is the Isaiah 7:14 tag.)
H. Model settings. From stored rows only: the USAGE lines and any max_tokens shown match the defaults; no setting appears that the operator did not order.
I. Outcome. debate_results outcome, verdicts, drv_uncured and removals compared with 37372 (the sol removal of 2 to 1; the hydrogen tries).
