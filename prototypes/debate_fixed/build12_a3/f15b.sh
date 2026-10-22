#!/bin/sh
# F15b (Worker_A3, BB-7397 rev 8): every 27795 and 27665 cure check, run on a node dir; outputs to f15b_out_<tag>/, md5 per harness.
# Usage: sh f15b.sh <node dir> <tag>. Inputs: fx/report27665.md (7f22d279), fx/rounds_27795.json, fx/f12_cases.json.
D=$1; T=f15b_out_$2; mkdir -p $T
node reg/h_cure.cjs $D fx/report27665.md > $T/h_cure.txt 2>&1
node reg/h_2c.cjs $D fx/report27665.md > $T/h_2c.txt 2>&1
node reg/h_site.cjs $D fx/report27665.md > $T/h_site.txt 2>&1
node reg/h_site2.cjs $D fx/report27665.md > $T/h_site2.txt 2>&1
node reg/h_ask.cjs $D > $T/h_ask.txt 2>&1
node h_f12.cjs $D fx/rounds_27795.json fx/f12_cases.json > $T/h_f12_27795.txt 2>&1
md5sum $T/*.txt
