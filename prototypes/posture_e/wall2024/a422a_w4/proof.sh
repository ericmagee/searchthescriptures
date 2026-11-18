#!/bin/bash
# ASK 422(a) DONE WHEN 1, 2 and 9, offline. Run from a422a/ with S set to the scratch root holding the fetches named below.
cmpLib(){ node -e 'const fs=require("fs");const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};const c=w=>w.nodes.find(n=>n.name==="Shared Library").parameters.jsCode;const a=c(ld(process.argv[1])),b=c(ld(process.argv[2]));console.log("   ",process.argv[3],a===b?"BYTE FOR BYTE EQUAL":"DIFFER",a.length)' "$1" "$2" "$3"; }
echo "1a. ASK 374 pairs on the pre-374 bases -> live 36fcf36b (engine) and the child after 374"
node lib_apply.cjs $S/rdf/prewrite_w374.json $S/rdf/prewrite_w374c.json pairs_374.json /tmp/o1e.json /tmp/o1c.json
cmpLib /tmp/o1e.json $S/a422c/pre_eng.json "engine vs 36fcf36b:"; cmpLib /tmp/o1c.json $S/a422c/pre_child.json "child vs pre-422(c) child:"
echo "1b. ASK 422(c) pairs on those -> live 3257a833 and 0e006a24"
node lib_apply.cjs $S/a422c/pre_eng.json $S/a422c/pre_child.json pairs_422c.json /tmp/o2e.json /tmp/o2c.json
cmpLib /tmp/o2e.json $S/a422c/back_eng.json "engine vs 3257a833:"; cmpLib /tmp/o2c.json $S/a422c/back_child.json "child vs 0e006a24:"
echo "1c. ASK 424 pairs on db091b9e and 0e006a24 -> the ASK 424 targets"
node lib_apply.cjs $S/a424/fresh_eng.json $S/a424/fresh_child.json $S/a424/pairs_424.json /tmp/o3e.json /tmp/o3c.json
cmpLib /tmp/o3e.json $S/a424/t424_eng.json "engine vs t424:"; cmpLib /tmp/o3c.json $S/a424/t424_child.json "child vs t424:"
echo "1d. refusals"
node lib_apply.cjs $S/a422c/back_eng.json plant_child_drift.json pairs_noop.json /tmp/x1.json /tmp/x2.json 2>&1 | tail -1; echo "    exit ${PIPESTATUS[0]}"
node lib_apply.cjs $S/a422c/back_eng.json $S/a422c/back_child.json pairs_absent.json /tmp/x1.json /tmp/x2.json 2>&1 | grep -m1 -oE "(Error: .*|REFUSED.*)"; echo "    exit ${PIPESTATUS[0]}"
echo "2. load check (t422a.cjs) on the targets built on the ASK 424 targets"
node t422a.cjs t422a_eng.json t422a_child.json t422a_eng.json t422a_child.json
echo "9. two-sha readback (libsha.py) on fetched pairs"
python3 libsha.py $S/a424/fresh_eng.json $S/a424/fresh_child.json; echo "    exit $?"
python3 libsha.py $S/a422c/back_eng.json plant_child_drift.json; echo "    exit $?"
