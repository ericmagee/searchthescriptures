// pkgRU test. Run from wall2024/: node pkgRU/test_RU.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
// unit: the K-RUL reader of the patched Panel Cure Check
const lib=p=>{const s=rd(p+'/Panel_Cure_Check.js');const i=s.indexOf('function krulTx');const j=s.indexOf('function krulLines2024');return new Function(s.slice(s.indexOf('const __KRUL_HEADS'),j)+'\nreturn {krulCards,krulQs,krulCheckCard,krulMatch};')();};
const L0=lib('pkgKS/patched') /* = live Panel Cure Check, sha 1e8734e26d62d724 */,L1=lib('pkgRU/patched');
const one='STATEMENT: K-RUL D5 vs C4 | RULING -- D5 vs C4 -- CHALLENGER LINK BROKEN. CLAIM: the child was found of the Holy Ghost before they came together. NAMED BY: "before they came together, she was found with child of the Holy Ghost." (Matthew 1:18, quoted in [CR3]). RULE: Commitment 3 -- "Meaning." APPLIED: so CHALLENGER LINK BROKEN.';
const SRC='When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.';
T('live reads no card from a one-line card',L0.krulCards(one).length===0);
const c1=L1.krulCards(one);T('pkgRU reads the one-line card: target D5 vs C4, grade CHALLENGER LINK BROKEN, four fields',c1.length===1&&c1[0].target==='D5 vs C4'&&c1[0].grade==='CHALLENGER LINK BROKEN'&&['CLAIM','NAMED BY','RULE','APPLIED'].every(k=>c1[0].f[k]));
T('pkgRU: the one-line card passes the card check',L1.krulCheckCard(c1[0],SRC,null)===null);
T('pkgRU: a RULING after a bar with no CLAIM/NAMED BY labels is not split or read as a card',L1.krulCards('STATEMENT: x | RULING -- D1 vs C1 -- UNDERDETERMINED').length===0);
const five='RULING -- D1 vs C1 -- UNDERDETERMINED\nCLAIM: x\nNAMED BY: "she was found with child"\nRULE: Commitment 3 -- "Meaning."\nAPPLIED: y';
T('five-line card read the same by live and pkgRU',JSON.stringify(L0.krulCards(five))===JSON.stringify(L1.krulCards(five)));
const nb='"The time-note in 7:16 does not turn \'virgin\' into \'wife.\'" ([CR4])';
T('live reads \'virgin\' as its own quote',L0.krulQs(nb).includes('virgin'));
T('pkgRU reads one quote, the double-quoted sentence',JSON.stringify(L1.krulQs(nb))===JSON.stringify(['The time-note in 7:16 does not turn \'virgin\' into \'wife.\'']));
T('pkgRU keeps a single-quoted span outside double quotes',JSON.stringify(L1.krulQs("\'the time-note\' and \"another quote here\""))===JSON.stringify(['the time-note','another quote here']));
T('pkgRU keeps the pkgR2 rule: a double-quoted span inside a single-quoted span is part of it',JSON.stringify(L1.krulQs("\'he said \"go now\" to her\'"))===JSON.stringify(L0.krulQs("\'he said \"go now\" to her\'")));
// whole-node cure replay vs the stored Panel Cure Check
const {execSync}=require('child_process');const out=execSync('node corpus/replay_cure_node.cjs pkgRU',{encoding:'utf8'});const d=out.split('\n').filter(l=>/^  \d/.test(l));
const ru=d.filter(l=>!/K-G4\|D\d vs C\d\|UNCURED -> K-G4/.test(l)||!/^  33014 chatgpt/.test(l));
console.log(ru.map(l=>'   '+l.trim()).join('\n'));
T('cure replay: the only changes beyond the known pkgCR 33014 rows are 4 K-RUL UNCURED -> CURED (32998 chatgpt D4 vs C5; 33025 grok D3 vs C5, D5 vs C4, D5 vs C5)',ru.length===4&&ru.every(l=>/K-RUL\|(D\d vs C\d)\|UNCURED -> K-RUL\|\1\|CURED/.test(l)));
// gate regression: pkgRU gate nodes vs pkgCM on every fixture
const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);};
const G=(Lb,X,seat)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!b||!its.length)return null;const PT=Lb.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:Lb.ciRounds(PT),DL:Lb.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const A=Lb.sbApply2024(seat,b.verdict_raw,b.fields,its,ctx.R);const R=Lb.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];const c=rep&&R.items.length?Lb.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};
 return JSON.stringify({A:[...(A.applied||[])].sort(),N:(A.items||[]).map(z=>z.sid+z.kind),G:R.items.map(g=>g.gid+g.kind+g.src),c:c.res.map(r=>r&&r.cured),n:c.uncured});};
const GC=mk('pkgCM/patched'),GR=mk('pkgRU/patched');let seats=0,diff=0;
for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f))){const X=JSON.parse(rd('corpus/'+f));for(const s of [...new Set(X.sb_items.map(x=>x.seat))]){seats++;if(G(GC,X,s)!==G(GR,X,s)){diff++;console.log('   gate differs: '+f+' '+s);}}}
T('gate: pkgRU equals pkgCM on every fixture seat ('+seats+' seats)',diff===0);
// cure prompt: the Panel Cure Builds and the Alternate Cure Build on the saved 33040 inputs, live vs pkgRU
{const W=JSON.parse(rd('/mnt/project-files/wall2024/prewrite_glm_83ef4d98.json'));const IN='/mnt/project-files/wall2024/inputs/33040_';
 const ld=n=>{try{const a=JSON.parse(rd(IN+n.replace(/ /g,'_')+'.json'))[0].main[0];return Array.isArray(a)?a:[a];}catch(e){return null;}};
 const $=n=>{const it=ld(n);if(!it)return {isExecuted:false,first:()=>{throw new Error('no '+n)},all:()=>[]};return {isExecuted:true,first:()=>it[0],last:()=>it[it.length-1],all:()=>it,item:it[0]};};
 const run=src=>JSON.stringify(new Function('$','$input','$json',src)($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{})).replace(/"at":"[^"]*"/g,'');
 const strip=s=>s.replace(/ Every RESTATED line you write[^"]*?counted under K-RUL\./g,'');
 for(const nm of ['Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Cure Build']){const a=run(W.nodes.find(n=>n.name===nm).parameters.jsCode),b=run(rd('pkgRU/patched/'+nm.replace(/ /g,'_')+'.js'));
  T('33040 '+nm+': the cure prompt carries the restated-line sentence once, and nothing else changes',b.split('Every RESTATED line you write').length-1===1&&strip(a)===strip(b));}}
console.log(ok+' OK, '+bad+' FAIL');
