# pkgRFX: one source for the round-heading normalizer (ASK 121, W4's form)

- rfx_src.cjs is the only place to edit the normalizer (__RFX). It holds HEAD, HEAD2, PH (defender-only placeholder step) and BODY.
- gen.cjs <in.json> <out.json> writes the generated text into all 17 round Extract nodes (D1-D4, D2B-D4B with PH; C1-C4, C3G, C4G, C1B-C4B without).
- check.cjs <workflow.json> exits 0 only if all 17 copies equal the generated text. Builders and graders run it on any package that touches a round Extract node, and on the fetch-back after a write.
- No library load, no runtime change: the code stays inside the 17 nodes.
- On live s160: check 17 of 17; gen output is byte-equal to the fetch-back (no write needed).
