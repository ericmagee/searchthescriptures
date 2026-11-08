# pkgRP9: reader phase 2 item 9, MNQ-class quoted-field reads (W3, 11-08)

Tracker RP2-9 (taken from W1 by W3). DeepSeek prompt-node change (3 Judge Enforcer Build nodes).

Swaps, each asking the shared reader (__RL, embedded by pkgRP10) first; a line the reader does not read as FORCED keeps the old read:
- failsNote: ANSWER round, ANSWER quote (W3 2484 repeat test) and FAILS quote of a FORCED line.
- efgCheck: MEANS round and MEANS quote. The CARRIED BY / GROUND tail read stays.

Behaviour change (test_RP9.txt): JEB 6 of 30 runs (33218 33249 33490 33705 33731 33750), Alt JEB 1 of 30 (33371); R2 Alt has no saved runs.
All of one kind: the old FAILS regex allowed only a GROUND tail, so on a FORCED line ending in `-- CARRIED BY: "..."` it swallowed the tail
into the FAILS quote, which then was not found in the answer round, and the "The FAILS words are found in [..]" note was dropped. The reader
ends FAILS at its closing mark, so the note now appears when the FAILS words stand in the answering round (and still not when they only
repeat the ANSWER). 33218 also moves the call batching (5 -> 6 calls) because the prompt grows. No item is added or removed.

Base: pkgRP11/patched (s65 + RP11; RP11 graded W2 3304, W1 3306). Build: node pkgRP9/build_RP9.cjs. Test: node pkgRP9/test_RP9.cjs.
