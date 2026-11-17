ASK 379 replay inputs (W4, 2026-11-17). gunzip before use.
exec_<run>.json / exec_<run>_nodes.json: the stored engine run's node data (38450 whole; 37372, 37510, 35296 the 82 nodes the pass reads and the chain), {data:{resultData:{runData}}}.
n8n_exec_<id>.json: scratch child executions.
  38569, 38570, 38571: loop replay of 38450 at cap 3 (passes 2, 3, 4), current child.
  38573, 38574, 38575: loop replay of 37372 at cap 3 (passes 2, 3, 4), current child.
  38560 (37510), 38562 (35296): single-pass replays with the earlier child form (input passed through; same chain nodes).
Commands (from a379_w4, inputs unzipped beside them, base s260 = prewrite_base_s260.json):
  node t_chain.cjs <base> n8n_exec_38573.json exec_37372_nodes.json 37372      (node by node against s260 code)
  node sim_loop.cjs t379_cap3.json exec_37372_nodes.json n8n_exec_38573.json n8n_exec_38574.json n8n_exec_38575.json
  node t379_multi.cjs t379_cap3.json exec_37372_nodes.json ; node t379_multi_fm.cjs t379_cap3.json exec_38450.json
  t379_cap3.json = A379_CAP=3 node build379.cjs <base> CHILD_ID_AT_WRITE t379_cap3.json c_cap3.json
