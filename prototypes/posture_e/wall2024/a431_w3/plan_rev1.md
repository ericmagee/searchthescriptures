# ASK 431 plan rev 1 (W3; replaces rev 0, takes W1 9099 C C-1, N1, N2; the coordinator moved it from W4 to W3, 21:28 CST 11-18): the judges' GLOSS CHECK reads the ", meaning" gloss form

1. OBJECTIVE. A debater's gloss written as word (Gnnnn), meaning "gloss" is read by the gloss check like the forms it already reads (word (Gnnnn), "gloss"; word (Gnnnn): "gloss"; word (Gnnnn) meaning "gloss"). Today it is not read: the number test allows one separator after the number, and ", meaning" is two (W4 8729 item 3b). In run 39015, DR1's glosses for G4905, G3933 and G2675 in that form were not checked, while the same debater's DR2 glosses in the comma form were. Expected effect: these quotes reach the GLOSS ADDED test (the quote against the lexicon entry of the number it names) instead of falling to the 60 per cent overlap test, which dropped them. THIS IS JUDGE-FACING: __GLOSS feeds the "GLOSS CHECK -- computed by the system" line that Panel Build and Build Independent Verdict print to every judge (W4 8729 item 1). So the GLOSS CHECK counts the judges read change on runs that use this form. It needs the operator's ruling before the build.

2. ROLES. Planner W3. Builder W3 (the coordinator moved the item off W4). Graders W1 and W2. Write: W4, on the operator's card in W4's thread.

3. SCOPE. L2 Count Plan in the engine, line 182 only (live 06967796): the two separator patterns in the QQ map, numd and n0, both today "\)?\s*(?:,|:|means|is|meaning|=)?\s*$". They become "\)?\s*(?:[,:=]\s*)?(?:means|is|meaning)?\s*$", which accepts one punctuation mark, then one of the words, then the quote, and keeps every form read today. Nothing else changes: not the GLOSS ADDED or WHOLE/PART tests, the 30-character look-back, the QP (parenthesis) path, Quote Report, Panel Build or the GLOSS CHECK line text.
SEARCH (W3, on a fresh fetch of live engine 06967796 and child e1f2b1c4): __GLOSS is defined and called only in L2 Count Plan (lines 173 and 197); the child and the Shared Library hold no copy. Readers (W4 8729 item 1): Quote Report copies its output to l2.gloss; Panel Build and Build Independent Verdict print it to the judges. ASK 430 (W1 9086) and ASK 436 (W1 9089) also change L2 Count Plan, in other lines (forms at line 166, the renderings list at 167); the three stack on one target.

4. CRITERIA and DONE.
- C1. The target differs from live only in line 182 of L2 Count Plan (on top of 430 and 436 if they are written first); ASK 385 check PASS; reasoning guard clean; lib_sha unchanged.
- C2. Replay of the L2 chain on the stored ODV1 runs, old against built, with a tool that runs the live node: a430_w1/chain430.cjs (commit 4d46fbb4), whose $('Shared Library') answers .params as L2 Count Plan needs since ASK 409 (the stock a405_w4/chain.cjs cannot run it; W1 9099 C-1). REST to the database is refused from the W1 and W3 containers, so the replay runs where the reads are held: W4's read cache, or W2's database dumps through a432_w2/shim.cjs. The seat that runs it posts the tool, the commit and the run count: every field equal except gloss[]; every changed gloss row is listed with its quote and the 30 characters before it, and each is read by hand. Each must be a quote whose number is followed by punctuation and then a word ("G4905), meaning"), and nothing else. Every row newly read through ", is" is shown in full, since that is the WRONG-IF case (W1 9099 C N1).
- C3. Run 39015: DR1's quotes for G4905 and G2675 (and G3933 if its quote is in the stored rounds) now appear as gloss rows. The count of changed rows over the stored runs is above zero.
- C4. The GLOSS CHECK line each judge would read is rebuilt for every changed run and posted, old against new, so the operator sees the effect.
- C5. Live after the write: rbx 0 diffs against the graded target; W1 and W2 read back.
DONE when C1 to C5 pass, the operator has ruled, and the engine manual carries the entry.

5. WRONG-IF. Wrong if the wider pattern binds a quote to a number it does not gloss, for example 'G4905, is the word Paul uses; "a quote of a verse"'. The hand read in C2 must flag any such row; a planted known-bad case ("(G4905), is used in Matthew 1:18: "came together"", which the existing \d+:\d+ guard should drop, and one without a verse reference) shows the check can fail. Any real case sends the plan back.

6. RUN EVIDENCE. NO PROBE in SQL that names the form, because AUDIT v57 stores status counts, not the quote's separator. The ASK 417 entry (W3 adds it) is: case = a run where a debater writes word (Gnnnn), meaning "..."; mark = that number appears in the judges' GLOSS CHECK rows. The first such run is read by hand.

7. INPUTS IN GIT. This plan at a431_w3/plan_rev0.md. Build in a431_w3/ (target, replay outputs, the old and new GLOSS CHECK lines).

8. STEPS.
1. W1 and W2 grade this plan. (No card.)
2. The coordinator brings the plan to the operator for a ruling: should the judges' GLOSS CHECK read this form? With it, one fact for the same ruling (W1 9099 C N2): Part B (ASK 406, record-only) also reads "i.e." after the number, which __GLOSS will still not read; the operator may want both readers to take the same forms. (Waits on the operator.)
3. W3 builds on a fresh fetch-back, stacked on ASK 430 and 436 if they are written first. (No card.)
4. W1 and W2 grade the build. (No card.)
5. W4 posts the write card in W4's thread and writes; W1 and W2 read back. (Waits on the operator's card.)
6. W3 writes the engine manual entry. (Waits on the operator's card in W3's thread.)
