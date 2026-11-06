# Shared reader, phase 1 (shadow only)

W1 builds this, W2 drives the parity run, and W3 rules on each row (spec: /mnt/project-files/w3/line_form_spec.md). Nothing here is wired into n8n.

## readLines.cjs (the new reader)
- `readLines(rawStoredText)` returns one row per non-empty line of the judge text.
  - A recognised line is `{n, form, fields, norm}`.
  - Any other line is `{n, form:null, why, code, tried, norm}`.
- `readLines(jtext)` takes the text as the engine reads it (W2 corpus jtext) and does not unescape again. `readStored(raw)` applies judgeText first. On the 33025 fixture judgeText(raw) equals the live `cureJText(raw,true)` on 3 of 3 seats.
- `code` is a stable refusal code, such as `COLLISION_GRADE_NOT_UPPER_CASE_CP2` or `NO_LINE_FORM`. `why` is prose only. Callers branch on `code`, never on `why` (Wall 2377, accepted by W3).
- `readLine(line)` reads a single line and returns `{form, f, norm}` or `{form:null, why, code, norm}`.
- `FORMS` lists the forms in the order they are tried.

## adapters/ (the old readers, called live)
- `_lib.cjs` loads the live shared library from `pkgKY/patched/Alternate_Merge.js` (n8n 83ef4d98), meaning everything above the node body.
  - It runs that code under `new Function`, so each adapter calls the real function or regex, not a copy.
  - Inline regexes (sbApply GR, PR, FR and keyChecks, the cureLines CORRECTED RESULT tag, the selfLines421 and gateLineFor ac() ANSWER CHECK regexes, the krulRulings collision regex) are pulled out of the function source.
  - If an anchor is not found, loading throws, so a drifted source cannot pass silently.
- `sb_sendBackRead.cjs` reads the SENDBACK regex from `pkgKIND/final/Send_Back_Record.js`.
- Each adapter exports `{name, form, scope, read}`:
  - With `scope:'line'`, `read(rawLine)` returns fields or null.
  - With `scope:'text'`, `read(rawStoredText)` returns `[{n, fields}]`, with `n` in the live split.
  - `fields.form` is set when one reader covers several forms.
- Field names follow the spec. Where an old reader yields less (for example, SB_FORM yields only `accepted`), the adapter returns only what that reader reads.
- `index.cjs` returns every adapter.

| adapter | scope | forms |
|---|---|---|
| am_rcLines | text | COLLISION, CLAUSE, KEYSTONE, RESULT, STANDING, CONCEDED (first of each) |
| am_keyChecks | text | KEYSTONE (sbApply Rule 0) |
| am_sbLabel | line | COLLISION, KEYSTONE, CONCEDED, STANDING, CLAUSE label |
| am_GR / am_PR | line | sbApply pkgCP2 grade check, pkgCP pair check |
| am_krulCollision | line | K-RUL collision |
| am_KF_LINE | line | FORCED |
| am_SB_FORM / am_SB_ROW | line | sbApply form check, OUT-OF-ROUND row |
| am_cureKey | line | RESTATED, RETRACTED, CORRECTED *, NOT PRESSED, PRESSED, SHORT, STATEMENT, RESPONSE |
| am_ciLedger | line | PRESSED / NOT PRESSED ledger |
| am_kagRow / am_selfAC / am_gateAC | line | ANSWER CHECK (K-AG, B7, gate key) |
| am_kcmtGrade | line | K-CMT grade-word test (no form) |
| am_gateRead / sb_sendBackRead | text / line | GATE and SENDBACK replies |

## Smoke result (33025 fixture, 3 seats; forms only, fields are W2's driver)
Every adapter hit lands on a line readLines gives the same form, except K-CMT, which has 2 lines readLines reads as another form or none. Those 2 lines are for W2's table.
