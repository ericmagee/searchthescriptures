# ASK 584 plan rev 1 (W4, 11-23 21:25 CST; takes W1 Wall 11242 D1, D2 and the SEARCH addition): Sol 6.2 as a new debater in Any vs Any on the operator's Vercel dashboard

The operator, verbatim: 21:06 CST "Can you update my verse cell? Any versus any debate drop down? Could you change the 6.1 soul to soul 6.2?"; 21:12 CST "typo.  i need that updated on my Vercel dashboard." On W4's card (21:10 CST) the operator chose "Add Sol 6.2 as a new debater".

1. OBJECTIVE. The Any vs Any drop-downs on the Vercel dashboard offer "Sol 6.2" (model_config seat sol62, openai/gpt-6.2-sol), and a launch with Sol 6.2 on either side is accepted by the launch function and seated by the engine. Expected effect: 10 choices today, 11 after; the other 10 choices, the judge order and every judge seat are unchanged.

2. ROLES. Planner and builder W4. Grader W1. Card: W4's thread (one engine node write and one database function write, both on the same card).

3. SCOPE and SEARCH (measured 21:12 to 21:18 CST, live reads).
 a. Fact for the operator: no "6.1 Sol" choice is in the drop-down today. The list is dash_debaters() (md5 of definition a0347d3a): Claude, OpenAI (seat chatgpt = openai/gpt-6.1-terra), Gemini, Grok, MiMo, Haiku, Opus, GLM, Qwen 4 Max, Spark. Seat sol (openai/gpt-6.1-sol) and seat sol62 are judges only.
 b. The dashboard page fills the drop-downs from the database: dash_api action odv1_engines returns dash_debaters() (ASK 482). So no dashboard deploy is needed; the static list in odv1.js is only the fallback when that read fails. CONFIRMED 21:20 CST: the live https://truth-app-dashboard.vercel.app/odv1.js (md5 efb5c5f9) calls dash_api odv1_engines and builds each label from api_model (gpt-6.2-sol shows as "Sol 6.2", the way chatgpt shows as "Terra 6.1"), with the model id beside it.
 c. The launch function dash_launch_odv1 (md5 59aa1169) accepts exactly the keys of dash_debaters(). No change to it.
 d. The engine moMxiV4Irg1uRBZN 8c633631, node Init Seats: const ENG lists the debaters claude, chatgpt, gemini, grok, mimo, haiku, opus, glm, qwen4max, spark, deepseek (deepseek refused). sol62 is not in ENG, so the engine would refuse it ("engine is not one of ..."). Every other engine node already knows sol62 as a judge (Resolve Seats, Build Synthesis, Build Independent Verdict, Build Diagnostic Prompt, Accept Build); the debater call in Resolve Seats is generic (model_config by mc_seat; family from model_config). The child f900375e names no engine key.
 e. model_config sol62: family openai, api_model openai/gpt-6.2-sol, max_tokens 64000, active true. No change.
 f. Judges when Sol 6.2 debates: Init Seats removes a debater from the panel ("is a debater") and removes its family (openai: chatgpt, sol, sol62) from the panel. This is the same path that runs today when OpenAI (chatgpt) debates.
 g. (W1 11242) Two more database functions read engine keys: dash_queue labels sides through dash_debaters() and odv1_side_label (odv1_side_label('sol62','openai/gpt-6.2-sol') returns "Sol 6.2"); dash_odv1_debates orders judges with a fixed list that already holds sol62. Neither needs a change.
 h. The ASK 482 mirror check (C6 of 482, run at engine readback and run start) requires ENG keys minus deepseek to equal dash_debaters() keys. Both changes therefore go live together.

4. CHANGES (exact text).
 E1 Init Seats, inside const ENG, after `spark:{fam:'openrouter',mc:'spark'},` insert `sol62:{fam:'openrouter',mc:'sol62'},`. Nothing else in the node changes.
 D1 dash_debaters(), VALUES list: after `(10,'spark','Spark','spark')` add `,\n    (11,'sol62','Sol 6.2','sol62')`. Nothing else changes.

5. CRITERIA and DONE.
 C1 After D1, select key from dash_debaters() returns the 10 keys of today plus sol62 (11), sol62 with api_model openai/gpt-6.2-sol and active true.
 C2 dash_launch_odv1 accepts sol62 on either side, and still refuses deepseek and a made-up key (test inside a transaction that is rolled back, so no request is sent; same method as 482).
 C3 After E1, the per-node diff of the engine fetchback shows only Init Seats changed, and in it only the inserted text.
 C4 Offline run of the live Init Seats panel rule for every ordered pair that includes sol62 (21 pairs, including sol62 vs sol62): each pair leaves at least 3 panel seats, and no openai seat is on the panel. Script and output in the ask584 folder.
 C5 The mirror check: sorted ENG keys minus deepseek equal sorted dash_debaters() keys (11), MATCH.
 C6 The dashboard: dash_api('odv1_engines') returns 11 entries with Sol 6.2 last; the live odv1.js reads that action (confirmed in build step 1).
 C7 No change to the child, the judge order ORDER0, model_config, or any model setting.
 DONE: C1 to C7 met and read back by W1.

6. WRONG-IF. The deployed odv1.js does not fill the drop-down from dash_api odv1_engines (the drop-down would then need a dashboard deploy). Check: build/wrongif584.sh (PASS only if the page calls odv1_engines and builds ODV1_PICK from the answer). Run 21:24 CST: known-good, the live odv1.js (md5 efb5c5f9) = PASS; known-bad, the same page with that call removed (static fallback only, odv1_knownbad.js) = FAIL. Output build/out_wrongif584.txt.

7. INPUTS IN GIT. Branch claude/untitled-9jle0o, folder a584_w4/: this plan; build/init_seats_8c633631.js (live Init Seats, md5 05a1e2f1) and build/init_seats_584.js (E1, md5 3679ee77); build/dash_debaters_prior.sql (live, md5 a0347d3a) and build/dash_debaters_584.sql (D1, md5 0c0c2efb); build/sim584.cjs and build/out_sim584.txt (C4: existing 100 pairs unchanged; 21 of 21 sol62 pairs OK, no openai judge; old code refuses sol62); build/out_c2_c1_c6_584.txt (C1, C2, C6 in a rolled-back block, all met); build/wrongif584.sh, odv1_live_efb5c5f9.js, odv1_knownbad.js, out_wrongif584.txt. Commit named on the Wall post.

8. RUN EVIDENCE. The first run that seats Sol 6.2 shows it as debater and no openai judge. Until then the change is marked unexercised.

9. STEPS AND REVERT.
 1. Fresh live fetch of the engine and of the deployed odv1.js; confirm 3b and 3d still hold.
 2. Build E1 on the fresh fetch; build D1; run C2 and C4 offline; post the results; W1 grades.
 3. The operator's card in W4's thread with E1 and D1 text and the effect.
 4. Write D1 then E1 in the same turn; fetch back; C1, C3, C5, C6; audit row; Wall; W1 readback.
 Revert: put back the saved prior engine version (8c633631) and the prior dash_debaters() definition (saved before the write). Both are reverted together.
