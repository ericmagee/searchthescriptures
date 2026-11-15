# Engine manual v177: draft entries (W3). HELD until each ASK is approved, built, written and read back.
Sources: ASK 325 plan 6844 with revision 1 at 6863, plants 6846, baseline W1 6842. ASK 327 and 328 proposal 6864, W1 baseline 6872 (a327/w1_baseline.md, fc638c5c), W3 marks 6837 and 6869.
Every [PENDING] field is filled from the build's own readback and grades. Nothing below describes live code until the matching WRITTEN AS line is added.

## ASK 325 (close enforcer misattribution), section 6 under the close enforcer, after the pkgNRH entry
- A CLOSING CONTRADICTION WHOSE EARLIER WORDS ARE THE OTHER SIDE'S, ONLY QUOTED BY THE FLAGGED SIDE, IS NOT COUNTED AGAINST IT (ASK 325; Close Enforcer Record):
  - Why: in run 37372 the close enforcer confirmed a contradiction on challenger link 1 three times (40639, 40640, 40641). Its EARLIER sentence ("the row bounds the not-knowing at the bringing-forth of the firstborn, so any knowing the record allows stands after the birth") is the defender's own round 3 MEANS line. The challenger only quoted it under "MEANS [CR3] P1.3" and answered it. The stored outcome DEFENDER PREVAILS rested on these rows.
  - What it does: a CONFIRMED row is demoted only when its EARLIER words are found in the other side's round text and not as the flagged side's own claim. The test reads the round text, never a heading or label (W3 6837 C2). A miss or an unreadable case keeps the row as CONFIRMED (fail-safe, C1). Both sides are treated the same way (C3). A true contradiction found by this checker or by the judge-side checker is left as it is.
  - Size: [PENDING].
  - Shown offline: [PENDING; DONE requires exactly 3 flips (40639 to 40641) over the 121-row population with 35 CONFIRMED rows, every other row unchanged, and all 10 plants (a325/w4_plants.json) as expected].
  - Limits: the judge-side checker's confirmation on challenger link 1 in 37372 (40644, 40645: "till bounds abstinence to the pregnancy after the taking" against "the abstinence bounded by till stands after the bringing forth") is a real contradiction and is untouched. 37372's stored outcome is not re-derived. Whether cfo_sides should count judge-side confirmations is the operator's question, outside this ASK (6863). No prompt line is added ((b) held). Live and UNEXERCISED until a run fires it.
  - WRITTEN AS [PENDING].

## ASK 327 rev 2 (removal view), section 10 under alternates
- THE debate_removals VIEW NAMES THE RULES AND THE ALTERNATES TRIED FOR A SEAT THAT WAS NOT COUNTED (ASK 327 rev 2; database view only; no table write, no n8n change):
  - Why: in run 37372 sol (HELD) was not counted for drv_uncured 2 (K-C cure x1, E-GATE CONTRADICTION x1). Hydrogen was tried twice and was NOT SEATED. The removal is stored in sol's judgment row and the view debate_removals ("not_counted"), but on that path removed_rules was NULL and the alternates tried stood only as text in the row (W4 6875 B, 6879). drv_removed is a list of replaced seats by design and stays so; adding unreplaced seats would break the recorder function, Format Markdown and the view (6879 item 3).
  - What it does: [PENDING on the build]. Planned: on "not_counted" rows only, removed_rules is read at view time from the row's stored "REMOVED FOR:" text, and a new last column alternates_tried holds each stored ALTERNATE TRIED line (seat, alternate, model, result, why). A row with no such line, or one that does not parse, gives NULL, never a guess. "replaced" rows and all old columns are unchanged. panel_split is unchanged [PENDING: option (a) or (b)].
  - Readers: no database function, view or n8n node reads debate_removals or odv1_drv_removals (W4 6879).
  - Shown offline: [PENDING; 37372 sol row shows the two rules and two hydrogen tries NOT SEATED with reasons; every other row identical in old columns; row count identical; "ALTERNATE: none" rows parse; unparsed rows counted].
  - WRITTEN AS [PENDING].

## ASK 328 (failed alternate USAGE line), section 10 under alternates
- A FAILED ALTERNATE REPLY RECORDS ITS USAGE AND FINISH REASON (ASK 328; Shared Library, the alternate_reply logging; record-only):
  - Why: in run 37372 both hydrogen alternate calls failed: the first returned no content with finish reason length, and the second was cut before a whole JSON object. The reply_error carried the finish reason as text, but no token counts and no limit (W4 6862, 6864).
  - What it does: when an alternate reply fails, reply_error ends with one line "USAGE: prompt=<n> completion=<n> reasoning=<n> finish=<reason> max_tokens=<n>", writing "not reported" for any value the provider does not give. max_tokens is read from the request body built for that call. The body is not changed (byte-identical).
  - Shown offline: [PENDING; 37372 expected lines W1 6872: prompt=104006 completion=64000 reasoning=63997 or 56380, finish=length, max_tokens=64000; successful rows unchanged; Format Markdown's TRIED pattern still closes on "]"].
  - Limits: this records only and changes no request field. It is not grounds to propose any reasoning, effort, thinking or limit setting without the operator's own instruction (§4, NO REASONING FIELD; W3 6869 C3). Live and UNEXERCISED.
  - WRITTEN AS [PENDING].

## Correction to the v176 ASK 323 part 1 entry (W3 Wall 6916; Worker_A3 6912)
- In the K-UNX gate entry, after "Three options, none preferred.", add: "The case-sensitive UNXA_ASM pattern was a code misread. Offering the ASSUMES route on the plain path extends the gate rule to a case its stated rule did not reach (an assumed fact with no row); that extension was the operator's decision, given by his card for ASK 323."
- Open for the operator (Worker_A3 6912 item 8): whether a removal applies when a judge's grade matched the send-back's own. ASK 319 (pwf reads every quote) is a misread fix and does not answer it.

## ASK 330 (gate form for an assumed fact) and ASK 331 (Option A removal test). The operator's words, 2026-11-15 14:56:43Z (08:56 CST): "approved. proceed and assign". Text approved: the team's amended forms (Wall 6919 to 6928: ASSUMES written by the judge; one grade-or-count test; fail-safe), which the coordinator's post to the operator at 08:53 CST stated exactly (confirmed by the coordinator, 15:00Z). HELD until each is built, graded, written and read back.

### Rule wording (for section 4 or 8, rulings; the operator's ruling of 14:56Z on the team form)
- RULING 460 (operator, 2026-11-15 14:56Z), EXTENDING RULING 421 TO THE K-UNX GATE AND ITS CURE CHECK: a premise counted UNEXHIBITED at the K-UNX gate may give as its reason an assumed fact with no row, in this form, on one line:
  STEP: "<the side's own words that take the step>" -- ASSUMES: <one fact the step takes as given> -- ROWS GIVE: "<the cited rows' words as written>".
  - STEP is a verbatim quote from the side's own rounds. ROWS GIVE quotes the cited verses verbatim. Code checks both against the text.
  - ASSUMES is written by the judge. It names one fact. It is never the opponent's or the debate's contested conclusion (that is a dependency, graded PROP-DEPENDENT), and never an inferred act ("an inferred act ... is never an ASSUMES", the live judge prompt's bar). A dependency is graded as one; the grade name PROP-DEPENDENT is the team's reading (W3 6919), not part of the operator's approval.
  - The charge fails when the side has laid out a chain to that fact with the links shown. ROWS GIVE never demands one verse stating the premise or conclusion.
  - An answer in this form can be CURED at the K-UNX cure check, as a named layer or a CORRECTED COUNT can.
  - Ground: rulings 421 and 460 and the text check. The judges grade the text alone; no guard text is read (Ruling 383).
- RULING 461 (operator, 2026-11-15 14:56Z), REMOVAL TEST, OPTION A: it applies alike to panel seats and to alternates. When a judge refuses a send-back's correction (UNCURED), the refusal is recorded as UNCURED. The seat stays counted only when code shows the grade word and every count field of the judge's line identical to the send-back's CHANGE TO line; for a seat that stays counted, the send-back's line replaces the judge's line. The count fields are [W4 6932 item 5, to be quoted from the build: CONCEDED LINKS, CHALLENGER CONCEDED LINKS, n, w, k, L, c]. Record-only rows (E-REREAD, and GATE KEEP marked RECORD-ONLY) are not removal items and stay out of the test. When that cannot be shown (no send-back grade, as in a K-C cure refused for "no RESTATED line", or the line cannot be replaced), the seat is removed as before.

### ASK 330 entry, section 8 under the K-UNX gate (after the ASK 323 part 1 entry)
- THE K-UNX GATE AND ITS CURE CHECK ACCEPT THE STEP / ASSUMES / ROWS GIVE FORM (ASK 330, ruling 460; Shared Library K-UNX item builder and cure reader):
  - Why: in run 37281 luna counted defender premises 5 and 6 UNEXHIBITED on an assumed fact ("assumed Davidic descent through Mary"); the defender's close reads "I rest this route on Romans 1:3, Luke 1:32 and Luke 1:35, and not on Mary's genealogy stated in a row." The gate's stated rule accepted only a named missing layer, and the cure check could never CURE an ASSUMES answer (W2 6921 b), though ruling 421 already stood in the judge prompts (W1 6920 a). Whether the rule reached this case was the operator's question (Worker_A3 6912 item 3); he ruled at 14:56Z (ruling 460).
  - What it does: [PENDING on the build; per the rule wording above].
  - Shown offline: [PENDING]. Expected from the record: no seat or count moves in 37281 or 37372; luna's 37281 lines carry no STEP quote, and its 37372 ASSUMES names contested conclusions (W4 6922 items 4, 5; 6926 item 3).
  - Limits: [PENDING]. Live and UNEXERCISED until a run fires it.
  - WRITTEN AS [PENDING].

### ASK 331 entry, section 7 under panel removal (debate rule violations)
- A JUDGE OR ALTERNATE WHOSE UNCURED LINE CHANGES NO GRADE AND NO COUNT KEEPS ITS SEAT (ASK 331, ruling 461, Option A; Shared Library send-back record step):
  - Why: in run 37281 sol was removed for one uncured answer check (40025, Luke 2:48 [CR4]) whose grade, MEETS, matched the send-back's own. Whether removal should apply there was the operator's question (Worker_A3 6912 item 8); he ruled at 14:56Z (ruling 461).
  - What it does: [PENDING on the build; per the rule wording above].
  - Expected from the record: 37281, sol keeps the seat and hydrogen is not called; the counted panel is chatgpt, luna, sol, all BROKEN, outcome unchanged (W4 6922 item 6, 6926 item 2). 37372, sol stays removed (its K-C cure has no send-back grade), so no re-derive. A COUNTED uncured line that moves a count (for example CHALLENGER CONCEDED LINKS 0 to 1) removes the seat. Hydrogen's own 37281 rows of that shape (40161 to 40163) were record-only ("RECORD-ONLY TRIAL, ruling 428"), its drv_uncured was 0, and they never counted (W1 6935).
  - Shown offline: [PENDING]. Limits: [PENDING]. The team's reading, from the v176 ASK 319 entry (W2 6781, W1 6780: case 40025 "live UNCURED, (b) CURED" in the offline test): ASK 319's pwf fix turns 40025 CURED, so 37281 is not itself a live case. Not measured on a run.
  - WRITTEN AS [PENDING].


Ruling numbers 460 and 461: the highest three-digit "ruling N" in the record is 459 (the_wall 3792, 4551; engine_manual v176 reaches 428; md_notes_rulings reaches 444). Four-digit "ruling NNNN" references on the Wall are a different series (post ids). Confirmed by the coordinator, 15:00Z. E-GATE CHANGE TO rows take the same ruling 461 test on the same code path, with the same fail-safe; GATE KEEP rows marked RECORD-ONLY stay out. The operator ruled the scope a team design decision (15:03:57Z: "Your question is a design question... that's a team decision"); the team agreed to include it (W2, W3 6936, W1 6942).

## ASK 329 ([L2] binding TRIAL, record-only), section 8 under the [L2] TAG CHECK, after the pkgGLB entry. Operator approval 2026-11-15 15:03:57Z ("all approved."). HELD.
- A RECORD-ONLY TRIAL BINDS EACH [L2] TAG TO ITS OWN ITEM AND REPORTS A TAG THAT PASSES ONLY THROUGH ITS SECTION (ASK 329 rev 2; L2 Count Plan and every L2C copy, trial field l2_trial; readers Build Save Body and Format Markdown only):
  - Why: a tag whose own text names no verse is bound to every verse cited in its section, and counts when the word stands in any of them. In run 37372 the defender's round 3 tagged tiktō (G5088) at Luke 1:35, where the record has gennōmenon (G1080); it printed COUNTED because the section also cites Luke 1:31, which holds G5088. Over 101 debates, 116 such numbers passed by section alone; the hand reads found 65 wrong bindings, 9 cross-language tags, 1 same-language contrast and 41 right bindings in forms the section rule covered (W4 6884, 6902; W2 6893; W3 6891 as corrected in 6898).
  - What it does: [PENDING on the build; per 6902 B and C: own text; forward only in the pipe form "[L2] <tag> | [L3] <ref>"; a line whose [L1] names two or more verses binds every reference in the line; a one-verse [L1] binds backward only; a bare chapter:verse is read under the last book named; else the section, as today. A tag that passes today only through its section takes one trial class: numbering pair (H2029/H2030 only; the list changes only on the operator's word), cross-language (a flag only, never NOT COUNTED, until the operator rules on the class B question), REVIEW, or NOT COUNTED with its reason. A number that fails today never becomes COUNTED.]
  - Reach: TRIAL, record-only. Panel Build, Build Independent Verdict, the enforcer path (drvCheck), kl2Lines and K-KJV, L2 Count Plan's count numbers and the existing AUDIT v28 line are unchanged (W4 6897, 6903). Moving from TRIAL to live status is the operator's decision after a graded run; it changes what the judges grade from (Ruling 383).
  - Shown offline: [PENDING; criteria 6902 E1 to E3 and 6903 items 10 and 11; rows 63, 65, 71, 77, 97, 98, 108 COUNTED; 109 (the 37372 case) NOT COUNTED; 107 and 112 cross-language flags (W3 6904)].
  - Limits: [PENDING]. Open for the operator: the class B question (W3 6888).
  - WRITTEN AS [PENDING].
