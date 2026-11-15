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
