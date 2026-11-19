# ASK 430 plan rev 2 (W1; W4 9093 N1 and N2 taken; step 1 hand read narrowed the -ed strip; W2 9119 notes taken, no -d form on -ee words): the KJV-renderings matcher reads -d and -ed forms

Assigned: coordinator relay of the operator's word (03:24Z 11-19, "if they can get started on something assign them"), register W3 9071 (owner W1), order 9077.

1. OBJECTIVE. In the ASK 340 Part B gloss check, a gloss part that differs from a KJV rendering of its own Strong's number only by a -d, -ed or -ied ending is FOUND, not NOT IN THE KJV RENDERINGS. Example (ASK 406 entry, run 39015): G2675 "prepare", KJV "prepared". Expected effect: on the stored runs, some NOT IN THE KJV RENDERINGS rows become FOUND (count stated at step 1), and no other row, tag, count or judge line changes. Record-only, as Part B is today.

2. ROLES. Planner and builder W1 (the coordinator's assignment). Graders W2 and W4. Write: W4, on the operator's card in W4's thread.

3. SCOPE. One function in one node: `forms` in L2 Count Plan (engine; live 06967796, line 159 of the node):
`const forms=p=>{const o=new Set([p]);...for(const v of [l+'s',l+'es',l.replace(/y$/,'ies'),l.replace(/ies$/,'y'),l.replace(/es$/,''),l.replace(/s$/,'')])if(v)o.add(pre+v);return [...o];};`
It is called twice, both on line 166 (the part as a phrase, and each content word), and only to test a gloss part against R0.W and R0.PH, the KJV words and phrases of that number's own rows.
Change: add the forms l+'d' (when l ends in e after a letter other than e; rev 2), l+'ed', l with a doubled last consonant + 'ed' (one-syllable stems: "stop" to "stopped"), l.replace(/y$/,'ied'), l.replace(/ied$/,'y'), and the reverse strips (l.replace(/ed$/,'') only when at least 3 letters stand before -ed (rev 1), l.replace(/d$/,'') when the word ends in -ed after a letter other than e (rev 2: not seed, need, feed, freed), l.replace(/(.)\1ed$/,'$1')). Nothing else in the node changes.
Not in scope: -ing and other endings (not in the finding); the 60 and 30 caps (ASK 432); the 24-word kjv list (ASK 436); __GLOSS, the judges' gloss line (ASK 431).
SEARCH (W1, on live engine 06967796 and child e1f2b1c4):
- `forms(` and the forms ending list `l+'es'`: only L2 Count Plan, engine. The child holds neither.
- e340 readers: the Part B statuses (e340.gloss) are read only by Build Save Body (AUDIT v57 record) and Format Markdown (report). C1 Extract, the other Extract and Build nodes, L2 Gloss Plan and the Shared Library read only e340.eng and e340.ok (Part A) (W4 9093 N1). So no judge prompt, tag or count reads a Part B status.
- Inline MAP: the Shared Library holds no copy of forms (the search ran on the library text too).

4. CRITERIA and DONE.
- C1. The target differs from live only in the forms line of L2 Count Plan (onlyjs-style check; reasoning guard: no model-setting change; ASK 385 PASS; lib_sha unchanged).
- C2. Replay of the L2 chain (a430_w1/chain430.cjs, a copy of a405_w4/chain.cjs whose $('Shared Library') returns the library's parameters, since L2 Count Plan reads them after ASK 409; driven by a430_w1/m430.cjs; W2 9119 N1) on the stored ODV1 runs, live against target. Tags, e340.eng, the judges' __GLOSS line and every Part B row other than a changed status are equal. The runs and rows are counted.
- C3. Every row that changes goes from NOT IN THE KJV RENDERINGS or LEXICON WORDING to FOUND. Each one is listed with its number, its gloss part and the KJV word it matched, and the graders read the list by hand. Run 39015's G2675 "prepare" is among them. A change to any other status FAILS.
- C4. Found nothing is not a pass: the count of changed rows is above zero.
DONE when C1 to C4 pass, the write is read back by W2 and W1 (rbx 0 diffs), and the engine manual's ASK 406 limit line is updated.

5. WRONG-IF. If an added form turns a gloss FOUND through a different English word (for example "fee" + d = "feed", or "bee" + d), then the matcher is wrong for that pair. Check at step 1: the C3 list is read by hand, and every FOUND it contains that holds a different word is named. Known-good: G2675 "prepare" against KJV "prepared". Known-bad plants: a gloss "fee" on a number whose rows hold "feed" turns FOUND, and so does the reverse, gloss "feed" against KJV "fee" (W4 9093 N2); the hand read must flag them. Rev 2 plants (W2 9119 N2): "seed" against KJV "see", and "see" against "seed", are NOT FOUND, and so are fee/feed and need/nee. Known limit: past forms of -ee verbs (free/freed, agree/agreed) are not read. If the step 1 list holds any such pair, the plan goes back for a narrower rule before the build.

6. RUN EVIDENCE. ASK 417 entry (W2): case = any run whose AUDIT v57 PART B line counts gloss parts; mark = NO PROBE in SQL. The Part B rows are stored only in the AUDIT v57 summary line, which counts statuses and does not list the matched form. The first run is read by hand from its record.

7. INPUTS IN GIT. This plan at a430_w1/plan_rev2.md (rev 0 and rev 1 kept beside it). Build and measure in a430_w1/ (target, patch, replay script, the run list, the C3 list). The replay's stored-run list (debates.json) is rebuilt by SQL from debate_results (ODV1 tokens); the REST cache stays in the container and is not committed.

8. STEPS.
1. W1: the patch and the replay on stored runs; post C1 to C4 and the C3 list. (No card.)
2. W2 and W4 grade. (No card.)
3. W4 posts the write card in W4's thread. Not undoable except by W4's revert file. (Waits on the operator's card.)
4. W4 writes; W1 and W2 read back; W3 writes the engine manual line on the operator's card in W3's thread.
Order (9077): after ASK 429. If ASK 429 is written first, the target is rebuilt on a fresh fetch-back (ASK 412 stacking); ASK 429 does not touch L2 Count Plan.

## STEP 1 RESULT (rev 1)
- Replay (W4, chain430 from W4's a405 folder, REST cache, engine 06967796; L2 Count Plan equal in live 2d40e6ad): m430_out.txt (736eafb4, sha256 1559e3796b27): 237 runs, 0 errors, 0 FAIL, 184 rows moved to FOUND in 89 runs, net 0. Every moved row is NOT IN THE KJV RENDERINGS or LEXICON WORDING to FOUND.
- Hand read (W1), each of the 26 distinct (number, gloss) pairs against kjv_word_map by SQL: 25 match the same English word (prepare/prepared, conceive/conceived, fit/fitted, frame/framed, name/named, espouse/espoused, scatter/scattered, possess/possessed, perceive/perceived, fill/filled, declare/declared, determine/determined, dismiss/dismissed, divorce/divorced, assemble/assembled, accompany/accompanied, company/companied, intended/intend, willed/will, conceived/conceive).
- ONE DIFFERENT-WORD MATCH: G1096 "used with great latitude" (2 rows): rev 0's /ed$/ strip made "used" into "us", a G1096 rendering. Rev 1 strips -ed only when 3 or more letters stand before it; "used" still reads "use" by the -d strip. Plant added (plants_out.txt): "used" vs KJV "us" NOT FOUND; "used" vs "use" and "intended" vs "intend" FOUND.
- Expected under rev 1: 182 rows moved (the 2 G1096 rows return to LEXICON WORDING). The replay is to be rerun on p430.cjs rev 1 (sha256 802b3784a34b) before the build is posted.

## REV 2 (W2 9119)
- The -d forms skip words in -ee and -eed both ways, so no -eed word becomes an -ee stem and no -ee word gains a -d. p430.cjs sha256 00c5a8b8c839. plants_out.txt: every known-bad plant (fee/feed both ways, need/nee, seed/see both ways, used/us, bee/bed) is NOT FOUND; prepare, conceive, carry, stop, used/use, intended/intend, love/loved are FOUND.
- The 25 same-word pairs of the step 1 hand read are all still FOUND under rev 2 (none has an -ee stem); G1096 "used with great latitude" against "us" is NOT FOUND. Expected rerun: 182 rows.
