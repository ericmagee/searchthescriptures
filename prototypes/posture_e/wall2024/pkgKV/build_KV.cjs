// pkgKV (W3 queue item 5: K-V to LIVE at zero false items). Run from wall2024/: node pkgKV/build_KV.cjs
// Base: pkgKW/patched (stack pkgRU, pkgKFR, pkgACR, pkgKC2, pkgKS3, pkgKW, pkgKV). Fixes from the promotion read of every corpus K-V item:
// (a) kvSegments: a segment whose first sentence gives its premise another grade (UNEXHIBITED, SPARED, STANDS, SUPPORTED, CONCEDED, ...) and no
//     VOID does not rule that premise VOID; a VOID in a later sentence there rules other premises (33020 grok: "premise 6 UNEXHIBITED (John 1:12
//     misses). Spared: 3 and 4. VOID, excluded: 1 (ONLY) and 5 (ONLY).").
// (b) kvQuotes: a single-quoted span may hold an apostrophe inside a word ('through Joseph's begetting', 33040 chatgpt premise 1).
// (c) KV_KIND: "goes beyond the quoted / the quote / '<quote>'" names the kind (a claim the quote does not make; 33040 chatgpt premises 1 and 6),
//     and one word may stand between "does not" and "make" ("a claim the quotation ... does not itself make").
// (c2) kvRulingOk reads the kind also with each quotation cut to 'Q', so a long quotation does not push "does not make" out of reach
//     (33040 chatgpt cure: "a claim the quotation 'So the loins of David reach Christ through a line of fathers' does not itself make").
// (d) K-V goes LIVE: ENF_STATUS, the item mark and the PASS mark.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgKW/patched';const OUT=process.env.OUT||'pkgKV';
const R=[
 ["if(!/\\bVOID\\b/.test(seg)||","if(!/\\bVOID\\b/.test(seg)||((s0=>!/\\bVOID\\b/.test(s0)&&/\\b(?:UNEXHIBITED|SPARED|STANDS|SUPPORTED|CONCEDED|NARROWED|COUNTED)\\b/i.test(s0))(seg.split(/(?<=[.!?])\\s+/)[0]))/* pkgKV (a) */||",'kvSegments: first sentence grades it otherwise'],
 ["for(const m of t.matchAll(/(?:^|[\\s(\\[:;,])['‘]([^'’\\n]{2,160})['’](?=$|[\\s.,;:!?)\\]])/g))out.push(m[1]);","for(const m of t.matchAll(/(?:^|[\\s(\\[:;,])['‘]((?:[^'’\\n]|['’](?=[A-Za-z])){2,160}?)['’](?=$|[\\s.,;:!?)\\]])/g))out.push(m[1]);/* pkgKV (b) */",'kvQuotes: apostrophe inside a word'],
 ["(?:do(?:es)?\\s+not|never)\\s+make","(?:do(?:es)?\\s+not|never)\\s+(?:[a-z]+\\s+)?make|\\bgo(?:es)?\\s+beyond\\s+(?:the\\s+)?(?:quoted?\\b|quotation\\b|['‘\"“])",'KV_KIND: goes beyond the quote; does not <word> make'],
 ["const kind=KV_KIND.test(seg);","const kind=KV_KIND.test(seg)||KV_KIND.test(String(seg).replace(/[\"“][^\"”\\n]*[\"”]/g,'\"Q\"').replace(/(^|[\\s(\\[:;,])['‘](?:[^'’\\n]|['’](?=[A-Za-z]))+?['’](?=$|[\\s.,;:!?)\\]])/g,\"$1'Q'\"));/* pkgKV (c2): a long quotation does not hide the kind */",'KV_KIND read with quotations shortened'],
 ["'K-V':'TRIAL'","'K-V':'LIVE'",'K-V LIVE'],
 ["names the kind. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]","names the kind. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]",'K-V mark LIVE'],
 ["each quotes the charge words and names the kind; TRIAL rule]","each quotes the charge words and names the kind; LIVE rule]",'K-V PASS mark LIVE'],
];
const plan={base:BASE,nodes:[]};fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,w] of R){const k=t.split(a).length-1;if(k===0&&w!=='K-V LIVE'&&!t.includes('function drvVoid'))continue;if(k!==1)throw new Error(f+' '+w+' x'+k);t=t.replace(a,()=>c);ed.push(w);}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_KV.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; edited '+plan.nodes.filter(n=>n.edits.length).length+'; edits per node '+[...new Set(plan.nodes.map(n=>n.edits.length))]);
