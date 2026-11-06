// pkgKVP test. Run from wall2024/: node pkgKVP/test_KVP.cjs [base] [out]. drvVoid (the K-V raise) base vs pkgKVP on every judge text with its
// request body: runs 33083 and 33060 (inputs/<run>_Panel_Payloads.json texts, <run>_Panel_Build.json bodies) and the corpus fixtures.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const BP=process.argv[2]||'pkgKCMF',OP=process.argv[3]||'pkgKVP';const plan=JSON.parse(rd(OP+'/plan_KVP.json'));
T('22 nodes: shas match the plan, each with the one kvSegments edit',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(BP+'/patched/'+n.file))===n.base_sha&&sha(rd(OP+'/patched/'+n.file))===n.final_sha));
const lib=p=>{const src=rd(p+'/patched/Panel_Payloads.js');globalThis.__K=null;try{new Function('$','$input','globalThis.__K={drvVoid,drvPromptText,kvSegments};\n'+src)(()=>({first:()=>({json:{}}),all:()=>[],isExecuted:false,params:{}}),{first:()=>({json:{}}),all:()=>[]});}catch(e){}return globalThis.__K;};
const O=lib(BP),N=lib(OP);const cases=[];const I='/mnt/project-files/wall2024/inputs/';
for(const run of ['33083','33060']){const PB=JSON.parse(rd(I+run+'_Panel_Build.json'))[0].main[0][0].json;const PP=JSON.parse(rd(I+run+'_Panel_Payloads.json'))[0].main[0][0].json;
 for(const x of PP.bodies){const p=JSON.parse(x).payload;const J=PB.judges.find(q=>q.seat===p.judge_seat);if(!J)continue;let t=p.verdict_raw;const i=t.indexOf('\n[AUDIT');if(i>0)t=t.slice(0,i);cases.push([run+' '+p.judge_seat,t,J.body]);}}
for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f))){const F=JSON.parse(rd('corpus/'+f));for(const X of [F,F.alt].filter(Boolean)){const pool=(X.PB&&X.PB.judges)||[];
 for(const B of (X.bodies||[])){const J=pool.find(q=>q.seat===B.seat);if(!J||!B.verdict_raw)continue;let t=String(B.verdict_raw);const i=t.indexOf('\n[AUDIT');if(i>0)t=t.slice(0,i);cases.push([f.slice(4,9)+' '+B.seat+(X===F?'':' (alt)'),t,J.body]);}}}
const ids=r=>r.items.map(i=>i.link).join(', ');const diffs=[];let n=0;
for(const [k,t,body] of cases){n++;const a=O.drvVoid(t,O.drvPromptText(body),0,0,'','',null),b=N.drvVoid(t,N.drvPromptText(body),0,0,'','',null);if(ids(a)!==ids(b))diffs.push(k+': ['+ids(a)+'] -> ['+ids(b)+']');}
console.log('   '+n+' judge texts; K-V item changes: '+diffs.length);diffs.forEach(d=>console.log('     '+d));
T('33083 sol: the false "CHALLENGER premise 3" K-V item is gone',diffs.some(d=>/^33083 sol: \[CHALLENGER premise 3\] -> \[\]$/.test(d)));
T('no other judge text changes its K-V items (a new item would be listed)',diffs.length===1);
const seg='Premise 3 is UNEXHIBITED because x; premises 1, 2 and 5 exhibit, and premise 6 is VOID.';
const S=N.kvSegments('CHALLENGE STANDING: PROP-DEPENDENT -- L=6 c=1 -- '+seg,'CHALLENGER');console.log('   unit segments: '+JSON.stringify(S));
T('unit: segments are premise 6 ("premise 6 is VOID.") only; premise 3 is not read as VOID',S.length===1&&JSON.stringify(S[0].ns)==='[6]');
const S2=N.kvSegments('CHALLENGE STANDING: X -- Premises 3 and 6 are VOID: "only" is added.','CHALLENGER');
T('unit: a VOID clause naming the segment\'s own premises is kept (premises 3 and 6 are VOID)',S2.length===1&&JSON.stringify(S2[0].ns)==='[3,6]');
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
