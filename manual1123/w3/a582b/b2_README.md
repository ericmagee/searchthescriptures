# ASK 582 second pass, batch 2 (class B: "since ASK n" inside behaviour sentences), 15 parts, 34 pairs

Plan Wall 11269; conditions P1 to P3 Wall 11270. Pairs: b2_pairs_all.json (one object, part -> list of pairs), md5 54b9cd13cbd2481f025671de7ba15ad6.

## P1. Regex, unit, counts
Unit: occurrences in the latest row of each part except 00.1; PostgreSQL regexp_matches(content, '[Ss]ince ASK', 'g').
Before (MEASURED 21:48 CST 2026-11-23): 42 = 02.0 1, 03.0 6, 04.0 6, 09.0 1, 09.1 4, 09.4 1, 09.5 1, 09.6 2, 09.7 5, 10.0 2, 11.0 1, 12.0 6, 14.0 1, 15.0 1, 17.0 4. (The plan's 43 was a miscount of mine; W1's 42 is right.)
After (by the pairs; to be measured in the rehearsal before the card): 3, all in 09.7, all KEPT for batch 3: the three "Why:" lines ("since ASK 426 the enforcer model is luna and no seat is DeepSeek, but ..."; "since ASK 426 the enforcer steps post to openrouter.ai, but ..."; "DeepSeek is refused everywhere since ASK 437 (the operator, 21:24 CST on 11-18 ...), but ..."). Each is the one line of why of its entry (operational_doc 0 (3)) and describes the earlier state on purpose; class C reads them.

## Previews on the live latest rows (MEASURED 21:56 CST 2026-11-23, p_write false; every pair count is 1)
part | base version, md5 | pairs | new md5 | new length
02.0 | 244 3b25813e | 1 | 12d61b4fbdb430758582e6869a734b83 | 1,784
03.0 | 242 5e0b6b35 | 5 | a281a5db2a9d4b825a0036550b43be01 | 2,688
04.0 | 242 a7925dd8 | 4 | a6a65e19acd22e2aee4b34c59d7500b9 | 13,647
09.0 | 242 0b5f5612 | 1 | 2480a96e4e53c13a4c88f5455a9ac741 | 38,931 (CHANGES when batch 1 is written first; re-measured then)
09.1 | 242 1fd7200f | 4 | c32aa3dc973260805c1df29f83a95d79 | 38,860
09.4 | 242 54a2efdc | 1 | 711fb2177625b2d2581eefea25cbe4ca | 36,578
09.5 | 242 9018c111 | 1 | 6b1a389e54f263a0d40519b6b162bf92 | 39,894
09.6 | 242 5dc5e479 | 2 | 826bd8693734538ebc6f8636964137b2 | 38,971
09.7 | 242 0befe377 | 2 | feb419b6fb9b16a5f340c7e7292f42a2 | 38,514
10.0 | 242 646b5350 | 2 | deda7adc91bf2773872b5dec75941dd3 | 39,760
11.0 | 245 467c3c63 | 1 | c437884e1a0034d761938b7a64ff3953 | 38,935 (CHANGES when batch 1 is written first; re-measured then)
12.0 | 242 eb64bfc7 | 5 | 954f32e52b143788727355c91c7beea8 | 37,944
14.0 | 242 15567cfa | 1 | 5901894ef4def760db8ce819ce9ec7e7 | 2,954
15.0 | 242 77253aba | 1 | 1b03fbdc20213439c954fa5fb6b28f06 | 6,009
17.0 | 246 2cfe5415 | 3 | 271977f6b4e42c5a1267b09f85e3a9b1 | 39,877
Characters removed: 753 in all (sum of base length minus new length over the 15 parts).

## P3. Order and expected whole-manual figures
Order: the parts in order_index order, after batch 1 stands (so the first batch 2 version is 251). The expected version per part, the md5 and length of 09.0 and 11.0 on their batch 1 bases, and engine_manual_full() version, md5 and length are measured in a rolled-back rehearsal of all 15 writes once batch 1 is written and read back, and posted before the card. Readback: node mrb.cjs <base> <new> <pairs of that part> <part>.

## WRONG-IF check (a clause removed must leave a true present-tense sentence)
Read live 21:56 CST 2026-11-23: model_config rows deepseek and deepseek_debate active = false; row luna active = true (openai/gpt-6-luna); dash_launch_odv1 source contains dash_debaters(). The n8n statements (two call families, Provider Removed Stop, cure and panel sub-workflows, library check at run start, code comments) are NOT re-read by W3 (W3 does not read n8n); each was already stated as the present state from its ASK onward, and no pair changes what is claimed, only the "since" clause. A grader or W4 who finds one of them no longer true should FAIL that pair.

## Pairs that do more than drop the clause (for the grader's eye)
- 03.0: "Since ASK 455 it no longer requires the ACTIVE `deepseek` row" -> "It does not require the ACTIVE `deepseek` row".
- 04.0: "since ASK 458 (engine) and ASK 459 (cure calls) a deepseek-family item fails closed at Provider Removed Stop, and since ASK 479 its rows are inactive" -> "a deepseek-family item fails closed at Provider Removed Stop (engine and cure calls), and its rows are inactive".
- 09.0: "(output 0, the DeepSeek output, since ASK 459)" -> "(output 0 is the DeepSeek output)".
- 09.4: "is HELD since ASK 570 (written 2026-11-23)" -> "is HELD" (the date goes too).
- 09.5: "since ASK 401 a quote made of a margin note alone passes when the note holds a period, as one without a period already did." -> "a quote made of a margin note alone passes, whether or not the note holds a period."
- 09.6: "take the same head since ASK 424 (next entry)." -> "take the same head (ASK 424, next entry)." (the ASK number stays as the name of the entry pointed at).
- 10.0: " (it gave ruling 421's enforcer reason, untrue since ASK 426)" removed whole (what the refusal text used to say).
- 12.0: earlier figures removed with the clause: "30 before"; "60 and 30 before"; "since ASK 428 removed its 88-character comment naming ASK 409; 635 before".
- 12.0: "since ASK 435 (rulings 495 and 496) the same holds after" -> "the same holds (rulings 495 and 496) after" (the ruling numbers stay).

## ADDENDUM A1 (after batch 1 was written, 22:06 CST 2026-11-23): rehearsal of all 15 writes, rolled back
Batch 1 stands: whole manual version 250, 311dfb27f5b3df4842a91b10472862cc, 707,135.
Order (by part name, which is order_index order), base -> new version, md5, length (MEASURED, rolled back):
02.0 v244 3b25813e -> v251 12d61b4fbdb430758582e6869a734b83 1,784
03.0 v242 5e0b6b35 -> v252 a281a5db2a9d4b825a0036550b43be01 2,688
04.0 v242 a7925dd8 -> v253 a6a65e19acd22e2aee4b34c59d7500b9 13,647
09.0 v248 69e266ce -> v254 e7bd25abb50eb3caee51e463b7d726bb 38,800
09.1 v242 1fd7200f -> v255 c32aa3dc973260805c1df29f83a95d79 38,860
09.4 v242 54a2efdc -> v256 711fb2177625b2d2581eefea25cbe4ca 36,578
09.5 v242 9018c111 -> v257 6b1a389e54f263a0d40519b6b162bf92 39,894
09.6 v242 5dc5e479 -> v258 826bd8693734538ebc6f8636964137b2 38,971
09.7 v242 0befe377 -> v259 feb419b6fb9b16a5f340c7e7292f42a2 38,514
10.0 v242 646b5350 -> v260 deda7adc91bf2773872b5dec75941dd3 39,760
11.0 v249 cd97ea91 -> v261 150f5f24349fa26f8be973b47ef6ea9e 38,031
12.0 v242 eb64bfc7 -> v262 954f32e52b143788727355c91c7beea8 37,944
14.0 v242 15567cfa -> v263 5901894ef4def760db8ce819ce9ec7e7 2,954
15.0 v242 77253aba -> v264 1b03fbdc20213439c954fa5fb6b28f06 6,009
17.0 v246 2cfe5415 -> v265 271977f6b4e42c5a1267b09f85e3a9b1 39,877
engine_manual_full() after: version 265, 213932548322e0d6db4562768135eb2b, 706,382 (753 removed). "[Ss]ince ASK" left outside 00.1: 3 (the 09.7 Why lines).
The log row of each part is built inside the write from the pairs themselves (old and new of every pair, word for word).
