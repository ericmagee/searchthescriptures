// pkgACR (reader phase 2, swap 2: the ANSWER CHECK readers). W3 enforcer_fix_queue item 2, part 2; spec sections 2, 7 (G6) and 8.
// Base: pkgKFR/patched (22 nodes; pkgKFR already embeds the shared reader as __RL). Run from wall2024/: node pkgACR/build_ACR.cjs
// Three readers of an ANSWER CHECK line move to the shared reader's ANSWER CHECK form. Where the reader refuses a line that starts
// "ANSWER CHECK:" (a MALFORMED line), the old reader still reads it, so no line the engine read before is dropped in this swap.
// RESTATED ANSWER CHECK lines stay unread by these three, as before.
//  kagRow (K-AG, TRIAL): verse, round field, NONE answer and grade word from the reader.
//  selfLines421 (B7 self-contradiction mark): MEETS/MISSES/FAILS per verse and side from the reader; every listed round counts (G6: several
//    rounds, [CR3], [CR4]); the old regex took only the first bracket.
//  K-F (W3 ruling, Wall 2410): quotation found with quote marks and list breaks normalised on both sides (kfFound).
//  gateLineFor2024 (which item line a gate CHANGE replaces): the verse and first round from the reader.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const one=(s,a,b,n)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(n+': anchor count '+k+' for '+a.slice(0,70));return s.split(a).join(b);};
const H="// pkgACR: the shared reader's ANSWER CHECK form for one line (null unless the line itself is an ANSWER CHECK line the reader reads)\n"
 +"function __acRead(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}}\n";
// kagRow
const KA="function kagRow(l){const s=String(l||'')";
const KB=H+"function kagRow(l){const f=__acRead(l);if(f&&f.answer!==undefined){ /* a line with no ANSWER field stays unread by K-AG, as before */const s=String(l||'').replace(/[*_`]+/g,'').replace(/^\\s*(?:[-\\u2022>]|\\d+[.)])?\\s*/,'').trim(); /* pkgACR */\n"
 +" return {verse:f.verse,rk:f.roundRaw,none:!!(f.answerBare&&/^NONE\\b/i.test(String(f.answer||''))),grade:String(f.grade||'').toUpperCase(),line:s};}return kagRow0(l);}\n"
 +"function kagRow0(l){const s=String(l||'')";
// selfLines421
const SA=" for(const raw of T.split('\\n')){const m=raw.trim().match(/^(?:[-\\u2022]\\s*)?ANSWER CHECK\\s*:\\s*((?:[1-3]\\s?)?[A-Z][a-z]+\\.?\\s+\\d+:\\d+)[^\\n]*?\\[\\s*(CR|DR)\\d\\s*\\][^\\n]*?--\\s*(MEETS|MISSES|FAILS)\\b/);if(!m)continue;const k=ref(m[1]);(AC[m[2]][k]=AC[m[2]][k]||[]).push(m[3]);}";
const SB=" for(const raw of T.split('\\n')){const f=__acRead(raw);if(f){const v=String(f.verse).match(/^((?:[1-3]\\s?)?[A-Z][a-z]+\\.?\\s+\\d+:\\d+)/);if(!v||!/^(MEETS|MISSES|FAILS)$/.test(f.grade))continue;const k=ref(v[1]);for(const rd of new Set(f.rounds.map(x=>x.slice(0,2))))(AC[rd][k]=AC[rd][k]||[]).push(f.grade);continue;} /* pkgACR: the reader, every listed round (G6) */\n"
 +"  if(/^\\s*(?:[-\\u2022]\\s*)?ANSWER CHECK\\s*:/i.test(raw)&&__RL.readLine(raw).form==null){const m=raw.trim().match(/^(?:[-\\u2022]\\s*)?ANSWER CHECK\\s*:\\s*((?:[1-3]\\s?)?[A-Z][a-z]+\\.?\\s+\\d+:\\d+)[^\\n]*?\\[\\s*(CR|DR)\\d\\s*\\][^\\n]*?--\\s*(MEETS|MISSES|FAILS)\\b/);if(!m)continue;const k=ref(m[1]);(AC[m[2]][k]=AC[m[2]][k]||[]).push(m[3]);}} /* a line the reader refuses: read as before */";
// gateLineFor2024
const GA=" const ac=s=>{const m=String(s).replace(/[*_`]+/g,'').trim().match(";
const GB=" const ac=s=>{const f=__acRead(s);if(f&&f.rounds.length)return (String(f.verse).replace(/\\s+/g,' ')+'|'+f.rounds[0]).toUpperCase();const m=String(s).replace(/[*_`]+/g,'').trim().match("; /* pkgACR */
const plan={base:'pkgKFR/patched (live 868b0814 + pkgRU + pkgKFR)',nodes:[]};fs.mkdirSync('pkgACR/patched',{recursive:true});
for(const f of fs.readdirSync('pkgKFR/patched').filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync('pkgKFR/patched/'+f,'utf8');if(!b.includes('const __RL='))throw new Error(f+': no __RL');
 let s=one(b,KA,KB,f+' kagRow');s=one(s,SA,SB,f+' selfLines421');if(b.includes('function gateLineFor2024('))s=one(s,GA,GB,f+' gateLineFor2024');
 s=one(s,"function kfLines(text,R){","// pkgACR (W3 ruling, Wall 2410): K-F finds a quotation with quote marks and list breaks normalised on both sides; a quote that joins\n// adjacent list items is found; one that skips words is not (ciFound as before, after the list marks at line starts are removed).\nconst __kfLB=s=>String(s==null?'':s).replace(/\\\\n/g,'\\n').replace(/(^|\\n)[ \\t]*(?:[-*\\u2022>]|\\d+[.)])[ \\t]+/g,'$1');\nconst kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t));\nfunction kfLines(text,R){",f+' kfFound');
 for(const k of ['m[3],R[m[2].toUpperCase()]','m[5],R[m[4].toUpperCase()]','m[6],R[m[4].toUpperCase()]'])s=one(s,'!ciFound('+k+'))','!kfFound('+k+'))',f+' kf '+k);
 fs.writeFileSync('pkgACR/patched/'+f,s);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgACR/plan_ACR.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
