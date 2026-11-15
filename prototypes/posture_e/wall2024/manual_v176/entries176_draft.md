# Engine manual v176: draft entries (W3; write nothing)

Each entry is drafted from the agreed Wall text. Fields marked [AT BUILD] are filled from W4's build post and the
written readback, never from this draft. Each entry goes into v176 only after its own write is live and read back.
Placement: 317 and 318 after the v175 DG-8 entry in section 5; 319 after the pkgPWF rev 2 entry in section 9;
320 near the E-ASSUME entry in section 9; 321 after the pkgNRC entry; 322 in section 5 after 318;
323 after the pkgBKC entry; 324 in section 12 or with the [L2] readers [AT BUILD: the section that holds tags()].
Each written ASK also adds one "WRITTEN AS s2xx" line and moves the Live flow line in section 18.

## 317 and 318 (written 2026-11-15 06:44:47Z; database rows, no node change)
- TWO SIGHTS SERVED TO THE ORACLE IN THE DG-8 SET DROP THE LEGAL FRAMING OF THE ESPOUSAL (kb_sights 555 = Sight 519, ASK 317; kb_sights 374 = Sight 266, ASK 318; Oracle seat only):
  - Why: in check call 37308 the Oracle's round 1 prompt carried DG-8 twice: the live row, and Sight 519 served as "GUARD SET (DG-8)" whose summary still read "Joseph and Mary were husband and wife in law from the espousal". Sight 266 in the same set read "having sex with his legal wife". DG-8 now forbids "wife in law" and "legal husband" (ASK 315).
  - What it does: Sight 519 summary takes DG-8 Edit 1 word for word ("husband and wife from the espousal, as the rows themselves name them", with Luke 2:5). Sight 266 summary "his legal wife (" becomes "his wife, as the rows name her ("; its doctrine (no law of God broken; the scorn is men's tradition, Mark 7:8; the child is Joseph's and he knows it) is unchanged.
  - Reach: guard_served_sets guard 8 (twelve sights) is returned by Retrieve Held Conclusions (rpc/debate_arsenal_guarded) and placed by Init with Guards in HELD CONCLUSIONS inside the Oracle profile prompt only. Judges get the label list (for example "S-519") for the citation check, never the text (Ruling 383).
  - Size: Sight 519 summary 2,552 to 2,615 characters (md5 4c8b7787 to cea0bca2); Sight 266 summary 1,543 to 1,559 (md5 166fe44f to e4cc8dfa); no node changes.
  - Limits: kb_sights.notes still carries "legal" on rows 281 and 374; no node reads notes. Sight 519 "Legal adoption produces no seed" is about adoption and stays. Not shown by a run.

## 319 pkgPWF: test every quote after an [L1] ((b) only)
- AN E-ANS CURE KEEPS ITS [L1] WHEN ANY QUOTE UNDER THAT TAG MATCHES THE ANSWER (pkgPWF, ASK 319, (b) only; Shared Library pwf, LIB 2532 [AT BUILD: lines]):
  - Why: in run 37281 sol's E-ANS cure 40025 was marked UNCURED and sol was removed. pwf() tested only the first quote after the [L1] ("his mother said unto him"); the second quote, which the judge's reason quotes ("thy father and I have sought thee sorrowing"), would have kept it (W2 6662 control D; W1 6666).
  - What it does: pwf() tests every quote after an [L1] up to the next layer tag, not only the first.
  - Size: [AT BUILD].
  - Shown offline: [AT BUILD: replay over the stored pkgABS and pkgPWF rows; 40025 must read CURED].
  - Limits: fix (a) of 6662 (count "the row" as naming the checked verse) is not built (team DISAGREE). Condition 3 (a cure whose only layer verse is the pressed verse does not cure) was withdrawn before the write: it would have turned 21 of 168 stored cures UNCURED, and a press can be answered from the pressed row read whole (W4 6778, W3 6779). fit() was stubbed in the replay. [AT BUILD].

## 320 E-ASSUME reads the Oracle's round 1 list
- THE ASSUMPTION CHECK ALSO READS THE ORACLE'S ROUND 1 ASSUMES CHARGES, MATCHED TO THE ROUND 2 PREMISE BY QUOTED TEXT (E-ASSUME option (a), ASK 320; Assume Check Build):
  - Why: in run 37281 E-ASSUME skipped ("no UNSUPPORTED-L4 premise carries ASSUMES", row 39566). Assume Check Build reads only vp4List(F.gr2,'DEFENDER') and vp4List(F.cr3,'CHALLENGER'); the Oracle's round 1 held ASSUMES 6 times and its round 2 held it 0 times (W4 6664). So pkgBNS, pkgNSG and pkgBKC (ASK 313) could not act.
  - What it does: when a round 2 premise carries no ASSUMES, the node takes the ASSUMES charge of the round 1 premise whose quoted [CR] text matches it. It never matches by number, because the lists renumber between rounds (in 37281 round 2 premise 5 is round 1 item 3, W2 6721).
  - Size: [AT BUILD]; calls: one more DeepSeek reader call per added premise [AT BUILD: measured count].
  - Shown offline: [AT BUILD].
  - Limits: option (b) (a judge's own ASSUMES clause as the source) is withdrawn; it would pass pkgBKC's two-word test by construction (W1 6675, W4 6677). Whether E-ASSUME returns BOTH NOT STATED is a model output and is not replayed without a paid call. [AT BUILD].

## 321 close-enforcer heading backstop
- A CLOSE THAT RESTATES A NARROWED LINK'S ROUND 1 HEADING IS RAISED AS A CANDIDATE (ASK 321; [AT BUILD: node]):
  - Why: in run 37281 the close enforcer ruled defender link D4 NOT A CONTRADICTION twice (39558); the round 4 chain line restated the round 1 heading the round 2 narrowing had dropped ("Texts naming Joseph as father report supposition or speech, and are corrected"). The judge-stage enforcer then confirmed it (J1).
  - What it does: for each defender link that a round 1 to 3 sentence narrows (pkgNRC's cecNar list), compare the round 1 heading with the round 4 "**Dn**" heading as normalized word sets; at Jaccard 0.8 or more the pair goes to the close enforcer as a numbered candidate. It is a candidate only; the DeepSeek check decides (W4's condition). Containment is not used.
  - Size: [AT BUILD].
  - Shown offline: over 62 stored debates, 56 narrowed links with both headings; highest overlap 0.60; 0 pairs at 0.8; 37281 D4 = 1.0 (W2 6679).
  - Limits: link attribution from narrowing sentences is loose; one positive case; a narrow backstop, not a broad catch.

## 322 Oracle gloss-fidelity line
- AN [L2] MEANING IN THE ORACLE'S ROUNDS IS THE LEXICON GLOSS IN ITS OWN WORDS (ASK 322; GUARDHOLD, profile oracle branch of Init with Guards; Oracle seat only):
  - Why: in run 37281 the Oracle glossed nomizo (G3543) with words the lexicon does not carry, and set aside its sense "suppose" (Worker_A3 6705 item 9). G3543's anchor_gloss: "from νόμος; properly, to do by law (usage), i.e. to accustom (passively, be usual); by extension, to deem or regard:-- suppose, thing, be wont."
  - What it does: adds one line to GUARDHOLD: "[L2] FIDELITY. An [L2] meaning is the lexicon gloss as served, in its own words, or a shortened run of them marked with "...". Add no word the gloss does not carry (rightly, truly, merely, only, really, or any judgment of your own). What a word "shows" in your case is [L4] and must be labeled [L4]. Where the gloss carries a sense against you (for nomizo, "suppose"), state it and answer it; do not drop it."
  - Reach: GUARDHOLD is on the Oracle branch only; the plain seat, the judges and the enforcers do not see it (Ruling 383; W2 6731).
  - Size: [AT BUILD] (the line is [AT BUILD: counted] characters per Oracle prompt).
  - Limits: text only, no reader checks it. In check call 37308 MiMo's nomizo line still added "carries no verdict of its own" (written before this line). Not shown by a run.

## 323 combined gate fix (K-UNX plain path)
- THE K-UNX GATE OFFERS THE ASSUMES ROUTE ON ITS PLAIN PATH, STOPS READING AN [Ln] INSIDE AN ASSUMES CLAUSE AS A MISSING LAYER, AND SAYS WHERE THE COLLISION GRADE GOES (ASK 323; judge cure prompt K-UNX gate line, both copies; kunxLines plain branch, LIB 466 [AT BUILD]):
  - Why: in run 37281 luna counted defender premises 5 and 6 UNEXHIBITED on an assumed fact ("assumed Davidic descent through Mary"). UNXA_ASM = /\bASSUMES\b/ is case-sensitive, so the lowercase line took the plain path, whose prompt never offers ASSUMES; the gate then moved the count to 0 (40042, 40043; W2 6718). A cure written as the gate asks ("quote the block's [L1]") was then flagged by the plain check, which read the "[L1]" token as a claimed missing layer (W2 6731 1c). Separately, the gate cure wrote "D5 vs C6 (Acts 2:30): DEFENDER LINK BROKEN" inside the CONCEDED LINKS line, so E-KEY still read UNDERDETERMINED and the verdict did not count it (W1 6728).
  - What it does: (a) the plain path's prompt adds "or, if the step takes for granted a fact no row gives, write ASSUMES: <that fact> and quote the block's [L1]"; (a2) in kunxLines' plain branch, [Ln] tokens inside an ASSUMES clause are dropped before unxLack reads the named layers; (4a) after "(a FORCED line, ruling 411)" the gate line adds "Write that grade as the pair's own line under COLLISION POINTS, in place of the pair's earlier line, never inside the CONCEDED LINKS line." The earlier line is kept in the cure log (W3 condition); both copies and every COLLISION POINTS reader change in step (W4 condition).
  - Size: [AT BUILD].
  - Shown offline: luna's line reproduces gate row 40042 on the plain path; the ASSUMES form without the [L1] token takes the ASSUMES path, and with a stubbed BOTH NOT STATED fact pkgBKC closes it (W2 6731). [AT BUILD: (a2) replay over 62 debates].
  - Limits: these are grading forms, not guard text, so Ruling 383 is met. Whether a judge now writes the ASSUMES form is not shown without a run. 4b (audit marks for a pair graded twice) is not part of this ASK.

## 324 G-number grant labels in [L2] lines
- A "(Gn)" THAT POINTS TO A GRANT LABEL IN THE SAME ROUND IS NOT READ AS A STRONG'S NUMBER (ASK 324; Shared Library tags() LIB 158-164 and countClaims() LIB 198-204 [AT BUILD]):
  - Why: in run 37281 the Oracle close's [L2] line "[L2] *gennaō* (G1080) passive with the feminine relative. The defender grants that *ek* "marks mothers in all three" (G5)." had its whole tag marked NOT COUNTED, valid G1080 included, because tags() took "(G5)", a pointer to the grant "G5 [CR...]", as Strong's G5, which is not in Matthew 1:16 (W1 6743).
  - What it does: skip a G token when (1) the same round has a line starting "G<n> [CR" or "G<n> [DR" with that n, and (2) the token is not in the Strong's citation form: an italic or starred transliteration, or Greek or Hebrew script, then an optional space, then "(Gn" or "(Hn". A list continuation such as "(G21, G22)" is not the citation form (W2 6745).
  - Size: [AT BUILD].
  - Shown offline: 42 hits in 18 debates (W1), 63 to 67 under a wider label pattern (W2, W1), all in challenger_r4; 0 in citation form by hand (W2 6745); a synthetic "*abba* (G5)" with a G5 grant label in the round stays counted (W4 6746 condition) [AT BUILD].
  - Limits: the same token is counted through Citation Scan, L2 Count Plan and PRS_LB; any reader that would still void the tag changes in step (W4 6746) [AT BUILD].
