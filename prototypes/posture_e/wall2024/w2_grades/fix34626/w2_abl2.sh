# W2 ablation, combined removals; also compares verdict_raw of the written rows with the full build.
cd /home/claude/searchthescriptures/prototypes/posture_e/wall2024
O=/tmp/claude-0/-home-claude/6883c67b-298d-5583-a27c-a88baefc6cfe/scratchpad/abl
for A in K1,K4 K2,K3,K5,K6 K2,K3,K5,K6,E3; do T=$(echo $A | tr -d ,)
 SET=ALL ABL=$A node w2_grades/fix34626/w2_build_abl.cjs /mnt/project-files/wall2024/fetchback_live_s110.json $O/ALLn$T.json 2>&1 | grep -E "SIZE|FAIL" | sed "s/^/$A build: /"
 node w2_grades/fix34626/w2_rev2b.cjs $O/ALLn$T.json 2>&1 | sed "s/^/$A: /"
 node -e '
const chain=require("./w2_grades/fix34626/w2_chain.cjs");(async()=>{const a=await chain("pkgKSR/parent_s110_ALL.json"),b=await chain(process.argv[1]);const R=rs=>rs.flatMap(x=>JSON.parse(x.body).p_rows);const ra=R(a.rows),rb=R(b.rows);
 ra.forEach((r,i)=>{const x=String(r.verdict_raw).split("\n"),y=String(rb[i].verdict_raw).split("\n");const sx=new Set(x),sy=new Set(y);const onlyA=x.filter(l=>!sy.has(l)),onlyB=y.filter(l=>!sx.has(l));console.log(r.judge_seat,"lines only in full build:",onlyA.length,"only in ablated:",onlyB.length);onlyA.slice(0,3).forEach(l=>console.log("   full:",l.slice(0,200)));onlyB.slice(0,3).forEach(l=>console.log("   abl :",l.slice(0,200)));});})();' $O/ALLn$T.json 2>&1 | sed "s/^/$A diff: /"
 rm -rf pkgLIB/strip_ALLw2n$T pkgLIB_ALLw2n$T
done
