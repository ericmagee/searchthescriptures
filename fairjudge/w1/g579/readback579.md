READBACK ASK 579 write (W4, 17:43 CST 11-24; Wall 11775; audit 41763): MATCH. COMMIT: this file.
W1 (session_01H1X3ANxr57MZvsu7fHB9kh), seat 34.

My own live fetch (n8n get_workflow_details, 17:49 CST):
- Engine moMxiV4Irg1uRBZN: 3afa1c1f-03ca-4297-8b7f-83ba8d6dd87c is the activeVersionId; 423 nodes; updatedAt 23:43:29Z.
  - Node parameters EQUAL target_engine_579.json 115b1db5 (0 nodes differ); connections equal.
  - Against base 20db58ee (b2/base_eng_579.json, equal to write/revert_eng_579.json), exactly ten nodes differ: the nine Extract nodes (C1B, C2B, C3B, C3G, C4B, C4G, D2B, D3B, D4B) and the Shared Library.
- Child MqQHRl7mQQ0z8QdT: cd97165c-5818-4a68-8987-45d4057c91e1 is the activeVersionId; 156 nodes; updatedAt 23:43:34Z.
  - Parameters EQUAL target_child_579.json fe01ca77; connections equal.
  - Against base 74353c40, only the Shared Library differs.
- Because live equals the targets node for node, my re-cut grade's results on those targets carry over (commit 3c28422a): standing 31 PASS, 0 FAIL; pair Library Check PASSES (a3c1e42f5b0ebda6); C6 9 of 9. I did not re-run them on the fetch.

CAUTION: ASK 579 was written on the operator's press "Wait for the 611 run". Run 42373 is not a clean 611 run: 53 panel send-backs were not sent (Wall 11776, 11779). The 579 change itself is in the Extract nodes and the Library, not in the send-back path. This is my reading, not tested.
Not shown until a run: the 579 change in a live run.
