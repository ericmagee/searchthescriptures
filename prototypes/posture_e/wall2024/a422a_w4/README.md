# ASK 422(a) build (W4): two copies, one writer, checked at load. Plan W3 rev 2 (a422_w3/plan_422a_rev2.md).

Base: the ASK 424 targets (a424_w4/build424.cjs on engine db091b9e and child 0e006a24). After ASK 424 is written, this is rebuilt on the fresh fetch-back.

    node build422a.cjs ENG CHILD db091b9e-4a6b-4c2a-a35a-e83f1c4cbe5f 0e006a24-8100-4186-b32c-ae218eb0b236 ENG_OUT CHILD_OUT
    S=<scratch root> ./proof.sh      # DONE WHEN 1, 2 and 9, offline; output in proof_out.txt

- sha.js: plain-JS SHA-256 (__SHA422, __LIBSHA422 = first 16 hex over JSON.stringify of the /*LIB*/ line array; null if unreadable). t_sha.cjs checks it against node crypto.
- build422a.cjs: engine node "Library Sha (ASK 422a)" between the true branch of "Second Alternate Needed?" and "Alternate Pass Call"; the Call's pass gains lib_sha.
  Child node "Library Check (ASK 422a)" between "Alternate Pass In" and "Alternate Pass Check"; it stops with "pkgLIB1: library drift, engine <x>, child <y>".
- lib_apply.cjs: one pair set applied to both libraries; refuses unless the two bodies give one sha. libw.py: the joined writer (engine then child, both read back).
- libsha.py: the two-sha readback (exit 1 on DIFFER); the ASK 419 run-start check is to call it.
- proof.sh reads fetches not in git (pre-374, pre-422(c), fetch-backs); the names are in the script.
