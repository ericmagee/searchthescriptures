# judge_fix5: fixes to ORACLE_DEBATE_V1 from the run 32284 reviews and the rulings of 2026-11-02 (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version 681c085a, read by GET on 2026-11-02 (data/workflow_live.json; the 67 code nodes in
  data/live_code/ equal judge_fix4/new by md5). base/ holds the live code of the 44 code nodes changed; new/<node>.js is built by `python3 patch.py`
  from base/ and lib/ (refp.js, close.js, citedin.js, blocks.js, sheet.js; anchored replacements that refuse on a wrong anchor count).
  `python3 flow.py` writes flow/nodes.json: 10 nodes added, 9 links removed, 20 added.
- write_package.py: one guarded PUT (base md5 of all 44 nodes; live connections and node count equal the base read; added nodes absent; links to
  remove present; planned links checked). Run only with --dry: write_dry.txt (guards passed; 481 links after, 470 before).
- sql/derive_debate_outcome_g10.sql: NOT APPLIED. Live definition kept in sql/derive_debate_outcome_live.sql (md5 2c39766e...).
- The database was read with SELECT only (data/run32284.json, data/enforcer_log_32284.json, data/kjv_32284.json; 32255/32266 copied from judge_fix4).

## Changes
- G1 D4 Build and C4 Build carry the defender's round 1 DECLARED CHAIN verbatim and the [DR3] C list (C4P.declared, C4P.cblocks), with "keep these
  numbers". C4P.renum also reads "under my own numbers", "in the order the challenger's blocks answer", "have not seen the text of my round 1
  declaration", and compares each close label's words and verses with the declared links and the [DR3] blocks. Note: "the close round's numbering does not govern".
- G2 K-G9 (citedin.js; Panel/Alternate Payloads, Extract Independent Verdict; cure in the 14 cure nodes): every verse of each ledger "cited in" line
  needs `PRESSED: <ref> -- [round] -- "<quote>" -- UNANSWERED | ANSWERED IN [round]` or `NOT PRESSED: <ref>`; the quotation must stand in the round, the
  round must press that side, ANSWERED IN must name the verse (ruling 376). A PRESSED/UNANSWERED verse must be in the count line (count >= 1).
  Cure: the ruling lines, CORRECTED COUNT and STANDING (ruling 372) or a re-ruling, plus RESPONSE; cureSet/recompute write it. Judge prompts require the section.
- G3 C4P.press: sentences in either close that grade or press the other side are DISREGARDED, printed beside the close (Panel Build, BIV, Build
  Synthesis, Format Markdown), recorded on D4/C4 Extract and by a review line (AUDIT v26 CLOSE-ROUND GRADING CHECK).
- G4 Panel Check records reason (error, timeout, refused, empty reply, unreadable), HTTP status (on error only; not exposed on a 200), reply length,
  retried; panel_substitution carries them (failure_kind values unchanged: the RPC checks them). One line in the header, the Result table and the reserve's row.
- G5 REFP, one parser (39 nodes carry it): ledger (PWL), close checks, citation scan (multi-part references, matched part by part), K-G4/cureRefs, cRefs, K-G6/K-G9.
- G6 escapes removed in the pre-check and the citation scan.   G7 Quote Compare `const HYPHEN_JOIN=false;` (Quote Report follows it).
- G8 Format Markdown: "**Outcome:**" first, with one computed line when verdict and outcome differ.
- G9 nodes "Panel Judge 1 Empty?" (IF: no error and no content) and "Panel Judge 1 deepseek retry" (same parameters, credential, timeout 900000,
  onError continueRegularOutput, no retryOnFail); Panel Check, Panel Payloads and Panel Tokens read the retry when it ran. Dormant after G12.
- G10 S-D also reads "guards bind / should bind / run against the defender"; new S-F "pressed nothing new" against the C4 and G3 findings; SQL: chain marks from the counted seats' majority at the first stamp.
- G11 VERSE SHEET: 8 HTTP nodes "<round> Verse Sheet" (kjv_verses, one call, URL <= 7,000 chars as Citation Scan) before every Build; the Extract of the
  previous round (Init with Guards for round 1) plans the request with REFP; the Build appends the rows as stored to the last user message. Cap 150 verses
  or 24,000 characters; every verse left off is listed. Round 1: only the Oracle seat, from its served rows.
- G12 Init Seats: DeepSeek out of the panel, reserve and alternates (NOT_PANEL); single judge, synthesis and diagnostic unchanged (first free seat of ORDER).
- G13 every rule copy: UNEXHIBITED includes "fewer than two prior layers (the burden rule, the same in every round)"; K-LB (blocks.js) marks a link-round
  block with fewer than two layer kinds that the count does not include; cure: counted, or a STATEMENT quoting the block's round with two kinds.

## Tests (test/)
compile_out.txt (44 compile); unit5_out.txt (133 fixtures, 0 bad); replay5_out.txt (32255, 32266, 32284: base, new, new without K-G9/K-LB, new without
K-G9); enf5_out.txt (all 67 enforcer rows; base and new agree on every row); cite5_items.json; sheet5_out.txt; pairings5_out.txt; sql_g10_out.txt.
Limits: 32284's stored panel texts are post-cure (F1 rewrote them), so the replay cannot re-raise Gemini's original K-G4/K-G3 (the enforcer rows are
re-checked instead); stored judgments predate the CITED-IN form, so K-G9 fires on every stored seat; Find Words is not emulated for 32284.
