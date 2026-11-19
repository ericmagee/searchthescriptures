// usage: node p440_w2/v455a.cjs EXEC.json ...  replays Resolve Seats (base 7cd61791 from a443_w4/t443_eng, live e0a61271 from a475_w4/fetchback) with and without the deepseek row
const fs=require('fs'),z=require('zlib');
const wf=p=>{let w=JSON.parse(z.gunzipSync(fs.readFileSync(p)));if(w.data&&w.data.nodes)w=w.data;return w;};
const code=p=>wf(p).nodes.find(n=>n.name==='Resolve Seats').parameters.jsCode;
const OLD=code('a443_w4/t443_eng.json.gz'),NEW=code('a475_w4/fetchback_w475_engine.json.gz');
const run=async(src,rd,drop)=>{
  const items=k=>{const r=rd[k];if(!r)throw new Error('no node '+k);let a=r[0].data.main[0];if(k==='Fetch Models'&&drop)a=a.filter(i=>i.json.seat!=='deepseek');return a;};
  const $=k=>({first:()=>items(k)[0],all:()=>items(k),item:items(k)[0]});
  const $input={first:()=>items('Fetch Models')[0],all:()=>items('Fetch Models'),item:items('Fetch Models')[0]};
  try{const $execution={customData:{set:()=>{}}};const f=new Function('$','$input','$execution','return (async function(){'+src+'\n})();');const o=await f($,$input,$execution);return {ok:true,out:JSON.stringify(o)};}
  catch(e){return {ok:false,err:String(e.message).replace(/ run_token=.*/,'')};}
};
(async()=>{for(const p of process.argv.slice(2)){const E=JSON.parse(fs.readFileSync(p));const rd=(E.data||E).resultData.runData;
  const stored=JSON.stringify(rd['Resolve Seats'][0].data.main[0].map(i=>i.json));
  const o1=await run(OLD,rd,false),n1=await run(NEW,rd,false),o2=await run(OLD,rd,true),n2=await run(NEW,rd,true);
  const j=r=>r.ok?JSON.parse(r.out):null;const js=r=>r.ok?JSON.stringify(j(r).map(i=>i.json)):null;
  console.log(p);
  console.log('  with deepseek row: base',o1.ok?'runs':'REFUSES '+o1.err,'| live',n1.ok?'runs':'REFUSES '+n1.err,'| base output = stored:',js(o1)===stored,'| live = base:',js(n1)===js(o1));
  if(o1.ok&&js(o1)!==stored){const a=JSON.parse(stored)[0],b=j(o1)[0].json;console.log('  base vs stored, differing keys:',Object.keys({...a,...b}).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k])).join(','));}
  if(n1.ok&&o1.ok&&js(n1)!==js(o1)){const a=j(o1)[0].json,b=j(n1)[0].json;console.log('  differing keys:',Object.keys({...a,...b}).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k])).join(','));}
  console.log('  without deepseek row: base',o2.ok?'runs':'REFUSES: '+o2.err,'| live',n2.ok?'runs':'REFUSES: '+n2.err);
  if(n2.ok&&n1.ok){const a=j(n1)[0].json,b=j(n2)[0].json;console.log('  live, without vs with: keys differing:',Object.keys({...a,...b}).filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k])).join(',')||'none');
   const d=b.deepseek||(b.models&&b.models.deepseek);console.log('  live without: deepseek field api_model =',d&&d.api_model,'(luna row api_model =',(rd['Fetch Models'][0].data.main[0].find(i=>i.json.seat==='luna')||{json:{}}).json.api_model+')');}
}})();
