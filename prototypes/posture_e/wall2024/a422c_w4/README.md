# ASK 422(c) build (W4): KV_EXCL takes "makes" and "excludes"

Plan: W2 8866 rev 1 (a422c_w2/plan_rev1.md, f871cd48); PASS W3 8868, W1 8870.

- build.cjs IN OUT BASE_VERSIONID: on the Shared Library line holding KV_EXCL (index 1013, line 1014 counted from 1), both
  "(?:make|exclude)\b" groups become "(?:makes?|excludes?)\b". Refuses unless exactly 2 groups sit in the literal and none
  outside it. MAP n recomputed (33 entries change n), header library sha updated, every stub parsed.
- t422c.cjs OLD NEW: stubs compile; the K-V kind test taken from each side's Cure Check stub; cases.json (plan cases a to h,
  W3's 9 wrong-if cases as e1 to e9); replay of the stored population at line and sentence level.
- Population (pop.json, not committed, 7.9 MB): the ASK 376 population (a376b, 21:12Z) plus every row stored since
  (judgments id > 1229 holding "void", K-V rows id > 44379, run 39266 alternates holding "exclu").

Built on live engine 36fcf36b (library sha 603f8ccc979aba85) and child 365d2828. New library sha 7b1cd78b3c25da5c, same
on both. Target file sha256 (first 16): engine 71ac26990ab51263, child bf0e0ac48cffd131.

The full REPLAY GATE (gate/replay.cjs) needs saved runs in /mnt/project-files/wall2024/inputs; that folder is empty in
this container, so the cases are carried here in kind-test form, not as gate/cases run edits.
