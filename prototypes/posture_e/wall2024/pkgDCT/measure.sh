#!/bin/bash
# pkgDCT measure, end to end (W1). Run from wall2024/: bash pkgDCT/measure.sh <fetchback> <work dir>
# 1 dump effective sources; 2 trim dead functions; 3 copy trimmed library-node sources into a strip folder;
# 4 pack them with gate/pack.cjs (the library pack used for every package); 5 build the workflow and print the code change.
set -e; FB=$1; W=$2; mkdir -p $W
[ -d $W/eff ] || node pkgDCT/dump2.cjs $FB $W/eff
[ -d $W/trim ] || node pkgDCT/trim.cjs $W/eff $W/trim
rm -rf $W/strip_DCT; mkdir -p $W/strip_DCT/patched
for f in pkgLIB/strip_DCT119/patched/*; do cp "$W/trim/$(basename "$f")" $W/strip_DCT/patched/; done
FB=$FB node --max-old-space-size=10000 gate/pack.cjs $W/strip_DCT $W/pkgLIB_DCT
node pkgDCT/build_DCT.cjs $FB $W/pkgLIB_DCT $W/trim $W/out.json
