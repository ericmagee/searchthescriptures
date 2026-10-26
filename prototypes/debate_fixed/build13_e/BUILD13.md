# THE DEBATE FIXED (BB-7397) rev 9, portion 1 build: Worker_E (DoD 19, 21-26; DoD 20 follows amendment 3)

Base: base13 = new12 = active 75dcb465 (63 of 63 byte-equal). Build: new13. Changed set: CHANGED13.txt (21 nodes: the 14 library copies,
Format Markdown, Plain Rule Lines, Citation Scan, Quote Report, Panel Build, Panel Payloads, Alternate Payloads). md5s: NEW13_MD5S.json.
Patches (applied by script, each anchor hit exactly once): patch_lib.py, patch_cite.py, patch_fm.py, patch_c.py.
Falsifiers: FALSIFIERS13.txt with Addendum 1 (A1-A3). Runs: RUN_base13.txt, RUN_new13.txt (run13.sh), f24.cjs, f26.cjs (outputs below).

| Falsifier | base13 | new13 | declared |
|---|---|---|---|
| F19 DeepSeek D6 vs C3 (28269) | UNCURED | CURED | UNCURED -> CURED |
| F19a D3 vs C1 | UNCURED | UNCURED | both UNCURED |
| F19b quote ends before the window | UNCURED | UNCURED | both UNCURED (caught the first build, A1) |
| F19b2 quote ends one letter inside | UNCURED | CURED | UNCURED -> CURED |
| F19c F15c.1, F15c.2 | UNCURED | UNCURED | both UNCURED |
| F19d 7194 defect 1 set (27433) | as rev 8 harness | same | unchanged |
| F21 Gemini 28269 section | "Rule applied: BROKEN" | "Rule applied: HELD ... (the clause counted after the judge's cure; retracted: D3 vs C1, D6 vs C1)." then the before-cure block | as declared |
| F21b 27893 (A3 f17) | - | Gemini's section +5 lines; DeepSeek's and the heads unmoved | predicted move |
| F22 28269 citation check | 167/148/2/17, Matthew 1:19 listed | 166/148/1/17, Matthew 1:19 out, Judges 11:39 stays | as declared |
| F22b 27893, 27795, 27665 | - | item lists unchanged | unchanged |
| F23 reads that gave no text | node: error text | "Reserve Build; Alternate Cure Build." | as declared |
| F24 (1) 700-char statement | 600, cut mid-word | 594, ends "word85..." | as declared |
| F24 (2) 28269 not-cured cells | "... \| Th Not cured: ..." | "... \| Th -- Not cured: ..." | as declared |
| F25 28269 head and sections | 1 Gemini, 2 Grok, 3 GLM | 1 DeepSeek (removed), 1 alternate GLM, 2 Gemini, 3 Grok | as declared |
| F26 (1) prompt C list | none | C1-C6 from [DR3], judgeBlock md5 unchanged (26cf5f19) | as declared (A2, A3) |
| F26 (2) audit, 28269 | none | Gemini D1 vs C5, D2 vs C6, D4 vs C4, D5 vs C7; GLM D1 vs C5, D6 vs C7; Grok, DeepSeek none | the pen's six |
| F26 report rows | none | six Result rows; panel text unchanged (noMarkers) | as declared |
| rev 8 cure set (f18c, F15, F16, F18) | RUN_NEW3 md5s | equal | unchanged |

Rendered 28269 report, base13 vs new13 (h13_fm.cjs): every changed line is one of F21-F25 (head 12-15, citation 35/37, cells 83/85, GLM's
section moved to its seat number, Gemini's before-cure block, Grok renumbered, reads line); the clock line differs by run time only.
OPEN: DoD 20 (amendment 3, 7615; my AGREED with one wording counter, 7618): F20, F20b and the reader sweep are declared before that change.
LIMITS: A1 (a second occurrence inside a margin refuses); A3 (bare references left out of the C list); the audit reads [DR3] from the text
sent to the judge, so a run whose prompt has no "=== [DR3]" section gives no audit line.
