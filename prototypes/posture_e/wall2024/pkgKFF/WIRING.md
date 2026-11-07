# pkgKFF: K-FF, a FORCED line's FAILS that is only verse words (W1 Wall 2768; W3 ruling Wall 2769)

## Gap
- K-F checks only that the FAILS quotation stands in the ANSWER round.
- So a FAILS that quotes only a verse the answer cites passes. Examples: 33197 chatgpt D1 vs C1 quotes Deuteronomy 20:7, and D4 vs C5 quotes "Thou art my Son, this day have I begotten thee".
- Under ruling 411, what fails is the answer's reading. A verse quotation says what the verse says.
- Root cause: the form told judges that FAILS quotes "the words of the layer of that answer". A layer is often a verse quotation.

## The rule (W3 2769, TRIAL, side-neutral)
K-FF is raised only when all three hold:
- **(a)** every word of the FAILS quotation (krulNorm) stands inside one KJV verse as the run read it (Cited Verses, from kjv_verses);
- **(b)** the ANSWER round quotes that verse as a verse quotation (its reference and quote marks, in either order), and the FAILS words stand inside that quotation;
- **(c)** the FAILS quotation is 4 words or more.

A verse the run did not read is NOT CHECKED: it raises no item.

## Cure
Any one of these cures the item:
- a FORCED line for the item whose FAILS is not only verse words;
- RETRACTED with its reason and one CORRECTED RESULT;
- a RESTATED line not graded LINK BROKEN.

No change is refused and no count is written. ENF_STATUS is 'K-FF':'TRIAL', and the mark ends "not counted in audit_flags". As with every TRIAL rule, Eric's silence rule (reply 2185) applies: an item left with NO WRITTEN RESPONSE counts in drv_uncured.

## Edits (base: live s28 = 4f62e6cf, fetchback_live_s28.json; 24 nodes)
| Nodes | Edits |
|---|---|
| Build Independent Verdict, Panel Build | __R396F: the FAILS placeholder now reads "the answer's own words that fail to show the fit ... its reading, not only the words of a verse it quotes", plus one sentence on K-FF |
| Extract Independent Verdict, Panel Payloads, Alternate Payloads | the library (kff_lib.js, inserted before kfcLines), a kffLines call after the kfcLines call, and ENF |
| the 19 cure and gate nodes | the library, ENF, the 3 rule lists (cureLabel, cureAsk, res keys), and the K-FF cure block before K-FC's |

The gate re-read (gateNewK2024) is not changed. K-FC is not re-read there either.

## Tests: `npm ci --prefix pkgEPK` once, then `node pkgKFF/test_KFF.cjs` gives 21 OK
- **A. Replay** (replay_KFF.cjs): 113 FORCED lines in the saved inputs of 33040 to 33261. Items appear only on 33197 D1 vs C1 (Deuteronomy 20:7), 33197 D4 vs C5 (the Son verse) and 33249 D5 vs C1 (the whole of Matthew 1:25, chatgpt). 33276 has no Panel Build body saved.
- **B. Hand cases from the stored record** (fixture_962_974.json, cut from debate_results [DR3] and kjv_verses):
  - 962 grok: Matthew 1:19.
  - 974 grok: Luke 1:35, Matthew 1:16 and Luke 3:23.
  - Each raises one item.
- **C. Controls:**
  - the answer's own sentence: no item;
  - the debater's own sentence that embeds verse words: no item;
  - a verse phrase the round does not quote as a verse: no item;
  - a FAILS under 4 words: no item;
  - a verse not read: NOT CHECKED.
- **D. Parity:** Panel Payloads on 33218 and 33222, and Panel Cure Check on 33218, give output identical to base.
- **E. In-node run on 33249:**
  - patched Panel Payloads gives chatgpt one K-FF item;
  - Panel Cure Build 2 carries it in the cure prompt. The excerpt is in cure_prompt_33249_chatgpt.txt.
- **F. The cure block** (Panel Cure Check on 33249, chatgpt's reply replaced by a RESPONSE line plus one of these):
  - FAILS rewritten in the answer's own words: CURED;
  - FAILS still the verse: UNCURED;
  - RETRACTED with its reason and CORRECTED RESULT: CURED.
- **G.** Every base equals the live s28 node, and every final matches plan_KFF.json.

## Evidence that the cure form works
In 33249, chatgpt's real cure reply for K-FC already rewrote D5 vs C1 with FAILS "The \"till\" bounds the not-knowing to the span from the taking to the birth.", which is the answer's own words. K-FF passes that line.

## Write and revert
- Write: replace jsCode with patched/<node>.js. Shas are in plan_KFF.json.
- Revert: base/<node>.js.
