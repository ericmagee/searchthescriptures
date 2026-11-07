# pkgEPL (W2, 11-07): enforcer replies name each judge line (lane 1, DeepSeek)

**Fault (33442).** Judge Enforcer call 5 sent 32 ids: P3.1 to P12.3 (10 E-PREM items, 3 judge lines each), plus R1.1 and R2.1. DeepSeek answered 12 lines labeled with the bare item ids P3 to P12, R1 and R2 (finish "stop"). A bare label that names 3 lines maps to no single line (the pkgEID rule), so all 30 E-PREM checks were NO VERDICT. The prompt's form line asked for "one line per ITEM id (the id alone, for example H2.1)", and the ITEM header carries the id without the dot.

**Fix (6 nodes, base live s48):**
- A. **Judge / Alt Judge Enforcer Build:** the form line asks for one line per LINE id, and says the bare ITEM id is never a reply label. Each item with 2+ judge lines ends with `REPLY LINES DUE FOR THIS ITEM: P3.1, P3.2, P3.3`. The line is added after the calls are packed, so every call holds the same items as before.
- B. **Judge / Alt Judge Enforcer Record:** a bare item label that names 2+ lines is applied to each of those lines only when every seat's grade there is the same. For E-PREM, that means each judge's count line reads `CONCEDED LINKS: 0`; for other rules, the same grade on the same line. Otherwise the lines stay NO VERDICT, as before. A dotted line for the same id keeps its own verdict.
- C. **Judge / Alt Judge Enforcer Retry Build (pkgESS count):** such a bare line counts as answering each of its lines, so the call is not resent for nothing.

**Shas:** see `patched.plan.json`. **Restack on W1 pkgECP (eb5b39c, same two Builds):** `node pkgEPL/build_EPL.cjs pkgECP/patched patched_on_ECP` builds `patched_on_ECP/` (JEB e83b8b7e7371, Alt JEB ab7857403ba9; the other 4 nodes are the same as in `patched/`). `EPL_OUT=patched_on_ECP EPL_BASE=../pkgECP/patched node pkgEPL/test_EPL.cjs` gives 11 OK, and the Builds change prompt text only against ECP.

**Test:** `node pkgEPL/test_EPL.cjs` gives 11 OK and writes `test_EPL.txt`.
- On 33442, NO VERDICT goes from 30 to 0, and the 30 rows read ENFORCER AGREE (right: SPARED). The other 248 rows are unchanged.
- Base s48 resends call 5 ("short reply: 12 for 32"); the patched build does not.
- Controls:
  - When the seat grades differ on P3 and P4, the Record leaves exactly those 6 lines NO VERDICT, and the Retry Build resends the call.
  - A dotted P3.2 line keeps its own verdict.
  - Each split half carries its items' due lines.
- Replay over 63 node runs (33218 onward, 6 nodes):
  - The Builds change prompt text only, with the same ids per call on every run.
  - The Records and Retry Builds change only on 33442.
