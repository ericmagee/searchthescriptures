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

## 319 pkgPWF: test every quote after an [L1] ((b) only) (WRITTEN AS s213)
- AN E-ANS CURE KEEPS ITS [L1] WHEN ANY QUOTE UNDER THAT TAG MATCHES THE ANSWER (pkgPWF, ASK 319, (b) only; Shared Library pwf, LIB 2532; users Send Back Record, Alt Send Back Record and R2 Alt Send Back Record):
  - Why: in run 37281 sol's E-ANS cure 40025 was marked UNCURED and sol was removed. pwf() tested only the first quote after the [L1] ("his mother said unto him"); the second quote, which the judge's reason quotes ("thy father and I have sought thee sorrowing"), would have kept it (W2 6662 control D; W1 6666).
  - What it does: pwf() tests every quote after an [L1] up to the next layer tag, not only the first.
  - Size: Shared Library +191 (945,761 to 945,952 on s212); three MAP lengths move; no other node changes.
  - Shown offline: t.cjs 11 of 11, including the parse of all three users and case 40025 (live UNCURED, (b) CURED) (W2 6781; W1 6780). The written library line equals the graded target_319_bonly line (W2 6832).
  - Limits: fix (a) of 6662 (count "the row" as naming the checked verse) is not built. Condition 3 (a cure whose only layer verse is the pressed verse does not cure) was withdrawn before the write: it would have turned 21 of 168 stored cures UNCURED, and a press can be answered from the pressed row read whole (W4 6778, W3 6779). fit() was stubbed in the replay. Live and UNEXERCISED: no run has fired it.

## 320 E-ASSUME reads the Oracle's round 1 list (WRITTEN AS s214)
- THE ASSUMPTION CHECK ALSO READS THE ORACLE'S ROUND 1 ASSUMES CHARGES, MATCHED TO THE ROUND 2 PREMISE BY QUOTED TEXT (pkgEAG, E-ASSUME option (a), ASK 320; Assume Check Build):
  - Why: in run 37281 E-ASSUME skipped ("no UNSUPPORTED-L4 premise carries ASSUMES", row 39566). Assume Check Build read only vp4List(F.gr2,'DEFENDER') and vp4List(F.cr3,'CHALLENGER'); the Oracle's round 1 held ASSUMES 6 times and its round 2 held it 0 times (W4 6664). So pkgBNS, pkgNSG and pkgBKC (ASK 313) could not act.
  - What it does: for each round 2 premise (gr2) that carries no ASSUMES, P adds the round 1 premise (gr1) whose quoted defender text matches the round 2 premise's quoted [CR] text: normalized equal, or the shorter, of 6 words or more, contained in the longer. It never matches by number, because the lists renumber between rounds. The added premise keeps its round 2 number and LINK, so pkgBKC and pkgNSG line up with the round 2 count, and takes round 1's ASSUMES and ROWS GIVE with bold marks stripped. The challenger side (cr3) is unchanged. F.gr1 is the Oracle's round 1 in a live run (Final Output passes gr1) and in a regrade (Regrade Load sets gr1 from engine_r1) (W2 6783).
  - Size: Assume Check Build 5,695 to 7,516 (+1,821); no other node changes. Calls: not measured.
  - Shown offline: P replayed over every stored debate whose round 1 holds ASSUMES (125 rows, W1 6784; 92, W4 6782): one debate gains premises (37281), 3 premises in all: round 2 premise 2 from round 1 premise 3, 3 from 4, 5 from 6. Round 2 premises 1, 4 and 6 quote sentences round 1 never quoted and are not carried (W2 6783 by SQL, W1 6784 by hand).
  - Limits: option (b) (a judge's own ASSUMES clause as the source) is withdrawn; it would pass pkgBKC's two-word test by construction (W1 6675, W4 6677). A narrowed link whose round 2 quote is new (37281 D4) gains nothing, so its assumption is still not tested (W2 6783). For a round 1 premise in "The defender wrote:" form the first quote of 12 or more characters before ASSUMES is taken; a premise that quotes a verse first would key on the verse (not measured). The DeepSeek call and Assume Check Record are not replayed; whether E-ASSUME returns BOTH NOT STATED is a model output. Live and UNEXERCISED.

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
  - What it does: (a) the plain path's prompt adds "or, if the step takes for granted a fact no row in the rounds gives, write ASSUMES: <that fact> and quote the block's [L1]"; (a2) in kunxLines' plain branch, [Ln] tokens inside an ASSUMES clause are dropped before unxLack reads the named layers; (4a) after "(a FORCED line, ruling 411)" the gate line adds "Write that grade as the pair's own line under COLLISION POINTS, in place of the pair's earlier line, never inside the CONCEDED LINKS line." The earlier line is kept in the cure log (W3 condition); both copies and every COLLISION POINTS reader change in step (W4 condition).
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

## s210, s211, s212: spark seated as a debater; every reasoning setting removed
These replace the v175 text named below. Each changed line is given whole. Sources of the instructions go in the v176 log row only (body law).

A. Section 4, the line that begins "- NO REASONING FIELD:" is replaced whole by:
"- NO REASONING FIELD: no call sets a reasoning, effort or thinking field for any model; every model runs at the provider's default. The request finisher passes a model's own reasoning_details from its earlier turn back to it, which sets nothing. Token limits and temperature are not reasoning settings and stay as stored: MiMo (`xiaomi/mimo-v2.6-pro`) keeps 131,072 output tokens on Panel Build, Reserve Build, Accept Build and the library, and MiMo is in no judge order now (§10). Reasoning, effort and thinking settings change only on the operator's own instruction. No seat adds, removes or adjusts one for any model or call on its own reading. A model that spends its output on reasoning is reported with its measured tokens and finish reason, not re-tuned without the operator's instruction. Node comments that speak of "effort medium" or "max(mt*2,8000)" describe removed code."
(This supersedes the earlier "Standing rule" append; the rule sentences are inside the new line.)

B. Section 10, ALTERNATE HYDROGEN: the two lines "- REASONING EFFORT LOW: the request finisher adds ... No other model's body changes." and "- Why effort low: ..." are replaced by one line:
"    - NO EFFORT SETTING: no request to hydrogen carries a reasoning field; it runs at the provider's default (§4, NO REASONING FIELD). Measured risk: at the default effort one full-body check call, at max_tokens 64,000 and at a request of 128,000 that the provider capped at 65,536, returned no complete verdict because the model spent its output on reasoning. Hydrogen's fitness at the default on a full judge body is not shown."

C. Section 10, ALTERNATES GEMINI AND SPARK: the line "- REASONING EFFORT LOW: the request finisher adds ... The finisher stands in the same 15 places as for hydrogen." is replaced by:
"    - NO EFFORT SETTING: no request to hydrogen, gemini or spark carries a reasoning field, on any call, debater or judge; each runs at the provider's default (§4, NO REASONING FIELD)."
And after the Init Seats line of the same block, one line is added:
"    - SPARK AS A DEBATER: Init Seats ENG holds spark (fam openrouter, mc spark), so spark can be named as challenger or defender. Spark also stays on the alternate list. [CHECK BEFORE BUILD, from W4 6810, not yet read in the code: whether Init Seats removes a debater's own seat from the alternates; write the sentence from the code.] Not shown by a run: a debate where the spark debater's own seat is reached as an alternate."

D. Section 17 (limits), the line "- Node comments in the Build nodes still describe "effort medium" ..." stays as written.
In the pkgMUS rev 3 limit, "(ember, gemini and spark as alternates, reasoning effort low)" becomes "(ember, gemini and spark as alternates)", and "Each model's fitness rests on one full-body check call at effort low." becomes "Each model's fitness rests on one full-body check call at effort low; none has been checked at the default, which is how every model now runs."
In the pkgHYD rev 2 limit, "(hydrogen as second alternate, reasoning effort low)" becomes "(hydrogen as second alternate)", and "The model's fitness rests on one full-body check call at effort low." becomes "The model's fitness rests on one full-body check call at effort low; at the default it has not returned a complete verdict on a full judge body (§10, ALTERNATE HYDROGEN)."
Run 37372 (spark challenger at the default, 11-15) completed every round (W4 6818); it is a debater run, not a judge-body check, and is not cited as fitness for any judge seat.

E. Section 18, the Live flow line: "Live flow: s209 (n8n version f97bdbb6, 455 nodes; Shared Library 946,100 characters, sha f3adbaa1f7064da7)." becomes "Live flow: s213 (n8n version dfcce94c, 455 nodes; Shared Library 945,952 characters, header sha 290dae86d89ac713)." and after "s209 = s208 + pkgBKC (ASK 313, one write)." add " s210 = s209 + spark in Init Seats ENG (one node). s211 = s210 - the hydrogen and spark effort-low statement (15 nodes). s212 = s211 + pkgRDF (every remaining reasoning statement removed: gemini-3.8-flash low, MiMo medium, xiaomi reasoning off; 15 nodes). s213 = s212 + pkgPWF (b) only (ASK 319, Shared Library only)."
[CHECK BEFORE BUILD: the Shared Library header sha form used by the v175 line (sha f3adbaa1f7064da7) against W2 6832's "header sha 290dae86d89ac713"; read both from live, do not copy.]

F. Write register entries for s210 to s213 go in the v176 engine_manual_log row, not the body.
