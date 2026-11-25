# ASK 625: THE AAR OF EVERY LIVE RUN STATES THE RUN'S COST (draft 2, in the ASK FORM; draft 1 60b252b0 graded PASS WITH N1, N2 by W1, Wall 11803, grade f40620e7; draft 2 applies both in the paragraph and in SCOPE and changes nothing else)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST, on the coordinator's number. THE OPERATOR'S WORDS, 17:56 CST 2026-11-24, project chat (message cmsg_017ZQamDMHrS6fqMHnQDVo58AAV2S8F3fgFR1SLdDddUYH; copied on Wall 11796): "i would also like to start having the cost include in each AAR live run (please update the operational doc with that requirement)".

RULES READ: operational document v145 (fa32021f, 75,912 characters) section 0, BODY LAW, clauses 1 to 8; its section 30, THE REVIEW AFTER A RUN; Wall manual section 7.4; the scope rule; ruling 512.

1. OBJECTIVE: every AAR of a live run tells the operator what the run cost, and the operational document holds that as a rule. Expected effect: the cost is in each AAR's RUN part without his asking, and a figure known to be short is said to be short.

2. ROLES: planner and writer W3 (the operational document's text; the operator's own word of 17:56 CST orders the update); grader W1; the card in W3's thread, with the exact text. No engine, child or table change. No builder.

3. SCOPE: ONE paragraph added to the operational document, section 30, directly after the paragraph THE REVIEW AFTER A RUN and before DENIALS, TIMEOUTS AND WRITES. Nothing else in the document changes.
   WHERE THE LINE BELONGS, AND WHY: the operator named the operational document. Its section 30 already owns what a review after a run must state; the cost requirement is a rule of that kind, so its one home is there (BODY LAW 5). Wall manual 7.4 owns the ORDER of the report; its RUN part reads "the run token, the live version, the outcome and the panel verdict, in one line." The new paragraph points at that part and does not restate the order. Wall manual 7.4 is NOT changed by this ASK; adding "and the cost" to its RUN line is a separate small write that the operator has not asked for.
   SEARCH (SQL, operational document v145): the words "run_cost", "cost of the run" and "costs" occur nowhere in the document. No rule on cost exists to amend.
   WHAT FIGURE, AND HOW SOURCED: the run's stored cost, debate_results.run_cost_usd, read by SQL (run 42373: 10.12). call_costs is a jsonb array column of the same row, not a table (N1); its entries sum to the stored figure exactly, so the sum is no independent check and the rule does not ask for it (N2). On run 42373 the stored figure is SHORT: call_costs is built from a fixed node list that leaves out the question round's answer and follow-up calls and the group batch and resend calls (W4, Wall 11786; AAR DEFECT 7). Until that list is repaired the AAR cannot give the true cost, so the rule requires the AAR to say so and to name the calls with no cost entry. Repairing the list is an engine change, not in this ASK; it wants its own number (626 is free) if the operator asks for it.
   THE TEXT TO ADD (466 characters with its Why line; the Wall number is this ASK's Wall post that copies the operator's words):

   THE COST OF A LIVE RUN. The AAR of every live run states the run's cost in dollars in its RUN part (the_wall_manual §7.4, AAR report). The figure is the run's stored cost (debate_results.run_cost_usd), read by SQL and never estimated. Where the run made calls that have no entry in its stored call costs (debate_results.call_costs), the AAR names those calls and says the cost is higher than the figure. A run that stored no cost reads NOT STORED. (Why: WALL-11796.)

   BODY LAW CHECK: (1) a rule and its mechanics only; (2) no author, date or session in the body; (3) one Why line, a bare Wall pointer; (5) one home, the order left to the Wall manual by pointer (3b: manual, section, the rule's name, no version); (5b) no changeable value, the omitted node names are not written; (7) the operator is not named.

4. CRITERIA and DONE: (a) version 146 equals version 145 with the paragraph and one blank line inserted at that one place and no other difference (W1's diff); (b) the write is one INSERT of version 146 by replace(), guarded on the base md5 fa32021f and on the result md5 computed before the write, with its operational_doc_log row holding the card, the press time and the grade; (c) W1's readback MATCH; (d) the next AAR sent carries the cost under the rule. DONE at (c); (d) is the run evidence.

5. WRONG-IF: the operator wants the true cost and not the stored figure with its caveat (then the call_costs repair comes first or with it); or he wants the cost somewhere other than the RUN part; or the paragraph breaks BODY LAW.

6. RUN EVIDENCE: NO PROBE in the engine. The mark is in the AAR itself: its RUN part holds a dollar figure and, where calls lack rows, the sentence naming the calls that have no entry. The AAR of run 42373 (draft 3, 7389b8b8) already does both.

7. INPUTS IN GIT: this file; aar/w3/aar_run42373_draft3.md (commit 8bbde09e); aar/w3/run42373/call_costs.json (commit 1239caa5).

8. STEPS: W1's grade of this draft; ONE card to the operator in my thread with the paragraph shown; on his press, the write (run state read first; rehearsed in a rolled-back transaction); my audit row; Wall post; W1's readback; done report listing the text added and nothing deleted.
