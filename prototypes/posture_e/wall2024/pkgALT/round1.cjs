// W2: own test of round 1 (Alternate Build) on stored runs with the pkgALT pool grok, argon, haiku.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s119_ALT.json'));
const LT=P.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/')));const MAP=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')));
const src=nm=>MAP[nm].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const code='$execution.customData={set(){}};'+src('Alternate Build');
const POOL={grok:{api_model:'x-ai/grok-4.7',family:'xai'},argon:{api_model:'google/gemini-4-argon',family:'google'},haiku:{api_model:'anthropic/claude-haiku-5.5',family:'anthropic'}};
(async()=>{for(const id of (process.argv[2]||'34852,34726').split(',')){const f='/mnt/project-files/wall2024/ex'+id+'_full.json';if(!fs.existsSync(f)){console.log(id,'no file');continue;}
 const rd=JSON.parse(fs.readFileSync(f,'utf8')).data.resultData.runData;if(!rd['Alternate Build']){console.log(id,'Alternate Build not run');continue;}
 const last=k=>rd[k][rd[k].length-1].data.main;const RS=JSON.parse(JSON.stringify(last('Resolve Seats')));
 RS[0][0].json.alternates=Object.keys(POOL).map(k=>({seat:k,fam:'openrouter',api_model:POOL[k].api_model,max_tokens:64000,family:POOL[k].family}));
 const AF=JSON.parse(JSON.stringify(last('Accept Final')));const acc=AF[0][0].json.acc;for(const k of ['grok','argon'])if(!acc.seats.find(s=>s.seat===k))acc.seats.push({seat:k,status:'ACCEPT',placed:true,lines:{}});
 const inp=last('Alternate Needed?')[0];
 for(const [tag,over] of [['stored pool',{}],['pkgALT pool',{'Resolve Seats':RS,'Accept Final':AF}]]){const o=await run(code,'Alternate Build',rd,over,inp);
  if(o.err){console.log(id,tag,'ERR',o.err.slice(0,200));continue;}
  console.log(id,tag,'->',JSON.stringify(o.map(x=>x.alt&&(x.alt.skip?(x.alt.removed_seat||'-')+': skip '+String(x.alt.skip).slice(0,80):x.alt.removed_seat+' -> '+x.alt.pool_seat))),'| skips',JSON.stringify((o[0].skips||[]).map(s=>(s.removed_seat||'-')+': '+String(s.skip).slice(0,90))));}}})();
