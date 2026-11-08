# pkgEKN: DeepSeek RULE K-W grades NOT HELD and REASSERTED instead of writing NO ANSWER

Nodes (base live s60, 219c6f95):
- Enforcer Build: ee66d61f1339 -> d0a0a62d24e9
- Alt Judge Enforcer Build: 8758f27fb673 -> 2c7332529206

Fault: the engine accepts four K-W answers (STANDS WITHOUT IT, CONCEDED, REASSERTED IN <round>, and NOT HELD with a reason quoting the flagged sentence, pkgKW). DeepSeek's RULE K-W named only the first two, and the reply rules say "in neither form: NO ANSWER". So DeepSeek wrote NO ANSWER on NOT HELD ("the judge's NOT HELD is not the K-W form"), and the send-back filter (^ENFORCER DISAGREE|NO ANSWER) sent every one back, right or wrong.
Saved runs, K-W rows with a NOT HELD answer graded NO ANSWER: main Enforcer 33371 32, 33389 17, 33411 11, 33430 20, 33442 12, 33461 21, 33490 3, 33627 19; Alt 33644 16 of 16. Other runs graded them (33575, 33592, 33617, 33644 main), so the reading varies by call.

Change: two passages in RULE K-W in both nodes.
1. The rule names all four forms as in its form, and says never to write NO ANSWER because the judge wrote NOT HELD or REASSERTED.
2. How to grade them, on the rule's existing first decision. NOT HELD is graded like STANDS WITHOUT IT with its reason in place of the layer: AGREE when the sentence carried no footing of the link, or the side no longer claims the fact and the reason adds no footing, or the side still claims it and the reason or the side's words it quotes carry it; DISAGREE when CONCEDED is right or the reason supplies footing the side never gave. REASSERTED: AGREE when the quoted words stand in that round and assert the fact again.

Behaviour change: NOT HELD and REASSERTED answers that DeepSeek finds right are no longer sent back. Wrong ones are still sent back, now with a reason on the merits. No other rule or field changes.

Test (node pkgEKN/test_EKN.cjs): 6 OK. Over 26 saved runs per node, the 22 main and 17 Alt K-W prompts differ from live only by the two passages; every other item is byte-equal.
Not testable offline: DeepSeek's new answers. Live check: K-W rows answered NOT HELD get AGREE or DISAGREE, none NO ANSWER.
