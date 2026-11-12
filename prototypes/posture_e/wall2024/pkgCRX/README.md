# pkgCRX: shared contradiction rule text and CLOSING BLOCK on the judge path (ASK 123, option 1)

- Parent: parent_s160_WVR8.json (live s160 + pkgWVR rev 8). Output: /mnt/project-files/wall2024/parent_s160_WVR8_CRX.json.
- Changes only Judge Contradiction Build. Close Enforcer Build is untouched and is the source of the shared text.
- The judge prompt is now: its own head (both sides, judge-named candidates) + the Close Enforcer RULES (definition, NOT list, CLOSING BLOCK sentence) + its own quote-and-link line (DECLARED CHAIN / LINK blocks) + the Close Enforcer FORMAT (reply lines, NONE line).
- Each judge-named candidate now carries its CLOSING BLOCK, built by the same cecBlock function (byte-equal copy) and the same "as under" de-duplication as Close Enforcer Build.
- check_CRX.cjs fails if the judge node's RULES, FORMAT or cecBlock drift from Close Enforcer Build. Run it on any package touching either node, and on the fetch-back.
- Proof: replay_stored.cjs rebuilds the 5 stored judge-path prompts (debate_enforcer_log) byte for byte with the old code, then measures the new ones.
- pkgWVR rev 8's ASK 116 sentence stays in the pkgWVR candidate note (Close Enforcer path only); it is not in the shared text.
