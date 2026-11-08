// pkgG4R test (W2, 11-08). Run from wall2024/: node pkgG4R/test_G4R.cjs
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const B0=f=>fs.readFileSync('pkgLIB/strip_CRG/patched/'+f,'utf8'),P1=f=>fs.readFileSync('pkgLIB/strip_G4R18/patched/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const all=fs.readdirSync('pkgLIB/strip_CRG/patched').filter(f=>f.endsWith('.js')).sort();const plan=JSON.parse(fs.readFileSync('pkgG4R/plan_G4R_v18.json','utf8')).nodes;
for(const f of all){const a=B0(f),b=P1(f);if(plan[f])T(a!==b&&b.split('function kg4RowHead2024(').length===2&&b.includes('kg4RowHead2024(q,pressText)'),f+' carries kg4RowHead2024 and the witness line');else T(a===b,f+' unchanged');}
T(['Gate_Build.js','Gate_Record.js','Alt_Gate_Build.js','Alt_Gate_Record.js','Alternate_Merge.js','Alternate_Merge_Seat.js'].every(f=>P1(f).includes("why:x.why+(x.rule==='K-G4'?g4GateNote2024(x,ctx):'')")),'the 6 gate nodes carry the gate note');
// units, from the patched Gate Build's own library
{const src=P1('Gate_Build.js');const f=new Function('$','$input',src.replace(/\n?return[^\n]*$/,'')+'\n;return {kg4Witnesses,kg4RowHead2024};');}
// replay
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'||k==='t0'?undefined:v);
let n=0;const ch=[];const notes=[];const diffs=[];
const walk=(o,fn,p='')=>{if(o&&typeof o==='object'){fn(o,p);for(const k in o)walk(o[k],fn,p+'.'+k);}};
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of Object.keys(plan)){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}
 if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both ('+e0+' | '+e1+')');continue;}n++;if(st(a)===st(b))continue;
 const its=[];walk(b,(o)=>{if(typeof o.why==='string'&&o.why.includes('THE ENGINE READS THIS LINE')&&o.gid)its.push(o);});
 const seen=new Set();for(const x of its){const k=x.gid+'|'+x.key;if(seen.has(k))continue;seen.add(k);if(f==='Gate_Build.js'||f==='Alt_Gate_Build.js')notes.push(RUN+' '+nm+' '+x.gid+' '+x.key+' :: '+x.why.slice(x.why.indexOf('a later')).slice(0,170));}
 // K-G4 cure status/why differences
 const g=o=>{const r=[];walk(o,(z)=>{if(z&&z.rule==='K-G4'&&typeof z.status==='string')r.push((z.seat||'')+'|'+z.link+'|'+z.status+'|'+String(z.why||'').slice(0,200));});return r;};
 const ga=g(a),gb=g(b);const dd=gb.filter(x=>!ga.includes(x));for(const x of dd)diffs.push(RUN+' '+nm+' NEW: '+x);for(const x of ga.filter(x=>!gb.includes(x)))diffs.push(RUN+' '+nm+' OLD: '+x);
 ch.push(RUN+' '+nm+': changed'+(its.length?' ('+seen.size+' gate notes)':''));}}
log('replay: '+n+' node runs over '+runs.length+' runs; changed outputs: '+ch.length);for(const x of ch)log('   '+x);
log('gate notes in Gate Build / Alt Gate Build: '+notes.length);for(const x of notes)log('   '+x);
log('K-G4 cure differences: '+diffs.length);for(const x of [...new Set(diffs)])log('   '+x);
T(notes.some(x=>/^33617 Gate Build G1 .*D2 VS C1/.test(x)&&/Genesis 4:25/.test(x)),'bar 33617 terra G1: the gate note names Genesis 4:25 as the answered witness');
T(notes.some(x=>/^33617 Gate Build G2 .*D4 VS C4/.test(x)),'bar 33617 terra G2: the gate note is shown');
T(n>0,'replay ran');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgG4R/test_G4R_v18.txt',out.join('\n')+'\n');
