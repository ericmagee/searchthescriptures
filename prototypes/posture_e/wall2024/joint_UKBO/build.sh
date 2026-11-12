#!/bin/bash
# Joint on live s152: pkgU72 rev 2 (W1), pkgKWH rev 3 (W2), pkgBRS (W2), pkgOLK (W1). Usage: bash build.sh <s152 json> <out json> <tmp dir>
set -e;D=$(dirname "$0")/..
bash $D/joint_UKB/build.sh "$1" "$3/jc.json" "$3";node $D/pkgOLK/build.cjs "$3/jc.json" "$2"
