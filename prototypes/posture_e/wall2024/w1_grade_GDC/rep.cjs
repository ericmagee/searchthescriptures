const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const LV=load('/mnt/project-files/wall2024/fetchback_live_s147.json'),PK=load(process.argv[2]);
const NODES=['Send Back Record','Gate Record','Alt Send Back Record','Alt Gate Record','R2 Alt Send Back Record','R2 Alt Gate Record'];
const parent=(W,n)=>{for(const [k,v] of Object.entries(W.connections))for(const o of (v.main||[]))for(const c of (o||[]))if(c.node===n)return k;};
const mk=(rd,W)=>name=>{const r=rd[name];const nd=W.nodes.find(n=>n.name===name)||{};const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(W,rd,name,input)=>{const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk(rd,W),$input);};
const mask=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?/g,'T');
const rows=o=>{const out=[];const walk=(x,p)=>{if(Array.isArray(x))x.forEach((y,i)=>walk(y,p+'['+i+']'));else if(x&&typeof x==='object'){if('status' in x&&(x.sid||x.gid||x.id||x.key))out.push([p,(x.seat||'')+' '+(x.sid||x.gid||x.id||x.key),x.status]);for(const k in x)walk(x[k],p+'.'+k);}};walk(o,'');return out;};
(async()=>{let eq=0,tot=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f))){
 const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;const sc=rd[n][rd[n].length-1].source[0];const pr=rd[sc.previousNode][sc.previousNodeRun||0];const inp=pr?(pr.data.main[sc.previousNodeOutput||0]||[]):[];
  let a,b;try{a=await run(LV,rd,n,inp);}catch(e){a='ERR '+e.message;}try{b=await run(PK,rd,n,inp);}catch(e){b='ERR '+e.message;}
  tot++;const same=mask(a)===mask(b);if(same)eq++;
  if(!same||typeof a==='string'||typeof b==='string'){console.log(f,n,'DIFF',typeof a==='string'?a:'',typeof b==='string'?b:'');
   if(Array.isArray(a)&&Array.isArray(b)){const A=a[0].json,B=b[0].json;for(const k of ['sb_rows','gate_rows'])(A[k]||[]).forEach((r,i)=>{const y=(B[k]||[])[i];if(JSON.stringify(r)!==JSON.stringify(y))console.log('   ',k,r.seat,r.item,':',r.cure_status,'->',y&&y.cure_status,'|',String(y&&y.cure_reason).slice(0,120));});for(const x of Object.keys(A))if(!/rows/.test(x)&&mask(A[x])!==mask(B[x]))console.log('   field differs:',x);}const ra=rows(a),rb=rows(b);const ma=new Map(ra.map(r=>[r[0]+r[1],r[2]]));for(const r of rb){const o=ma.get(r[0]+r[1]);if(o!==r[2])console.log('   ',r[1],o,'->',r[2]);}}
 }}
console.log('equal',eq,'of',tot);})();
