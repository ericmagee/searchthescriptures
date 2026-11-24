# ASK 571: one stored copy of the L2C sheet code, served from the Shared Library (W4, PLAN draft 1, built and tested)

DRAFT. Nothing is written. W1 grades; the operator approves the write on W4's card.
Ruling: the operator at 17:46 CST 11-23 ("can this be consolidated into a single library?") and 17:49 ("no, let's do it now, to avoid rework. we must Put efficiency over convenience."). ASK 565 and ASK 568 (approved 17:40) are carried inside this ASK, so 568 is not written separately.
Base: engine moMxiV4Irg1uRBZN d8292f62 (ASK 563 live), child MqQHRl7mQQ0z8QdT de9efc4e, library sha f24a5192c60cbc55.

## 1. OBJECTIVE
Thirty engine nodes each carry their own copy of the L2C code (the [L2] tag reader, the verse sheet, the count check). After this ASK the Shared Library holds the text once and each node loads it. The texts the nodes run do not change, except the six Builds, which gain ASK 565 and ASK 568 as approved. Expected effect: the 30 nodes shrink from 1,027,445 to 505,827 characters. The engine workflow file shrinks from 7,632,719 to 7,110,944 characters. A future fix to the sheet is made in one place.

## 2. ROLES
Planner and builder: W4. Grader: W1. Write card: W4's thread.

## 3. SCOPE
The block `const L2C=(()=>{ ... })();` in 30 engine nodes; the Shared Library of the engine and of the child (LIB lines appended, 7 MAP entries added, header sha reset). No other node, no prompt, no model setting.
SEARCH:
- engine d8292f62: `const L2C=` stands in 30 nodes plus the Shared Library. The 30 nodes and their texts (md5 of the block):
  - Extract b299e365, 13 nodes: C1, D2, C2, D3, C3, D4 Extract; C3G, C1B, D2B, C2B, D3B, C3B, D4B Extract.
  - Build 38744bf8, 6 nodes: D2, C2, D3, C3, D4, C4 Build.
  - Lexicon Plan 7f615d73, 6 nodes: D2 to C4 Lexicon Plan.
  - L2 Lexicon Plan 3885b8ed, 1 node.
  - Count Plan 8eac181f, 2 nodes: L2 Count Plan, L2 Gloss Plan.
  - Citation Scan dc5c8420, 1 node.
  - Quote Report c8bd04c5, 1 node.
- child de9efc4e: `const L2C=` in the Shared Library only; no node.
- Workflows the engine and child call (Execute Workflow targets): Cure Call c7366RPLb8vdMQg6, Early Alternate SX4ZWtgHNs96uBOo, the child. Also read: Panel Judge Call Y1VIsNB6KBrs1znP and Error Handler v02XXRlIhoHzMTjJ. None holds `L2C`. NOT SEARCHED: none.
- Names the block uses from outside itself (scope analysis with acorn and eslint-scope, not a grep): `$` and `REFP` only, besides built-ins. REFP is declared after L2C in most nodes, so the loader passes it lazily.
- `$('L2 Count Plan')` stands inside the Extract, Build and Count Plan texts. Each of those 21 nodes keeps the literal in one `if(false){$('L2 Count Plan');}` line, as the gate stubs do, so the node text still names it.
- 7 of the 13 Extracts hold L2C inside a try block (the B and G Extracts). The loader sits in the same place, so a loader error behaves as an error in today's block would.
- Shared Library line use: the 7 entries reuse 143 existing LIB lines (the library's own L2C copy at lines 69 and up) and 15 appended lines. No pending library change (547, 548, 552, 559/560, 561, 570) touches any of these lines; checked by applying the 547, 548 and 552 edits and by line sets for LAY, 3406 and 3552.

## 4. THE CHANGE
1. Shared Library, engine and child alike: append 15 LIB lines at the end (gate entries address lines by index, so nothing is inserted). Add 7 MAP entries, "L2C Extract", "L2C Build", "L2C Lexicon Plan", "L2C L2 Lexicon Plan", "L2C Count Plan", "L2C Citation Scan" and "L2C Quote Report", each a list of LIB lines that rebuilds one text byte for byte. Reset the header sha: f24a5192c60cbc55 becomes c1c1b7db87542c3a.
2. "L2C Build" is today's Build text with ASK 565 (the cited-first pass, before its anchor) and ASK 568 (`const CAPC=26000;` to `const CAPC=130000;`). It equals byte for byte the L2C block of the graded 565+568 target (ask565/w4/build/target_engine_563_565_568.json).
3. In each of the 30 nodes, the block is replaced by a loader of the pkgREFP shape. It reads the entry from `$('Shared Library').params.jsCode`, throws "pkgL2C: the Shared Library holds no <entry> entry" if the entry is missing, and throws "pkgL2C: rebuilt <entry> is N, expected M" on a length mismatch. Then it runs the text with `new Function`. For texts that use REFP, it passes a proxy that reads the node's own REFP when called. The Shared Library node is not wired and never runs; the gate stubs and pkgREFP already read its params the same way in every run.
4. This is one stored copy served as seven texts. It is not one function with options. Merging the Extract and Build texts (the three KEEP lines) would change Extract behaviour and is not part of this ASK.

## 5. CRITERIA and DONE
Each is run by test571.js, offline, and again inside the write script before the PUT and on the fetch-back. All 106 checks PASS (out_test571.txt).
1. Engine: only the 30 nodes and the Shared Library change. Child: only the Shared Library. Connections, node names, types, onError settings and positions are unchanged.
2. Every existing LIB line is unchanged and new lines are appended only. Every existing MAP entry (49) is unchanged and rebuilds the same source. The engine and child carry the same LIB and the same 7 new entries.
3. For each of the 30 nodes:
   - the node text outside the block is byte for byte unchanged;
   - the block is replaced by its entry's loader;
   - the text the entry serves equals today's block byte for byte (the Builds: today's block plus 565 and 568).
4. Behaviour, for each of the 30 nodes, on run 41822's inputs. The old block and the new loader run with the same `$` and the same real REFP. The output of every exported function the text has is identical. The calls are tags on the eight rounds; check for D2 and C3; sheet for D2, D3, D4, C2, C3 and C4, with and without a keep list; sheetPlan; countClaims; countCheck; lexUrls; wordsUrls; refsIn; blockAt; apocIn; index; numOf; norm. The `$` mock serves L2 Count Plan's e340, and a synthetic claim shows that path is read.
5. Negative controls must FAIL as shown:
   - REFP missing: outputs differ on tags, check, sheetPlan, refsIn and blockAt.
   - `$` without L2 Count Plan: outputs differ on check.
   - Entry missing: the loader throws.
   - One library line changed: the loader throws.
6. All 30 changed nodes parse as Code node bodies. The Library Check pair passes: engine and child lib c1c1b7db87542c3a, map 5a8cca206846330f.
7. "Found nothing" is not a pass for 3 and 4: each node must show a non-empty, equal output set.
DONE: written on the operator's press. The fetch-back equals the PUT for every node. Criteria 1 to 6 pass on prewrite against fetch-back. W1's readback matches.

## 6. WRONG-IF
This plan aims at the wrong thing if the n8n Code runtime gives `new Function` code different built-ins or a different `$` than the node body, so that the same text behaves differently. Checked before posting: the gate stubs (pkgLIB) run their whole source through `new Function` with `$` and `$input`, and L2 Count Plan loads REFP the same way (pkgREFP). Known-good: run 41736 completed with the gate stubs live, reading `$('Shared Library').params` from a node that is never wired. Known-bad that the test catches: a loader that does not pass REFP or `$` (criterion 5).

## 7. RUN EVIDENCE
Mark: the next run's D2 to C4 Builds carry an [L2] SHEET whose cap line names 130000 (ASK 568). Rows from the cited-first pass appear first (ASK 565). Every Extract's L2 lines carry the same statuses as the stored-row replay of that run would give. A loader error would stop the node with "pkgL2C:" in debate_errors. NO PROBE beyond that: the change is designed to be behaviour-neutral outside the Builds.

## 8. INPUTS IN GIT
The container's git clone is gone since the morning of 11-23. Inputs, scripts and outputs are on the mount under /mnt/project-files/ask571/w4/, with md5s:
- build/build571.js 2a92b7c1
- build/test571.js 36f22eab
- build/cutl2c.js 2bc2fd02
- build/out_test571.txt 6ef03955
- build/target_engine_571.json f570e06e
- build/target_child_571.json dd870a8c
- write/write571.sh 53f0cee7
- build/base_engine.json (fetch-back of d8292f62) and build/base_child.json (de9efc4e)
Inputs: ask565/w4/in565_41822.json, ask557/w4/build/rounds41822.json.

## 9. STEPS
1. Built and tested offline (done).
2. W1 grades this plan and build.
3. Write card in W4's thread; on the press, write571.sh <engine version> <child version>. It fetches fresh, checks both versions and rebuilds on the fresh fetch. It runs the pair check and test571 before the PUT. It writes the engine and then the child, fetches back and compares, then runs the Library Check and test571 on the fetch-back.
4. Audit row; Wall post; W1 readback.
Other library writes (547+548+552, 559/560, 561, 570) touch none of the L2C lines. Each write script patches the fresh fetch, so the order does not matter. Each later write is re-cut on the previous fetch-back by its own script.

## 10. REVERT
write571.sh saves revert_engine.json and revert_child.json (the pre-write PUT bodies). Revert = PUT them back, then fetch back and run the Library Check pair.

## 11. STATED LIMITS
1. After this ASK, the library's own L2C lines (69 and up), which the gate entries also serve, are shared with the 30 nodes. A later edit to one of those lines changes all of them. That is the point of the ASK. Any such edit must be tested on the 7 entries as well.
2. Each loader is about 650 to 700 characters, so a node saves its block less that amount.
3. The child's Library Check map sha now covers the 7 entries, which the child does not use. They are carried so that the map shas still agree without changing the Library Sha node's engine-only list.
