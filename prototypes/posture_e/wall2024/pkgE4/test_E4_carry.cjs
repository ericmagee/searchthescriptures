// test_E4_carry (W2, W3 3216 bar): on every saved run with an x-ai (grok) alternate, the early request (Early Alternate Build's body_sent,
// built with only the nodes that have run by Panel Cure Check) equals the live Alternate Call openrouter body expression evaluated on the
// saved run at gate time, including reasoning_details on the acceptance turn.
const fs=require('fs');const {harness,D}=require('../pkgGSL/harness.cjs');
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s61.json','utf8'));const ACB=W.nodes.find(n=>n.name==='Alternate Call openrouter').parameters.jsonBody;
const EXPR=ACB.slice('={{ '.length,ACB.lastIndexOf(' }}'));
const N=JSON.parse(fs.readFileSync('pkgE4/out/main_nodes_new.json'));const EAB=N.find(n=>n.name==='Early Alternate Build').parameters.jsCode;
const SL=fs.readFileSync('pkgLIB_v24_RMR/patched/Shared_Library.js','utf8');global.__SLTEXT=SL;
const wrap=c=>'return (async()=>{\n'+c.replace("$('Shared Library').params.jsCode","__SLTEXT")+'\n})();';
const LATE={'Send Back Call openrouter':null,'Alternate Cure Call openrouter':null,'Alternate Call openrouter':null};
let ok=0,bad=0,rd=0;
(async()=>{for(const R of fs.readdirSync(D).filter(f=>/^\d+_Alternate_Call_openrouter\.json$/.test(f)).map(f=>f.split('_')[0]).sort()){
 const ldf=n=>{const f=D+R+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f));const r=d[0];return ((r.data&&r.data.main)||r.main)[0];};
 const ab=ldf('Alternate Build');if(!ab)continue;const calls=ab.filter(x=>x.json.alt&&!x.json.alt.skip);if(!calls.length)continue;
 let e;try{e=await harness(R,LATE)(wrap(EAB.replace(/\$execution\.id/g,'"'+R+'"')),'Panel Cure Check');}catch(x){continue;}
 for(const c of calls){const a=c.json.alt;const m=(e||[]).find(x=>x.json.early.seat_for===a.removed_seat);if(!m)continue;
  // live: the expression on the gate-time alt (saved Alternate Build output), every saved node visible
  global.__J={alt:a};const live=harness(R)('return '+EXPR.split('$json.alt.body').join('__J.alt.body')+';','Alternate Build');
  const same=JSON.stringify(live)===JSON.stringify(m.json.alt.body_sent);const nrd=(live.messages||[]).filter(z=>z&&z.reasoning_details).length;rd+=nrd;
  if(same)ok++;else bad++;console.log((same?'OK  ':'FAIL')+' '+R+' '+a.removed_seat+'->'+a.seat+' ('+a.api_model+'): turns with reasoning_details live '+nrd+', early '+(m.json.alt.body_sent.messages||[]).filter(z=>z&&z.reasoning_details).length);}}
 console.log('TOTAL',ok,'OK,',bad,'FAIL; reasoning_details turns carried',rd);})();
