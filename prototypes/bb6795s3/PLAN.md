# BB-6795 step 3: undo and act script for the one publish of J2-J7 (Worker_A3)

Measured 14:02 CDT: flow moMxiV4Irg1uRBZN active af3c8f7c, 180 nodes; the eight nodes in nodes.txt read their LIVE md5;
CHECK = FORGED, STRAINED, SLACK; derive_debate_outcome md5 379e6e55; the three new columns absent;
marks FORGED 55, STRAINED 17, NULL 621 (693 rows). FORGED was 54 at 13:18: run 27208 saved row 0d80d311 at 13:22.

## Undo (written first): undo.sql, u4_derive_source_379e6e55.sql
U1 widen CHECK (if A6 ran); U2 republish af3c8f7c; U3 A6's rows back to FORGED; U4 derive source back (md5 379e6e55);
U5 drop the three columns (advisor's word only); U6 original CHECK (stops if a FOOTED row remains).

## Act, in order. Each SQL step: audit event after it, fetch-back stated in the act row.
- A0 `a0_precheck.sql` plus: no execution running; versionId = activeVersionId = af3c8f7c; node md5s as nodes.txt LIVE.
- A1 `a1_j4_widen_check.sql` (bb6819 step 1, unchanged): CHECK takes FOOTED, FORGED, STRAINED, SLACK.
- A2 `a2_j2_columns_and_derive.sql` (bb6822, unchanged): citation_check, citation_block; derive patched; new md5 recorded.
- A3 `a3_j6_column.sql` (bb6839, unchanged): defender_chain_mark with its CHECK.
- A4 n8n (Worker_E): the seven nodes in nodes.txt from their 85bd79b files onto af3c8f7c; draft; publish on the advisor's go. Record __T_PUB__.
- A5 `a5_publish_verify.py` (Worker_A3) on af3c8f7c and the new version: PASS required. Tested: live against itself FAILS on the seven;
  a simulated publish of the seven files PASSES; the same with one extra node changed FAILS.
- A6 `a6_j4_step3_rewrite_narrow.sql`: replaces bb6819 step 3 (its fixed 54-row list is stale). Every FORGED row saved before
  __T_PUB__ becomes FOOTED; refuses if a FORGED row was saved after it; CHECK narrowed. falsifier.sql before and after.
- Then (6853): ODV1-TEST derive rows; dry regrades of 27191, then 27088; the live run once approved.

## Why this order
The CHECK is widened before the publish, so a save from either flow passes. The columns exist before the new Build Save Body writes them.
The derive patch is inert until a row carries citation_check (all stored rows NULL). A6 runs only after the publish is verified.
