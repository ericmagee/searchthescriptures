// pkgPAY test. Run from wall2024/: node pkgPAY/test_PAY.cjs
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
console.log(ok+' OK, '+bad+' FAIL');
