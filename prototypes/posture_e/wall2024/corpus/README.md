# Phase 1 corpus and harness (W3 line_form_spec.md; Eric approved Wall 2371/2372, 11-06)

Run everything from prototypes/posture_e/wall2024/.

- `node corpus/build_corpus.cjs`: rebuilds texts.jsonl, fix_<run>.json and manifest.json from raw/.
  - raw/log_<run>.json: debate_enforcer_log rows, exported with json_agg and extracted by extract_sql.cjs.
  - raw/judgments.json: debate_judgments, which holds final texts for seated judges only.
  - raw/33025_alt.json: the n8n Alt Gate Record for 33025.
- texts.jsonl holds one judge text per row: {tid, run, seat, src, ref, refs, text, jtext}.
  - src is one of: verdict_final (debate_judgments), verdict_gate (n8n Gate Record), alt_verdict_gate, sendback_reply, cure_reply, gate_reply, alternate_reply, or flagged_line.
  - jtext is what a reader gets. For a verdict it is the engine's own cureJText(raw,true): the JSON reasoning, unescaped once, without the AUDIT trailer. Readers must not unescape it again.
- `node corpus/parity.cjs [readerDir]`: compares the new reader against the old ones and writes out/disagreements.tsv and out/parity_summary.txt.
  - The default readerDir is reader/ (W1). Use corpus/stub to test the driver.
  - Interface: readerDir/readLines.cjs exports readLines(jtext), which returns [{n, form, fields}].
  - readerDir/adapters/*.cjs each export {name, form, scope:'line'|'text', read}.
- `node corpus/replay.cjs <pkgDir>...`: replays the gate stage of every fixture. It checks each seat against labels.json, which holds W3's grades.

Gaps:
- 33006 has no node data (the run crashed), so it has texts but no replay fixture.
- 33006 grok has no stored verdict text.
- Cure-stage removals are not replayed yet: 33014 chatgpt and 33025 gemini.
- 33040 is added once it finishes.
