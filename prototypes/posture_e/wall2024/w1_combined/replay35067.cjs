// W1: s130 + pkgRCH + joint Shared Library (NVR+CMX), offline on run 35067. Every node that changed or reads the Shared Library is replayed on its stored inputs
// in four versions: s130, RCH alone, joint alone, combined. Interference test: combined equals the one version that changes it (or s130 when none does).
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const un=p=>{let j=JSON.parse(fs.readFileSync(p));j=j.data||j;return j.workflow||j};
const V={s130:'/tmp/claude-0/live_now.json',RCH:P+'parent_s130_RCH.json',JOINT:P+'joint_s130_NVR_CMX.json',COMB:process.argv[3]||'/tmp/claude-0/cmx/combined.json'};
const Lv={},Wv={};for(const k in V){Lv[k]=L(V[k]);Wv[k]=un(V[k]);}
const code=(k,n)=>{if(n in Lv[k].M)return Lv[k].code(n);return Wv[k].nodes.find(x=>x.name===n).parameters.jsCode;};
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
const ex=process.argv[2]||'ex35067_full.json';const rd=JSON.parse(fs.readFileSync(P+ex,'utf8')).data.resultData.runData;
const NODES=[...new Set(Object.keys(Lv.s130.M).concat(['Close Enforcer Build']))].filter(n=>rd[n]);
(async()=>{let bad=0;const changed=[];for(const n of NODES){const o={};for(const k in V){const r=await run(code(k,n),n,rd);o[k]=r.err?'ERR '+r.err:S(r);}
 const r=o.RCH!==o.s130,j=o.JOINT!==o.s130;const exp=r&&j?null:r?o.RCH:j?o.JOINT:o.s130;const ok=exp===null?'BOTH CHANGE':o.COMB===exp;if(ok!==true)bad++;
 const tag=(r?'RCH ':'')+(j?'JOINT ':'');if(r||j||o.COMB!==o.s130){changed.push(n);console.log(n.padEnd(28),'| changed by:',tag||'none','| combined equals expected:',ok,'| errors:',['s130','COMB'].map(k=>o[k].startsWith('ERR')?k:'').join('')||'none');}}
 console.log(ex,'nodes replayed',NODES.length,'changed',changed.length,'interference',bad);})();
