// pkgL2B chained replay: Citation Scan (patched) -> L2 Lexicon Plan -> L2 Count Plan -> Quote Report, each patched and fed the patched upstream
// outputs; the sheets the plans would fetch (L2 Words, L2 Lexicon, L2 Counts) are the saved ones, so a tag that needs a word row the run never fetched
// shows as it would against the saved sheet. Lists every [L2] tag whose words or status change.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const B='/mnt/project-files/wall2024/fetchback_live_s44.json';const W=JSON.parse(fs.readFileSync(B));
const code=(n,p)=>p?fs.readFileSync(__dirname+'/patched/'+n.replace(/[ ?\/]/g,'_')+'.js','utf8'):W.nodes.find(z=>z.name===n).parameters.jsCode;
const has=(R,n)=>fs.existsSync('/mnt/project-files/wall2024/inputs/'+R+'_'+n.replace(/ /g,'_')+'.json');const fin=(R,n)=>feeder(B,n).find(x=>has(R,x));
const out=[];const log=s=>{out.push(s);console.log(s);};let ch=0;
for(const R of ['33218','33222','33249','33261','33299','33311','33322','33345','33371']){if(!has(R,'Citation Scan')||!has(R,'Quote Report'))continue;const ov={};
 for(const n of ['Citation Scan','L2 Lexicon Plan','L2 Words Plan','L2 Count Plan']){if(!has(R,n))continue;const f=fin(R,n);if(!f)continue;const p=fs.existsSync(__dirname+'/patched/'+n.replace(/[ ?\/]/g,'_')+'.js');ov[n]=harness(R,{...ov})(code(n,p),f);}
 const q0=harness(R)(code('Quote Report',0),fin(R,'Quote Report')),q1=harness(R,ov)(code('Quote Report',1),fin(R,'Quote Report'));
 const t=o=>((o[0].json.l2||{}).tags||[]).filter(x=>x.status!=='IGNORED');const A=t(q0),Bt=t(q1);const key=x=>x.round+'@'+x.at;const M=new Map(A.map(x=>[key(x),x]));
 log(R+': counted tags '+A.length+' -> '+Bt.length+'; NOT COUNTED '+A.filter(x=>x.status==='NOT COUNTED').length+' -> '+Bt.filter(x=>x.status==='NOT COUNTED').length);
 for(const y of Bt){const x=M.get(key(y));const wa=x?(x.words||[]).map(w=>w.w).join('/'):'(ignored before)',wb=(y.words||[]).map(w=>w.w).join('/');if(!x||x.status!==y.status||wa!==wb){ch++;log('  '+y.round+' '+(x?x.status:'NEW')+' ['+wa+'] -> '+y.status+' ['+wb+'] | '+String(y.seg).slice(0,120));}}
 for(const x of A)if(!Bt.find(y=>key(y)===key(x))){ch++;log('  GONE '+x.round+' '+x.status+' ['+(x.words||[]).map(w=>w.w).join('/')+']');}}
log('changed tags: '+ch);fs.writeFileSync(__dirname+'/chain_L2B.txt',out.join('\n')+'\n');
