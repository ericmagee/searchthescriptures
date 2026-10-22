#!/bin/sh
# F18c (Worker_A3, BB-7397 rev 8 DoD 18): the F15b set plus Worker_E's F11 harnesses (Gemini's 27795 retraction). Usage: sh f18c.sh <dir> <tag>
sh f15b.sh $1 $2
T=f15b_out_$2
node h_f11.cjs $1 fx/gemini_verdict_raw_27795.txt fx/gemini_cure_reply_27795_rebuilt.txt > $T/h_f11_27795.txt 2>&1
node h_f11b.cjs $1 > $T/h_f11b_27795.txt 2>&1
md5sum $T/h_f11_27795.txt $T/h_f11b_27795.txt
