#!/bin/bash
# Joint on live s152: pkgU72 (W1), then pkgKWH rev 2 (W2), then pkgBRS (W2). Usage: bash build.sh <s152 json> <out json> <tmp dir>
set -e;D=$(dirname "$0")/..
node $D/pkgU72/build.cjs "$1" "$3/ja.json";node $D/pkgKWH/build_KWH.cjs "$3/ja.json" "$3/jb.json";node $D/pkgBRS/build_BRS.cjs "$3/jb.json" "$2"
