const fs=require('fs');const {runNode,D}=require('./run329.cjs');const L2C=require('./l2c_load.cjs')('../a328/target_328.json');
const TRIAL=fs.readFileSync(__dirname+'/trial329.js','utf8');const trialFn=new Function('L2C',TRIAL+'\nreturn __l2trial329;')(L2C);
const rows=fs.readFileSync('m116.txt','utf8').trim().split(';').map(s=>{const [n,run,lab,num,ref,lp]=s.split('|');return {n:+n,run,lab,num,ref,lp:+lp};});
const col={CR1:'claude_r1',DR1:'engine_r1',CR2:'claude_r2',DR2:'engine_r2',CR3:'engine_r3',DR3:'challenger_r3',CR4:'defender_r4',DR4:'challenger_r4'};
const cache={};const out=[];
for(const r of rows){const d=D.find(x=>x.run_token.split('-')[1]===r.run);if(!d){out.push({...r,today:'NO DEBATE'});continue;}
 if(!cache[r.run])cache[r.run]=runNode(d);const {J,tr}=cache[r.run];const T=String(d[col[r.lab]]||'');
 const c=J.tags.filter(t=>t.round===r.lab&&(t.words||[]).some(w=>w.kind==='strongs'&&w.w===r.num));
 let best=null,bd=1e9;for(const t of c){const pa=T.lastIndexOf('\n\n',t.at);const off=t.at-(pa<0?0:pa+2);const dd=Math.abs(off-r.lp);if(dd<bd){bd=dd;best=t;}}
 if(!best){out.push({...r,today:'NO TAG'});continue;}
 const w=best.words.find(w=>w.kind==='strongs'&&w.w===r.num);const it=tr.items.find(x=>x.round===best.round&&x.at===best.at);
 out.push({...r,off:bd,today:best.status,num_ok:w.ok,own:L2C.refsIn(best.seg).length,trial:it?it.trial:(best.status==='COUNTED'?'COUNTED':'(today '+best.status+')'),failnum:it?it.num:null,binding:it?it.binding:null,why:it?it.why:best.why});}
fs.writeFileSync('map116.json',JSON.stringify(out,null,0));
const tally={};out.forEach(o=>{const k=o.today+' -> '+o.trial.replace(/^\(today.*\)$/,'unchanged');tally[k]=(tally[k]||0)+1;});console.log(tally);
console.log('offset>3:',out.filter(o=>o.off>3).map(o=>o.n+':'+o.off).join(' '));
