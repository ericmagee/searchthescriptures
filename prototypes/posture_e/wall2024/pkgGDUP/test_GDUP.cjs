// pkgGDUP test (W3 2319). Run from wall2024/ after the build: node pkgGDUP/test_GDUP.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgGDUP/plan_GDUP.json'));
T('6 nodes: base and final shas match the plan',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgGD/patched/'+n.file))===n.base_sha&&sha(rd('pkgGDUP/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgGDUP/patched/'+n.file));return true;}catch(e){console.log('   '+e.message);return false;}}));
T('gateStands2024 is in each node once, and sbApply2024 is unchanged from pkgGD',plan.nodes.every(n=>rd('pkgGDUP/patched/'+n.file).split('function gateStands2024(').length===2)&&(()=>{const {fnText}=require('./fn.cjs');return plan.nodes.every(n=>fnText(rd('pkgGDUP/patched/'+n.file),'sbApply2024')===fnText(rd('pkgGD/patched/'+n.file),'sbApply2024'));})());
const mk=(file,PB)=>{const AM=rd(file);const lib=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
 return new Function('$','$input',lib+'\nreturn {gateCure2024,gateItems2024,sbApply2024,ciRounds,gatePromptText2024,drvLinks};')(n=>{if(n==='Panel Build'&&PB)return {first:()=>({json:PB})};throw new Error('offline');},null);};
const OLD=PB=>mk('pkgGD/patched/Alternate_Merge.js',PB),NEW=PB=>mk('pkgGDUP/patched/Alternate_Merge.js',PB);
// 33006 grok G4-G6 (lines from debate_enforcer_log 5554, 5573-5575; collision lines shortened to link, grade and witness)
const AC0='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "He is the one addressed and told to take his wife. The of the Holy Ghost clause is the reason given to him." -- MEETS -- "the verb is the margin\'s begetting-verb for what is in her."';
const S8='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "He is the one addressed and told to take his wife. The "of the Holy Ghost" clause is the reason given to him." -- MISSES -- "The "of the Holy Ghost" clause is the reason given to him" (Commitment 5)';
const GT='ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: "the verse that carries the margin\'s begetting-verb names Joseph, son of David, and his wife in the same breath" -- ANSWER: "Matthew 1:20 names Joseph, the son of David. He is the one addressed and told to take his wife. The "of the Holy Ghost" clause is the reason given to him, and the verb is the margin\'s begetting-verb for what is in her." -- MEETS -- "the verb is the margin\'s begetting-verb for what is in her"';
const COL=['D2 vs C3 (Matthew 1:20): CHALLENGER LINK BROKEN -- [L1] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost" GROUND: the press on Matthew 1:20 was met.',
 'D2 vs C4 (Matthew 1:19): CHALLENGER LINK BROKEN -- [L1] Matthew 1:19 "was minded to put her away privily" [L3] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost." GROUND: the press was met.',
 'D6 vs C6 (Matthew 1:20): CHALLENGER LINK BROKEN -- [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost" GROUND: the press was met.'];
const F={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'COLLAPSED',challenger_conceded_links:3};
const raw=JSON.stringify({...F,reasoning:'HELD.\nANSWER CHECKS:\n'+AC0+'\nCOLLISIONS:\n'+COL.join('\n')+'\nRESULT: DEFENDER WINS'},null,2);
const its=[{seat:'grok',sid:'S8',rule:'E-ANS',ans:'CHANGE',line:AC0,to:S8}];const ctx={R:null,DL:[],ask:false};
const run=(M,reply)=>{const G=M.gateItems2024('grok',raw,F,its,ctx).items;return {G,C:M.gateCure2024('grok',raw,F,its,G,typeof reply==='function'?reply(G):reply,ctx)};};
const same=G=>G.map(x=>'GATE: '+x.gid+' || CHANGE TO: '+GT+' || the answer meets the press').join('\n');
{const o=run(OLD(null),same),n=run(NEW(null),same);const st=C=>C.res.map(r=>r.gid+':'+(r.cured?'C':'U')).join(' ');
 T('33006 grok pattern: 3 E-GATE B items on one ANSWER CHECK line that S8 rewrote',n.G.length===3&&n.G.every(x=>x.kind==='CONTRADICTION'&&x.src==='E-GATE B'));
 T('pkgGD (live e46017fd): the first item CURED, the 2 identical changes UNCURED, 2 counted ('+st(o.C)+')',st(o.C)==='G1:C G2:U G3:U'&&o.C.uncured===2);
 T('pkgGDUP: all 3 CURED, 0 counted ('+st(n.C)+'); G2/G3 reason: '+n.C.res[1].why,st(n.C)==='G1:C G2:C G3:C'&&n.C.uncured===0);
 T('pkgGDUP: E-APPLY still applies G1 (the first change) and the text is the same as on pkgGD',n.C.R2.R1.applied.join(',')===o.C.R2.R1.applied.join(',')&&n.C.R2.T1===o.C.R2.T1&&n.C.R2.R1.applied.includes('G1'));}
{const rp=G=>G.map((x,i)=>'GATE: '+x.gid+' || CHANGE TO: '+(i===0?GT:GT.replace('-- MEETS --','-- MISSES --'))+' || r').join('\n');const n=run(NEW(null),rp);
 T('a different CHANGE TO that was not applied stays UNCURED',!n.C.res[1].cured&&!n.C.res[2].cured);}
{const rp=G=>G.map((x,i)=>i===0?'GATE: G1 || KEEP || keep':'GATE: '+x.gid+' || CHANGE TO: '+S8+' || r').join('\n');const n=run(NEW(null),rp);
 T('a CHANGE TO equal to the line as it stands, with the item still raised, stays UNCURED',n.C.res.slice(1).every(r=>!r.cured));}
{const rp=G=>'GATE: G1 || KEEP || k\nGATE: G2 || KEEP || k\nGATE: G3 || KEEP || k';const o=run(OLD(null),rp),n=run(NEW(null),rp);
 T('KEEP answers decide as on pkgGD',JSON.stringify(o.C.res.map(r=>[r.cured,r.why]))===JSON.stringify(n.C.res.map(r=>[r.cured,r.why])));}
// replay: every stored 32998 gate reply on its live items, pkgGD against pkgGDUP
{const FX=JSON.parse(rd('pkgGD/fixture_32998.json'));const L=(PB)=>mk('pkgG4W/patched/Alternate_Merge.js',PB);let n=0,d=0;
 for(const X of [FX,FX.alt]){const Lm=L(X.PB),O=OLD(X.PB),N=NEW(X.PB);for(const b of X.bodies){const its=X.sb_items.filter(x=>x.seat===b.seat);const rep=X.gate_replies[b.seat];if(!its.length||!rep)continue;
  const j=X.PB.judges.find(q=>q.seat===b.seat);const PT=N.gatePromptText2024(j.body);const ctx={R:N.ciRounds(PT),DL:N.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const G=Lm.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx).items;const a=O.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx),c=N.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,rep,ctx);
  a.res.forEach((r,i)=>{n++;const s=c.res[i];if(r.cured!==s.cured||r.why!==s.why){d++;console.log('   32998 '+b.seat+' '+r.gid+' changes: '+r.why+' -> '+s.why);}});}}
 T('replay 32998: all '+n+' stored gate decisions are the same on pkgGD and pkgGDUP (cure and reason)',n===8&&d===0,d+' differ');}
console.log('\n'+ok+' OK, '+bad+' FAIL');
