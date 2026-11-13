# W2 trace: why ember's run 36212 judgment escaped the enforcer checks (read only, nothing built). 00:20 CST 11-13

## Cause (MEASURED)
- ember (meta/muse-ember, seated for luna by pkgMUS rev 3) wrote its JSON "reasoning" with its newlines escaped twice: the stored reasoning holds 40 literal "\n" sequences and 0 real newlines. After JSON parse the whole decision block (RESULT, KEYSTONE, COLLISION POINTS, ANSWER CHECK, premises) is ONE physical line that begins "HELD -- [L1] ...".
- Alt Judge Enforcer Build reads judge lines with line-anchored patterns (^ANSWER CHECK:, collision, keystone, RESULT ...). On one line nothing matches, so it builds no item and returns je_skip "no judge decision line and no synthesis claim was read". Only the separate K-W check (eakItems2024) ran; K-C ran on the cure path. That matches the log: ember has K-C and K-W rows only.
- Offline replay (simalt.cjs, live s177 library code for Alt Judge Enforcer Build, ember's stored verdict_raw, the run's rounds): as stored -> je_skip, 0 items. With the reasoning's literal "\n" turned into newlines (simalt2.cjs, FIX=1) -> 2 calls, 29 items: E-ANS, E-COL, E-HOLD, E-KEY, E-PREM, E-RES. The E-COL items include ember's five "CHALLENGER LINK BROKEN" collisions, the same check that sent terra back on D2 vs C2.
- In all debate_judgments, only one row has "\\nRESULT" (escaped twice): ember, run 36212. No earlier seat did this.

## Is pkgMUS rev 3 at fault (my build)
- The line reader's blind spot pre-dates pkgMUS. pkgMUS seated a model whose reply format was never tested against it: the W4 check call (36162) proved the call works, not the reply format. My run grade (Wall 5645) counted pkgMUS rev 3 as clean on "ember's row is HELD, readable, cures CURED" without checking enforcer coverage of ember. That count is withdrawn.
- MY MISTAKE: I built pkgMUS rev 3 (Wall 5588) and then counted it in my own run grade. A builder may not grade its own build.

## Outcome bearing (ESTIMATE)
- ember voted DEFENDER WINS with five collisions graded CHALLENGER LINK BROKEN, unchecked. The outcome was UNDERDETERMINED from terra and sol, so ember's unchecked vote did not set it.

## Fix candidates (not built)
1. pkgNLF: in Panel Payloads, Alternate Payloads and R2 Alternate Payloads (each has "verdict_raw:env.text"), before the payload is built:
   if(typeof v.reasoning==='string'&&!/\n/.test(v.reasoning)&&(v.reasoning.match(/\\n/g)||[]).length>1){v.reasoning=v.reasoning.replace(/\\n/g,'\n');env.text=JSON.stringify(v);}
   SIZE (ESTIMATE): 268 chars per copy with comment; +268 if the three share one library line, up to +804 if not; prompt 0. Proof owed: the replay above at FIX, plus a check that downstream readers (gate, cure, derive) see the same lines.
2. Order only: move ember off first alternate until fix 1 is live (Init Seats ORDER0 / Accept Build ORDER): about +/-0 code; the operator's own order, so his decision.
