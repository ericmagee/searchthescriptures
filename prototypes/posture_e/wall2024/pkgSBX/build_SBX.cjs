// pkgSBX (reader phase 2, the SENDBACK reply; W3 split 2026-11-06 11:02 CST). Run from wall2024/: node pkgSBX/build_SBX.cjs
// The SENDBACK reply is read in Send Back Record and Alt Send Back Record only (no library node reads it). Base: pkgEC2/patched (08eb818).
// Both nodes get the shared reader (reader/readLines.cjs, embedded as __RL the way pkgKFR embeds it in the library nodes). A reply line the
// reader reads as REPLY kind SENDBACK gives id, KEEP or CHANGE, the CHANGE TO payload and the sentence; a line the reader refuses is read by the
// old pattern, as before (pkgACR rule). The first answer to an id wins, as before.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const RL=fs.readFileSync('reader/readLines.cjs','utf8');
const HEAD="// pkgSBX: the shared line reader (reader/readLines.cjs sha "+sha(RL)+"), as in the library nodes\n"
 +"const __RL=(function(){const module={exports:{}};const exports=module.exports;\n"+RL.replace(/^'use strict';\n/m,'')+"\nreturn module.exports;})();\n"
 +"function __sbxRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}}\n";
const A0="  const m=l.match(/SENDBACK\\s*:?\\s*(?:ITEM\\s*)?#?\\s*(S\\s*\\d+)";
const A1="  {const r=__sbxRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='SENDBACK'){const id=r.f.id; /* pkgSBX: the reader decides whether the line is a SENDBACK answer, its id and KEEP or CHANGE */\n"
 +"   const m0=l.match(/SENDBACK\\s*:?\\s*(?:ITEM\\s*)?#?\\s*(S\\s*\\d+)\\s*:?\\s*\\|\\|\\s*(KEEP|CHANGE\\s+TO\\s*:?([\\s\\S]*?))\\s*(?:\\|\\|\\s*(.*))?$/i);const same=m0&&m0[1].replace(/\\s+/g,'').toUpperCase()===id&&(/^KEEP$/i.test(m0[2].trim())?'KEEP':'CHANGE')===r.f.answer;\n"
 +"   /* the payload and sentence keep the judge's own characters when the old pattern reads the same id and answer (the reader's spec-0 normalisation strips backslashes) */\n"
 +"   if(!A[id])A[id]=same?{ans:r.f.answer,to:(m0[3]||'').trim(),why:(J?String(m0[4]||'').replace(/\"\\s*,?\\s*[}\\]]*\\s*$/,''):String(m0[4]||'')).trim(),line:l}:{ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/\"\\s*,?\\s*[}\\]]*\\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}\n"+A0;
const plan={base:'pkgEC2/patched (08eb818)',reader_sha:sha(RL),nodes:[]};fs.mkdirSync('pkgSBX/patched',{recursive:true});
for(const f of ['Alt_Send_Back_Record.js','Send_Back_Record.js']){const b=fs.readFileSync('pkgEC2/patched/'+f,'utf8');if(b.includes('const __RL='))throw new Error(f+': already has __RL');
 const k=b.split(A0).length-1;if(k!==1)throw new Error(f+': anchor x'+k);const s=HEAD+b.split(A0).join(A1);new Function('$','$input','$json',s);
 fs.writeFileSync('pkgSBX/patched/'+f,s);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgSBX/plan_SBX.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name.padEnd(24),x.base_sha,'->',x.final_sha));
