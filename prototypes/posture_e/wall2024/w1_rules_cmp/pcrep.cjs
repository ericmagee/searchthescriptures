const fs=require('fs');const W='/mnt/project-files/wall2024/';const src=fs.readFileSync('precheck143.js','utf8');
const preCheckSide=new Function(src+'\nreturn preCheckSide;')();const P=JSON.parse(fs.readFileSync('jprompts.json'));
let tot=0,miss=0;
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const run=f.match(/\d+/)[0];const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 let r=null,where=null;const walk=(o,p)=>{if(r)return;if(o&&typeof o==='object'&&!Array.isArray(o)){if(typeof o.cr1==='string'&&typeof o.gr2==='string'&&typeof o.cr3==='string'&&o.gr2.length>500){r=o;where=p;return;}for(const k in o)walk(o[k],p+'.'+k);}else if(Array.isArray(o))o.forEach((x,i)=>walk(x,p+'['+i+']'));};
 for(const n in rd){rd[n].slice(0,1).forEach(x=>walk(x.data,n));if(r)break;}
 if(!r){console.log(run,'no round fields');continue;}
 const live=[].concat(preCheckSide(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),preCheckSide(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'));
 const stored=(P[run]||'').split('\n').filter(l=>/^(CHALLENGER|DEFENDER) LIST \[[CD]R\d\] item/.test(l));
 const lm=live.filter(l=>/no verbatim quote found/.test(l));tot+=live.length;miss+=lm.length;
 console.log(run,where.slice(0,40),'live items',live.length,'stored',stored.length,'| live no-quote:',lm.map(x=>x.replace(/: no verbatim.*/,'')).join('; ')||'none','| stored no-quote:',stored.filter(l=>/no verbatim/.test(l)).length);
 fs.writeFileSync('pc_'+run+'.txt',live.join('\n'));}
console.log('total',tot,'no-quote',miss);
