# pkgFUN rev 9 (W1): rev 8 with W3's three findings fixed (Wall 4085, grade_FUN8_w3.md). Offline; not for write until the operator says.

Rule in one sentence: a K-S3 answer that opens with COUNTED (or with "Yes."/"Agreed."/"Correct."/"Confirmed." alone and then COUNTED standing as its own
sentence on the next line) is cured unless the whole answer, with the lines under it, is one listed refusal, and then it reads UNCURED; "TOUCHES NO LINK:"
with its reason on the next line is read exactly as the same words on one line.

Changes against rev 8 (build_FUN9.cjs = build_FUN8.cjs plus three edits):
- F1: "my count" removed from the subject list of the "(count) is wrong" refusal (list B). "COUNTED. My count is wrong." (+ CORRECTED COUNT) cures, as live. "The count is wrong" and "My count stands" stay refusals.
- F2: E3 applies only when COUNTED on the next line is followed by . ! : ; , a dash, or the end. "Yes.\nCOUNTED is wrong." and the like read as live (UNCURED).
- F3: E4 joins the reason line with a space instead of ". ", so the separator no longer counts as a word. "TOUCHES NO LINK:\nI refuse to answer." reads UNCURED, as the one-line form.

Size: Shared Library 604,776 to 605,474 characters (+698, +0.12%; rev 8 was +665). No prompt text, no model call, no log field.
Write file pkgFUN/parent_s105_FUN9.json: 418 nodes; against live s105 (fetchback_live_s105.json) only the Shared Library differs. Pack pkgLIB_KRO2_KSL_FUN9 (every stub rebuilds).

Checks
- w1_cases_FUN9.txt: 23 of 23 as labeled (labels a4bf0b33, before the build). My rev 8 label N17 is withdrawn (now F1b CURED, W3's ruling).
- W2's full set, 623 cases (w2_623_base_FUN8_FUN9.txt; columns base KRO2+KSL, rev 8, rev 9): rev 9 583 match; no case where rev 9 is wrong and the base right;
  the one correct answer refused ("TOUCHES NO LINK.\nIt does not touch D1 to D6 ...", a period instead of a colon) is refused by the base as well.
- Every W3 grade file w3_good2-8, w3_bad2-8b (w3_sets_on_FUN9.txt): 0 correct answers that live cures are refused; 0 refusals that live refuses are cured.
  Same-as-live notes stand (3 correct answers live also refuses; refusals not on the lists still cure with a note).
- gate_FUN9.txt on fetch-back s105: 767 node runs byte-equal, target item changes 0, 17 near-miss checks passed: GATE PASS.
