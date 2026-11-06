# Variants the live readers accept beyond the spec (W1, from n8n 83ef4d98 source)

This answers spec section 5. Each entry is read from the regex source in `pkgKY/patched/Alternate_Merge.js`, or from `pkgKIND/final/Send_Back_Record.js` for SENDBACK. "Case-insensitive" means the regex has the `i` flag or the line is upper-cased first.

## COLLISION
- **rcLines:**
  - Case-insensitive (the line is upper-cased).
  - No colon is needed: the grade may appear anywhere after the pair.
  - Only DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN and UNDERDETERMINED are read. STANDS and WITHDRAWN on a pair line give grade null.
  - Also counts `D<i> [:] [--|—|-|:] WITHDRAWN` lines with no pair (wdn).
- **krulRulings (K-RUL):**
  - Case-sensitive, and the colon is required.
  - Allows `*` list marks and `**` bold.
  - Reads only DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN and WITHDRAWN.
- **sbApply GR (pkgCP2):** case-sensitive, colon required, all 5 grades.
- **sbLabel and sbApply PR:**
  - Pair only, case-insensitive, `vs.` allowed.
  - Backslashes are stripped (sbLabel). PR also takes a `FORCED [(Commitment N)]:` prefix.

## KEYSTONE
- **rcLines + keyChecks:** case-insensitive. The separator is optional and may be `--`, `—`, a single `-` or `:`. The en dash is not accepted.
- **kkLines:**
  - Case-insensitive, and a separator is required (`--`, `—`, `-` or `:`).
  - A second optional separator before the reason.
- **krulRulings:** any line starting `[-*•] ** KEYSTONE:`. The link is the first `D<i>`.

## CORRECTED RESULT (cureLines, pkgCR)
- The tag is case-insensitive.
- After the tag, any of `--`, `—`, `–`, `:`, `;`, `,` or `(` starts the reason.

## FORCED (KF_LINE)
- Case-insensitive. List marks `-`, `•`, `1.` and `1)` are accepted.
- `[[CR3]]` double brackets are accepted, and a colon after the round is optional.
- Quotes may be `"` or `“` only. Single quotes are not read.
- A `(...)` note may follow each quotation.
- After FAILS, a reason may follow `--`, `—`, `–`, `(`, `;`, `,` or `:`.

## PRESSED / NOT PRESSED
- **Ledger form (ciLedger):**
  - `PRESSED: <verse> -- [<round>] -- "<quote>" -- UNANSWERED|ANSWERED IN [<round>]`. Brackets are optional, and the line is case-insensitive.
  - List marks `-`, `*`, `•`, `>` and `1.` are accepted.
- **NOT PRESSED (ciLedger):** valid when the rest names a `n:n` verse, has no `|`, and has no `vs C<j>`.
- **Cure form (cureLines CURE_KEY):**
  - `PRESSED:` followed by any text, read by the cure's own field logic.
  - The key is upper case only.

## ANSWER CHECK
- **kagRow (K-AG):**
  - List marks `-`, `•`, `>` and `1.` are accepted.
  - The verse runs up to the first `--`, and the round is any bracketed text.
  - `ANSWER: NONE` is accepted, and the answer may be quoted with `"`, `'`, `“` or `‘`.
  - The grade is any word after the next `--`, optionally in parentheses, and is upper-cased (case-insensitive). It is not limited to MEETS, MISSES, FAILS or UNPROVEN.
- **selfLines421 (B7):**
  - Case-sensitive. Only `-` or `•` list marks are accepted.
  - The round must be `[CRn]` or `[DRn]`, and the grade must be MEETS, MISSES or FAILS.
- **gateLineFor ac():** the separator may be `--` or `—`, but not an en dash. The round must be `[CR1-4]` or `[DR1-4]` in single brackets.

## OUT-OF-ROUND (SB_ROW)
- The round may be written with or without brackets, and any digit is accepted (`[CD]R\d`).
- The tag reason follows `--` or `—`, but not an en dash.

## SB_FORM (sbApply "has a line form")
- Also accepts `D<i>:` and `D<i> --` heads, `PREMISE <n>`, and `RULING` with no separator. Case-insensitive.

## SENDBACK / GATE replies
- The match is not anchored, so a reply line is read wherever it starts in the line.
- These id variants are all accepted: `SENDBACK S1`, `SENDBACK: ITEM S1`, `#S1`, `S 1`, and an optional colon after the id.
- The colon after `CHANGE TO` is optional, and the trailing `|| sentence` is optional.
- gateRead keeps the first reply per id.

## K-CMT grade test (kcmtGrade2024)
- Not a form. It looks for an upper-case BROKEN, FORCED, MISSES, VOID or UNPROVEN anywhere outside quotes.
- It skips RESULT recomputed, CLAUSE, STANDING, ruling-card lines, and any line that already names a Commitment.
- On an ANSWER CHECK, it reads only the slot after ANSWER.

## SHORT
- `SHORT:` is accepted by cureLines CURE_KEY (upper case) and is missing from spec section 2. readLines reads it as form SHORT.
