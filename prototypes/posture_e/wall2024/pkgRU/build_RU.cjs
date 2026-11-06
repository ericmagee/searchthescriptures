// pkgRU (K-RUL reading; record-only rule, driven to zero false items so it can go LIVE). Run from wall2024/: node pkgRU/build_RU.cjs
// Base: live ec44727f node code (83ef4d98 export; ec44727f differs only in Init Seats and Accept Build), with pkgCM's patched file for the six
// nodes pkgCM changes (pkgRU stacks on pkgCM). The K-RUL library is copied into 22 nodes; each gets (a) and (b), and the 19 with the cure prompt get (c). Corpus: 7 runs, 14 UNCURED K-RUL rows.
// (a) A card written on one line ("STATEMENT: K-RUL D3 vs C5 | RULING -- D3 vs C5 -- GRADE. CLAIM: ... NAMED BY: ... RULE: ... APPLIED: ...")
//     is read as the five-line card (33025 grok: 3 cards written, 3 false "no ruling card" items).
// (b) A single-quoted word inside a double-quoted NAMED BY quote is part of that quote, not a quote of its own
//     (32998 chatgpt: NAMED BY "The time-note in 7:16 does not turn 'virgin' into 'wife.'" read 'virgin' as a one-word quote; false item).
// (c) The cure prompt states that every RESTATED line needs its card in the same reply (Commitment 11). The engine already counts a RESTATED
//     line without a card (W3 reply 2157, R7), but no prompt says so: 10 corpus rows, 0 of 7 cure replies wrote a card for a restated line.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/prewrite_glm_83ef4d98.json','utf8'));
const plan={base:'live ec44727f (83ef4d98 node code) + pkgCM (cf019fa) for the nodes it changes',nodes:[]};fs.mkdirSync('pkgRU/patched',{recursive:true});
for(const n of W.nodes){const live=(n.parameters||{}).jsCode||'';if(!live.includes('function krulCards'))continue;const NODE=n.name;const file=NODE.replace(/ /g,'_')+'.js';
 const cm='pkgCM/patched/'+file;const base=fs.existsSync(cm)?fs.readFileSync(cm,'utf8'):live;let t=base;const done=[];const HASP=base.includes('For a K-RUL item, write the card');
const rep=(a,b,tag,opt)=>{const n=t.split(a).length-1;if(opt&&n===0)return;if(n!==1)throw new Error(NODE+' '+tag+': anchor found '+n+' times');t=t.replace(a,()=>b);done.push(tag);};
// (a)
rep("function krulCards(T){const L=String(T||'').split('\\n').map(l=>l.replace(/[*`]+/g,'').trim());const cards=[];",
 "function krulCards(T){const L=[];String(T||'').split('\\n').map(l=>l.replace(/[*`]+/g,'').trim()).forEach(l=>{const m=l.match(/(?:^|\\|\\s*)((?:[-\\u2022]\\s*)?RULING\\s*(?:--|\\u2014|\\u2013|:)[\\s\\S]*)$/);" /* pkgRU (a): a one-line card */
 +"if(m&&/\\bCLAIM\\s*:/.test(m[1])&&/\\bNAMED BY\\s*:/.test(m[1])){m[1].split(/\\s+(?=(?:CLAIM|NAMED BY|RULE|APPLIED)\\s*:)/).forEach(p=>L.push(p.trim()));}else L.push(l);});const cards=[];","a");
rep("const c={head:L[i],target:segs[0]||'',grade:(segs.length>1?segs[segs.length-1]:'').trim(),f:{}};",
 "const c={head:L[i],target:segs[0]||'',grade:(segs.length>1?segs[segs.length-1]:'').trim().replace(/[.;,]+$/,''),f:{}}; /* pkgRU (a): a one-line card's grade ends with a stop */","a2");
// (b)
rep("function krulQs(nb){const s=String(nb||'');const out=[];const used=[];\n for(const m of s.matchAll(/(^|[\\s(\\[;:,])['\\u2018]",
 "function krulQs(nb){const s=String(nb||'');const out=[];const used=[];const dq=[...s.matchAll(/[\"\\u201c]([^\"\\u201d]{3,})[\"\\u201d]/g)].map(m=>[m.index,m.index+m[0].length]); /* pkgRU (b) */\n for(const m of s.matchAll(/(^|[\\s(\\[;:,])['\\u2018]","b0");
rep("const a=m.index+m[1].length;used.push([a,a+m[0].length-m[1].length]);if(m[2].trim().length>=3)out.push(m[2]);}",
 "const a=m.index+m[1].length;const e=a+m[0].length-m[1].length;if(dq.some(([x,y])=>a>x&&e<y))continue; /* pkgRU (b): a single-quoted word inside a double-quoted quote is part of it */used.push([a,e]);if(m[2].trim().length>=3)out.push(m[2]);}","b");
// (c)
rep("For a K-RUL item, write the card; a missing card is not a reason to change the grade.",
 "For a K-RUL item, write the card; a missing card is not a reason to change the grade. Every RESTATED line you write is a deciding ruling (Commitment 11): under it, in this reply, write its five-line card, one field to a line: RULING -- <the link> -- <the grade>, CLAIM:, NAMED BY:, RULE:, APPLIED:. A RESTATED line without its card is counted under K-RUL.","c",!HASP);

 try{new Function('$','$input','$json',t);}catch(e){throw new Error(NODE+': does not parse: '+e.message);}
 fs.writeFileSync('pkgRU/patched/'+file,t);plan.nodes.push({file,name:NODE,base:fs.existsSync(cm)?'pkgCM':'live',base_sha:sha(base),final_sha:sha(t),parts:done.join(' ')});}
fs.writeFileSync('pkgRU/plan_RU.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(28),x.base.padEnd(6),x.base_sha,'->',x.final_sha,x.parts));console.log(plan.nodes.length,'nodes');
