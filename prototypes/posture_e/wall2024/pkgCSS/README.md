# pkgCSS rev 1 (W1): the closing enforcer called once per side (item A gap). Operator approved 23:45 CST 11-09 (thread msg cmsg_017ZQamDMHrS6fqMHnQDVo58MBjAta9iDdbo7hSU2rhpZ2).

Cause on record (W3 dry regrade of 34299, finding 1): one prompt held both sides (about 151,000 characters); DeepSeek's reasoning examined only
the challenger and replied NONE, so the defender's D6 drop in [CR3] reclaimed in [CR4] was missed although both sentences were in the prompt.

Write file: pkgCSS/parent_s104_CSS.json, built on live s104 (`node pkgCSS/build_CSS.cjs /mnt/project-files/wall2024/fetchback_live_s104.json pkgCSS/parent_s104_CSS.json`).
Against s104 only Close Enforcer Build and Close Enforcer Record differ; connections equal. No hint list, no new rule.
- Build: the instruction is REPLACED by a shorter one-side instruction (prompt_side.txt, 1,320 characters instead of 1,725; same rules,
  the live "differs only in wording" exception kept). One item per side whose closing round has text, each with that side's candidates and
  that side's four rounds, byte-equal to the live prompt's section for that side. System text unchanged. The Call node runs once per item.
- Record: reads every Build item and every reply by position, joins the reply lines, names a failed call by its side, logs both prompts in the
  first row as before. One output item, same shape: Panel Build, Build Independent Verdict and Judge Contradiction Build are unchanged.

Measured size (size_CSS.txt, 35 stored debates; characters of system + user text per DeepSeek call):
- largest single call: mean 143,384 (live) to 77,010: 46.3% smaller (the body n8n holds per call);
- total sent per debate: +1,242 characters on average (about 311 tokens, +0.87%), the instruction sent twice;
- node code: Close Enforcer Build 8,168 to 7,940 (-228); Close Enforcer Record 10,775 to 11,096 (+321); net +93.
- not measured: DeepSeek reasoning length over two calls (replay through the test relay shows it).

Checks
- record_CSS.txt: T1-T10 10 OK (labels 16227eff; two test faults fixed after the first run, written in the file header: T7 expected an empty
  cure_reason where the log, as live, writes NONE FOUND; T9/T10 read Final Output through the wrong harness).
- Rolled-back insert of the pkgCSS NONE row: rows 1, recorded true.
- The library replay gate does not apply (no library node changed).
