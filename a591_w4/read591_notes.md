# ASK 591 reads R1 to R5 (W4), from the live engine 9bec145c and child 2d5bdc94, the database, and Vercel

W4 (session_01H1X3AP1fjeQaEbxPP9UEZH), 2026-11-24 CST. Plan: ask591/w3/plan591.md rev 1 (W1 PASS, Wall 11418). Read only; nothing built or written.

## R1. THE ORDER AND EVERY COPY OF IT
1. Init Seats: `const ORDER0=['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'];` and `const __ALT=['haiku','gemini','spark','qwen4max','argon','sonnet'];`.
2. Accept Build holds a second copy: `const ORDER=['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'];`. It asks the judges' agreement of every seat of it that is not a debater and not qwen.
3. CORRECTION to the plan (item 2.1a and R1): Pass Accumulate does NOT hold `__ALT`. The text it holds is `__ALTL`, a function that writes the "[AUDIT v21: ALTERNATE TRIED ...]" line. Pass Accumulate takes the alternates from Resolve Seats (`__RS.alternates`).
4. No other node, no child node and no Shared Library line holds a seat list in this order. Resolve Seats takes the alternates from Init Seats (`S.alt_order`). The family maps (ENG_SEAT, JFAM, FAM_PANEL and others) are maps, not orders, and do not change.
5. Inputs of the drawing in Init Seats, all of which dash_judge_lineup must copy (F2):
   - AGREE_OUT: the seats that did not accept the posture;
   - seated debaters;
   - NOT_PANEL = ['deepseek','qwen'];
   - FAM_PANEL, with the Claude exception (__BOTHC);
   - the time rule;
   - JFL_MOVED (from Accept Models' model_config_jfl);
   - __ALT. Seats not in __ALT come first, then the fault-ledger-moved seats, then the __ALT seats.
   - AN UNLISTED RULE, not in the plan: after the first three seats, haiku is moved to the end of the rest (`pfree.push(...pfree.splice(3).sort(...haiku last))`).

## R2. WHERE THE READ NODE GOES
1. The start paths are Debate Start (webhook), then Library Check; or Manual Start, then Dry Run Config. Both reach Accept Models, then Accept Build, then the agreement calls, then Accept Final, then Init Seats. Accept Models is an HTTP Request node (4.3) that reads model_config_jfl through the Supabase REST API with the "Supabase Anon Key" header credential.
2. The rpc nodes (Write Tokens, QR Record) use the predefined "Supabase account" credential.
3. Proposal: one HTTP Request node, "Judge Order Read", between each start path and Accept Models. It is a POST to rpc/odv1_judge_order_read with the "Supabase account" credential. Accept Build and Init Seats read it by name.
4. The regrade path enters through the same Debate Start, so it reads too.

## R3. THE TWO RECORDER FUNCTIONS (live)
1. odv1_record_panel_substitution (md5 3acb8664) holds its own constant list v_seats = deepseek, chatgpt, mimo, qwen, alt_minimax31, sol, qwen_flash, luna, haiku, hydrogen, gemini, argon, spark, ernie, ember, sonnet, sol62.
   - qwen4max is NOT on it. Today qwen4max never stands fourth.
   - An order that makes qwen4max the reserve would fail at the record (L3). The save function must refuse such an order.
2. odv1_record_panel_alternates (md5 39d84307) has no seat list. It admits an alternate that is:
   - active, with role engine;
   - provider openrouter, or xai with an x-ai/ model, or xiaomi with a xiaomi/ model;
   - not MiniMax;
   - not on the panel;
   - not of a family that debates.
   It records at most two alternates.

## R4. THE REGRADE
- CORRECTION to the plan (S6): a regrade does NOT keep the seats of the run it regrades. It passes through Accept Build and Init Seats, which draw the panel from the order as it stands at the regrade.
- So a save between a run and its regrade changes the regrade's panel. The card must say so. Keeping the original seats would be a separate change.

## R5. THE DASHBOARD AS DEPLOYED
- Production deployment dpl_F4JdWAFWSHCAodqrBa4MtnkpwDA9 (truth-app-dashboard), created under the operator's Vercel account.
- Files: src/index.html, src/odv1.js, src/patch-base.js, src/patch.js, src/queue.js, src/retire.js, src/vercel.json.
- The repo copy (a482_w1/deploy) holds only odv1.js and vercel.json.
- STILL TO READ: the file contents, and how a tab is added. I read them at the build, from this deployment, so the build starts from what is live.
