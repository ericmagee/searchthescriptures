# Card text: ASK 579 entry for the engine manual (part 11.2)

Pairs file manual1123/w3/a579/em_pairs_579_draft1.json 5114ec60 (grader confirmed, Wall 11874). Part 11.2 v312 59f3a6af (16,713) becomes 9c844df7 (18,648). Nothing is deleted. One entry is added between the two lines shown.

## BEFORE

```
No other run mark: the three are storage only.
  - THE LAYERS CHECK READS FIVE MORE TAG FORMS
```

## AFTER

```
No other run mark: the three are storage only.
    - ASK 579, THE RE-CALL REPLY BLOCKS OF NINE EXTRACT NODES ARE SERVED FROM THE SHARED LIBRARY (one write; storage only; plan fairjudge/w3/a579/ASK579_plan_rev2.md md5 922b1a04). Cause: nine engine nodes each held one large block that reads a debater's re-call reply, and the nine texts share most of their lines.
      1. The blocks: the `__O423` statement in C2B, D3B and C3B Extract (MAP entries "O423 C2B Extract", "O423 D3B Extract" and "O423 C3B Extract"), and the call inside the try block that fills `__X2` in C4G, C3G, C1B, D2B, D4B and C4B Extract (MAP entries "X2 C4G Extract", "X2 C3G Extract", "X2 C1B Extract", "X2 D2B Extract", "X2 D4B Extract" and "X2 C4B Extract"). Each node rebuilds its own text, byte for byte, from the Shared Library through a loader. In the six try nodes the loader stands before the try, so a Library fault stops the node and is not taken for a reply that could not be read. The loader stops the node with "pkgX579: the Shared Library holds no <entry> entry" when the MAP entry is missing, and with "pkgX579: rebuilt <entry> is <n>, expected <n>" when the rebuilt length differs.
      2. The Shared Library gains 270 lines and nine MAP entries; no existing line moved or changed. The nine nodes go from 226,060 to 41,693 characters, and the Shared Library gains 70,069. The new entries also reuse 37 existing library lines, which 54 existing MAP entries serve too, so a later edit of any of those 37 lines changes the nine Extract nodes as well. The statements __LB423, __CC423, __LC423 and __A423 stay inline. No node's behaviour changes.
      3. Marks for the next run: no error text "pkgX579" in debate_errors, and the run's saved row and report exist. Shown offline: on the stored inputs of run 42071 each of the nine nodes gives the same output as before; in that run a re-call ran in C2B and C3B Extract only. Limit: a re-call through one of the six try nodes is not shown by any run.
  - THE LAYERS CHECK READS FIVE MORE TAG FORMS
```
