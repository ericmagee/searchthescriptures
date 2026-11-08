# pkgRP11: reader phase 2 item 11, ANSWER CHECK reads (W4, 11-08)

Tracker RP2-11 (W3 order item 11: "acRound, acUnp, __acG, eaxHold (the form read only; its prose stays)").

What it swaps, in the three Judge Enforcer Build nodes (the DeepSeek enforcer prompt builders). Each read asks the shared reader first (`__RL`, which pkgRP10 embedded). A line the reader does not read as ANSWER CHECK (refused, RESTATED or another form) keeps the old read.
- acRound: whose answer the line grades. This is the first round's letter: CR is the defender's answer and DR is the challenger's.
- acUnp: whether the press is UNPROVEN, so carries no answering burden. The form part comes from the reader: the grade word UNPROVEN, an empty MEANS quote, or a bare MEANS: NONE. An UNPROVEN in the prose still counts, as before, because the prose stays.
- __acG: the grade word (MEETS, MISSES or FAILS; any other reader grade gives null, as the old read did).
- The side and verse filter of the UNEXHIBITED-premise check (the inline `^ANSWER CHECK: <verse> -- [CR|DR` match).

Not swapped: eaxHold (the three Judge Enforcer Record nodes). It reads the engine-built item key "ANSWER CHECK <verse> [CRn]", not a judge line. The reader reads no form there, and test_RP11 probes that.

Behaviour change (changes_RP11.txt), on 12 distinct lines in 7 runs (33299, 33371, 33411, 33430, 33617, 33644, 33731), all of one kind:
- The line has a MEANS quote that itself begins with a quote mark, for example `MEANS: ""born of" a woman names the mother ..."`.
- The old `MEANS:\s*""` test took that as an empty MEANS. The press was then labelled "(UNPROVEN press: no answering burden)" in the DeepSeek prompt, and dropped from the "answers to proven presses" counts.
- The reader reads the real MEANS, so the label goes and the counts rise (for example 40 -> 42 in 33411). No enforcer item is added or removed. Only the prompt text, and the batching that follows from its length, moves.

Base: s65 (pkgRP10, then pkgEKS, on the three nodes). Build: `node pkgRP11/build_RP11.cjs <fetchback_live_s65.json>`. Test: `node pkgRP11/test_RP11.cjs <same>`.
In test_RP11:
- JEB: 30 runs, 23 byte-equal and 7 differ (the change above).
- Alt JEB: 30 runs, all byte-equal.
- The reader decided over 2,000 ANSWER CHECK reads on each node, so the reader path is live.
- TOTAL 5 OK, 0 FAIL.
Note: the run filter in test_RP10.cjs also matched the Alt files under the JEB name, so its "JEB 60 runs" counted about 30 runs twice. test_RP11 uses an exact match.
