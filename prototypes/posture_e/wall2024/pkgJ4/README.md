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

## Haiku path on joint (a), forced as live (luna removed by the stored run)
- Chain from Alternate Needed? with the stored removal (chain_34726_alt_*.txt, alt_kw.cjs, alt_kw_out.txt).
- live s113: haiku K-W #4 and #6 UNCURED; luna->haiku NOT SEATED (self-check matches the run).
- joint (a): both CURED ("reasserted in a later round, with its quote"); luna->haiku SEATED, haiku drv_uncured 0; panel_effective chatgpt, haiku, sol. sol stays 1 here only because this replay starts after Panel Payloads (stored).
- Panel Done fails closed in the replay ("alternates were seated but Record Alternates ...") because Record Alternates is a database node whose stored output is the live run's (none seated). A replay artifact.

## Rebuilt on pkgOON rev 2 (W2 4405/4406) with pkgKCQ rev 2 and pkgKWQ rev 2
- Base parent_s113_OON2_GK1.json: +118. Joint (a) joint_s113_OON2_GK1_KCQ2_KWQ2.json: +267 (118 + 149). Joint (b) joint_s113_OON2_GK1_KCQ2_KWQ2_EAD.json: +2,142 (267 + 1,875). Measured against s113; Shared Library only; prompt 0.
- Union check on (b): 42 of 42 library nodes equal the union of the single packages' added lines; no line touched twice.
- Chain 34726 from Panel Payloads on (a) (chain_34726_J4A2.txt): luna 0 (gate 4 of 4 cured), chatgpt 0, sol 0; alt_needed false; panel_effective chatgpt, luna, sol; all BROKEN. Haiku path forced as live (alt_kw_J4A2.txt): both K-W CURED; luna->haiku SEATED. quorum_met NOT SHOWN (database side).

## Rebased on s114 (live 17:00 CST 11-10 = s113 + pkgEAD rev 3b; W4 Wall 4423)
- s114 equals parent_s113_EAD.json node for node (0 differing nodes, measured). So joint (b) on s113 is joint (a) on s114: joint_s114_OON2_GK1_KCQ2_KWQ2.json, same bytes as joint (b) (sha256 ed0985508c10c586). +267 code over s114, Shared Library only, prompt 0. Joint (b) retired.
- pkgKCQ/build.cjs on s114: KCQ +121, KWQ +28, BOTH +149 (parent_s114_*.json). Same node set as the s113 builds.
- Union check on s114, 42 unpacked library nodes: joint (a) added and removed lines equal the union of BOTH_s114 and W2's parent_s114_OON2_GK1.json (sha256 54b066618b461343); 42 of 42. Same against W2's s113 base: 42 of 42.
