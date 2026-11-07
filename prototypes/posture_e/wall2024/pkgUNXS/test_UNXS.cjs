// pkgUNXS tests. Run from wall2024/: node pkgUNXS/test_UNXS.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgUNXS/plan_UNXS.json','utf8'));const asm=JSON.parse(fs.readFileSync('pkgASM/plan_ASM.json','utf8')).nodes,g2=JSON.parse(fs.readFileSync('pkgGSL2/plan_GSL2.json','utf8')).nodes;
T('A1 22 nodes; bases are the GSL2 finals (6) and the ASM finals (16)',plan.nodes.length===22&&plan.nodes.every(n=>(g2.find(z=>z.name===n.name)||asm.find(z=>z.name===n.name)).final_sha===n.base_sha));
T('A2 every patched file matches its sha and compiles, and only unxSegs changed',plan.nodes.every(n=>{const s=fs.readFileSync('pkgUNXS/patched/'+n.file,'utf8'),s0=fs.readFileSync(n.base+'/'+n.file,'utf8');try{new Function('$','$input','$json','$execution',s);}catch(e){return false;}
 const L=fs.readFileSync('pkgUNXS/unxs_lib.js','utf8');return sha(s)===n.final_sha&&s===s0.replace(/function unxSegs\(sec\)\{[^\n]*\n[^\n]*\n/,()=>L+'\n')&&s0.split('function unxSegs(').length===2;}));
const NS=new Function(fs.readFileSync('pkgUNXS/unxs_lib.js','utf8')+';return unxSegs;')();const ns=s=>NS(s).map(x=>x.ns.join(',')+'|'+x.seg.trim()).join(' # ');
T('U1 bare entries after --, ; and counted:',ns('CONCEDED LINKS: 4 -- counted: 2 UNEXHIBITED (rival begetter); 4 UNEXHIBITED (came together). Spared: 1 and 3.')==='2|2 UNEXHIBITED (rival begetter); # 4|4 UNEXHIBITED (came together).',ns('CONCEDED LINKS: 4 -- counted: 2 UNEXHIBITED (rival begetter); 4 UNEXHIBITED (came together). Spared: 1 and 3.'));
T('U2 "Spared" ends the last counted entry, so its "narrowed" is not that entry\'s ground',ns('CONCEDED LINKS: 1 -- 6 UNEXHIBITED (x). Spared: 2, 3, each narrowed in [CR3].')==='6|6 UNEXHIBITED (x).');
T('U3 the Premise form reads as before',ns('CHALLENGER CONCEDED LINKS: 1 -- Premise 1: UNEXHIBITED (a); premises 2 and 3 spared')==='1|Premise 1: UNEXHIBITED (a); # 2,3|premises 2 and 3 spared');
T('U4 a verse number is not a premise ("Matthew 1:19 is unanswered")',ns('CONCEDED LINKS: 1 -- Premise 2 UNEXHIBITED (Matthew 1:19 is unanswered)')==='2|Premise 2 UNEXHIBITED (Matthew 1:19 is unanswered)');
T('U5 "Premise 5 UNEXHIBITED" is not read twice',NS('CONCEDED LINKS: 1 -- Premise 5 UNEXHIBITED (x)').length===1);
require('child_process').execSync('node pkgUNXS/replay_UNXS.cjs > /dev/null');const R=fs.readFileSync('pkgUNXS/replay_UNXS.txt','utf8');
T('B1 replay of 142 verdicts: 59 items -> 69, 0 lost, 10 added',/items old reader 59, new reader 69/.test(R)&&!/^LOST/m.test(R)&&(R.match(/^ADDED/mg)||[]).length===10);
T('B2 32980 grok premise 6 ("-- 6 UNEXHIBITED", the pkgUNXA reconciliation case) now raises K-UNX-A on [L1] Acts 2:30',/ADDED  32980 grok DEFENDER premise 6 ASSUMES \[L1,L3\] Acts 2:30/.test(R));
const {harness}=require('../pkgGSL/harness.cjs');const H=harness('33222');const P=n=>fs.readFileSync('pkgUNXS/patched/'+n,'utf8'),Q=n=>fs.readFileSync('pkgASM/patched/'+n,'utf8');const S=o=>JSON.stringify(o);
T('G1 Panel Payloads on 33222: same output as pkgASM',S(H(P('Panel_Payloads.js'),'Reserve Needed?'))===S(H(Q('Panel_Payloads.js'),'Reserve Needed?')));
T('G2 Alternate Payloads on 33222: same output as pkgASM',S(H(P('Alternate_Payloads.js'),'Alternate Call openrouter'))===S(H(Q('Alternate_Payloads.js'),'Alternate Call openrouter')));
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgUNXS/test_UNXS.txt',txt);console.log(txt);process.exit(bad?1:0);
