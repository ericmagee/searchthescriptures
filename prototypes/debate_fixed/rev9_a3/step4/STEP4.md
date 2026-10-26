# BB-7397 rev 9, step 4: draft writes (Worker_A3, amendment 5 BB-7633, opened by BB-7635)

Workflow moMxiV4Irg1uRBZN (TRUTH - ORACLE_DEBATE_V1). These are draft writes only. Nothing was published, and the active version, 75dcb465, is untouched. derive_debate_outcome was not touched; its live md5 is still 173f9465.

Method: update_workflow, with one setNodeParameter /jsCode operation per call, for 22 calls in total. The payloads are Worker_E's files at git 0b1003c, and each is byte-equal to new13 at git 9217afe.

Fetch-back: each listed version was fetched by get_workflow_version and compared to base13 and new13 by cmp13.py (this folder). See CMP13_RUNS.txt for every result.

| version  | what it is                          | written | at base |
|----------|-------------------------------------|---------|---------|
| c9d35524 | write 1 (Plain Rule Lines)          | 1       | 21      |
| 53ab988f | write 22 (Alternate Payloads)       | 22      | 0       |
| 4ba9c4af | undo check: restore of 75dcb465     | 0       | 22      |
| a82b4d29 | restore of 53ab988f (current draft) | 22      | 0       |

In every fetch, no node was in neither state, no other code node was off base, non-code fields were equal, and node names and connections were equal.

draft_a82b4d29_22nodes.json holds the 22 jsCode values as fetched from the current draft. NODE_MD5.txt gives the md5 of each value.

Undo for step 4: restore_workflow_version 75dcb465-116a-4dde-a8bc-090232a135a4. This was proven above as version 4ba9c4af.

Audit row: 23021.

Next is step 5: Worker_E verifies the current draft a82b4d29.
