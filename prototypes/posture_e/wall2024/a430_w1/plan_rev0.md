# ASK 430 plan rev 0 (W1): the KJV-renderings matcher reads -d and -ed forms

Assigned: coordinator relay of the operator's word (03:24Z 11-19, "if they can get started on something assign them"), register W3 9071 (owner W1), order 9077.

1. OBJECTIVE. In the ASK 340 Part B gloss check, a gloss part that differs from a KJV rendering of its own Strong's number only by a -d, -ed or -ied ending is FOUND, not NOT IN THE KJV RENDERINGS. Example (ASK 406 entry, run 39015): G2675 "prepare", KJV "prepared". Expected effect: on the stored runs, some NOT IN THE KJV RENDERINGS rows become FOUND (count stated at step 1), and no other row, tag, count or judge line changes. Record-only, as Part B is today.

2. ROLES. Planner and builder W1 (the coordinator's assignment). Graders W2 and W4. Write: W4, on the operator's card in W4's thread.

3. SCOPE. One function in one node: `forms` in L2 Count Plan (engine; live 06967796, line 159 of the node):
`const forms=p=>{const o=new Set([p]);...for(const v of [l+'s',l+'es',l.replace(/y$/,'ies'),l.replace(/ies$/,'y'),l.replace(/es$/,''),l.replace(/s$/,'')])if(v)o.add(pre+v);return [...o];};`
It is called twice, both on line 166 (the part as a phrase, and each content word), and only to test a gloss part against R0.W and R0.PH, the KJV words and phrases of that number's own rows.
Change: add the forms l+'d' (when l ends in e), l+'ed', l with a doubled last consonant + 'ed' (one-syllable stems: "stop" to "stopped"), l.replace(/y$/,'ied'), l.replace(/ied$/,'y'), and the reverse strips (l.replace(/ed$/,''), l.replace(/d$/,'') when the stem ends in e, l.replace(/(.)\1ed$/,'$1')). Nothing else in the node changes.
Not in scope: -ing and other endings (not in the finding); the 60 and 30 caps (ASK 432); the 24-word kjv list (ASK 436); __GLOSS, the judges' gloss line (ASK 431).
SEARCH (W1, on live engine 06967796 and child e1f2b1c4):
- `forms(` and the forms ending list `l+'es'`: only L2 Count Plan, engine. The child holds neither.
- e340 readers: the Part B statuses (e340.gloss) are read only by Build Save Body (AUDIT v57 record) and Format Markdown (report). C1 Extract, the other Extract and Build nodes, and the Shared Library read only e340.eng and e340.ok (Part A). So no judge prompt, tag or count reads a Part B status.
- Inline MAP: the Shared Library holds no copy of forms (the search ran on the library text too).

4. CRITERIA and DONE.
- C1. The target differs from live only in the forms line of L2 Count Plan (onlyjs-style check; reasoning guard: no model-setting change; ASK 385 PASS; lib_sha unchanged).
- C2. Replay of the L2 chain (a405_w4/chain.cjs, as ASK 406's m406.cjs) on the stored ODV1 runs, live against target. Tags, e340.eng, the judges' __GLOSS line and every Part B row other than a changed status are equal. The runs and rows are counted.
- C3. Every row that changes goes from NOT IN THE KJV RENDERINGS or LEXICON WORDING to FOUND. Each one is listed with its number, its gloss part and the KJV word it matched, and the graders read the list by hand. Run 39015's G2675 "prepare" is among them. A change to any other status FAILS.
- C4. Found nothing is not a pass: the count of changed rows is above zero.
DONE when C1 to C4 pass, the write is read back by W2 and W1 (rbx 0 diffs), and the engine manual's ASK 406 limit line is updated.

5. WRONG-IF. If an added form turns a gloss FOUND through a different English word (for example "fee" + d = "feed", or "bee" + d), then the matcher is wrong for that pair. Check at step 1: the C3 list is read by hand, and every FOUND it contains that holds a different word is named. Known-good: G2675 "prepare" against KJV "prepared". Known-bad plant: a gloss "fee" on a number whose rows hold "feed" turns FOUND, and the hand read must flag it. If the step 1 list holds any such pair, the plan goes back for a narrower rule before the build.

6. RUN EVIDENCE. ASK 417 entry (W2): case = any run whose AUDIT v57 PART B line counts gloss parts; mark = NO PROBE in SQL. The Part B rows are stored only in the AUDIT v57 summary line, which counts statuses and does not list the matched form. The first run is read by hand from its record.

7. INPUTS IN GIT. This plan at a430_w1/plan_rev0.md. Build and measure in a430_w1/ (target, patch, replay script, the run list, the C3 list). The replay's stored-run list (debates.json) is rebuilt by SQL from debate_results (ODV1 tokens); the REST cache stays in the container and is not committed.

8. STEPS.
1. W1: the patch and the replay on stored runs; post C1 to C4 and the C3 list. (No card.)
2. W2 and W4 grade. (No card.)
3. W4 posts the write card in W4's thread. Not undoable except by W4's revert file. (Waits on the operator's card.)
4. W4 writes; W1 and W2 read back; W3 writes the engine manual line on the operator's card in W3's thread.
Order (9077): after ASK 429. If ASK 429 is written first, the target is rebuilt on a fresh fetch-back (ASK 412 stacking); ASK 429 does not touch L2 Count Plan.
