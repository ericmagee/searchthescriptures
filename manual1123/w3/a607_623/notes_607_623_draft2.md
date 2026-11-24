# Engine manual entries for ASK 607 and ASK 623, draft 2 (W3, 16:11 CST 2026-11-24)

Pairs: em_pairs_607_623_draft2.json, md5 6721facfbd6e37068e76163cb8afbadb. Keys are parts; each value is the pair list sent to engine_manual_part_apply.
Read before drafting: section 0 (part 00.1 v247 5bc72deb); W4's notes607.md f4a99e70 and notes623.md 168ec815; Wall 11732 to 11742; the live fetch-back ask623/w4/write/fetchback_eng_623.json (engine 20db58ee: Init Seats ENG, FAM_PANEL, JFAM_I; Shared Library lines carrying rfs); my SQL at 16:1x CST on model_config (neon, hydrogen, gemini_deb), dash_debaters(), odv1_judge_order, odv1_judge_order_log and the seat list of odv1_record_panel_substitution.

PREVIEW (engine_manual_part_apply, write false, 16:2x CST):
- Part 11.2, base v242 6b4d83aad79368f834e66aa538a045fd (14,690): 1 pair, count 1, to 16,684, md5 6338737261e957a56d5927b5c2889587. Pair list md5 6a4df5431a2ef63160af1a1c65ed3283.
- Part 10.0, base v308 b2c1b6de730b5de6f8b30cf0d71f04d7 (54,641): 5 pairs, counts 1,1,1,1,1, to 58,677, md5 990527b69689bc65eee56201bf8bedeb. Pair list md5 0383bbaaea02319cc657a45af9fb46a0.
(The pair list md5 is of json.dumps(list, ensure_ascii=False), the text that is sent base64-encoded.)

WHAT EACH PAIR DOES
11.2, pair 1 (ASK 607): a new entry of five items is put after the ASK 549 entry and before the ASK 561 entry. Nothing is removed.
10.0, pair 1 (ASK 623): the RESERVE line's sentence on the substitution recorder's seat list now names neon beside qwen4max.
10.0, pair 2: the JUDGE ORDER line called the ASK 608 entry "the last entry of this section"; it is no longer the last, so it is named by its title.
10.0, pair 3 (ASK 623): the Init Seats refusal line quoted in the Haiku entry now lists hydrogen and neon, as the live node prints them.
10.0, pair 4 (ASK 623): after "Four pairs ... with no reserve and no alternate behind it." one sentence is added: with the two new debaters there are twelve.
10.0, pair 5 (ASK 623): the new last entry of section 10, GEMINI 4 HYDROGEN AND GEMINI 4 NEON DEBATE AND JUDGE.

BODY LAW: no card, press time, md5, audit id, Wall number or grade in the new text. The entries name ruling row 546, stored judgment 1122 and enforcer log rows 29285 to 29295 as the evidence of what was shown, and the token counts of the two check calls.
NOT STATED IN THE BODY, on purpose: any token limit (the home of that value is the model_config row); the judge order's seats in full (its home is the table).
NOT CHANGED: part 11.0's older lines on dash_debaters (an earlier state, already superseded by the Haiku entry of section 10); part 09.4 (the retraction hint on a form refusal is unchanged); the ASK 549 entry.
OPEN FOR THE GRADER: (1) "Either sits on the panel only when the operator moves it there" rests on W4's build note that the order is changed only by the page's Save; (2) the twelve pairs and the 128/4 split are W4's test output (out_t623.txt), reproduced by W1 (Wall 11737), not re-run by me.

DRAFT 2 AGAINST DRAFT 1 (370f0784): one sentence added in the 623 entry's Judges item, on W4's correction (Wall 11746): "As alternates they can be offered a removed judge's seat with no save, after the alternates ahead of them in the list." W4 confirmed that the engine has never called neon (its only call was the check call through the temporary check workflow). Part 11.2 is unchanged from draft 1.
