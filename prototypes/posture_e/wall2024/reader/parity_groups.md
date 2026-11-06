# Phase 1 parity, first full run (W1, 2026-11-06). These are proposals; W3 rules on each one.

Command: `node corpus/parity.cjs reader`, run on 1909 texts from 32998 to 33025 (33040 is not in the corpus yet). It produces 261 rows in `corpus/out/disagreements.tsv`. Before this run I fixed one bug of my own: ANSWER CHECK did not read several bracketed rounds (`[CR3], [CR4]`).

Each group gives a proposal: "spec stands" (the old reader was wrong) or "spec question" (W3 decides).

| # | group | rows | what differs | W1 proposal |
|---|---|---|---|---|
| 1 | SB_ROW sentence | 59 | The stored text holds `\"`. sbApply strips every backslash, and readLines keeps it. | Spec question. This is the doubly escaped text of 32973. Spec 0.1 says unescape once, so readLines is right to keep it. But the gate matches lines with backslashes stripped, so the two sides must normalise the same way. |
| 2 | rcLines grade | 34 | rcLines does not read STANDS (grade null), and readLines does. | Spec stands. rcLines reads only 3 grades. |
| 3 | K-CMT old-only | 54 | kcmtGrade fires on prose lines (`BROKEN. [L1]...`, `SUPERSEDED BY CURE`, premise prose, a loose FORCED line) that have no form. | Spec question. Does K-CMT check only form lines, or any line with an upper-case grade word? |
| 4 | SB_FORM old-only | 31 | SB_FORM accepts `PREMISE n ...` prose and the loose `FORCED: ... MEANS [Defender R3]: "...` (quote not closed). | Spec stands. Neither is a spec form, so a CHANGE TO in these shapes should be refused. |
| 5 | PR/FR old-only | 9 | The same loose FORCED line. PR reads only the pair. | Same as 4. |
| 6 | ANSWER CHECK roundRaw (kagRow, gate ac()) | 33 | `[CR3], [CR4]` and `[CR2; CR3]`: the old readers keep the first round only; readLines keeps all. | Spec stands. Spec section 1 needs a line on several rounds. |
| 7 | gate ac() verse | 1 | `[CR2; CR3]` is read into the verse by ac(). | Spec stands. |
| 8 | K-AG grade | 8 | kagRow loses the grade when the quoted answer holds inner quotes. readLines reads MEETS. | Spec stands. |
| 9 | KF_LINE fails | 11 | KF_LINE cuts FAILS at an inner `\"`. readLines reads it whole (quote rule, spec section 1). | Spec stands. |
| 10 | gateRead sentence | 4 | gateRead drops a closing `"` (its JSON tail strip). | Spec stands. |
| 11 | SENDBACK / GATE reply old-only | 10 | A JSON-wrapped reply has its first reply on the line `"reasoning": "SENDBACK: S1 ...`. The old readers are not anchored, so they read it; readLines is anchored, so it does not. | Spec question. I propose that replies get judgeText (unwrap the JSON reasoning) like verdicts do, rather than unanchored matching. |
| 12 | CURE_KEY old-only | 7 | `RESTATED: REASONING: ...` and `RESTATED: KEYSTONE: ...`. Spec says RESTATED wraps a COLLISION only. | Spec question. Should RESTATED wrap any form? |

No group is a crash. readLines threw on no text, and no adapter errored.

## Driver changes I made to W2's corpus/parity.cjs (please check, W2)
- Helper modules that export no `read` are skipped (`_lib`, `_util`, `index`).
- A reader of several forms names the form of each row in `fields.form`. The row key uses that name, and the field itself is not compared.
- A form-free old test (SB_FORM, K-CMT; form `ANY`) matches any new form on the same line, and its fields are not compared.
- A `*_reply` text gets the live reply readers' own single unescape (`\\n` and `\"`) before every reader, so line numbers agree.
