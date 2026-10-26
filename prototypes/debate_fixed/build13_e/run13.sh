#!/bin/sh
# Rev 9 run (Worker_E): sh run13.sh <node dir> <tag>. Writes RUN_<tag>.txt, fm28269_<tag>.md, reg_<tag>/ (the rev 8 set from A3's tree at 22a4aec,
# whose path is A3 below; outputs copied here).
D=$(cd $1 && pwd); T=$2; A3=${A3:-/tmp/claude-0/-home-user-searchthescriptures/58ba9d31-f07a-5e6e-a230-4fe44a036213/scratchpad/wt12/prototypes/debate_fixed/build12_a3}; O=RUN_$T.txt
{ echo "== node h13_cure.cjs $1"; node h13_cure.cjs $1
  echo "== node h_qr.cjs $1 (28269 citation chain)"; node h_qr.cjs $1 fx/rounds28269_h.json fx/kjv28269.json > qr28269_$T.json; node -e "const q=require('./qr28269_$T.json');console.log(q.checked,q.matches,q.mismatches,q.not_checked);q.items.filter(i=>i.status!=='MATCHES'&&i.status!=='NOT CHECKED').forEach(i=>console.log(' ',i.side,i.round,i.ref,i.status,JSON.stringify(i.quote).slice(0,90)))"; md5sum qr28269_$T.json
  echo "== node h13_fm.cjs $1"; node h13_fm.cjs $1 fm28269_$T.md; md5sum fm28269_$T.md
  echo "== rev 8 set in A3's tree"; (cd $A3 && sh f18c.sh $D $T && node f15.cjs $D && node f16.cjs $D && node f17.cjs $D fx/kjv25.json && node f18.cjs $D) > reg_$T.txt 2>&1; rm -rf reg_$T; mkdir reg_$T; cp -r $A3/f15b_out_$T/* reg_$T/; rm -rf $A3/f15b_out_$T; echo "rev 8 set output: reg_$T.txt md5 $(md5sum < reg_$T.txt | cut -c1-32)"; md5sum reg_$T/*
} > $O 2>&1; cat $O
