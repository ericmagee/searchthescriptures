#!/bin/sh
# Item 6 proof (W1, 11-09): pkgKRC's change, made as ONE edit to lib/cureVerdicts.js, gives pkgLIB/strip_CJR_KRC byte for byte
# (build_KRC.cjs made the same change by substitution in 26 files). Run from wall2024/.
set -e
T=$(mktemp -d)
node gate/src.cjs split pkgLIB/strip_CJR $T/src >/dev/null
node -e '
const fs=require("fs");const p=process.argv[1];
const OLD="if(!respOf(x)&&!(x.rule===\x27K-B\x27&&(wd.has(U(x.link))||cureRest(o,x).length))){";
const NEW="if(!respOf(x)&&!(x.rule===\x27K-B\x27&&(wd.has(U(x.link))||cureRest(o,x).length))&&!(x.rule===\x27K-RUL\x27&&krulCure(x,reply.text,R,\x27\x27).st===\x27CURED\x27)){ /* pkgKRC */";
const s=fs.readFileSync(p,"utf8");if(s.split(OLD).length!==2)throw new Error("expected one hit");fs.writeFileSync(p,s.replace(OLD,NEW));' $T/src/lib/cureVerdicts.js
node gate/src.cjs join $T/src $T/strip >/dev/null
diff -r $T/strip/patched pkgLIB/strip_CJR_KRC/patched && echo "OK: one edit to lib/cureVerdicts.js == strip_CJR_KRC (26 files) byte for byte"
rm -rf $T
