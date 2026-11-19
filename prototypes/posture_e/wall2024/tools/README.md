# tools/: the shared check tools (lab item 8 of Wall 8821; ASK 447)

Run from this folder or give paths. Each tool is read-only against live systems, except the writers restw.py and libw.py (n8n, only on an operator card) and audit_row.py (one audit_log row after a verified write).

| Tool | ASK | Use | When |
|---|---|---|---|
| rbx.cjs (+ lib.cjs) | 420(a) | Workflow readback: node rbx.cjs <live.json> <target.json> <label>; every node parameter and connection compared | After every n8n write, by both readers |
| mrb.cjs | 420(b) | Engine manual readback: node mrb.cjs <base_version> <new_version> <pairs.json> prints one read-only SELECT (md5 and length of base + pairs against the stored version) | After every engine manual write |
| engine_manual_apply (SQL function) | 421(b) | Engine manual write: preview with p_write false, then write; counts each pair, previews md5, logs | Every engine manual change (manual writer only, on the card) |
| runstart.py | 419 | Run-start check: python3 runstart.py --engine <versionId> --child <versionId> --body <body.json> --body-sha <prefix>; GO or REFUSED | Before every run start; the run-start post quotes GO and the body sha |
| gate.cjs (+ gate_plant.cjs, GATE.md) | 442 | Replay gate: node gate.cjs --base LIVE.json --cand TARGET.json --expect-base <live versionId>; replays changed L2 chain nodes over every stored run, refuses a stale base (exit 3) | Before every card for a code change |
| exercise.cjs | 417 | Which live packages a run exercised: node exercise.cjs <run_token> [--all] prints one read-only SELECT; registry is ../a417_w2/registry.json (or REG=path) | After every run, in the run grade |
| restw.py, libw.py (+ audit_row.py) | 463 | The n8n writers: restw.py for one workflow, libw.py for the engine and child together. --write needs --seat and --card; after a readback with 0 diffs, equal connections and published, each writes one audit_log row (log_audit_event) listing every removed, added and changed node; a failed readback writes none | Every n8n write |

Originals stay where they were built (a420b_w1, a419_w4, a417_w2) as the graded record; these copies are the ones to run.
runstart.py finds the ASK 385 check at ../a385/reg385.cjs or ../a385_w4/reg385.cjs, so it runs from tools/ unchanged.
The JS tools need acorn: run npm install once in this folder (package.json pins acorn 8.11.3; node_modules is not in git).
