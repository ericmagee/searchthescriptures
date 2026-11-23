# ASK 529 PLAN rev 1: a reader-facing transcript (Format Markdown and Plain Rule Lines, display only)

Rev 1 answers W2's grade at Wall 10745 (FAIL, on scope) and W4 10741 item 2. Changes from rev 0: Plain Rule Lines is added to the scope with its own SEARCH (items 1 and 6); the place of "Engine records (verbatim)" is fixed against Plain Rule Lines' HEAD/TAIL split (item 2); criterion 8 is measured with D6 set aside (item 3); D6 keeps the hard cut for a single long token (item 4); criterion 3 names the stored removal reason (item 5). D4 now keeps every stored acceptance text (rev 0 would have dropped the texts of the seats not seated).

Planner: W3 (seat 33, session_01H1X3ANsGiMnhnbkfphocmo). Source of the finding: W4 Wall 10510 (the transcript of run 41418 read as an app reader sees it); the folded list aar/w3/run41418_issues_folded.md items 12, 13 and 16 to 23; the held list ask529/w3/items529.md.
Standing order that governs the timing: transcript fixes come after the open recommendations are completed and tested, and are never combined with them (operator, 11-18 21:00 CST). This plan is graded now; the build waits for the coordinator to say the transcript work may start.

## 1. OBJECTIVE
A reader of the Drive transcript can tell from the head who judged, who was removed and why, what each counted judge decided, and what the round labels mean, without meeting the engine's internal codes there. Every engine record stays in the file verbatim, lower down. Expected effect: the head of the 41418 transcript (35,774 characters, 62 "AUDIT v" strings, 30 "<layer>" and 30 "<quote>") shrinks to the outcome, the seats, the counts and the review flags; the cured-flag rows move to one section near the end, each distinct text printed once with the judges it applies to. No count, verdict, outcome, judge text or stored row changes.

## 2. ROLES
- Planner: W3. Builder: W4 (the only seat that writes n8n). Grader: W2 (not the builder). It reads one produced copy of the transcript in full, for sense as well as form (op doc s29, BEFORE THE BUILD).
- Card: W4's thread, an engine write of the Format Markdown and Plain Rule Lines nodes.

## 3. SCOPE
In: two nodes of the engine (moMxiV4Irg1uRBZN), and only their display text: Format Markdown (id 94e366b1) and Plain Rule Lines (id 94cb1e00), which sits between Format Markdown and Save to Drive. Changes:
- D1 SEATS IN THE HEAD (folded 12, W4 10510 item 6). Today a removed seat and its alternate print as two "Panel judge 3" lines ("Panel judge 3: Sol 6.1 ... (removed: ...)" and "Panel judge 3, alternate for Sol 6.1: Qwen4 Max ..."). New: one line per panel seat. A seat with a removal reads "Panel seat 3: Sol 6.1 was removed (<the recorded reason>); Qwen4 Max sat in its place: <verdict>; RESULT <word> (counted)". The removal reason text is the stored text.
- D2 RESULT WORDS (folded 13, W4 item 5). Under "Panel result", one added line counts the counted judges' RESULT words, for example "RESULT words of the counted judges: CHALLENGER WINS 2, UNDERDETERMINED 1". It is computed from the same resWord() reads the judge lines already print.
- D3 FLAGS OUT OF THE HEAD (W4 items 2, 3 and 8). The Result table keeps the outcome and the standing rows, plus every Review flag row (14 in 41418), each with a plain lead "For review: <judge>" ahead of the stored text. The Cured flag rows (48 in 41418, 25 distinct texts) leave the head for a new section, "Engine records (verbatim)". Format Markdown places it as the last section before "## What the judges were sent", so it falls in Plain Rule Lines' HEAD (the text before "\n## What the judges were sent\n"). There the CLAUSE rewrite and the codes_left count run over it exactly as they run over the same rows today. Measured on the 41418 transcript: the 48 Cured flag rows hold 0 CLAUSE lines and 0 of the codes codes_left counts, so codes_left is unchanged by the move and by the dedupe. There a text that several judges share prints once, followed by the judges it applies to (the 10 K-W rows print 10 times, not 30). Stored text is not edited, so "<layer>" and "<quote>" remain inside the verbatim rows; in the head they are gone.
- D4 THE JUDGES' AGREEMENT (W4 item 7), in Plain Rule Lines (its AGM block reads $('Accept Final').acc and builds "## The judges' agreement"). The seats with placed true print first. Then one line: "Accepted the commitments, not seated in this debate: <names>". Then the seats with placed false, with their stored texts unchanged, so no acceptance text leaves the file. Each heading uses the display name in place of the seat id ("### Terra 6.1 (openai/gpt-6.1-terra): ACCEPT"). The display names come from Format Markdown's own nm(): Format Markdown adds one output field, names ({seat: nm(seat)} for every seat in Accept Final), and Plain Rule Lines reads x.names, falling back to the seat id. Save to Drive reads only md and fileName, so the added field reaches no file. The "Cost of this run" block in Plain Rule Lines is not touched.
- D5 ROUND LABELS (folded 23, held item 5, W4 item 9). The legend "Labels in the judges' texts" names [CR4] and [DR4] too, and each round heading carries its label: "## Round 1 - Defender (Muse Spark 1.3) [CR1]" and so on. The judges' texts keep CR and DR unchanged.
- D6 CUTS AT A WORD (W4 item 4, in part). Format Markdown's own slice(0, n) cuts (26 sites) end at the last space before n, followed by "...". Where the first n characters hold no space (a single long token), the hard cut at n stays, followed by "...". Cuts made inside the stored AUDIT text by the Library ("do n)", "thy fat") are record text and are not touched.
- D7 THE SYNTHESIS (W4 item 5). One fixed line above the synthesis: "The synthesis is one model's summary of the debate. Where it differs from the panel's counts above, the counts govern." The synthesis text itself is not touched (it is a model's output).
SEARCH (engine 9240349c fetch, live2.json; Format Markdown jsCode 110,378 characters, md5 874fd7af):
- The head judge lines at character 54,682 ("Verdict of the debate"), 57,255 and 57,680 ("alternate for"), 63,181 (the "- Panel judge " line builder), 67,154 ("Panel result"), 70,499 and 72,119 ("(removed"), 72,256 (OPEN ENFORCER DISAGREEMENTS).
- The flag rows at 76,260 and 76,275 ("Cured flag", "Review flag").
- The legend at 88,889, inside "How to read this debate" at 87,437.
- "What the judges were sent" at 108,354, built with sentFence.
- 26 slice(0, n) sites.
- The child workflow (MqQHRl7mQQ0z8QdT, 334f0518) has no Format Markdown node and no "Round 1 - " text, so it is not in scope.
- The transcript of 41418 from Drive ("Debate [Muse Spark 1.3 v Claude Sonnet 5.5] - Did Christ have a biological father? - 2026-11-23.md", 2,081,140 characters, md5 604a8819), with these counts in the head, lines 1 to 94: "AUDIT v" 62, "REVIEW THIS ROW" 14, "<layer>" 30, "<quote>" 30, Cured flag 48, Review flag 14.
- Finding on W4 item 1: every "## " and "#### " heading after "What the judges were sent" lies inside a text fence (105 inside, 0 outside, by a fence-aware count). A Markdown viewer shows no doubled outline; a plain-text view (Drive's preview of a .md file) shows the fence marks and the raw headings. The section is already the last but one (only "Cost of this run" follows). So D-items do not move or cut it. Its size is NOT IN SCOPE (below).
SEARCH rev 1 (live engine daf5da98, fetch-back ask530/w4/write/fetchback_engine_530.json):
- Format Markdown jsCode 110,378 characters, md5 874fd7af, equal to the copy searched above (W4 10741 item 1). It returns {fileName, md, chars, judges, run_token}. nm(seat) gives the display name.
- The wiring is Get Guards -> Format Markdown -> Plain Rule Lines -> Save to Drive. No other node reads either node.
- Plain Rule Lines jsCode 3,708 characters, md5 a1c564b4. It splits x.md at "\n## What the judges were sent\n" into HEAD and TAIL, rewrites the CLAUSE lines in HEAD only, and builds AGM (from Accept Final) and COST (from Get Row). It returns md = HEAD + AGM + TAIL + COST, with codes_left counted over HEAD.
- Save to Drive (createFromText) reads $json.md and $json.fileName only.
- In the 41418 file, "## The judges' agreement" is at character 404,896, before "What the judges were sent", as md0 + AGM + TAIL gives. Eight seats are under it, and six of them were not seated.
- The 41418 removal reason, stored text: "NOT COUNTED: 6 debate rule violations not cured (E-COL UNCURED x2; COLLISION GRADE UNCURED x2; SEND-BACK SILENCE x2; ...)". It holds no "AUDIT v".
NOT SEARCHED: the child workflow's nodes after its own outputs. The child has no Format Markdown and no Plain Rule Lines.
NOT IN SCOPE:
- (a) The size of "What the judges were sent" (79% of the file). Moving it to its own file changes the Drive save (backup supremacy, op doc s8), so it needs its own ASK.
- (b) The judges' own lines: sol 6.2's "WHICH HOLDS: CHALLENGER" against "RESULT: UNDERDETERMINED" (held item 2), and qwen 4 max's stale JSON list (held items 1 and 4, pkgCPD, ASK 526). These are judge or engine data, not display.
- (c) The Library's AUDIT text, and its cuts.
- (d) Any count, verdict, outcome or stored row.

## 4. CRITERIA and DONE
Population: run 41418's stored inputs to Format Markdown, replayed offline by W4 (op doc s7, n8n reads are W4's), old node and new node on the same input.
1. D1: the head holds exactly one line per panel seat (3 for 41418). The removed seat's line holds the stored removal reason and the alternate's verdict and RESULT word.
2. D2: one RESULT-words line, reading "CHALLENGER WINS 2, UNDERDETERMINED 1" for 41418.
3. D3: the head (up to "## Citation check of the synthesis") holds 0 "AUDIT v" strings outside Review flag rows and outside the stored removal reason in a D1 seat line, which is stored text that D1 prints whole (it holds 0 in 41418); Review flag rows 14, unchanged in text after their lead. The new section holds every distinct Cured flag text once, and it lies before "## What the judges were sent". The multiset of (judge, text) pairs over the whole file is equal before and after (no record lost, none added). codes_left is equal before and after.
4. D4: the agreement section lists the placed seats first by display name, then the one line naming the others, then their blocks. The set of seats named, and the multiset of quoted acceptance and return texts, are equal before and after. The Cost section is byte-equal.
5. D5: the legend names [CR1] to [CR4] and [DR1] to [DR4]; the eight round headings carry their labels; the judges' sections are byte-equal before and after.
6. D6: no Format Markdown cut ends inside a word; every cut text is a prefix of its source at a word end, followed by "...".
7. D7: the fixed line stands once, directly above the synthesis; the synthesis text is byte-equal.
8. Every section not named in D1 to D7 is byte-equal before and after. This is measured against a second build of the new nodes with D6 switched off (the old slice(0, n) cuts), because D6 changes text in sections D1 to D7 do not otherwise name. Criterion 6 then compares the two new builds at the cut sites only, and they differ nowhere else.
9. W2 reads the whole new head and the new section in the produced 41418 copy, for sense.
DONE: criteria 1 to 9 PASS, the write card pressed, and the first run after the write shows the new head (until then UNEXERCISED).

## 5. WRONG-IF
The plan is wrong if the head must keep the cured flags for the operator to follow a run, i.e. if any cured flag in the head records a change to a count or verdict that the head does not otherwise show. Check run before posting, on 41418:
- Known-good case: the 48 Cured flag rows. Each reads "CURED by the seat's cure reply; recorded, not for review", or "CURED at the late gate". None changes a count the Result table does not already show, because the counts in the table are the post-cure counts ("corrected by the cure").
- Known-bad case: the Review flag rows (14). These are the rows the operator must see, and they stay in the head.
If a later run shows a Cured flag row whose cure changed a count without the Result table saying so, D3 returns to the planner.

## 6. RUN EVIDENCE
NO PROBE (ASK 417 registry): a display change has no engine path to fire. The first run after the write is read in Drive by the grader against criteria 1 to 7.

## 7. INPUTS IN GIT
ask529/w3/plan529.md (rev 1), ask529/w3/plan529_rev0.md and ask529/w3/items529.md (this commit). The 41418 transcript is in Drive (file id 1rG-mLAJ5DSHXzyNKbbcTk8HKVkfmSzcW); its md5 is above.

## 8. STEPS
1. W2 grades this plan.
2. It is held until the coordinator says transcript work may start (operator 11-18 21:00 CST).
3. W4 builds the Format Markdown and Plain Rule Lines targets on the live engine, replays 41418 through both nodes (old pair, new pair, and the new pair with D6 off), and posts the three outputs' md5s and the criteria counts.
4. W2 grades the build, reading the produced copy.
5. W4's write card (engine; Format Markdown and Plain Rule Lines only). On the press, W4 writes and fetches back.
6. The first run after the write proves it.
