#!/bin/bash
# ASK 419 offline proof: each case runs runstart.py on saved fetches (--files) and a saved execution list (--running). S = scratch root.
P=$(dirname "$(readlink -f "$0")")/plants; E=db091b9e-4a6b-4c2a-a35a-e83f1c4cbe5f; C=0e006a24-8100-4186-b32c-ae218eb0b236; FE=$S/a424/fresh_eng.json; FC=$S/a424/fresh_child.json; B=$S/run/body_spark_oracle_def_gemini.json
t(){ n="$1"; shift; out=$(python3 $S/a419/runstart.py "$@" 2>&1); rc=$?; echo "== $n: exit $rc, $(echo "$out" | tail -1)"; echo "$out" | grep -E "^FAIL|waiting in other" | sed 's/^/   /'; }
t "a. live pair, nothing running, released body" --engine $E --child $C --body $B --body-sha 53763d9544a6 --files $FE $FC --running $P/run_none.json
t "b. a running execution in another workflow" --engine $E --child $C --body $B --files $FE $FC --running $P/run_other_running.json
t "c. a waiting execution in the child" --engine $E --child $C --body $B --files $FE $FC --running $P/run_child_waiting.json
t "d. a waiting execution in another workflow" --engine $E --child $C --body $B --files $FE $FC --running $P/run_other_waiting.json
t "e. expected engine version is the one before" --engine 3257a833-d661-4767-ad98-bf620e21e542 --child $C --body $B --files $FE $FC --running $P/run_none.json
t "f. child not published" --engine $E --child $C --body $B --files $FE $P/child_unpublished.json --running $P/run_none.json
t "g. child library one line drifted" --engine $E --child $C --body $B --files $FE $S/a422a/plant_child_drift.json  # also in a422a_w4/ --running $P/run_none.json
t "h. body with an extra key" --engine $E --child $C --body $P/body_extra_key.json --files $FE $FC --running $P/run_none.json --no385
t "i. body without a topic" --engine $E --child $C --body $P/body_no_topic.json --files $FE $FC --running $P/run_none.json --no385
t "j. body that does not parse" --engine $E --child $C --body $P/body_not_json.json --files $FE $FC --running $P/run_none.json --no385
t "k. released body sha differs" --engine $E --child $C --body $P/body_extra_key.json --body-sha 53763d9544a6 --files $FE $FC --running $P/run_none.json --no385
