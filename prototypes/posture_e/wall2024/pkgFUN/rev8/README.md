# pkgFUN rev 8 (W1): the ENFORCED COUNTED reading, the later step after pkgKRO rev 2 (operator ASK 2 option 3). Offline; not for write until the operator says.

Base: live s104 (pkgKRO rev 2) + pkgKSL rev 2 = pkgLIB/strip_KRO2_KSL, fetch-back pkgKSL/parent_s104_KSL.json. W4 is writing pkgKSL rev 2; when the
new live fetch-back exists, rebuild with `node pkgFUN/build_FUN8.cjs` on it and confirm the base equals it (expected: same library).
Write file pkgFUN/parent_s105_FUN8.json (repacked on live s105, 4b5d599a; byte-identical to parent_s104KSL_FUN8.json; s105 equals the KSL parent node for node): against s104 + KSL rev 2 only the Shared Library differs. Pack pkgLIB_KRO2_KSL_FUN8 (every stub rebuilds).

Changes (26 library files, the K-S3 line and pkgKSL's other-item test):
- E1 enforce: pkgKRO's COUNTED cure is withheld when the whole answer, with pkgKSL's lines under it, is one listed refusal (rev 7 whole-answer
  reader); the answer then reads UNCURED as before pkgKRO. Every other note stays record-only.
- E2 a quotation after the sentence is text that follows (W3 rev 7 case 3).
- E3 "Yes." / "Agreed." / "Correct." / "Confirmed." alone, with COUNTED opening the next line, is read from COUNTED (W3 Wall 4076).
- E4 "TOUCHES NO LINK:" with its reason on the next line is read with that line (W3 Wall 4076).
- E5 a line under the RESPONSE line that names another item but also this item's own number stays in the answer (W1 KSL rev 2 grade, H4).

Measured size: Shared Library jsCode 604,776 to 605,441 characters (+665, +0.11%). No prompt text, no model call, no log field added.

Checks
- w1_cases_FUN8.txt: 20 of 20 as labeled (labels b1067962, before the build). Open labels W2/W3 to confirm: N17 "COUNTED. My count is wrong."
  (enforced as a refusal, as rev 7) and N18 "Counted. The grant stands." (cured).
- corpus_FUN8_run.txt: 520 planted answers from every seat (corpus_FUN8.json: allplants_FUN7 sets, W2's 287, W3's KRO and KSL sets; 2 with
  conflicting labels left out). 0 correct answers refused, except two that W2's 287 labels CURED under "second-line":
  "COUNTED.\nThat is not right." and "**COUNTED**\nI do not accept this count." Rev 8 refuses both; they are refusals on the next line, and
  W2's own pkgKSL cases label "COUNTED.\nThat is not right." UNCURED. Label question for W2.
  W3's w3_bad_ksl2.json holds "TOUCHES NO LINK:\nit concerns no link of the chain" as "reads UNCURED under KSL"; rev 8 cures it by E4, as W3 4076 asks.
- gate_FUN8.txt: 767 node runs byte-equal, target item changes 0, 17 near-miss checks passed: GATE PASS (no stored K-S3 answer says COUNTED).
