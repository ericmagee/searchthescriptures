# pkgRTB family 3: "unanswered" (the PRESSED cure for K-G1 / K-G4), design (W2, 11-08)

Third family of the approved rule table (Eric 07:42 CST 11-08, Wall 3161): K-W first, then RETRACTED, then "unanswered".
Same method as families 1 and 2. One row in pkgRTB/rule_table.cjs, every copy rendered from it at build time, a conformance test against
the library's own reader and cure checks, and a replay that must be byte-equal once the old text is restored.

## What the engine enforces (the source of truth)

From Panel Cure Build 1 (strip_RTB2K), the same in all 26 cure nodes:
- Reader `P.PRESSED`: a cure line is `PRESSED: D<n> vs C<m> | [<round>] | "<quote>"`. It needs the `|` separators and a quoted string.
- `cureLines` keeps a PRESSED line only for rounds DR1, DR2, CR1, CR2 or CR3.
- `CURE_PRESS = {DEFENDER: ['DR1','DR2'], CHALLENGER: ['CR1','CR2','CR3']}`. A round outside the side's set is UNCURED ("does not press the ...").
- `cureFoundAll(quote, R[round])`: the quote must stand word for word in that round. Otherwise UNCURED ("no quotation found in the named round").
- `kg4Split`: when a later round of the side that holds the link names every pressed witness the line rests on, a PRESSED line is UNCURED ("unanswered-false").
- K-G1 also needs CORRECTED COUNT for that side, at least the number of its K-G1 links.
- K-G4 meaning break (`!g4Unans2024`, ruling 421): RETRACTED cures only with a 6+ word quotation standing in a round of the holding side (its own words), or with a verse of the line that such a round names. FORCED also cures it.
- An unanswered-witness break: RETRACTED cures under cureReasoned (the round, plus a 3+ word quote or a verse; family 2).

## The copies today, and where they drift

| copy | where | count | says | drift |
|---|---|---|---|---|
| format line | cure ask (library) | 26 | `PRESSED: D<n> vs C<m> \| [<round>] \| "<the words of that round, quoted exactly>"` | does not say which rounds count for which side |
| K-G1 clause | cure ask | 26 (x2 phrases) | PRESSED line quoting the earlier round; rounds by side; CORRECTED COUNT | rounds listed by hand. Right today, but a second copy of CURE_PRESS |
| K-G4 clause | cure ask | 26 | "rounds as for K-G1", then RETRACTED with the family 2 reason | for a meaning-break line, that RETRACTED clause is too weak (6+ words needed). It was weaker still before family 2 |
| g4Label UNANSWERED-WITNESS BREAK | send-back mark | 26 | "Otherwise cure it with a PRESSED line quoting the round that pressed it" | no form, no pair, no rounds, no exact-quote rule |
| g4Label MEANING BREAK | send-back mark | 26 | FORCED, or RETRACTED with 6+ words | right; keep as the source for the meaning-break row |
| agreement, Commitment 5 tail | Panel Build + 10 prompt nodes, incl. 4 DeepSeek | 18 | "A break that rests on an unanswered press quotes the pressing sentence instead (Commitment 5)" | no form, no rounds, no exact-quote rule, no unanswered-false limit |
| DeepSeek rule text | JEB x3 | 3 | "the line quotes the pressing sentence and names its round (ruling 392)" | same gap as the agreement |

A judge reading only the agreement, or the send-back mark, cannot write a PRESSED line that cures. Three things it would not know: the
`|` form, the rounds that count for the side, and that a later naming defeats the cure.

## The row

```
PR: {
 form: 'PRESSED: D<n> vs C<m> | [<the round that pressed the witness>] | "<its words, quoted exactly>"',
 rounds: CURE_PRESS,                        // read from the library constant at build time; no hand copy
 roundsText: side => 'against the defender: [DR1] or [DR2]; against the challenger: [CR1], [CR2] or [CR3]' (rendered from rounds),
 limit: 'it does not cure when a later round of the side that holds the link names every pressed witness the line rests on; then RETRACT or FORCE it',
 example: 'PRESSED: D2 vs C1 | [DR2] | "the coming together is the taking into his house"',
 render: { formLine, clause (K-G1/K-G4), mark (g4Label), agreement (Commitment 5 tail), enforcer (DeepSeek) }
}
RXM (meaning-break RETRACTED): 'RETRACTED for the line, with a reason that quotes 6 or more words, word for word, from a round of the side that holds the link, or names a verse of the line that such a round names'
```

## Build and test (same as families 1 and 2)

- build_RTB_subs.cjs gets the PR and RXM substitutions. The library builds to a new strip directory (strip_RTB3), so the graded strips stay as they are.
- Prompt nodes: the agreement tail and the DeepSeek line, on the composed s66 bases (JEB_BASE).
- Conformance:
  - the example is read by `P.PRESSED` as kind cure with sep `|`;
  - its round is in CURE_PRESS for the side;
  - the rendered round lists equal CURE_PRESS;
  - no old copy is left;
  - render counts equal the tally;
  - the RXM wording matches the 6-word check (an example passes the K-G4 meaning branch, and a 5-word quote fails it).
- Replay: every library and prompt node on every saved run is byte-equal once each render is put back to its old text.

## Not in scope

- No reader or cure logic changes. If an ask and the engine disagree, the engine wins and the ask moves to match it.
- K-G11 and K-P (UNPROVEN presses) keep their text. They come next if this family shows the method holds.
