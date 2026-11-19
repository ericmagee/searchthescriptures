# ASK 455 rev 1 (W4): DeepSeek remnants after the ENFORCER moved to luna (8821 item 16)
Rev 0 (Wall 9201) was wrong: no DeepSeek model is called. Build Synthesis, Build Diagnostic Prompt and Build Independent Verdict set the DeepSeek model first, then replace the body with the single judge's model; ORDER holds no DeepSeek.
1. OBJECTIVE. No step depends on, or names, DeepSeek where luna is the model. Expected effect: removing the DeepSeek model_config row cannot stop a run, and records name the ENFORCER, not DeepSeek.
2. ROLES. Planner and builder W4. Graders W1 and W2. Card: W4 thread.
3. SCOPE and SEARCH (search "deepseek" and "DEEPSEEK" in every node of both workflows and in public functions and views; find455_engine_out.txt, names455_out.txt).
   A. Resolve Seats line 9: need('deepseek') stops the run if the row is missing; line 28 passes a deepseek field. Build Synthesis line 98, Build Diagnostic Prompt line 2, Build Independent Verdict line 394 read that field for the first model they set. Change: these three read the enforcer field; Resolve Seats drops need('deepseek') and the deepseek field.
   B. Assume Check Record lines 43 to 44: cure_status "DEEPSEEK NO ANSWER" and cure_reason "DEEPSEEK: ..." become "ENFORCER ...". No node or SQL function reads these strings (search: only a comment in dash_launch_odv1).
   C. Seven builders' skip text "no DeepSeek model_config row" becomes "no ENFORCER model_config row".
   D. 42 engine and 6 child node names holding "deepseek": a separate build after A to C, because a rename touches connections and every $('name') reference.
   OUT: Accept Build's "deepseek" seat branch (unreachable, ORDER has no DeepSeek); model_config rows.
4. CRITERIA and DONE. C1: after A to C, search finds no need('deepseek'), no .deepseek read, no "DEEPSEEK" output text. C2: reasoning guard; max_tokens and every model setting unchanged. C3: replay of the four A nodes and Assume Check Record on 5 stored executions: the final body model equal, only the first-set model and the labels differ. DONE: C1 to C3, two grades, card, readback.
5. WRONG-IF. A path where the __orc replacement does not happen would now call luna instead of DeepSeek; C3 shows it as a changed final model. Run before posting C3 on one execution with a planted missing judge model.
6. RUN EVIDENCE. ASK 417 entry: case = an E-ASSUME row with no answer; mark = cure_status reads "ENFORCER NO ANSWER".
7. INPUTS IN GIT. a455_w4/plan_rev1.md, find455.cjs and find455_engine_out.txt, names455.cjs and names455_out.txt; live engine fetched 05:4xZ 11-19. Build files to follow in a455_w4.
8. STEPS. a. Grades of this plan. b. Build A to C, C1 to C3. c. Grades. d. Card. e. Write, readback. f. D as its own build.
