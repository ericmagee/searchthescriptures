GRADE ASK 607 build rev 0 (ask607/w4/b1/notes607.md f4a99e70, git 879c090b, Wall 11738): PASS WITH N1. COMMIT: this file.
RULES READ: ruling 546 ("Record-only, as ASK 549"); my plan grade 5b52b915 (N1, chatgpt rows 7218 to 7224); op doc v145 ASK FORM and TWO LIVE RUNS; ASK 599; ASK 612; ASK 616; build rule (fresh base, touched nodes only, no model settings); NEVER TOUCH REASONING (gate prompt untouched).
OBJECTIVE MET: yes. One Library line gains rfs:'pkgFRM' at the one form-refusal push; the existing ASK 549 reader makes the 11 luna rows record-only; nothing else moves.
STANDARD (ASK 599): PASS. No dead code; the mark is read; one ASK tag on the changed line.

Re-run by me in my own container, on W4's files:
- Base = live: base_*.json equals my 608 fetch-backs node for node (engine 94b682a0, 423 nodes; child b9cd4e5c, 156 nodes; connections equal); n8n updatedAt unchanged (20:37:09Z, 18:31:19Z).
- build607.cjs rebuilds targets byte-equal to W4's: engine 46a1862b, child b367f537. lib 802077b0878612c9 to 2f5aa1e63d51edb1.
- Target against base: only Shared Library changes in each. In it, three lines: the sha header; LIB line 6 grows by 94 characters, exactly the inserted `,rfs:'pkgFRM'/* ASK 607 ... */`; MAP line 7 changes only n, +94 on 13 entries (same 13 in engine 64 keys and child 62 keys), every p unchanged.
- C1, C2, C3 outputs byte-equal to W4's (ALL PASS each). C1 shows luna 11 counted before, 0 after; chatgpt 7218 to 7224 equal old and new (my plan N1 answered).
- C1 inputs equal the DB: md5 of item and cure_reason for rows 7218, 7224, 29285, 29295 match debate_enforcer_log.
- C4 SQL re-run: 25 rows NOT APPLIED, ids 7218 to 53202, 5 seats, 6 debates; other kinds 0. Matches.
- Standing set on the targets: 31 PASS 0 FAIL. Pair check: Library Check PASSES (lib 2f5aa1e63d51edb1, map ad6e192e0d5a225f).
- write607.sh read: refuses on a live run, on a failed C1 to C3, on a live Shared Library not the base, and on a failed standing set; replaces only Shared Library on the live JSON; reads back and runs standing and pair after. Holds with or without ASK 623 written first (623 does not touch the Shared Library: if it did, the script stops, fails closed).

N1: c1_607.cjs sets ACORN_DIR to a path in W4's own scratchpad (/tmp/claude-0/-home-user/86d59483.../ac/node_modules). It runs only in W4's container; in mine it failed until pointed at /opt/node-tools/node_modules. Fine for the write (W4 runs it), but the record in git cannot be replayed elsewhere. Fix before the write or in the next build: use process.env.ACORN_DIR || '/opt/node-tools/node_modules'.
