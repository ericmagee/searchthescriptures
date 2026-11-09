# pkgQRC: the judges question closing-round contradictions (item C of Wall 3714)

Builder W2. Base: live s82 (b04eda94). The operator's rule (14:31 and 14:42 CST 11-09): a debater confirmed to contradict itself in the closing round has its chain broken by default; the judges watch for contradictions and question the debaters at closing, using their one question to each debater.

The wording (C1 to C5) is on Wall 3716 for the operator. Nothing is written live before he approves it.

## What changes (QR Ask Build, QR Check, QR Final, QR Merge only; edits anchored, each asserted once)
- C1: Commitment 9 (QR_C8, inlined in all four nodes) gets one new last sentence. A contradiction question quotes the earlier and the closing passage and asks how they agree; the answer cannot withdraw either; the closing enforcer confirms.
- C2: QR Ask Build's ask gets the watch-and-question paragraph. The JSON form takes optional "earlier_round" and "earlier_quote".
- C3: qrCheck (all four nodes) keeps ruling 415's checks and adds checks for the earlier fields:
  - "round" is that debater's closing round (CR4 or DR4);
  - "earlier_round" is one of its earlier rounds;
  - the earlier quote is word for word in that round;
  - the new-verse check also reads the earlier quote.
- C4: QR Final. The debater's prompt gets one sentence, and the debater sees both quotes. The record and the items carry the earlier fields.
- C5: QR Merge. The judges' text gets one sentence, and the block labels a CONTRADICTION QUESTION with both quotes.

Not changed: QR Trial? and QR Ask Build's dry-trial guard. The question round still runs only on a dry regrade. Running it live is the operator's ASK 1 (Wall 3716).

## Proof
probe_QRC.txt: 17 OK, on run 34108's recorded closing contradiction (terra: [CR3] "I grant that this is the ordinary means." against [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew, ..."). Rounds are excerpts in fixture_34108.json, with both sentences placed by SQL position().
- The ask is live plus C1 and C2.
- The 34108 contradiction question passes every check.
- These are refused: reversed rounds, a quote that is not word for word, an uncited verse, an earlier round from the other side, and a made-up earlier quote.
- An ordinary question gives output equal to live QR Check.
- The debater sees both quotes and C4.
- The judges read C5 and the CONTRADICTION QUESTION line.

## Files
build_QRC.py (writes parent_s82_QRC.json and nodes/*.js), probe_QRC.cjs/.txt, fixture_34108.json.
