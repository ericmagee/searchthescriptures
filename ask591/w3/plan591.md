# ASK 591 plan, rev 0 (W3): the operator sets the order of the judges and alternates on a dashboard page

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade. W4 builds after ASK 590. No build before the operator's card.

## 1. The request (the operator's own words are in the W3 thread)
- 23:23 CST 2026-11-23: he asked whether a dashboard could set the judge and alternate line-up. W3 answered with a sketch and said it would be numbered. It was not numbered (coordinator's miss and W3's: no follow-up).
- 00:41 CST 2026-11-24: "did you write an ask for the vercel dashboard judge ordering?" and 00:42 CST: "i spoke to you earlier about it".
- LIVE, NOT TRIAL (ruling row 512): the page and the engine read are planned for live use. No switch, no record-only stage. The offline tests of section 6 are proof before the write, not a stage.

## 2. What is true now (source: engine manual v279 parts 02.0, 04.0, 10.0, 17.0, read by SQL this turn; repo a482_w1; NOT read by W3: the engine code)
1. The order is code. Init Seats holds `ORDER0` (one list of judge seats) and `__ALT` (the seats that are alternates only). The panel is the first three free seats, the reserve is the next, the alternates follow in `ORDER0` order (part 10.0, "How seats are drawn").
2. The same order stands in other nodes: Accept Build, and seat or family maps in Resolve Seats, Build Synthesis, Build Independent Verdict and Build Diagnostic Prompt (part 10.0, "JUDGE ORDER AND ALTERNATES, LIVE AS OF ASK 437"). A change of order today is a hand edit of several nodes.
3. Rules that act on the order and are not the order itself: the family rule (FAM_PANEL); NOT_PANEL (the time rule, ruling 362; deepseek, ruling 421); posture acceptance; the judge fault ledger's move of a seat to the end at state ALTERNATE; the seated-debater rule; the Claude exception; guards G1 to G3 and G5 on alternates; the database functions odv1_record_panel_alternates and odv1_record_panel_substitution, which admit or refuse seats by their own tests and lists.
4. The single judge, and so the synthesis and the diagnostic, is the first free seat of the order that is not time-removed and not of a debater's family. A change of order can change the single judge.
5. The dashboard is a static site on the Vercel project truth-app-dashboard. Its pages are JavaScript files that call database functions (dash_api and the dash_ functions). ASK 482 is the precedent: SQL functions plus deploy/src/odv1.js, deployed by a seat. The debater list already comes from the database (dash_debaters), and the launcher reads it.

## 3. The objective
The operator opens a dashboard page, puts the panel judges and the alternates in the order he wants, saves, and the next run seats judges in that order. No model edits engine code to change the order. The page shows him the line-up a run will seat, after the engine's rules.

## 4. The design
S1. ONE TABLE, the one home of the order: `odv1_judge_order` (seat text primary key, references model_config.seat; list text: 'panel' or 'alternate'; ord integer; unique (list, ord)). And `odv1_judge_order_log`: one row per save, holding the whole order before and after, the time and who saved. RLS on. Seeded in the same migration from the live `ORDER0` and `__ALT` as W4 reads them at build, so the first run after the write seats exactly what it seats today.
S2. READ FUNCTION for the engine: `odv1_judge_order_read()` returns the two lists in order and a version number (the log row id). EXECUTE for service_role and lab_seat only, as record_debate_row_tokens.
S3. THE ENGINE READS IT AT RUN START. Init Seats is a code node and cannot query the database, so one new node before it (the same credential and node type as the engine's other rpc calls) calls odv1_judge_order_read, and Init Seats takes its order and its alternate set from that item in place of the constants `ORDER0` and `__ALT`. Every other node that holds its own copy of the order (item 2.2) reads Init Seats' output instead of its own copy; W4 names each in the build. The rules of item 2.3 are NOT changed: they act on the table's order exactly as they act on `ORDER0` today.
S4. THE ORDER A RUN USED IS RECORDED: Init Seats' output carries the order version, and Build Save Body writes one review_notes line "[JUDGE ORDER v<n>: panel list ...; alternates ...]". (Build Save Body runs after Init Seats, so the line writes; W4 confirms on the live path, the lesson of Wall 11403.)
S5. IF THE READ FAILS or the table does not pass the checks of S7: the run stops before any model call, with the message "JUDGE ORDER: the order table could not be read (<reason>); no call was made". Reason for stopping and not falling back: a run that silently used an order the operator did not set would be a result he did not ask for, and stopping before any call costs nothing. The launch status on the dashboard shows the message.
S6. A run reads the order once, at its start. A save during a run changes the next run, not the running one. A regrade keeps the seats of the run it regrades; W4 confirms from the regrade path and says so in the build.
S7. SAVE FUNCTION for the page: through dash_api (the dashboard password), action `judge_order_save` with the two lists. It refuses, and changes nothing, unless: every seat of the table is in exactly one list, once; no seat is added or dropped (a new model still needs its model_config row, its check call and its engine maps first: a separate ASK each time); the panel list holds at least four seats that are active in model_config. It writes the table and one log row in one transaction.
S8. THE PAGE (a new tab, "Judge order", on the dashboard): two lists, PANEL JUDGES and ALTERNATES. Each row: position, model name (the odMName rule), model id, family, active or not, and the fault ledger state (COUNTING, EXAMPLES, ALTERNATE) from jfl_report. Drag, or up and down buttons, within a list and between the lists. A Save button; after a save the page reads the table back and shows it. Below: THE LINE-UP FOR A DEBATE. He picks defender and challenger (the dash_debaters list) and the page shows panel 1 to 3, the reserve, the alternates in order, the single judge, and every seat left out with its reason in words (same family as a debater; removed by the time rule; moved to the end by the fault ledger; is a debater). One line states what the page cannot know before a run: whether each seat accepts the posture.
S9. THE LINE-UP SHOWN IS COMPUTED BY ONE SQL FUNCTION, `dash_judge_lineup(def_engine, ch_engine)`. This is a second copy of Init Seats' drawing rule, which is a risk: two copies can drift. The control: test T2 below compares the function with Init Seats for every ordered debater pair, and it is rerun at every later change of Init Seats (added to part 15.0, Verifying a change). The page says "as the engine would seat it now".
S10. NOT CHANGED: the family rule, the time rule, the fault ledger, the guards, both recorder functions and their bars, model_config, every prompt, every judge rule. No reasoning text is touched. The display order in dash_odv1_debates and dash_odv1_judges (a seat list without sol, part 17.0) is a display matter and is out of this ASK.

## 5. Limits stated plainly (for the card)
L1. The page reorders seats the engine already knows. It does not add a model.
L2. The rules of item 2.3 still decide who sits. A seat he puts first can still be left out by the family rule, the time rule or the fault ledger; the page shows that before the run.
L3. The reserve recorder (odv1_record_panel_substitution) keeps its own seat list. If an order makes a seat the reserve that this function refuses, the reserve step would fail at its record. W4 reads the function's list at build; the save function refuses an order whose possible reserve (any seat that can stand fourth for some debater pair) is not on that list, and names the seat. Changing that list is not in this ASK.
L4. A changed order can change the single judge (item 2.4).

## 6. Proof before the write (offline; W4 builds, W1 reruns)
T1. With the seeded table, Init Seats' output (panel, reserve, alternates, single judge) equals the live engine's for all ordered debater pairs (132 in ASK 437's test), seat for seat.
T2. dash_judge_lineup equals Init Seats for all ordered pairs, on the seeded order and on at least three other orders (one that moves an alternate into the panel list, one that moves a panel seat to the alternates, one reversed).
T3. Each refusal of S7 and L3 refuses and leaves the table unchanged.
T4. S5: an empty table, a missing seat and a failed call each stop the run before any call node, with the message.
T5. The review_notes line of S4 writes on the live path order of nodes (node order tested, not only node text).
T6. No node outside the named ones changes; the Shared Library md5 is unchanged unless W4's read shows a copy of the order there, in which case it is named.
T7. The page: screenshots of the tab after a save and of the line-up for two pairs; the saved order read back from the table equals what the page shows.

## 7. Reads owed by W4 before the build (W3 does not read n8n)
R1. The live `ORDER0` and `__ALT` arrays, and every node that holds a copy of the order or a seat list that must follow it.
R2. Where Init Seats sits in the path and which node type and credential the new read node uses.
R3. The seat tests and lists of odv1_record_panel_alternates and odv1_record_panel_substitution as they are live.
R4. The regrade path: which seats a regrade uses.
R5. The dashboard source as deployed now (index.html and its script files) and how a tab is added; who deploys (ASK 482 was deployed by a seat on the operator's card).

## 8. Order of work
W1 grades this plan. W4 does the reads R1 to R5 and builds after ASK 590 is written: one migration (two tables, three functions, the dash_api action), one engine write (the read node, Init Seats and the nodes of R1), one dashboard deploy. Each goes on W4's cards to the operator. W3 then writes the engine manual entry (part 10.0 and part 02.0) on its own card, and the AAR row draft.

## 9. Revert
The engine: W4's revert file restores the constants. The tables and functions may stay; they act on nothing once the engine does not read them. The dashboard: the previous deployment.
