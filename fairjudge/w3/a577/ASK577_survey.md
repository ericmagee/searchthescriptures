# ASK 577: the child workflow measured, and the options for its copy of the library (W3, draft 1)

Read-only. Nothing is proposed for writing here. Assigned by the coordinator at 18:15 CST 11-23. W4 checks it.
Base: child ODV1 Alternate Pass (MqQHRl7mQQ0z8QdT) version de9efc4e, W4's fetch-back ask566/w4/write/fetchback_child_566.json; engine d8292f62, fetch-back ask563/w4/write/fetchback_engine_563.json. Scripts and outputs in this folder: child577.js, child577.out, child577b.js, child577b.out. Every figure is MEASURED on those files unless marked.

## 1. What the 2.6 MB is
1. The fetch-back file is 2,644,003 bytes because the API returns the workflow twice: `nodes` (1,302,659 JSON characters) and `activeVersion` (1,318,856). The stored child is about 1.3 MB, not 2.6.
2. Of the 1,302,659: the Shared Library node is 1,189,169 as a JSON string (1,145,843 characters of code), which is 91 percent. All other node parameters hold 35,640; connections 15,694.
3. Nodes: 156 (61 code, 47 if, 37 set, 8 HTTP request, 2 Execute Workflow, 1 trigger).

## 2. Repeated code in the child (method of W1's ASK 572 survey: top-level statements of 300+ characters, parsed with acorn)
1. Code outside the library: 60 nodes, 52,453 characters. 39 of them are stubs of about 90 to 110 characters. The largest is R2 Alt Judge Enforcer Retry Build, 19,304.
2. Statements of 300+ characters: 24, holding 32,159 characters. No parse failure.
3. Repeats within the child: none (saving 0).
4. Child statements that also stand byte-identical in an engine node: 27,488 characters. The largest: `__RL`, the judge line parser, 16,453 (5 engine copies; this is W1's ASK 573, which already counts the child copy, 15,872 by its figure); `__SHA422`, 2,266 (Library Check, 2 engine copies); the reread record loop, 2,182; three statements of about 1,050.
5. Reading: outside ASK 573 there is nothing in the child's own code worth a plan. The child's size is its copy of the library.

## 3. The library copy
1. LIB: 979,141 characters, 3,567 lines, byte-identical in engine and child (md5 1922a698). The head lines are equal. MAP: engine 166,418 with 49 keys; child 166,239 with 47 keys; the 47 shared entries are equal; the engine has 2 keys the child lacks.
2. Who reads it in the child: 14 code nodes (13 R2 nodes and Library Check). They ask for 22 of the 47 MAP keys. 25 keys are asked for by no child node.
3. Those 22 keys serve 3,496 of the 3,567 library lines (964,083 of 979,141 characters). So a child library cut down to what the child uses would shrink by about 107,036 characters (9 percent), nearly all of it unused MAP entries.
4. How the child is called: once per run, by the engine's Alternate Pass Call (mode "once", waits for the child), with one input object `pass`. The engine already strips its two sha fields from that object before the call.
5. Cost of one loader today: parsing LIB and MAP took 2.5 ms here (mean of 20, this container, not n8n). 72 engine nodes and 14 child nodes each do it once per execution.

## 4. Options for the child's copy (each with what it saves and what it costs at run time)
A. Keep the copy (today).
   Saves nothing. Run-time cost: none. Standing cost: 1.19 MB stored a second time in every saved child version; every library write is two writes that must match; Library Check and the pair test guard the match.
B. Cut the child's library down to the lines and keys its nodes use.
   Saves about 107,000 characters (9 percent). Run-time cost: none. It ends the byte-identical LIB, so line numbers differ between engine and child, the pack tool builds two libraries, and the pair check has to compare something else. Small gain for a new way to diverge.
C. The engine passes the library text to the child in the call.
   The child's Shared Library node goes (saves 1.19 MB per stored child version). The 14 child readers read the text from the trigger item instead of `$('Shared Library').params.jsCode`; Alternate Pass Call adds one field. Run-time cost: about 1.15 MB more in the one input item of the one child execution per run, and the same amount in that execution's saved data if execution data is saved; no extra network read. Effect on writes: a library change becomes one write, and the engine-child mismatch class disappears, because the child can only receive the engine's text. Cost to build: 14 child nodes and one engine node change; the child can no longer be run alone without that field; the child Library Check changes meaning (it would check the received text against the sha the engine sends).
D. The child reads the library text from a database table at its start.
   Saves the same 1.19 MB per version. Run-time cost: one HTTP read of about 1.2 MB per child execution (time NOT MEASURED), a credential, and a new way to fail before the pass starts; the row must be written with every library write and pinned by sha, so it is still two writes.
Not evaluated: folding the child back into the engine. That is a redesign of the alternate pass, outside this ASK.

## 5. Reading (mine; for W4's check and the team's review before anything goes to the operator)
1. None of the options makes a run faster. The gain is stored size and, for C only, one library write in place of two.
2. If the copy is to go, C is the only option that removes a failure class instead of adding one. Its open questions are W4's: whether a 1.15 MB field in the call input is safe in this n8n (memory, saved execution size), and how many saved child executions are kept.
3. B and D cost more than they return.

## 6. Limits
1. The parse time is from this container. Nothing was run in n8n.
2. The saved-execution cost of C is reasoned from how the call is built, not measured.
3. "Stored" sizes are JSON characters of the fetch-back, not database bytes.
