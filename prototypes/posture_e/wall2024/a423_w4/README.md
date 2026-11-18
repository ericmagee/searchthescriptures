# ASK 423 build (W4): link labels "LINK D<n>" / "LINK C<n>" kept as "LINK <n>"

Plan: W3 a423_w3 rev 1 + rev 2 (5a51ae34); W2 C1, C2 (8863); W1 8867 note, adopted W3 8868 ("REWRITTEN: none" always written).
Built on live engine 3257a833 (after ASK 422(c)). Engine only: the child holds none of the five nodes.

- lbl423.js: the block put, byte-identical, at the head of C2B, D3B and C3B Extract. Each node's original code runs unchanged inside
  `const __O423=(()=>{ ... })();` and its output goes through `__A423` (C2B and D3B: side D, bound = the defender's declared chain from
  D1 Extract; D3B only before its last CHALLENGER'S UNSUPPORTED-L4 PREMISES header; C3B: side C, bound = the highest entry number of that
  list in D3B Extract).
- build.cjs IN OUT BASE_VERSIONID: also Build Save Body (reads the B node's round_fix when it ran; writes the AUDIT v27 LINK LABELS line)
  and Assume Check Build (vp4Block takes the premise's own number and prefers the header tagged [premise n]).
- t423.cjs TARGET LIVE rows.json: DONE WHEN a to e. rows.json (not committed) = every stored run whose engine_r2, engine_r3 or
  challenger_r3 has a line-head LINK...[DC]<digit> (SQL superset; 19 runs). Texts outside that superset cannot match the rewrite pattern.

DEVIATION for the planner: the bound reader. The Shared Library's chain_count regex reads run 39266's "D1: ... D5:" chain as 0, so with
it nothing would be rewritten on the run that raised ASK 423. __CC423 is chain_count widened to read "D1:" and "1)" heads.
