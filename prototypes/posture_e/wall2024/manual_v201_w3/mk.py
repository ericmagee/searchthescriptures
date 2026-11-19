import json
P=[]
P.append({"old":"It always requires the ACTIVE `deepseek` row (the `deepseek` seat's own calls) and, since ASK 426, the ACTIVE `luna` row (the enforcer model, RS.enforcer, §9).",
"new":"It requires the ACTIVE `luna` row (the enforcer model, RS.enforcer, §9; since ASK 426). Since ASK 455 it no longer requires the ACTIVE `deepseek` row: when that row is missing, the `deepseek` field takes the luna row (§9)."})
P.append({"old":"Alternate Build and Early Alternate Build (byte-equal; they keep their comments)",
"new":"Alternate Build and Early Alternate Build (byte-equal; they kept their comments until ASK 444 A2, below)"})
P.append({"old":"except the Shared Library, Alternate Build and Early Alternate Build; a package or ASK",
"new":"except the Shared Library and one comment in Early Alternate Build (ASK 444 A2); a package or ASK"})
P.append({"old":"Extract Independent Verdict and Panel Payloads run kunxLines with no Assume Check Record upstream, so the item is raised there as before.",
"new":"Extract Independent Verdict and Panel Payloads ran kunxLines without Assume Check Record until ASK 456 (their read lines did not name it, so the runner did not send it), so the item was raised there as before."})
P.append({"old":"lib422 in the child execution naming both pairs of values.",
"new":"lib422 in the child execution naming both pairs of values. Since ASK 443 the engine also checks its own library against its header sha at the start of every webhook run (below)."})
E443='''  - THE ENGINE CHECKS ITS SHARED LIBRARY AGAINST ITS HEADER SHA AT THE START OF EVERY WEBHOOK RUN (ASK 443; engine "Library Check", between "Debate Start" and "Accept Models"):
    - Why: the ASK 422(a) checks compare the engine's library with the child's, and run only when a second alternate pass is needed. No node compared a library with its own header sha, so a mismatched library was caught only on that rare path.
    - What it does: the new Code node computes the library text sha with the two hash functions of "Library Sha (ASK 422a)", copied word for word, reads the header sha, and stops the run with "pkgLIB2: Shared Library text sha X differs from its header sha Y" when they differ, or when the header or the library cannot be read; otherwise it passes the items through. The child is not changed.
    - Reach: a stop before Accept Models; nothing a model reads changes.
    - Shown offline: on the live text the check passes; it stops on each of four plants (one library byte changed, the header changed, the header missing, the library unreadable). 65 ms per run, measured offline. The target differs from its base only by the node and its two connections.
    - Live: engine c1256eec (from 7cd61791), on the operator's card "Write all four" pressed 06:37:05Z on 11-19 (with ASK 444 A2, 455 and 456); library sha cad3b4f8239c2504 on both workflows.
    - Limits: only the webhook path passes the node; "Manual Start" (dry run) and the regrade path do not. That the hash runs in the n8n runner is not shown; if it does not, every webhook run stops at this node. Not shown by a run; its mark is a run that reaches Accept Models with no pkgLIB2 stop.
'''
E444='''  - THE TWO ALTERNATE BUILDS LOSE THEIR CODE COMMENTS, BUT ONE (ASK 444 A2; engine Alternate Build and Early Alternate Build):
    - Why: ASK 428 left Alternate Build (7 comments) and Early Alternate Build (6) byte-equal, so they were the only Code nodes besides the Shared Library that still held comments.
    - What it does: removes the 7 comments of Alternate Build and 5 of the 6 of Early Alternate Build, every token kept. The comment kept begins "pkgE4 v2 (W3 3216): Alternate Call openrouter's own body expression, verbatim"; the reasoning guard refused its removal (it names reasoning_details).
    - Reach: none; no code token changes.
    - Shown offline: tokens equal (717 and 1,116), the $() names equal, and each node's text, run up to its run line with the live Shared Library, rebuilds a byte-equal source. The reasoning guard is clean and the library sha unchanged.
    - Live: engine c1256eec (from 7cd61791), on the operator's card "Write all four" pressed 06:37:05Z on 11-19.
    - Limits: not shown by a run; its mark is a run in which an alternate is seated, with no pkgLIB stop.
'''
E455='''  - A MISSING DEEPSEEK ROW NO LONGER STOPS THE RUN, AND THE ENFORCER'S RECORDS SAY ENFORCER (ASK 455 parts A to C; Resolve Seats; Assume Check Record; Enforcer Build, Anticheat Build, Close Enforcer Build, Judge Contradiction Build and Assume Check Build; Shared Library line 2970, read by Judge Enforcer Build and Alt Judge Enforcer Build on the engine and R2 Alt Judge Enforcer Build on the child):
    - Why: since ASK 426 the enforcer model is luna and no seat is DeepSeek, but Resolve Seats still required the ACTIVE `deepseek` row, and the enforcer's record and skip texts still named DeepSeek.
    - What it does: (a) Resolve Seats: "const ds=need('deepseek');const enf=need('luna');" becomes "const enf=need('luna');const ds=M['deepseek']||enf;", so a missing `deepseek` row no longer stops the run and the `deepseek` field takes the luna row. (b) Assume Check Record writes "ENFORCER " where it wrote "DEEPSEEK " (NO ANSWER and NO REPLY), and the cure_reason "ENFORCER: " where it read "DEEPSEEK: ". (c) The skip text "no DeepSeek model_config row" becomes "no ENFORCER model_config row" in the five builds and the library line.
    - Not changed: Build Synthesis, Build Diagnostic Prompt and Build Independent Verdict still read the `deepseek` field for the first body, which the single judge's body replaces; having them read the enforcer row was dropped, because the reasoning guard refused an edit that touches max_tokens text in Resolve Seats and Build Independent Verdict. The JFAM map keys and the node names that say deepseek stay.
    - Reach: the seat check and the E-ASSUME record text; no prompt changes.
    - Shown offline: the 7 changed Code nodes, old against new, on stored executions 38226, 38450, 38593, 38661 and 39266: 0 errors; every node equal except Assume Check Record in 4 executions, each equal once DEEPSEEK is read as ENFORCER. With the `deepseek` row removed from Fetch Models (38226, 39266), the old Resolve Seats refuses ("seat deepseek has no ACTIVE model_config row") and the new one runs. The library line keeps its length, so no MAP n changes; library sha 4d19497f4f93879b to cad3b4f8239c2504 on both workflows.
    - Live: engine c1256eec and child cd11b411 (from 7cd61791 and e9a13846), on the operator's card "Write all four" pressed 06:37:05Z on 11-19.
    - Limits: not shown by a run; its mark is an E-ASSUME "assumption check" row with no answer that reads ENFORCER, and none DEEPSEEK.
'''
E456='''  - EVERY LIBRARY STUB IS SENT EVERY NODE ITS CODE READS (ASK 456; the read lines of engine stubs Extract Independent Verdict, Panel Payloads, Alternate Payloads, Send Back Record and Alt Send Back Record, and child stubs R2 Alternate Payloads and R2 Alt Send Back Record; judge-facing):
    - Why: the n8n runner sends a Code node only the nodes it names. A form 3 stub names them on its if(false){...} read line, or reads all of them with $(String()). In 7 stubs the read line did not name every node that the rebuilt library source reads, so each such read failed silently inside try/catch. Run 38593 shows it: Panel Payloads, replayed with the runner's gating and the old read line, equals the stored output byte for byte.
    - What it does: adds only the missing $("Node"); calls to each read line; every name already there is kept and no other text changes. Engine: Extract Independent Verdict adds Assume Check Record, Cited Verses, L2 Count Plan and Panel Build; Panel Payloads and Alternate Payloads add Assume Check Record and L2 Count Plan; Send Back Record adds Alt Seated and L2 Count Plan; Alt Send Back Record adds L2 Count Plan. Child: R2 Alternate Payloads adds Assume Check Record and L2 Count Plan; R2 Alt Send Back Record adds L2 Count Plan.
    - Reach: judge-facing. Code that could not read these nodes now can: in Panel Payloads and the alternate payloads, the pkgBKC keep (ASK 313); in Extract Independent Verdict, the ASK 340 English set-aside, the pkgBKC keep and the ROWS GIVE verse check.
    - Shown offline: over every stub of both workflows, live has 5 engine and 2 child stubs with an unnamed literal or dynamic read, the targets 0; only the first line of each changed stub differs, and the rebuilt source is equal. On run 38593, Panel Payloads new against old removes one line from the chatgpt judge's body, the K-UNX line on defender premise 2 (Acts 2:30), whose ASSUMES fact Assume Check Record holds BOTH NOT STATED; that judge's flags go from 10 to 9, its K-UNX line on premise 5 (Luke 1:35) stays, and no verdict, standing or count changes. Alternate Payloads and Alt Send Back Record are equal old and new on 38593; all four replayed nodes are equal on 38226.
    - Live: engine c1256eec and child cd11b411 (from 7cd61791 and e9a13846), on the operator's card "Write all four" pressed 06:37:05Z on 11-19.
    - Limits: Extract Independent Verdict ran in no stored run, so its effect is not shown; the child stubs were not replayed. Not shown by a run; its mark is a run in which Assume Check Record holds a BOTH NOT STATED fact matching a judge's ASSUMES clause, and that judge's body carries no K-UNX line for that premise.
'''
A='  - THE ENFORCER MODEL SEES JUDGES AS "Judge 1"'
P.append({"old":A,"new":E443+E444+E455+E456+A})
json.dump(P,open('pairs.json','w'),ensure_ascii=False)
pj=json.dumps(P,ensure_ascii=False)
assert '$p$' not in pj
open('preview_q.sql','w').write("select left(r::text,700) x from (select engine_manual_apply(200,'f1769a97a68fcc7248767b32b306bcbd',$p$"+pj+"$p$::jsonb,null,null,null,null,null,false) r) s;")
print(len(pj))
