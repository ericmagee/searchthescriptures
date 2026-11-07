# pkgEAI (W3 grade_33389 fault 2): DeepSeek enforcer fix, side-neutral

Four nodes: Judge Enforcer Build, Alt Judge Enforcer Build, Judge Enforcer Record, Alt Judge Enforcer Record.
- pkgEAI/patched, base live s45 (d813c20d): Builds 571fef513c90 / d46e8a7dff5a -> 760ce193c4bc / f3d0e18c1d2b; Records 7825fedf4301 / 376b3e737b41 -> cbcf0f9382ed / 33b73297f34b.
- pkgEAI/patched_on_pkgEID, base W1's pkgEID/patched: rebuild with
  node pkgEAI/build_EAI.cjs --base pkgEID/patched --rbase pkgEID/patched --out pkgEAI/patched_on_pkgEID : Builds 8c4699bc921f / e16b19d7fbcb -> e1f68fbb258e / 0f9687f0083d; Records 257f39c3ca96 / 3e3b1eaf0e40 -> 9928ff5cbd47 / 3b87eb766cf1.

1. eaiBlock (eai_lib.js): THE ANSWER IN FULL may also come from the paragraph of a listed round that holds the answer's first 6 words.
   A bullet group is taken from its first bullet; in a verse list (each bullet opens with its own verse) only the answer's own bullet is taken.
   An answer under 3 words is never searched; under 6 words it must hit exactly one paragraph.
2. E-ANS: each finder (verse line, MEANS header, paragraph) passes the gate on its own. Before, a verse-line block the gate refused hid the later finders.
   The grant test also takes a bare "Grant ..." opening.
3. E-HOLD (eahFull): each finder gated on its own, paragraph finder last.
4. Records (pkgEAW / pkgEAH hold): the push's quote and the block are matched with quote marks folded out, so a push quoting
   "Grant it: 'before ...'" matches a round that wrote Grant it: "before ..." (33389 chatgpt Matthew 1:18 and Luke 1:31 [DR3]).

Test: node pkgEAI/test_EAI.cjs -> 51 OK, 0 FAIL. 195 items gain a block; calls <= 8 and not_checked unchanged in every run; no hold lost.
18 pushes held that live does not hold, across 33218, 33249, 33299, 33371, 33389. In 33389: chatgpt Ezra 2:61, Matthew 1:18, Luke 1:31 [DR3]; sol Luke 2:48 [CR4].
