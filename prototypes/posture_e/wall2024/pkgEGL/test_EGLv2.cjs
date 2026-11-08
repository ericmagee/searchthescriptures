// pkgEGL v2 test (W2 test, base s52 vs patched_v2). Run from wall2024/: node --max-old-space-size=8000 pkgEGL/test_EGLv2.cjs
// W3 3005 grade bar: (1) the rebuilt 33497 prompt has no G ids; (2) on the saved 33497 reply the Record fans out the same-form groups and leaves the mixed
// groups NO VERDICT ("group-labelled reply, answers differ"); (3) replay of every saved run shows no other change.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const B0=f=>fs.readFileSync(__dirname+'/base_s52/'+f,'utf8'),P1=f=>fs.readFileSync(__dirname+'/patched_v2/'+f,'utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK '+m);}else{bad++;log('FAIL '+m);}};
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const prompt=o=>{const j=o[0].json;return j.body&&j.body.messages?j.body.messages.map(m=>m.content).join('\n'):'';};
{const H=harness('33497');const i=fin('33497','Enforcer Build');const a=H(B0('Enforcer_Build.js'),i),b=H(P1('Enforcer_Build.js'),i);const pa=prompt(a),pb=prompt(b);
 T((pa.match(/ITEM G\d+/g)||[]).length===24,'33497 base prompt has 24 "ITEM G<k>" headers');
 {const left=[...pb.matchAll(/(.{0,20})\bG(\d{1,2})\b/g)].filter(m=>!/G\d{3,4},\s*(?:G\d+,\s*)*$/.test(m[1]));T(!/ITEM G\d/.test(pb)&&left.length===0,'33497 patched prompt has no G<k> item id (the only short G numbers left are Strong\'s numbers inside a Strong\'s list, e.g. "G1537, G4151, G40": '+(pb.match(/\bG\d{1,2}\b/g)||[]).length+')');}
 T((pb.match(/^ITEM \d+ OF 24 \(/gm)||[]).length===24&&(pb.match(/^Answer each of: A\d+\.1(, A\d+\.\d+)*$/gm)||[]).length===24,'33497 patched: 24 "ITEM <k> OF 24" headers, each with its "Answer each of" list');
 const ida=JSON.stringify(a[0].json.ids),idb=JSON.stringify(b[0].json.ids);T(ida===idb,'answer ids and rows unchanged ('+a[0].json.ids.length+')');
 const strip=p=>p.replace(/^ITEM (?:G\d+|\d+ OF \d+) /gm,'ITEM ').replace(/^Answer each of:[^\n]*\n/gm,'').replace(/'?The answer id is the A<item>[^\n]*\n?/,'');T(strip(pa)===strip(pb),'prompt otherwise identical');}
{const H=harness('33497');const i=fin('33497','Enforcer Record');const a=H(B0('Enforcer_Record.js'),i)[0].json,b=H(P1('Enforcer_Record.js'),i)[0].json;
 log('   33497 tally base '+JSON.stringify(a.enf421.tally)+' -> patched '+JSON.stringify(b.enf421.tally));
 const g=r=>(r.cure_reason.match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER|NO VERDICT)/)||[])[1];const grp=x=>(String(x).match(/^A(\d+)\./)||[])[1];
 const ids=(b.enf421_rows||[]);const B=JSON.parse(fs.readFileSync(D+'33497_Enforcer_Build.json'));
 T(a.enf421.tally['NO VERDICT']===52,'33497 base: 52 NO VERDICT');
 const fan=b.enf421_rows.filter(r=>/answered item \d+ as a whole/.test(r.cure_reason)),mix=b.enf421_rows.filter(r=>/group-labelled reply, answers differ/.test(r.cure_reason));
 log('   fanned-out rows '+fan.length+', mixed-group rows '+mix.length+', other NO VERDICT '+b.enf421_rows.filter(r=>g(r)==='NO VERDICT'&&!/answers differ/.test(r.cure_reason)).length);
 const s=JSON.stringify(B);const idsAll=[...s.matchAll(/"id":\s*"(A(\d+)\.\d+)"/g)].map(m=>m[2]);const byG={};for(const n of idsAll)byG[n]=(byG[n]||0)+1;
 const fg=new Set(fan.map(r=>(r.cure_reason.match(/answered item (\d+) as a whole/)||[])[1])),mg=new Set();for(const r of mix){const m=r.cure_reason;mg.add(m);} 
 T(fg.size===12,'12 same-form groups fanned out ('+[...fg].sort((x,y)=>x-y).join(',')+')');
 T(fan.length+mix.length===a.enf421.tally['NO VERDICT'],'every former NO VERDICT row is either fanned out or marked "answers differ" ('+(fan.length+mix.length)+')');
 T(b.enf421.tally['NO VERDICT']===mix.length,'NO VERDICT left = mixed-group rows only ('+b.enf421.tally['NO VERDICT']+')');
 for(const r of mix.slice(0,3))log('   e.g. '+r.seat+' '+r.item+': '+r.cure_reason.slice(0,140));for(const r of fan.slice(0,2))log('   e.g. '+r.seat+' '+r.item+': '+r.cure_reason.slice(0,160));}
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();const st=x=>JSON.stringify(x,(k,v)=>k==='at'||k==='created_at'?undefined:v);let n=0;const ch=[];
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const nm of ['Enforcer Build','Enforcer Record']){if(!fs.existsSync(D+RUN+'_'+nm.replace(/ /g,'_')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;const f=nm.replace(/ /g,'_')+'.js';
 let a,b,e0=null,e1=null;try{a=H(B0(f),i);}catch(x){e0=String(x.message).slice(0,100);}try{b=H(P1(f),i);}catch(x){e1=String(x.message).slice(0,100);}if(e0||e1){T(e0===e1,RUN+' '+nm+' same error both');continue;}n++;
 if(nm==='Enforcer Build'){const pa=prompt(a),pb=prompt(b);const sp=p=>p.replace(/^ITEM (?:G\d+|\d+ OF \d+) /gm,'ITEM ').replace(/^Answer each of:[^\n]*\n/gm,'').replace(/'?The answer id is the A<item>[^\n]*\n?/,'');
  const ea=st({...a[0].json,body:null}),eb=st({...b[0].json,body:null});if(sp(pa)!==sp(pb)||ea!==eb)ch.push(RUN+' Enforcer Build: change beyond the header lines');}
 else if(st(a)!==st(b))ch.push(RUN+' Enforcer Record: '+JSON.stringify(a[0].json.enf421&&a[0].json.enf421.tally)+' -> '+JSON.stringify(b[0].json.enf421&&b[0].json.enf421.tally));}}
log('replay: '+n+' node runs over '+runs.length+' runs; changes beyond the header lines: '+ch.length);for(const c of ch)log('   '+c);
T(ch.length===1&&/^33497 Enforcer Record/.test(ch[0]),'the only behaviour change is 33497 Enforcer Record');log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_EGLv2.txt',out.join('\n')+'\n');
