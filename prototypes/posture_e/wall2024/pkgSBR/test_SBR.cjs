// pkgSBR test. Run from wall2024/: node pkgSBR/test_SBR.cjs. Lists every behaviour change against pkgPS (the base).
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgSBR/plan_SBR.json'));
T('22 nodes: base (pkgPS) and final shas match the plan; 6 gate nodes edited, 16 unchanged',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgPS/patched/'+n.file))===n.base_sha&&sha(rd('pkgSBR/patched/'+n.file))===n.final_sha)&&plan.nodes.filter(n=>n.edits.length===3).length===6&&plan.nodes.filter(n=>!n.edits.length).every(n=>n.base_sha===n.final_sha));
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbLabel,gateRead2024,sbApply2024,gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,SB_ROW};')(()=>{throw 0},null);};
const O=lib('pkgPS'),N=lib('pkgSBR');const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l));const tx=o=>String(o.jtext!=null?o.jtext:o.text);
// 1. sbLabel on every distinct corpus line
{const seen=new Set();const d=[];let n=0;for(const o of C)for(const l of tx(o).split('\n')){const k=l.trim();if(!k||seen.has(k))continue;seen.add(k);n++;const a=O.sbLabel(k),b=N.sbLabel(k);if(a!==b)d.push(o.run+' '+o.seat+' '+o.src+': '+JSON.stringify(a)+' -> '+JSON.stringify(b)+' | '+k.slice(0,150));}
 console.log('   sbLabel on '+n+' distinct corpus lines: '+d.length+' differ');d.forEach(x=>console.log('     '+x));globalThis.__d1=d;}
// 2. gateRead2024 on every corpus text and every fixture gate reply
{const d=[];let n=0;const texts=C.map(o=>[o.run+' '+o.seat+' '+o.src,tx(o)]);
 for(const f of ['corpus/fix_32998.json','corpus/fix_33014.json','corpus/fix_33020.json','corpus/fix_33021.json','corpus/fix_33025.json','corpus/fix_33040.json']){try{const X=JSON.parse(rd(f));for(const X1 of [X,X.alt].filter(Boolean))for(const [s,r] of Object.entries(X1.gate_replies||{}))texts.push([f+' '+s,String(r)]);}catch(e){}}
 for(const [k,t] of texts){const a=O.gateRead2024(t),b=N.gateRead2024(t);if(!Object.keys(a).length&&!Object.keys(b).length)continue;n++;for(const id of new Set([...Object.keys(a),...Object.keys(b)])){const x=JSON.stringify(a[id]||null),y=JSON.stringify(b[id]||null);if(x!==y)d.push(k+' '+id+'\n        old: '+x.slice(0,260)+'\n        new: '+y.slice(0,260));}}
 console.log('   gateRead2024 on '+n+' texts with gate answers: '+d.length+' answers differ');d.forEach(x=>console.log('     '+x));globalThis.__d2=d;}
// 3. the K-S3 row lookup: every corpus line in the OUT-OF-ROUND row form, as a CHANGE TO, against the seat's judge text (old key vs new)
{const RL=require('../reader/readLines.cjs');const nrm=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 const rq=s=>{const t=nrm(s);const k=t.match(/["“]([^"”]+)["”]/);return (k?k[1]:t.replace(/\s+(?:TOUCHES NO LINK|COUNTED)\b[\s\S]*$/i,'').replace(/^["“]+|["”]+$/g,'')).trim().toUpperCase();};
 const oo=l=>{const r=RL.readLine(String(l));return r.form==='OUT-OF-ROUND'?r.f:null;};const sk=s=>String(s||'').replace(/^["“]+|["”]+$/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 const judge={};for(const o of C)if(/^(verdict_gate|alt_verdict_gate)$/.test(o.src))judge[o.run+' '+o.seat]=tx(o).split('\n');
 const flips=[];let n=0,nf=0;for(const o of C){if(!/^(sendback_reply|gate_reply|change_to|cure_reply|alternate_reply)$/.test(o.src))continue;const L=judge[o.run+' '+o.seat];if(!L)continue;
  for(const raw of tx(o).split('\n')){const to0=raw.match(/CHANGE\s+TO\s*:?\s*(.*?)(?:\s*\|\|.*)?$/i);const to=(o.src==='change_to'?raw:(to0?to0[1]:'')).trim().replace(/^["“]([\s\S]*)["”]$/,'$1');if(!to)continue;
   const m=to.match(O.SB_ROW),a=oo(to);if(!m&&!a)continue;n++;
   const fo=m?(L.find(l=>{const r=nrm(l).match(O.SB_ROW);return r&&r[1].toUpperCase()===m[1].toUpperCase()&&r[2].toUpperCase()===m[2].toUpperCase()&&rq(r[3])===rq(m[3]);})||null):null;
   const fn=a?(L.find(l=>{const b=oo(l);return b&&b.side===a.side&&b.round===a.round&&sk(b.sentence)===sk(a.sentence);})||null):fo;
   if(fn)nf++;if(!!fo!==!!fn||(fo&&fn&&fo!==fn))flips.push(o.run+' '+o.seat+' '+o.src+': '+(fo?'found':'not found')+' -> '+(fn?'found':'not found')+'\n        CHANGE TO: '+to.slice(0,200)+(fo?'\n        old row: '+fo.trim().slice(0,200):'')+(fn&&fn!==fo?'\n        new row: '+fn.trim().slice(0,200):''));}}
 console.log('   K-S3 row lookup: '+n+' CHANGE TO payloads in the row form ('+nf+' find a judge row with the new key); found-or-not-found flips: '+flips.length);flips.forEach(x=>console.log('     '+x));globalThis.__d3=flips;}
// 4. gate replay (W2 corpus/replay.cjs) and the fixture gate run, base vs patched
{const r=p=>execSync('node corpus/replay.cjs '+p,{encoding:'utf8',maxBuffer:1<<26}).split('\n').map(l=>l.replace(new RegExp('^'+p+'\\b'),'PKG'));const a=r('pkgPS'),b=r('pkgSBR');
 const d=b.filter((l,i)=>l!==a[i]);console.log('   corpus/replay.cjs gate replay: '+b.length+' lines, '+d.length+' differ');d.slice(0,40).forEach(x=>console.log('     '+x.slice(0,220)));globalThis.__d4=d;}
T('no label, gate answer or row lookup changes, and the gate replay is unchanged',!globalThis.__d1.length&&!globalThis.__d2.length&&!globalThis.__d3.length&&!globalThis.__d4.length);
console.log(ok+' OK, '+bad+' FAIL (behaviour changes are listed above for W3)');process.exit(bad?1:0);
