// W1 grade of pkgCRF: run s135 and CRFb stub code (rebuilt from each library) on stored exports; compare outputs with response_format removed.
const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const A=LIB('/tmp/claude-0/_u_fetchback_live_s135.json'),B=LIB('/tmp/claude-0/_u_parent_s135_CRFb.json');
const NODES=['Cure Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Cure Build','R2 Alternate Cure Build','Cure Normalize','Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3','Alternate Cure Normalize','R2 Alternate Cure Normalize'];
const strip=x=>JSON.parse(JSON.stringify(x,(k,v)=>k==='response_format'?undefined:v));
const rfCount=x=>(JSON.stringify(x).match(/"response_format"/g)||[]).length;
(async()=>{for(const f of process.argv.slice(2)){const ex=JSON.parse(fs.readFileSync(f,'utf8'));const rd=ex.data.resultData.runData;const nm=f.split('/').pop().replace('_full.json','');
 for(const n of NODES){if(!rd[n])continue;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);
  if(a.err||b.err){console.log(nm,n,'ERR',a.err||'-',b.err||'-');continue;}
  const sa=JSON.stringify(a),sb=JSON.stringify(b),ea=JSON.stringify(strip(a)),eb=JSON.stringify(strip(b));
  const notes=s=>(s.match(/ANSWER FORMAT: return one JSON object/g)||[]).length;
  console.log(nm,'|',n,'| identical',sa===sb,'| equal without response_format',ea===eb,'| response_format old/new',rfCount(a),rfCount(b),'| ANSWER FORMAT notes old/new',notes(sa),notes(sb),'| chars',sa.length,sb.length);}}})();
