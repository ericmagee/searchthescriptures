// pkgKSN: replay the 4 nodes holding line 1326 on every stored export, joint (W2) vs joint+KSN; print each changed KEYSTONE line.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const A=L(P+'joint_s130_NVR_CMX.json'),B=L(process.argv[2]||'/tmp/claude-0/cmx/ksn.json');
const NODES=['Alternate Merge Seat','Cure Check','Panel Cure Check','R2 Alternate Merge Seat'];
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{let t=0,eq=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);t++;if(String(a.err)!==String(b.err)){console.log(e,n,'ERR differs',a.err,b.err);continue;}
  const sa=S(a),sb=S(b);if(sa===sb){eq++;continue;}const k=new Set();for(const m of sb.matchAll(/STALE KEYSTONE REASON[^)]*\)/g))k.add(m[0]);
  const ex=sb.replace(/ \[AUDIT: REASON WRITTEN BEFORE THE CURE[^\]]*\]/g,'');const only=ex===sa.replace(/ \[AUDIT: REASON WRITTEN BEFORE THE CURE[^\]]*\]/g,'');
  console.log('CHANGED',e.slice(2,7),n,'| differs only by the note:',only);for(const x of k)console.log('   ',x.slice(0,400));}}
 console.log('replays',t,'equal',eq);})();
