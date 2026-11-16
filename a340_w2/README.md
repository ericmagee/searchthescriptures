W2 grade of ASK 340 (target a870766f7085, base s229 6d1d3310).
- mine340.json = build340.cjs run on W2's own live s229 read; nodes and connections equal to target.
- t_mine.txt = t340.cjs replay, PRE = W2 live read; identical to W4 t340_out.txt except header "new network" count (cache already filled).
- p_mine.txt = plant340.cjs on mine340.json; byte-identical to W4 plant340_out.txt.
- other_output_diff.txt (od.cjs) = every non-tag, non-e340 field that differs PRE vs POST: only l2_trial n.checked / n.same, 12 runs.
