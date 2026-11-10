// W2: Send Back Record and Alt Send Back Record of live s112 on every stored run with stored inputs; how each KEEP answer is read, against the stored reading.
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W=Ld(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s112.json');const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const code=n=>{const s=W.nodes.find(x=>x.name===n).parameters.jsCode;let i=s.indexOf('\nreturn await new Function(');if(i<0)return s;return new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));};
const files=new Set(fs.readdirSync(D));const runs=[...files].filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
const raw=(run,n)=>{const k=run+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(k))return null;const d=JSON.parse(fs.readFileSync(D+k,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const KEEP=r=>/\|\|\s*KEEP\b/.test(r.response_line||'');
(async()=>{const tot={keep:0,same:0,diff:[],runs:0,err:[]};
 for(const N of ['Send Back Record','Alt Send Back Record']){const c=code(N);const prev=N==='Send Back Record'?'Send Back Call openrouter':'Alt Send Back Call openrouter';
  for(const r of runs){const st=raw(r,N);if(!st||!st[0]||!st[0].json.sb_rows)continue;const inp=raw(r,prev)||[];
   const mk=name=>{const it=raw(r,name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
   const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
   let o;try{o=(await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:r}))[0].json;}catch(e){tot.err.push(r+' '+N+': '+String(e.message).slice(0,100));continue;}
   tot.runs++;const S=st[0].json.sb_rows.filter(KEEP),Nw=(o.sb_rows||[]);
   for(const s of S){tot.keep++;const n=Nw.find(x=>x.seat===s.seat&&x.item===s.item);const a=s.cure_status+' | '+String(s.cure_reason||""),b=n?n.cure_status+' | '+String(n.cure_reason||'').slice(0,70):'NO ROW';if(a===b)tot.same++;else tot.diff.push(r+' '+N+' '+s.seat+' '+s.rule+' '+s.item+'\n      stored: '+a+'\n      s112:   '+b);}}}
 console.log('runs replayed',tot.runs,'| KEEP answers',tot.keep,'| read the same',tot.same,'| read differently',tot.diff.length);tot.diff.forEach(x=>console.log('  '+x));tot.err.forEach(x=>console.log('  ERR '+x));})();
