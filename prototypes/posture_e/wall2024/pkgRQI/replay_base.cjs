// generic: node replay_nodes.cjs <pkg json> "<node1>,<node2>,..." -- runs each node on all 13 exports with its stored parent output, live s147 vs package
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s149.json'),PK=load(process.argv[2]);const NODES=(process.argv[3]||'').split(',');
const mk=(rd,W,over)=>name=>{if(over&&over[name])return over[name];const r=rd[name];const nd=W.nodes.find(n=>n.name===name)||{};const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,rd,name,input,over)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(rd,W,over),$input);};
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?/g,'T');
const walk=(x,p,out)=>{if(Array.isArray(x))x.forEach((y,i)=>walk(y,p+'['+i+']',out));else if(x&&typeof x==='object'){if(typeof x.status==='string')out.set(p,x);for(const k in x)walk(x[k],p+'.'+k,out);}return out;};
module.exports={LV,PK,mk,run,mask,load};
if(require.main===module&&process.argv[3])(async()=>{let eq=0,tot=0,stEq=0;const only=process.argv[4];
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f)&&(!only||f.includes(only)))){
 const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;for(let ri=0;ri<rd[n].length;ri++){const sc=(rd[n][ri].source||[])[0];const pr=sc&&rd[sc.previousNode]?rd[sc.previousNode][sc.previousNodeRun||0]:null;const inp=pr?(pr.data.main[sc.previousNodeOutput||0]||[]):[];
  let a,b;try{a=await run(LV,rd,n,inp);}catch(e){a='ERR '+e.message;}try{b=await run(PK,rd,n,inp);}catch(e){b='ERR '+e.message;}
  tot++;const st=rd[n][ri].data.main;const stMatch=mask((a||[]).map?a.map(x=>x.json):a)===mask((st[0]||[]).map(x=>x.json));if(stMatch)stEq++;
  if(mask(a)===mask(b)){eq++;continue;}
  console.log(f.slice(2,7),n,'run',ri,'DIFF',typeof a==='string'?a:'',typeof b==='string'?b:'');
  if(typeof a!=='string'&&typeof b!=='string'){const A=walk(a,'',new Map()),B=walk(b,'',new Map());
   for(const [p,y] of B){const x=A.get(p);if(!x){console.log('   NEW ROW',p,y.rule||'',y.status);continue;}if(x.status!==y.status)console.log('   ',p.slice(-60),x.seat||x.side||'',x.rule||'',x.key||x.id||'',':',x.status,'->',y.status,'|',String(y.why||y.reason||'').slice(0,140));}
   for(const [p,x] of A)if(!B.has(p))console.log('   DROPPED ROW',p,x.rule||'',x.status);}
 }}}
console.log('node runs',tot,'equal',eq,'| live harness equals stored output on',stEq,'of',tot);})();
