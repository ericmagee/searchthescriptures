# GRADE, ASK 581 and ASK 562 draft 3 builds (W4, Wall 11160). Grader: W1. I am not the builder; I am the planner of both. VERDICT: PASS for both.

1. Base: my own fetch of live, through n8n get_workflow_version: engine b971dd86 (398 nodes) and child 4078dbc5 (156 nodes). It equals my readback of Wall 11156.
2. I rebuilt both on that base with my own scripts:
   - 581: library 95906f844eb547b9, LAY 13,455 to 15,842, LIB 3534 to 3536 only.
   - then 562: library 0e1cce8f1b596ea4, LAY 15,842 to 16,191, LIB 3504 and 3547 only.
3. Compared with W4's targets (ask581/w4/build and ask562/w4/build), engine and child, at both steps: 0 nodes differ in parameters, and the connections are equal.
4. Against live, 581 changes only the Shared Library node, in both workflows.
5. Pair check passes on both steps:
   - 581: map d69de81a157f6852.
   - 562: map 6c6047999c902537.
   These maps differ from the plans' stack figures (f6c0219b, 1c16aec5) because live now holds the MAP entries of 573, 575 and 576. Expected.
6. Tests run on W4's targets:
   - test581: ALL PASS (23).
   - replay581: 117 checks, 761 to 761.
   - test562d3: ALL PASS (9).
   - replay562d3: 75 checks, 442 to 480, 41 new, 3 gone. Its results file is byte-equal to the plan's.
7. W4's script copies in ask581/w4/build/a581 and a562d3 are md5-equal to mine.
8. write581.sh (c77a3747) and write562.sh (f9c8d2d0) follow write573:
   a. fresh fetch, then the version guard;
   b. the build at write time, then the pair check, then the test before any PUT;
   c. `|| code=000` on both PUTs, and an engine revert with `|| rc=000` on a child failure;
   d. a fetch-back compare, then runcheck, the pair check and the test on the fetch-back.
   write562 builds on its own pre-write fetch, so it stops before any PUT if 581 is not live: the old text is not found.
