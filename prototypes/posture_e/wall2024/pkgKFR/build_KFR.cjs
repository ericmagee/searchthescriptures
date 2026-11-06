// pkgKFR (reader phase 2, swap 1: the FORCED reader). W3 enforcer_fix_queue item 2; spec sections 7 to 11 (line_form_spec.md).
// Base: pkgRU/patched (22 nodes = live 868b0814 [ec44727f + pkgCM] + pkgRU). Run from wall2024/: node pkgKFR/build_KFR.cjs
// KF_LINE, the FORCED line regex in 22 nodes, is replaced by the shared reader (reader/readLines.cjs, embedded verbatim): a line is a FORCED
// line when readLine() reads it as the FORCED form. Every caller keeps its code: KF_LINE.test(l) and l.match(KF_LINE) (through
// Symbol.match) return the same groups as before: [line, pair, MEANS round, MEANS quote, ANSWER round, ANSWER quote, FAILS quote].
// What the reader reads that KF_LINE did not (W3 rulings): a quote holding " -- " ends before the next field label (spec 8 rule 1; G4/G5);
// FAILS runs to the last closing mark (G9); [Defender Rn]/[Challenger Rn] rounds (spec 8.2); the Commitment tag after the pair (spec 11).
// A RESTATED: FORCED line is not read here (as before); only a line whose own form is FORCED.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const RL=fs.readFileSync('reader/readLines.cjs','utf8');
const DEF=/\nconst KF_LINE=\/\^[^\n]*?\/i; \/\* judge_fix10 K-F reader[^\n]*\*\/\n/;
const B="\n// pkgKFR (W3 queue item 2; reader phase 2 swap 1): KF_LINE is the shared reader's FORCED form (reader/readLines.cjs, embedded verbatim below).\n"
 +"const __RL=(function(){const module={exports:{}};const exports=module.exports;\n"+RL.replace(/^'use strict';\n/m,'')+"\nreturn module.exports;})();\n"
 +"function __kfM(s){const l=String(s==null?'':s);const r=__RL.readLine(l);if(!r||r.form!=='FORCED'||!r.f||!r.f.pair||r.f.restated)return null;const f=r.f;const m=[l,f.pair,f.meansRound,f.means,f.answerRound,f.answer,f.fails];m.index=0;m.input=l;return m;}\n"
 +"const KF_LINE={test:s=>!!__kfM(s),[Symbol.match]:s=>__kfM(s),toString:()=>'KF_LINE (readLines FORCED)'};\n";
const plan={base:'pkgRU/patched (live 868b0814 + pkgRU)',reader_sha:sha(RL),nodes:[]};fs.mkdirSync('pkgKFR/patched',{recursive:true});
const defs=new Set();
for(const f of fs.readdirSync('pkgRU/patched').filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync('pkgRU/patched/'+f,'utf8');const m=b.match(DEF);if(!m)throw new Error(f+': no KF_LINE definition');
 if(b.split(m[0]).length!==2)throw new Error(f+': KF_LINE defined more than once');defs.add(m[0]);const s=b.replace(m[0],()=>B);
 fs.writeFileSync('pkgKFR/patched/'+f,s);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
if(defs.size!==1)throw new Error('KF_LINE differs between nodes: '+defs.size+' variants');
fs.writeFileSync('pkgKFR/plan_KFR.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; one KF_LINE definition replaced in each; reader '+plan.reader_sha);
