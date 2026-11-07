// pkgFCB node test. Run from wall2024/: node pkgFCB/test_FCB.cjs   (reads the repo only)
//  A. replay_FCB.cjs on the 30 stored FORCED lines (150 checks)   B. each patched node = its base + the planned edits, and compiles
//  C. the K-FC cure block, cut from Panel Cure Check, on mocked replies   D. the mark is not counted in audit_flags (no "REVIEW THIS ROW")
// E. scope_FCB.cjs: kfcLines and what it reads are in scope in all 22 library nodes
const fs=require('fs');const cp=require('child_process');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n);}};
let rp='';try{rp=cp.execFileSync('node',['pkgFCB/replay_FCB.cjs']).toString();}catch(e){rp=String(e.stdout||'');}t('A1 replay: '+rp.trim().split('\n').pop(),/30 lines; 150 OK, 0 FAIL/.test(rp));
const plan=JSON.parse(fs.readFileSync('pkgFCB/plan_FCB.json','utf8'));const LIB=fs.readFileSync('pkgFCB/kfc_lib.js','utf8');
const src=fs.readFileSync('pkgFCB/build_FCB.cjs','utf8');const E=new Function('LIB',src.slice(src.indexOf('const E={'),src.indexOf('const OUT=')).replace('const E=','return ')+';')(LIB);
for(const n of plan.nodes){const b=fs.readFileSync('pkgFCB/base/'+n.file,'utf8'),p=fs.readFileSync('pkgFCB/patched/'+n.file,'utf8');let u=p;
 for(const k of n.edits.slice().reverse()){u=u.split(E[k][1]).join(E[k][0]);}
 let c=true;try{new Function('$','$input','$json','$execution',p);}catch(e){c=false;}
 t('B '+n.name+' = base + '+n.edits.join(',')+', compiles',u===b&&c&&(!n.edits.includes('lib')||p.includes(LIB)));}
t('B2 24 nodes in the plan',plan.nodes.length===24);
// C: the cure block
const P=fs.readFileSync('pkgFCB/patched/Panel_Cure_Check.js','utf8');const i=P.indexOf("if(x.rule==='K-FC'){");const j=P.indexOf("  if(x.rule==='K-F'){if(wd.has",i);const BLK=P.slice(i,j);
const env=fs.readFileSync('pkgFCB/test_env.js','utf8')+LIB;const V=JSON.parse(fs.readFileSync('pkgFCB/verses_fixture.json','utf8'));
const cure=(x,text,o)=>new Function('$','x','reply','o','R',env+"const U=s=>String(s||'').toUpperCase();const wd=new Set((o.withdrawn||[]).map(w=>U(w.link)));const cureRest=()=>o.rest||[];const cureUnwrap=s=>s;const res=(st,why,l)=>({st,why,l});"+BLK+"return {st:'FELL THROUGH'};")
 (n=>{if(n==='Cited Verses')return{all:()=>V.map(j=>({json:j}))};throw new Error(n);},x,{ok:true,text},o,{CR3:'1. Matthew 1:25 "knew her not till she had brought forth" -- MEANS: the text says Joseph did not know her until the birth -- [L2] ginosko'});
const FL='FORCED: D2 vs C2 -- MEANS [CR3]: "the text says Joseph did not know her until the birth" -- ANSWER [DR3]: "a" -- FAILS: "a"';
const x={rule:'K-FC',link:'D2 vs C2'};
const c1=cure(x,FL.replace(' -- FAILS: "a"',' -- FAILS: "a" -- CARRIED BY: "And knew her not till she had brought forth" -- GROUND: [L1] x'),{});
t('C1 a FORCED line with CARRIED BY words of Matthew 1:25 cures ('+c1.why+')',c1.st==='CURED');
const c2=cure(x,FL+' -- CARRIED BY: "being a just man, and not willing"',{});t('C2 words of another verse: UNCURED ('+c2.why.slice(0,90)+')',c2.st==='UNCURED'&&/Matthew 1:25/.test(c2.why));
const c3=cure(x,'nothing',{});t('C3 no FORCED line: UNCURED',c3.st==='UNCURED');
const c4=cure(x,'RETRACTED',{withdrawn:[{link:'D2 vs C2',line:'RETRACTED: D2 vs C2'}]});t('C4 RETRACTED cures',c4.st==='CURED'&&c4.why==='retracted');
const c5=cure({rule:'K-F',link:'D2 vs C2'},FL,{});t('C5 a K-F item is not taken by the K-FC block',c5.st==='FELL THROUGH');
t('D1 the K-FC mark does not end "REVIEW THIS ROW"',!/K-FC\)[^\n]*REVIEW THIS ROW/.test(LIB));
const X=fs.readFileSync('pkgFCB/patched/Extract_Independent_Verdict.js','utf8');t('D2 Extract runs K-FC right after K-F',X.indexOf('const FC=kfcLines(text,R)')>X.indexOf('const F9=kfLines(text,R)'));
let sp='';try{sp=cp.execFileSync('node',['pkgFCB/scope_FCB.cjs']).toString();}catch(e){sp=String(e.stdout||'');}t('E1 scope: '+sp.trim().split('\n').pop(),/22 OK, 0 FAIL/.test(sp));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
