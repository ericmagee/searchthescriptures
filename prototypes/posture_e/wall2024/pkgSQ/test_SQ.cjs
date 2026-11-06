// pkgSQ test. Run from wall2024/: node pkgSQ/test_SQ.cjs [base, default pkgRCK] [out, default pkgSQ]. Lists every behaviour change against the base.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const BP=process.argv[2]||'pkgRCK';const OP=process.argv[3]||'pkgSQ';const plan=JSON.parse(rd(OP+'/plan_SQ.json'));
T('22 nodes: base ('+BP+') and final shas match the plan; 6 gate nodes edited, 16 unchanged',plan.base===BP+'/patched'&&plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(BP+'/patched/'+n.file))===n.base_sha&&sha(rd(OP+'/patched/'+n.file))===n.final_sha)&&plan.nodes.filter(n=>n.edits.length===1).length===6&&plan.nodes.filter(n=>n.base_sha===n.final_sha).length===16);
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024,cureRounds,SB_ROW};')(()=>{throw 0},null);};
const O=lib(BP),N=lib(OP);
// 1. run 33060 chatgpt: the 4 K-S3 send-back items against the judge text Gate Record started from (Panel Cure Check output)
{const D='/mnt/project-files/wall2024/inputs/';const GR=JSON.parse(rd(D+'33060_Gate_Record.json'))[0].main[0][0].json;const PC=JSON.parse(rd(D+'33060_Panel_Cure_Check.json'))[0].main[0][0].json;
 const its=GR.sb_items.filter(x=>x.seat==='chatgpt'&&x.rule==='K-S3');const b=PC.bodies.map(x=>JSON.parse(x)).find(x=>x.payload.judge_seat==='chatgpt');const raw=b.payload.verdict_raw;
 const F0={verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links};
 const na=R=>R?R.items.filter(z=>z.kind==='NOT APPLIED').map(z=>z.sid):null;const a=O.sbApply2024('chatgpt',raw,F0,its,null),c=N.sbApply2024('chatgpt',raw,F0,its,null);
 console.log('   33060 chatgpt K-S3 items '+its.map(x=>x.sid).join(', ')+'; base NOT APPLIED: '+JSON.stringify(na(a))+'; pkgSQ NOT APPLIED: '+JSON.stringify(na(c)));
 if(c)c.rp.forEach(([o,n])=>console.log('     '+o.trim().slice(0,140)+'\n       -> '+n.trim().slice(0,140)));
 T('33060 chatgpt: base refuses S1, S2, S4 (as live); pkgSQ applies all four, each onto the judge row with the same sentence',JSON.stringify(na(a))==='["S1","S2","S4"]'&&c&&na(c).length===0&&c.rp.length===4);}
// 2. the K-S3 row lookup on every corpus CHANGE TO in the row form (as test_SBR section 3): found-or-not-found flips, old key vs new
{const RL=require('../reader/readLines.cjs');const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l));const tx=o=>String(o.jtext!=null?o.jtext:o.text);
 const oo=l=>{const r=RL.readLine(String(l));return r.form==='OUT-OF-ROUND'?r.f:null;};
 const sk0=s=>String(s||'').replace(/^["“]+|["”]+$/g,'').replace(/\s+/g,' ').trim().toUpperCase();const sk1=s=>String(s||'').replace(/\\+/g,'').replace(/["'`‘’“”]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
 const judge={};for(const o of C)if(/^(verdict_gate|alt_verdict_gate)$/.test(o.src))judge[o.run+' '+o.seat]=tx(o).split('\n');
 const flips=[];let n=0;for(const o of C){if(!/^(sendback_reply|gate_reply|change_to|cure_reply|alternate_reply)$/.test(o.src))continue;const L=judge[o.run+' '+o.seat];if(!L)continue;
  for(const raw of tx(o).split('\n')){const to0=raw.match(/CHANGE\s+TO\s*:?\s*(.*?)(?:\s*\|\|.*)?$/i);const to=(o.src==='change_to'?raw:(to0?to0[1]:'')).trim().replace(/^["“]([\s\S]*)["”]$/,'$1');if(!to)continue;
   const a=oo(to);if(!a)continue;n++;const f=sk=>L.find(l=>{const b=oo(l);return b&&b.side===a.side&&b.round===a.round&&sk(b.sentence)===sk(a.sentence);})||null;const x=f(sk0),y=f(sk1);
   if(x!==y)flips.push(o.run+' '+o.seat+' '+o.src+': '+(x?'found':'not found')+' -> '+(y?'found':'not found')+'\n        CHANGE TO: '+to.slice(0,200)+'\n        judge row: '+String(y||x).trim().slice(0,200));}}
 console.log('   K-S3 row lookup: '+n+' corpus CHANGE TO payloads in the row form; flips: '+flips.length);flips.forEach(x=>console.log('     '+x));
 T('corpus row lookup: no row found before is lost, and every new find is the same side, round and words',flips.every(x=>/not found -> found/.test(x)));}
// 3. gate replay (corpus/replay.cjs), base vs pkgSQ
{const r=p=>execSync('node corpus/replay.cjs '+p,{encoding:'utf8',maxBuffer:1<<26}).split('\n').map(l=>l.replace(new RegExp('^'+p+'\\b'),'PKG'));const a=r(BP),b=r(OP);
 const d=b.map((l,i)=>[a[i],l]).filter(([x,y])=>x!==y);console.log('   corpus/replay.cjs gate replay: '+b.length+' lines, '+d.length+' differ');d.slice(0,40).forEach(([x,y])=>console.log('     - '+String(x).slice(0,220)+'\n     + '+y.slice(0,220)));
 T('gate replay: same line count; differences listed above',a.length===b.length);}
console.log(ok+' OK, '+bad+' FAIL (behaviour changes are listed above for W3)');process.exit(bad?1:0);
