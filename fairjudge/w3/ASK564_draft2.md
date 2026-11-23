# The Oracle exploits every weakness its layer examination finds (W3, ASK 564, DRAFT 2b)

DRAFT ONLY. Nothing is written. The exact text needs grading (W1), the builder's anchor check (W4) and the operator's approval.

Basis, the operator's words, 17:14 CST 11-23: "the Oracle needs to be told to exploit all weaknesses found from layers examinations".
Failed runs as evidence (the standing rule for Oracle-facing text): runs 41736 and 41822, both CHALLENGER PREVAILS. In run 41822 the challenger's [L2] claim on the "therefore" of Luke 1:35 (dio, G1352; DR1 line 39, DR2 line 49) and the [L4] built on it (DR2 line 53, DR3 line 77, DR4 line 31) were never examined or pressed by the Oracle in CR2, CR3 or CR4 (ASK 557 draft 5b, section 1 item 8).

## 1. What ASK 557 already says, and what it does not
ASK 557 Change A (approved 17:09 CST 11-23) tells the Oracle to break its opponent's replies down by layer, to test each layer, and to "Say which layer fails and quote the words that show it." It does not tell the Oracle what to do with a failed layer once found: to press it, to say what falls with it, or to carry it forward until it is answered.

## 2. The change
Scope: the Oracle seat only. One sentence group added to the constant `__ORACLE9` in Init with Guards. No other node, no check, no corpus, guard or ruling text, no model setting.
Anchor (in the ASK 557 text of `__ORACLE9`, one occurrence): `Say which layer fails and quote the words that show it. Prove every position with the layers.`
Exact change: between those two sentences insert:
` Exploit every weakness that this layer-by-layer test of your opponent's replies finds. Charge each point of your opponent that has a failed layer as its own numbered premise in your UNSUPPORTED-L4 PREMISES list, where it is graded: quote your opponent's own words that carry the point, name each failed layer of it, and under it give the layers that show the failure, the verse under PRESSED WITH: and, where the failure is in a word, the [L2] SHEET row for that word. The list keeps its limit of 6 premises: when more than six points fail, list the six that bear most on your opponent's case. State each charge in the positive form, by what the quoted rows do give; where your opponent's step takes a fact for granted, use the footing rule's STEP -- ASSUMES -- ROWS GIVE line. Carry each charge into the list of your link round. In your close, restate each one left unanswered in the GAPS LEFT OPEN form only. A weakness you found and left out of the list while the list had room is a failure of yours.`

Draft 2b meets W1's condition on draft 2a (Wall grade after 11013): the lists are capped (D3 Build, live: "a numbered list (max 6)"), so the text now charges one premise per failed point, naming each failed layer under it, and says the limit of 6 governs and which six to keep. The closing sentence no longer calls an unlisted weakness a failure when the list is full. The stale anchor-check question on the GAPS text is removed.

Draft 2a: the operator asked at 17:17 CST how the Oracle knows what "the examination" points to. The first sentence now names it: the layer-by-layer test of the opponent's replies, which the sentences just before it in `__ORACLE9` order.

Why this wording (W1's grade of draft 1, Wall 11004, FAIL with two fixes):
F1. A charge is graded only in the list. Init with Guards: "Charge it in your round 2 UNSUPPORTED-L4 PREMISES list; it is graded only there." D3 Build: "A charge left outside this list is not graded." D4 Build: "do not press new witnesses or premises against the challenger ... the judges do not count a press made here." Draft 1 told the Oracle to press in the same round and in the close, where a press does not count. Draft 2 puts every charge in the list and carries it to the link round's list.
F2. The close lists unanswered presses only in the ASK 537 form ("GAP: premise <n> [<the round that listed it>] -- <the verse you pressed ...> -- UNANSWERED ... no quotation and no other words"). Draft 2 names that form and adds no other listing.
Ruling 421: the charge is stated by what the quoted rows do give, and an assumed fact takes the footing rule's STEP -- ASSUMES -- ROWS GIVE line, which "carries none of the words no, not, none, never, only, without, alone, every or no other" (D3 Build).

To confirm at the anchor check (W4): that the anchor stands once in the written `__ORACLE9` (engine 215e327a); that the added length (about 990 characters in the system prompt) raises no limit.
For the grader (W1): regrade against F1, F2 and the ruling 421 point.

## 3. Revert
Restore Init with Guards from the pre-write export; compare md5 of the node.

## 4. Test
1. Offline: build the Oracle system prompt with run 41822's inputs; the inserted text stands once; a plain defender profile's prompt is unchanged.
2. Every other node: md5 unchanged.
3. The proof is a live run, read in the transcript: each layer the Oracle names as failed stands as a numbered premise of its list with the layers that show the failure, is carried into the link round's list, and, if unanswered, stands as a GAP line in the close. There is no code check in this draft; a record-only count can be planned after the first run shows the form.

## 5. Order
After ASK 557 Change A is written (the anchor is in its text), or in the same write if the operator approves in time.
