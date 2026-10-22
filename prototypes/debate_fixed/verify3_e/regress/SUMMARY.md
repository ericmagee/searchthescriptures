# Count-line regression (Worker_E), 2026-10-21 about 20:33 CDT

**Data:** 285 stored count lines (debate_judgments and ODV1 single judges) with a stated count of 1 or more, in lines.json (each row md5-checked against the database). For each line, the parser's counted set |P ∪ K| is compared with the integer the judge stated.

| Build | MATCH | UNDER | OVER |
|---|---|---|---|
| dba53ff countedSet (subagent, regress_out.json) | 149 | 103 | 33 |
| 76eed6d drvCounted (Worker_E rerun) | 161 | 97 | 27 |

**76eed6d, defender side:** 139 lines, 44 undercounted.

**Main causes of an undercount, read by hand on dba53ff (classify.cjs):**
- **45 lines:** items labelled C<n>, D<n> or P<n>.
- **13 lines:** "LINK none".
- **16 lines:** a negation inside the item's own description.
- **9 lines:** bare numbers.
- **8 lines:** a bare count with no itemization.

An undercount makes K-G6 or K-G7 raise a premise the judge counted. The honest cure is then refused, because needN adds the false item.
