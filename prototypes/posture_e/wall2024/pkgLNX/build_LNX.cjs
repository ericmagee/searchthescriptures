// pkgLNX (W3 feedback ruling B3, 2026-11-06): the single-judge extractor strips a leading "Line N, exactly:" before it reads lines.
// The prompt (Build Independent Verdict) says "Line 2, exactly: RESULT: ..." and "Line 3, exactly: CLAUSE: ...". On 33175 the single
// judge copied those words, so the line-anchored RESULT, CLAUSE and n/w/k reads failed (result=null, clause=null, n/w/k from prose).
// Base: Extract Independent Verdict from fetchback_live_1b49671d.json (equal to fetchback_n24.json). One edit, on the upper-case copy only:
// the stored independent_verdict_raw keeps the judge's text as written. Run from wall2024/: node pkgLNX/build_LNX.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const f='Extract_Independent_Verdict.js';const s0=fs.readFileSync('pkgLNX/base/'+f,'utf8');
const A="const upper=raw.toUpperCase().replace(/[*_`]+/g,'');";
const Bn="/* pkgLNX (W3 ruling B3): a judge that copies the prompt's \"Line N, exactly:\" ahead of a label still has that label at the start of its line */\nconst upper=raw.toUpperCase().replace(/[*_`]+/g,'').replace(/(^|\\n)[ \\t]*LINE[ \\t]+\\d+[ \\t]*,?[ \\t]*EXACTLY[ \\t]*:[ \\t]*/g,'$1');";
if(s0.split(A).length!==2)throw new Error('anchor count');const s=s0.replace(A,()=>Bn);
new Function('$','$input','$json','$execution',s);fs.mkdirSync('pkgLNX/patched',{recursive:true});fs.writeFileSync('pkgLNX/patched/'+f,s);
fs.writeFileSync('pkgLNX/plan_LNX.json',JSON.stringify({base:'fetchback_live_1b49671d.json (= fetchback_n24.json)',nodes:[{name:'Extract Independent Verdict',file:f,base_sha:sha(s0),final_sha:sha(s),edits:1}]},null,1));
console.log(f,sha(s0),'->',sha(s));
