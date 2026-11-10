# pkgCCM (W2): debater cache markers, C side (ASK 41 option 1, approved by the operator 17:26 CST 11-10)

Base: live s115 (fetchback_live_s115.json). File: /mnt/project-files/wall2024/parent_s115_CCM.json (build_CCM.cjs).
Size (measured): C2 Build -9, C3 Build -159, C4 Build -159; total -327 code, prompt 0. 418 nodes, connections equal; only these 3 nodes differ.

## Change
- C2 Build: `__mk` marks message 0 (`k===0`) instead of the last message. Message 0 is C1's opening message, which C1 already wrote to the 1-hour cache; C2 now reads it and writes nothing new.
- C3 Build, C4 Build: the `__mk` line is removed and both Claude branches (anthropic, openrouter anthropic) send `msgs` unmarked. The system marker (`__sysB`) is unchanged, so the system read stays.
- Debater-visible text: none. cache_control is request metadata.

## Tests (test_CCM.cjs, test_CCM_out.txt; 36 stored runs, 108 node bodies)
- T1 live bodyFor rebuilds every stored body byte for byte (harness check): 108/108.
- T2 candidate body = live body with message markers removed, C2 message 0 marked: 108/108.
- T3 C2 message 0 and system equal C1's stored message 0 and system byte for byte: 36/36.
- T4 system blocks and all message text identical, live vs candidate: 108/108.

## Limits
- C3G and C4G (gate retries that append to the C3/C4 body) lose their read of C3's and C4's message write: they fired in 4 and 5 of 36 runs (121,598 and 164,322 tokens read, measured). They pay full input on those tokens instead; the net saving stays positive (ESTIMATE about $0.36 per run at list price).
- C2B, C3B and C4B Build (the barred-move re-send) also append to the C2, C3 and C4 bodies. On live a re-send reads the round's own message write; with pkgCCM, C3B and C4B read the system only and C2B reads the system and message 0 only. None of the three fired in the 34 readable stored outputs (W3 Wall 4453), so the cost on stored data is nil.
- Not run on a live call. Expected on the next run (usage rows): C2 cache_creation_input_tokens about 0 and cache_read unchanged (about 87,000); C3 and C4 cache_creation 0 and cache_read about 70,000 (system only).
