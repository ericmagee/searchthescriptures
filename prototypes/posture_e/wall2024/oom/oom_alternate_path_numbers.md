# Out-of-memory in the alternate path: where the bytes are (W2, 11-07)

Source: the 33299 node outputs in /mnt/project-files/wall2024/inputs/. 33299 is the only alternate run with real node data; 33276, 33289, 33311 and 33322 lost theirs.
33299 seated grok as the alternate for chatgpt and finished.

## Totals
- All 240 node outputs: 88.8 MB of JSON.
- 12 nodes carry the enforcer log array: 24.5 MB.
- Of that 24.5 MB, **21.0 MB (86%) is the same prompt or reply text repeated** inside one array.
- Alternate Merge Seat and Alternate Merge also carry `enforcer_log_body`, a second full copy of the array: 9.2 MB more (pkgDUP's target).

## Why the text repeats
Every cure row stores `prompt_sent` and `full_reply` for the cure call it came from. A cure call that raises 24 items writes the same prompt on all 24 rows.
At Alternate Merge (502 rows):
- `prompt_sent`: on 116 rows, 18 distinct values. That is 3.13 MB stored, 0.51 MB distinct.
- `full_reply`: on 117 rows, 19 distinct values. That is 1.01 MB stored, 0.15 MB distinct.

## Per node (MB)
| node | file | log | body copy | repeated text in log |
|---|---|---|---|---|
| Alternate Merge | 9.71 | 4.70 | 4.70 | 3.48 |
| Alternate Merge Seat | 9.32 | 4.51 | 4.51 | 3.48 |
| Alternate Needed? | 2.99 | 2.02 | 0 | 1.86 |
| Gate Record | 2.99 | 2.02 | 0 | 1.86 |
| Send Back Record | 2.99 | 2.02 | 0 | 1.86 |
| Judge Enforcer Record | 2.73 | 2.02 | 0 | 1.86 |
| Enforcer Record | 2.32 | 2.02 | 0 | 1.86 |
| Panel Cure Check | 2.21 | 2.02 | 0 | 1.86 |
| Build Save Body | 1.68 | 0.78 | 0 | 0.73 |
| Build Diagnostic Prompt | 1.40 | 0.78 | 0 | 0.73 |
| Extract Diagnostic | 1.40 | 0.78 | 0 | 0.73 |
| Cure Check | 1.22 | 0.78 | 0 | 0.73 |

n8n keeps every node's output in memory for the whole execution. So the log is held once per node that passes it on. At the merge nodes the log grows from 56 rows (2.02 MB, panel cure rows only) to 421 to 502 rows (4.5 to 4.7 MB): the panel's send-back and check rows join, and then the alternate's own rows. Each merge node also holds the body copy, so each is over 9 MB. Dry? passes the same 9.7 MB on. The crashes all came at or after the alternate path (Panel Tokens x3, Format Markdown, Alt Send Back Build), and the runs that crashed were the runs that alternated.

## Options (none built)
1. pkgDUP (asked of Eric): drop the second copy (`enforcer_log_body`). Saves 9.2 MB on 33299.
2. Prompt dedupe (new): carry each distinct prompt and reply once, in a side map keyed by hash, with each row holding the key. Write Enforcer Log expands the keys back into full text just before the DB write, so the stored rows are byte-identical to today's. Saves about 21 MB on 33299 (24.5 MB of log becomes about 3.5 MB).
3. Both together: about 30 MB of the 88.8 MB (34%), and about 80% of what the alternate path adds.
