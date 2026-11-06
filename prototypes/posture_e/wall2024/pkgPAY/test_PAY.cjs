// pkgPAY test. Run from wall2024/: node pkgPAY/test_PAY.cjs
// pkgPAY/readers: Judge_Enforcer_Build and Alt_Judge_Enforcer_Build are the live code (pkgCM/patched, 868b0814); Enforcer_Build and Format_Markdown are W2's workflow snapshot of 2026-11-05 20:41 CST (the n8n read failed today): the live-test thread checks those two against live before the write.
// For each saved run: (1) the new Normalize code forwards every cure field unchanged except body, and enfPrompt of the slim body equals
// enfPrompt of the full body; (2) Panel Cure Check run on the slim Normalize outputs gives the same output as on the stored ones (the
// enforcer_log time stamp 'at' aside), prompt_sent included; (3) the size saved.
const fs=require('fs'),zlib=require('zlib');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
const plan=JSON.parse(rd('pkgPAY/plan_PAY.json'));
T('22 nodes; base shas = '+plan.base+', final shas = pkgPAY/patched; only the 5 Normalize nodes change',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgPAY/patched/'+n.file))===n.final_sha)&&plan.nodes.filter(n=>n.base_sha!==n.final_sha).length===5);
const load=run=>JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));
const mock=N=>name=>{const runs=N.nodes[name];if(!runs)return {isExecuted:false,first:()=>{throw new Error('not saved '+name)},all:()=>{throw new Error('not saved '+name)}};const items=runs[runs.length-1]||[];return {isExecuted:true,first:()=>({json:items[0]}),last:()=>({json:items[items.length-1]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};
const run=(file,N,inp)=>new Function('$','$input','$json',rd(file))(mock(N),{first:()=>({json:(inp||[])[0]||{}}),all:()=>(inp||[]).map(j=>({json:j})),item:{json:{}}},{});
const AM=rd('pkgKV/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {enfPrompt};')(()=>{throw 0},null);
const strip=o=>JSON.stringify(o,(k,v)=>k==='at'?undefined:v);
const runs=fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort();
let fieldsOk=true,promptOk=true,checkOk=true,nSeats=0,before=0,after=0;const msg=[];
for(const r of runs){const N=load(r);const N2=JSON.parse(JSON.stringify(N));
 for(const [nf,bn] of [['Panel_Cure_Normalize_1','Panel Cure Build 1'],['Panel_Cure_Normalize_2','Panel Cure Build 2'],['Panel_Cure_Normalize_3','Panel Cure Build 3'],['Alternate_Cure_Normalize','Alternate Cure Build'],['Cure_Normalize','Cure Build']]){
  const nn=nf.replace(/_/g,' ');if(!N.nodes[nn]||!N.nodes[bn])continue;const st=N.nodes[nn][N.nodes[nn].length-1];
  const out=run('pkgPAY/patched/'+nf+'.js',N,st.map(()=>({})));
  out.forEach((o,i)=>{nSeats++;const a=st[i].cure,b=o.json.cure;if(!a){if(b)fieldsOk=false;return;}
   const ka=Object.keys(a).filter(k=>k!=='body'),kb=Object.keys(b).filter(k=>k!=='body');if(JSON.stringify(ka.map(k=>[k,a[k]]))!==JSON.stringify(kb.map(k=>[k,b[k]]))){fieldsOk=false;msg.push(r+' '+nn+' fields differ');}
   if(L.enfPrompt(a.body)!==L.enfPrompt(b.body)){promptOk=false;msg.push(r+' '+nn+' prompt differs');}
   before+=JSON.stringify(st[i]).length;const s2=Object.assign({},st[i],{cure:b});after+=JSON.stringify(s2).length;N2.nodes[nn][N2.nodes[nn].length-1][i]=s2;});}
 if(N.nodes['Panel Cure Check']){let x,y;try{x=strip(run('pkgKV/patched/Panel_Cure_Check.js',N));y=strip(run('pkgPAY/patched/Panel_Cure_Check.js',N2));}catch(e){checkOk=false;msg.push(r+' '+e.message);continue;}
  if(x!==y){checkOk=false;msg.push(r+' Panel Cure Check output differs');}else msg.push(r+' Panel Cure Check output equal ('+(x.length>>10)+' KB)');}}
msg.forEach(m=>console.log('   '+m));
T('every Normalize output ('+nSeats+' seat items, '+runs.length+' runs): every cure field but body is forwarded unchanged',fieldsOk&&nSeats>0);
T('enfPrompt (prompt_sent) of the slim body equals that of the full body, every seat',promptOk);
T('Panel Cure Check on the slim Normalize outputs equals its output on the stored ones, every run (prompt_sent included)',checkOk);
T('size: Normalize outputs '+(before>>10)+' KB -> '+(after>>10)+' KB over the corpus',after<before);
// W3 (16:16Z): every other reader of the Normalize outputs. The whole-node replay cannot run them (their other inputs are not saved), so this
// reads their code: each reader's only use of the body is the enfRows argument, which (above) gives the same prompt_sent.
{const R=f=>rd('pkgPAY/patched/'+f+'.js');
 T('Panel Cure Build 1-3 never read $input or any Normalize node (they are wired after a Normalize node only for order)',['Panel_Cure_Build_1','Panel_Cure_Build_2','Panel_Cure_Build_3'].every(f=>!/\$input/.test(R(f))&&!/Normalize/.test((R(f).match(/\$\('[^']+'\)/g)||[]).join(' '))));
 const uses=(t,v)=>[...t.matchAll(new RegExp('\\b'+v+'\\.cure\\.body\\b','g'))].map(m=>t.slice(m.index-(v+'&&'+v+'.cure?').length,m.index+(v+'.cure.body:null)').length));
 T('Cure Check (from Cure Normalize) reads cure.body once, as the enfRows argument',(u=>u.length===1&&u[0]==='r&&r.cure?r.cure.body:null)')(uses(R('Cure_Check'),'r'))&&/enfRows\([^;]*r&&r\.cure\?r\.cure\.body:null\)/.test(R('Cure_Check')));
 T('Alternate Merge Seat (from Alternate Cure Normalize) reads cure.body once, as the enfRows argument',(u=>u.length===1&&u[0]==='c&&c.cure?c.cure.body:null)')(uses(R('Alternate_Merge_Seat'),'c'))&&/enfRows\([^;]*c&&c\.cure\?c\.cure\.body:null\)/.test(R('Alternate_Merge_Seat')));
 T('Panel Cure Check reads cure.body once, as the enfRows argument',(u=>u.length===1)(uses(R('Panel_Cure_Check'),'r'))&&/enfRows\([^;]*r&&r\.cure\?r\.cure\.body:null\)/.test(R('Panel_Cure_Check')));
 const X=f=>rd('pkgPAY/readers/'+f+'.txt');
 T('Enforcer Build, Judge Enforcer Build (live, pkgCM) and Alt Judge Enforcer Build (live, pkgCM) read only cure.rounds from the Normalize nodes; Format Markdown reads only reply, who and seat there (the body it shows comes from the Build nodes)',
  ['Enforcer_Build','Judge_Enforcer_Build','Alt_Judge_Enforcer_Build'].filter(f=>/Normalize/.test(X(f))).every(f=>{const t=X(f);return /c&&c\.rounds\)\{R=c\.rounds/.test(t)&&!/\bc\.body\b/.test(t);})&&/if \(c && c\.seat\) REPLY\[\(c\.who \|\| ''\) \+ '\|' \+ c\.seat\] = i\.json\.reply \|\| null;/.test(X('Format_Markdown'))&&/'Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'\]\.forEach[\s\S]{0,200}c\.body/.test(X('Format_Markdown')));}
console.log(ok+' OK, '+bad+' FAIL');
