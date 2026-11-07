# pkgEID (W1): DeepSeek enforcer reply labels (W3 Wall 2893 lane 1 D9; W4 33389 report)

DeepSeek enforcer fix, 4 nodes, on the live stack (pkgEFG/patched_live_on_pkgEAM = d813c20d's enforcer nodes).

| Node | base | patched |
|---|---|---|
| Judge Enforcer Build | 571fef513c90 | 8c4699bc921f |
| Alt Judge Enforcer Build | d46e8a7dff5a | e16b19d7fbcb |
| Judge Enforcer Record | 7825fedf4301 | 257f39c3ca96 |
| Alt Judge Enforcer Record | 376b3e737b41 | 3e3b1eaf0e40 |

- Build: the reply form says "one line per ITEM id (the id alone, for example H2.1; never the judge's name, and never the name beside the id)", "<item id>".
- Record: (a) "ID (seat)" / "ID, seat" labels are read (33389 call 4: 30 lines "P1.1 (gemini) --" were dropped).
  (b) lines keyed by judge name map onto the call's items in order only when count and judge sequence equal the call's items exactly (33389 call 3: 21 lines);
  otherwise NO VERDICT as now, and enf428.errors names the label fault. (c) a bare number ("Y1", 33249) is read as the call's one item Y1.x; none or several -> NO VERDICT + fault.
  enf428.eid counts each path. No other row changes.
- test_EID 10 OK: 33389 NO VERDICT 51 -> 0 (E-PREM 30, E-HOLD 18, E-KEY 3); rows of the other calls unchanged; judge-order and count mismatch controls stay NO VERDICT;
  "ID (seat)" control; bare-number and ambiguity controls.
- replay_EID 45 OK over every saved run, main and Alt: a row changes only from NO VERDICT; Build output differs only by the reply-form sentence (33218 parity: no change).
  NO VERDICT 204 -> 137. Gains: 33389 51, 33371 Alt 11 (grok E-PREM, seat-keyed), 33249 Alt 3, 33249 main 2.
  Left: 33222 main 89 (call timed out after 300 s), 33299 Alt 47 (finish_reason length: the reply was cut at the token cap); neither is a label fault.
