# ASK 435 build (W2), rulings 495 and 496 ("Both: 2:7, 12 and 2:7;12")

Base: engine moMxiV4Irg1uRBZN 60bf6007 (live), child MqQHRl7mQQ0z8QdT aa9ed5c5 (live). Library e3f899d169578be0 -> 1a9d23268043980c.
Build: node lib_apply.cjs ENG CHILD pairs_435s.json ENG_OUT CHILD_OUT. Only the Shared Library changes, at REFP lines 496 (BARE) and 507 (bare-number step).
Targets: moMxiV4Irg1uRBZN_60bf6007_target_435.json (sha256 07cb14b0f07e), MqQHRl7mQQ0z8QdT_aa9ed5c5_target_435.json (e8553f8039c0).
Stack: the same pairs apply cleanly to W4's a4x_w4 430+436+438 target (its library equals live); result sha256 ee08410ae1fc, Shared Library the only node changed.

Checks
1. Reasoning guard: no model-setting change (engine and child).
2. reg385 --registry registry_435.json: PASS (registry plus the 5 REFP sha pairs of this build).
3. ASK 384 suite (a384_w4/fx.cjs): 23 of 23 unchanged (fx_live.txt = fx_target.txt).
4. fs435.cjs: 11 of 11 pass. "Psalms 2:7, 12" and "2:7;12" give 2:12; "2:7; 12" does not; "Luke 21:26;35" gives 21:35.
5. r435s.cjs (REFP.parse, 1,835 stored texts): 12 items gained, 0 lost, 6 runs. k435s.cjs (REFP.keys cap 12): 1 key gained (Galatians 4:29, run 32157 claude_r2), 0 lost.
Not run: a full replay of each model-facing builder (D2-D4, C2-C4 Build, Panel Build, Build Independent Verdict, Citation Scan).
