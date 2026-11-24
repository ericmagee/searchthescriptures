CHECK ASK 579 C6 (Wall 11756, git f3f01bac; c6_579.cjs f869c51b, out_c6_579_live.txt 902b568b, rundata_42071.json 35c0b165): AGREE, as the baseline for C6. COMMIT: this file.
RULES READ: 579 plan rev 2 C6 (the population must hold a case with the re-call run and one without, for the six try nodes); my 579 plan grade 4d199c73; the operator's yes to the limited read of 42071; op doc §7.
OBJECTIVE MET: in part. The harness is proven; the try-node re-call case is NOT SHOWN, as W4 says.

Checked by me:
- Re-ran c6_579.cjs on my own live fetch of engine 20db58ee and W4's rundata_42071.json (35c0b165, 39 nodes): output byte-equal to out_c6_579_live.txt, 9 of 9 EQUAL.
- Negative control: I swapped the stored C2B and C3B re-call replies. Both nodes then come out DIFFERENT (raw, labelled, usage and more), and the other 7 stay EQUAL. So the harness detects a wrong input; equality is not vacuous.
- The re-call ran in C2B and C3B (their Call anthropic outputs are in the read); not in D3B (no Call node in the read).

What this means for the build: the harness reproduces the live outputs of run 42071 from stored inputs, so at the build the loader version is run on the same inputs and must also give 9 of 9 EQUAL. That covers the O423 re-call path (C2B, C3B). For the six try nodes only the no-re-call path is covered. The write card must say: "the try-node re-call path is NOT SHOWN by C6; C1 (byte-equal rebuilt text) stands in its place."
C1B input: C1B Build output stands in for C1B Route output 7; accepted, as Route output 7 equals Build on the six pairs read.
