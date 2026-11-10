# Joints on s113 (W1, offline): form-fault fixes of run 34726
- Base: /mnt/project-files/wall2024/parent_s113_OON_GK1.json (W2: pkgOON +40, pkgGK1 +97; +137 measured).
- Joint (a) joint_s113_OON_GK1_KCQ_KWQ.json: + pkgKCQ + pkgKWQ (pkgKCQ/build.cjs SET=BOTH on the base). +169 code measured against s113 (137 + 32). Shared Library only; prompt 0.
- Joint (b) joint_s113_OON_GK1_KCQ_KWQ_EAD.json: joint (a) + pkgEAD rev 3b (build_EAD.cjs BASESRC=J4A). +2,044 code measured (169 + 1,875). Shared Library only; prompt 0.
- Node overlap: OON/GK1 change 10 gate/merge nodes; KCQ/KWQ change 30 nodes, including all 10 of those; EAD changes the 3 send-back build nodes, shared with none.
- Union check: for each of the 42 library nodes, joint (b)'s added lines against s113 equal the union of the single packages' added lines (OON_GK1, KCQ+KWQ, EAD): 42 of 42, no line touched twice.
- Chain replay of 34726 from Panel Payloads with stored model replies (W2's chain_w2.cjs, replies renumbered), chain_J4.cjs:
  - live s113 (self-check): luna 12 counted, sol 1, haiku tried for luna NOT SEATED (2 uncured), sol none (G4). Same as the live run.
  - joint (a): luna gate 4 items, 4 cured, 0 counted; chatgpt 0; sol 0 (K-C not raised). alt_needed false; no seat removed; panel_effective chatgpt, luna, sol; all three BROKEN.
  - NOT SHOWN: the outcome row (quorum_met) itself; the haiku path (no alternate is needed on joint (a)), so pkgKWQ is shown only by its function-level cure replay.
