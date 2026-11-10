const fs=require('fs');const d='/mnt/project-files/wall2024/inputs/';
const rd=f=>{try{const j=JSON.parse(fs.readFileSync(d+f,'utf8'));return Array.isArray(j)?j[0]:j;}catch(e){return null;}};
const P={'claude-opus-5-5':[4,0.05],'claude-sonnet-5-5':[2,0.05],'claude-haiku-5-5':[0.1,0.1]};
const S={};const runs=new Set();const dur={};const models={};
for(const f of fs.readdirSync(d).filter(f=>/_(C[1-4]G?|D[1-4]B?)_Call_anthropic\.json$/.test(f))){
 const [r,n]=f.split('_');const s=fs.readFileSync(d+f,'utf8');const g=k=>{const m=s.match(new RegExp('\\\\?"'+k+'\\\\?"\\s*:\\s*(\\d+)'));return m?+m[1]:null;};
 const mm=s.match(/\\?"model\\?"\s*:\s*\\?"(claude-[a-z0-9-]+)/);const model=mm&&mm[1].replace(/-\d{8}$/,'');const cw=g('cache_creation_input_tokens'),cr=g('cache_read_input_tokens');if(cw===null)continue;runs.add(r);
 (models[n]=models[n]||{})[model]=(models[n][model]||0)+1;
 const x=rd(f);if(x&&x.executionTime!=null&&/^D[234]$/.test(n))(dur[n]=dur[n]||[]).push(Math.round(x.executionTime/1000));
 S[r+n]={cw,cr,model};}
let save={C2:0,C34:0,C34loss:0,D:0};
for(const r of runs){const base=m=>P[m]?P[m][0]:NaN;const rdm=m=>P[m]?P[m][1]:NaN;
 const c2=S[r+'C2'];if(c2)save.C2+=c2.cw*base(c2.model);
 for(const k of ['C3','C4']){const c=S[r+k];if(!c)continue;save.C34+=c.cw*base(c.model);const G=S[r+k+'G'];if(G){const part=G.cr-c.cr;save.C34loss+=part*base(G.model)*(1-rdm(G.model));}}
 for(const k of ['D2','D3','D4']){const c=S[r+k];if(c)save.D+=c.cw*base(c.model)*0.75;}}
for(const k in save)save[k]=+(save[k]/1e6).toFixed(2);
console.log('runs',runs.size,'USD over runs',save,'net per run',((save.C2+save.C34-save.C34loss+save.D)/runs.size).toFixed(3));
console.log(JSON.stringify(models));
for(const k in dur){const a=dur[k].sort((x,y)=>x-y);console.log(k,'call seconds n',a.length,'min',a[0],'med',a[a.length>>1],'max',a[a.length-1],'over 290s',a.filter(x=>x>290).length);}
