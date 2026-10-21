# Revision 8 step 3: how to rebuild and rerun (no model call, no flow run)
1. Rows: SQL, saved as five.json (md5 73ae11e1 at 2026-10-21 13:36Z):
   SELECT json_agg(json_build_object('tok',d.run_token,'dr1',d.claude_r1,'dr2',d.claude_r2,'dlink',d.engine_r3,'cr1',d.engine_r1,'cr2',d.engine_r2,'clink',d.challenger_r3,'single',d.independent_verdict_raw,'judges',(SELECT json_agg(json_build_object('seat',j.judge_seat,'tag',j.verdict_tag,'ds',j.defense_standing,'raw',j.verdict_raw) ORDER BY j.id) FROM debate_judgments j WHERE j.debate_id=d.id))) FROM debate_results d WHERE run_token IN ('ODV1-27433-0lt3ljxt','ODV1-27177-z7igrc2p','ODV1-27191-bbe6uj76','ODV1-27208-ekasifv0','ODV1-27259-75fg8o6t');
   (key names: dr* = defender rounds = flow tags CR*; cr* = challenger rounds = flow tags DR*.)
2. Nodes: every Code node's jsCode from the active version (95f04001), one file per node; patch each: python3 patch_rev8.py <in> <out>.
   Expected anchors applied: 21 in each cure node (items 1-2, the K-G5 helpers, item 5 and its two 6904 (c) anchors) (Cure Build/Normalize/Check, Panel Cure Build 1-3, Panel Cure Normalize 1-3, Panel Cure Check,
   Alternate Build, Alternate Cure Build, Alternate Cure Normalize, Alternate Merge); 2 in each round extract (D1, C1, D2, C2, D3, C3 Extract);
   1 in Panel Payloads, Alternate Payloads, Extract Independent Verdict; 4 in Format Markdown (item 5); 0 elsewhere.
3. Modules: from Panel Payloads cut "const DRV_REF=" through the end of drvCheck, from Cure Check cut "const CURE_RULE=" through the end of
   cureReport, from Format Markdown cut "const drvRead" through its end, concatenate, export {drvCheck,cureVerdicts,cureAsk,cureReport,drvRead}; once from the live files (mod_live.js), once from the patched (mod_new.js).
4. node harness_rev8.cjs five.json mod_live.js mod_new.js  -> HARNESS_RESULT.txt (expected: HARNESS PASS).

## Amendment for 7194 (git after be398cb)
- K-G5 defect 1: a SHORT quote must sit in the link round's answer to the verse: 300 characters before to 1,200 after each naming, inside its LINK block (cureNamed). The unrelated same-block sentence 7194 named is now UNCURED (harness case).
- K-G5 defect 2: cureRefs reads comma lists, ranges, short book names (Matt, Jer, Mt...), slash pairs, and a bare chapter:verse inherits the last book named. Detection over the 56 lines: 21 lines, including the 10 7194 names.
- Note 3 (refusal check limit) and note 4 (cost) go into the operator text: the refusal check is one exact provider sentence measured on one row (27177); other wordings pass as a round. Cost on the five rows: judges sent to a cure call, live 18 of 20, new 19 of 20; the new items ride the same cure call as the old ones, so the added cost is mostly a longer ask and answer, plus one call in twenty.

## Amendment for 7195 D3 and 7196
- Item 5 now follows 6904 (c) as written: a STATEMENT is run through the item's own check and cures if it passes (K-B two layer kinds; K-G1/K-G4 a named pressing round quoted, plus the link round's answer where K-G5 applies). ITEM5_judge_statement.md quotes 6904 (c) whole.
