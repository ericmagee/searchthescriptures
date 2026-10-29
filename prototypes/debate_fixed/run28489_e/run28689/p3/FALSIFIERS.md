# P3 (order BB-7994, P2D BB-8004 step 6): items 1 and 4, and the max_tokens trace. Falsifiers declared before building.
Objects this step names, and only these: Init with Guards (item 1), Build Save Body (item 4). Base: live 23cf8db4 (p3/live_*.js).

Item 1 (agreed text: WALL-1838 reply 1882, taken from the row by SQL, never retyped):
- F1a: the GUARDHOLD string carries the agreed sentence exactly once, right after the anchor
  "(for DG-8: Luke 1:34, Matthew 1:18, Matthew 1:25, Sight 1578 item 10)." and one space; the node differs from live only by
  that insertion (new minus the inserted span equals live, byte for byte).
- F1b: evaluated as JavaScript, GUARDHOLD's value contains the sentence with its double quotes as quote characters (no
  backslash left in the value), and the code still parses.
- F1c (mutant): the sentence inserted without escaping its double quotes -> the node fails to parse.

Item 4 (agreed design: WALL-1841 replies 1866-1869):
- MAX_TOKENS TRACE: Build Synthesis sets requestBody.max_tokens (every family branch writes it); Build Save Body runs after
  it on the same path, so $('Build Synthesis').first().json.requestBody.max_tokens is in reach. To be shown by the harness.
- F4a: with Synthesis Normalizer usage {prompt_tokens 1000, completion_tokens 2000, completion_tokens_details.reasoning_tokens
  1500}, finish_reason "length", and Build Synthesis max_tokens 20000, review_notes carries exactly one
  "[SYNTHESIS USAGE: prompt=1000 completion=2000 reasoning=1500 finish=length max_tokens=20000]", as its last item.
- F4b: no completion_tokens_details -> "reasoning=not reported".
- F4c: a node that cannot be read -> its fields read "unknown"; the save is not stopped.
- F4d: every other review_notes item unchanged and in the same order as live, on the same inputs.
- F4e (mutant): the line built from the Verdict Normalizer instead -> F4a fails.
Readers of review_notes read (no parser keys on its absence): Format Markdown (panel flags only, single judge lines
excluded), derive_debate_outcome (appends), dash_odv1_debates, dash_odv1_by_id, view debate_admissible (display).
Effect declared: review_notes is no longer null on a saved row. NOT CHECKED: the site's own readers of review_notes.
