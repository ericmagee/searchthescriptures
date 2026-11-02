# judge_fix6: fixes to ORACLE_DEBATE_V1 from run 32293 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version 6ff18a54 (confirmed by GET on 2026-11-02, data/workflow_live.json; 67 code nodes in
  data/live_code/). base/ holds the live code of the 30 code nodes changed; new/<node>.js is built by `python3 patch.py` from base/ and lib/
  (status.js, layers.js, blocks.js, citedin.js, close.js; lib/old/ is the judge_fix5 text the patch replaces, anchored, refusing on a wrong count).
- No node or connection is added or removed. write_package.py: one guarded PUT (versionId, base md5 of all 30 nodes, live connections and node count
  equal the base read). Run only with --dry: write_dry.txt (guards passed; 481 connections, 262 nodes, unchanged).
- Database read with SELECT only: data/run32293.json, data/enforcer_log_32293.json, data/kjv_32293.json (46 cited chapters). 32284, 32266, 32255 copied from judge_fix5.

## Changes
- H1 One layer reader, drvLayers (lib/layers.js), for K-B, K-LB (lbKinds) and every cure check (drvKinds). A tag runs to the next layer tag or a blank
  line; [L2] accepts a plain-letter source word with its meaning anywhere in the tag's text ("kata sarka (according to flesh)", "(osphys, loins)").
  K-LB never marks a premise the seat ruled VOID (lbVoid: "Premise n is VOID", "Premises 1 and 5 are VOID", "each/all/the six ... VOID").
- H2 Quotations in single marks are read (DRV_QUOTE, the cure's stmtQ). A refused K-LB statement names its step (1 statement, 2 quotation, 3 layer
  kinds). Row 81 (single judge, premise 4) was refused at step 3: the old reader read L3 only, because "[L1] \"1 Chronicles 28:6 \"And he ...\"\""
  has nested double marks and the [L2] word did not stand first.
- H3 Renumbering flag (C4P.renum): a stated numbering, a number above the declared ones, or a label that shares no verse and no distinctive word with
  its own declared link (or [DR3] block) and scores 3 or more on another. Labels stop at the next heading or label; "C5, C6" lines are skipped.
- H4 Press check (C4P.press): every sentence under an other-side label, an other-side heading or bold lead, and any sentence that grades the other side
  (refused, fails, does not stand, inference ... not state, concedes, breaks, not one of); not ANSWER blocks, own-position sentences, or a sentence
  that only reports the other side's own words (its words stand in order in one sentence of that side's rounds).
- H5 K-G9: "NOT PRESSED: <ref> -- <reason>" (also after ";", ":", ",", in parentheses); no reason of three words is not a ruling. "K-G9 PASS: n verses
  ruled" is written into the seat's text. Judge and cure prompts ask for the reason.
- H6 Citation Scan item cap raised from 300 to 1000 (no paging; an item past the cap is NOT CHECKED with that reason). The Luke 1:34 flag came from
  pairing the quotation with the nearest reference before it; the last earlier reference of the same sentence (not a parenthesised citation) is now
  the fallback, tried only when the first fails. Every NOT CHECKED carries a reason, kept in the stored citation items with rebound_from.
- H7 Failure Salvage copies each round Extract's cache_diag line into review_notes.
- H8 ENF_STATUS (lib/status.js, one text in 17 nodes): LIVE K-B, K-C, K-G1, K-G3, K-G4, K-G6, K-G7, K-G8, K-N, K-S, K-SC; TRIAL K-LB, K-G9, C4-RENUM,
  C4-PRESS. drv_uncured counts LIVE items only (Panel Payloads, Alternate Payloads, Panel Cure Check, Alternate Merge). A TRIAL item is still sent to the
  cure; its report line and enforcer row say "TRIAL rule"; it raises no other item's required count (kNeed).

## Tests (test/)
compile_out.txt (30 compile); unit6_out.txt (88 fixtures, 0 bad); replay6_out.txt (32293, 32284, 32266: base and new); enf6_out.txt (all enforcer rows);
close6_out.txt (H3 flags, H4 hits quoted); cite6_out.txt (32293 citation chain, base and new); kb_diff_out.txt (K-B kinds, base against new, 17 BROKEN lines).
Limits: Find Words is emulated over the 46 cited chapters only; stored judgments predate the K-G9 reason form, so K-G9 (TRIAL) fires on most seats;
32284 and 32266 replies hold no K-G9 or K-LB answers. The [L2] reader is more lenient ("the house (of David)" is read as L2); K-B changed on one stored
line only (32266 GLM D6 vs C6, a true "prin e sunelthein (before they came together)" now read).
