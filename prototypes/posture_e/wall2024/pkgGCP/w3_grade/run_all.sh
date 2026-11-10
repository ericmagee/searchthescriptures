#!/bin/bash
# W3: every case on live s111 and on the candidate, one process each. usage: run_all.sh <candidate> <outdir>
C=$1; O=$2; L=/mnt/project-files/wall2024/fetchback_live_s111.json; D=$(dirname $0)
for c in L0 P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P10b P11 P12 P13 P14 P15 P16 P17 P18; do
  echo "node $D/w3_gcp.cjs $L $c > $O/live_$c.json 2>&1"; echo "node $D/w3_gcp.cjs $C $c > $O/cand_$c.json 2>&1"
done | xargs -P 6 -I{} timeout 400 bash -c "{}"
