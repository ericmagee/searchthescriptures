# K-S3 COUNTED test set (W2, independent of W1's rule)

Coordinator 01:14Z 11-10. Labels come from the judge rulebook only (K-S3: "answer in the RESPONSE line with COUNTED, correcting your count, or with TOUCHES NO LINK: <one line naming why it touches no declared link or listed premise>"). They were not checked against any build's rule.

Label rule used:
- CURED: COUNTED opens the answer (plain or under markup) and nothing in the answer takes the count back. A negation, "withdrew", "retracted", "though", "but", "however" that describes the defender, a link, a verse, the round, or W2's own earlier miss does not take the count back. TOUCHES NO LINK with a one-line reason is CURED.
- UNCURED: anything in the answer, in any sentence, that denies the count, the concession, or that it applies; withdraws, retracts or reverses the count; keeps the old count; counts only in part; or no COUNTED keyword at all.

Files:
- cases.txt: 113 cases, `expected|category|answer|reason`. `\n` in an answer is a line break.
- ks3_run.cjs: `node pkgFUN/w2_testset/ks3_run.cjs <strip dir> [<strip dir> ...]`. Puts each answer in 34108 luna's RESPONSE line for K-S3 S3 DEFENDER CR4: #1, runs Panel Cure Normalize 1 then Panel Cure Check, reads the K-S3 row's cure_status. About 2 minutes per strip dir.
- ks3_run_s98_FUN2.txt: column 1 = live s98 (pkgLIB/strip_KCB_base), column 2 = FUN rev 2 (pkgLIB/strip_FUN2).
- ks3_results.json: the same, as data.

Results (113 cases: 69 CURED expected, 44 UNCURED expected):
- Live s98: 73 match. 12 correct answers refused, 28 refusals read CURED.
- FUN rev 2: 82 match. 13 correct answers refused, 18 refusals read CURED.

What live s98 does, from the misses:
1. It reads only the first sentence. "COUNTED. That is not right." and "COUNTED.\nThat is not right." read CURED; every refusal placed after "COUNTED." passes.
2. Negations in the first sentence refuse a correct answer ("COUNTED: by this grant D6 does not stand.", "COUNTED, so D6 is no longer exhibited.").
3. Formatted openings refuse a correct answer, in live and in FUN rev 2: "**COUNTED** ...", "- COUNTED. ...", "`COUNTED` ...", "ANSWER: COUNTED. ...", "COUNTED (correcting my count): ...", "COUNTED - the grant ...". ("**COUNTED.** ...", "* COUNTED: ...", "COUNTED — ..." and "\"COUNTED\". ..." read CURED.)

What FUN rev 2 still misses:
- Refuses correct answers with "though", "although", "but" or "however" aimed at the defender or at timing (6 cases).
- Reads CURED: withdraw/retract/strike/reverse of the count ("I withdraw that.", "I retract the count.", "Withdrawn.", "Strike that.", "On reflection, no.", "I reverse that: it is not counted."), past-tense or third-person denials ("The defender did not concede it.", "This was never a concession.", "Nothing in the round grants it."), "That count is mistaken.", "Not accepted.", "It isn't valid.", "my count stands unchanged".
- The formatted openings in item 3 above.

Borderline labels (graders may rule otherwise): "COUNTED, but only in part." (UNCURED: a partial count does not correct the count); "Counted." (UNCURED: the rule names COUNTED); "ANSWER: COUNTED." and "`COUNTED`" (CURED: markup around the keyword); "COUNTED. I could not count it before the close because I missed it." (CURED: explains the miss).

## Extension and FUN rev 3 run (W2, 2026-11-10 01:45Z)

33 cases added (coordinator 01:33Z): formatted openings (underscore, italic, bold italic, block quote, numbered, dot bullet, brackets, dashes, semicolon, leading spaces, bold then colon, bullet and bold) and multi-sentence answers, with refusals in each form. 146 cases in all; cases 1 to 113 are unchanged.
- ks3_run_FUN3.txt (pkgLIB/strip_FUN3, W1 commit 9cc64312): 137 of 146 match. Of the first 113: 112 (the miss is "COUNTED.\nThat is not right.", a refusal on a second line, which W3 is ruling on). Of the 33 new: 25.
- ks3_run_s98_FUN2.txt reruns live s98 and FUN rev 2 on all 146.
FUN rev 3 misses in the new cases:
- Refusals read CURED: "**COUNTED.** That is not right." (the same refusal reads UNCURED without bold); "COUNTED. The grant is in round 3. It is not a concession of D6, so my count stands."; "COUNTED. I have looked again. I do not count it after all."; "COUNTED. The defender granted the ordinary means. I retract my count of it."; "COUNTED. The defender granted it. That grant does not apply to D6."; and two second-line refusals ("**COUNTED**\nI do not accept this count.", "COUNTED. The defender granted it.\n\nCorrection: not counted.").
- Correct answer refused: "[COUNTED] The defender concedes D6 in [DR3]." (borderline label: brackets around the keyword).

## Label correction (W2, 00:25 CST 11-10, W1's question on Wall 4080)
Three "second-line" cases (lines 102, 135, 147) carry the main label UNCURED, which was always the label: each is a refusal on the line after COUNTED. Their fifth field, the narrow label used only with NARROW=1, read CURED because of W3's ruling 1 (Wall 3933): the reader then got only the RESPONSE line, a stated limit. pkgKSL rev 2 now gives the reader the lines under the RESPONSE line, so that limit is gone and the narrow label is now ENFORCED. My mistake: I did not update the narrow field when pkgKSL passed.

## Extension for pkgFUN rev 8 (W2, 00:20 CST 11-10)
336 cases were added, and the set now holds 623; cases_ext336.txt holds the new ones alone. Labels were committed before any run (bbbf61d9).
- 26 planted multi-line forms: other-item lines before a refusal (W3, Wall 4076 note 1), own and other item (W1 H4), COUNTED on the second line, TOUCHES NO LINK with its reason on the next line, and correct and refusing multi-line answers.
- 310 real K-S3 answers from every stored cure reply. In all 2,221 RESPONSE lines no stored K-S3 answer opens with COUNTED. The real answers are 306 TOUCHES NO LINK, labeled CURED (9 of them give only the quoted grant as their reason), and 4 NOT HELD, labeled UNCURED.
