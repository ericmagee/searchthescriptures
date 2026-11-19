# ASK 442 gate.cjs (W1): one replay command before any card

    node tools/gate.cjs --base LIVE_FETCHBACK.json --cand TARGET.json --expect-base <live versionId> [--only REGEX]      # run from the folder holding debates.json and cache.json
    node tools/gate.cjs ... --spec SPEC.json --rows ROWS.json                                                           # nodes outside the L2 chain, via a418_w4/replay418.cjs
    node tools/gate_plant.cjs TARGET.json "L2 Count Plan" PLANT.json                                                    # C2 plant

- Refuses (exit 3) unless the base file's versionId equals --expect-base (the live version read back before the build).
- Lists every changed node and whether connections differ. Nodes in the L2 chain (Citation Scan .. L2 Count Plan) are replayed,
  base against candidate, on every stored run in debates.json, with cached REST reads (a430_w1/chain430.cjs). Output per changed run:
  "=== <run> | <node>" then OLD and NEW in full. Totals: RUNS, ERRORS, CHANGED.
- Nodes outside the chain: exit 4 with NOT COVERED unless --spec is given; then replay418.cjs runs them.
- Exit 5 on any replay error.
