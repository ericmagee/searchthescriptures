// W2: Anticheat Record of live s108 (before pkgACM) and live s112 on every stored run with its stored DeepSeek reply. Builder's reading only (pkgACM is W2's).
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const code=w=>{const by={};w.nodes.forEach(n=>by[n.name]=n);const stub=by['Anticheat Record'].parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)return stub;const lib=by['Shared Library'].parameters.jsCode;return new Function('$',stub.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));};
const A=code(Ld('/mnt/project-files/wall2024/fetchback_live_s108.json')),B=code(Ld('/mnt/project-files/wall2024/fetchback_live_s112.json'));
const files=new Set(fs.readdirSync(D));const runs=[...files].filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const raw=(run,n)=>{const k=run+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(k))return null;const d=JSON.parse(fs.readFileSync(D+k,'utf8'));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(c,run){const inp=raw(run,'Anticheat Call deepseek')||[];const mk=name=>{const it=raw(run,name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 try{return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:run}))[0].json.acx;}catch(e){return {ERR:String(e.message||e)};}}
(async()=>{let n=0,err=0;console.log('code sizes: s108',A.length,'s112',B.length);
 for(const r of runs){if(raw(r,'Anticheat Call deepseek')===null)continue;const a=await go(A,r),b=await go(B,r);if(a.ERR||b.ERR){err++;if(r==='33389'||r==='33617')console.log(r,'ERR',a.ERR,b.ERR);continue;}n++;
  const ra={},rb={};(a.rows||[]).forEach(x=>ra[x.id]=x);(b.rows||[]).forEach(x=>rb[x.id]=x);
  const d=Object.keys({...ra,...rb}).filter(id=>JSON.stringify(ra[id])!==JSON.stringify(rb[id])).map(id=>id+' '+(ra[id]?ra[id].answer:((a.no_answer||[]).includes(id)?'NO ANSWER':'none'))+' -> '+(rb[id]?rb[id].answer+(rb[id].shown?' SHOWN':''):'none'));
  if(d.length||r==='33389'||r==='33617')console.log(r,'| no_answer s108',JSON.stringify(a.no_answer||[]),'s112',JSON.stringify(b.no_answer||[]),'|',d.join('; ')||'no change');}
 console.log('runs replayed',n,'errors',err);})();
