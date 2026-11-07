// pkgSGA test. Run from wall2024/: node pkgSGA/test_SGA.cjs   (reads the repo and /mnt/project-files/wall2024/inputs only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgSGA/plan_SGA.json'));T('6 nodes; base and final shas match the files',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgSGA/base/'+n.file))===n.base_sha&&sha(rd('pkgSGA/patched/'+n.file))===n.final_sha));
const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf('\nfunction ',i+10));};
T('sbApply2024 is the same in all 6 patched nodes',new Set(plan.nodes.map(n=>sha(fn(rd('pkgSGA/patched/'+n.file))))).size===1);
T('outside sbApply2024 every node equals its base',plan.nodes.every(n=>{const b=rd('pkgSGA/base/'+n.file),p=rd('pkgSGA/patched/'+n.file);return b.replace(fn(b),'')===p.replace(fn(p),'');}));
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgSGA/base/Alternate_Merge.js'),N=lib('pkgSGA/patched/Alternate_Merge.js');
const D='/mnt/project-files/wall2024/inputs/';const L=(run,nn)=>{const f=D+run+'_'+nn+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const F=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
// ---- 33218: the four items ----
const SB=L('33218','Send_Back_Record');const B=SB.bodies.map(x=>typeof x==='string'?JSON.parse(x):x);const ccl=t=>(t.split('\n').find(l=>/^\s*\**\s*CHALLENGER CONCEDED LINKS\s*:/i.test(l))||'');
for(const [seat,sids] of [['chatgpt',['S20','S21']],['sol',['S18','S19']]]){const bb=B.find(b=>b.payload.judge_seat===seat);const its=SB.sb_items.filter(x=>x.seat===seat);
 const a=O.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null),c=N.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null);
 const na=a.items.filter(z=>z.kind==='NOT APPLIED'&&sids.includes(z.sid)).map(z=>z.sid),nc=c.items.filter(z=>z.kind==='NOT APPLIED'&&sids.includes(z.sid)).map(z=>z.sid);
 T('33218 '+seat+': base NOT APPLIED '+JSON.stringify(na)+'; pkgSGA none',na.length===2&&!nc.length);
 T('33218 '+seat+': items other than these are the same',JSON.stringify(a.items.filter(z=>!sids.includes(z.sid)))===JSON.stringify(c.items.filter(z=>!sids.includes(z.sid))));
 T('33218 '+seat+': counts and result unchanged ('+a.result+')',a.result===c.result&&JSON.stringify(a.fields)===JSON.stringify(c.fields));
 const L1=ccl(c.text);console.log('     '+seat+' CHALLENGER CONCEDED LINKS after: '+L1.slice(0,700));
 if(seat==='chatgpt')T('33218 chatgpt: the CHALLENGER CONCEDED LINKS line keeps its label and premises 1, 3, 4, 5, and takes S25 (premise 2) and S26 (premise 6) as sentences (base: S26 alone, label lost)',/Premises 1, 3, 4 and 5 are spared/.test(L1)&&/Premise 2 is NOT VOID/.test(L1)&&/Premise 6 is NOT VOID/.test(L1)&&!/Premise 2 is VOID/.test(L1)&&/Premise 2 is NOT VOID and is spared: its connective reading/.test(L1)&&/Premise 6 is NOT VOID and is spared in its narrowed form/.test(L1)&&c.applied.includes('S26'),c.audit.match(/APPLIED:[^\]]*/)[0].slice(0,300));
 else T('33218 sol: S20/S21 (E-PREM, whole line) win over S18/S19, recorded as replaces; the line is S21\'s',/^CHALLENGER CONCEDED LINKS: 0 -- Premises 1 through 6 are spared as supported; premise 6/.test(L1.trim())&&/replaces[^;\]]*S1[89]/.test(c.audit),c.audit.match(/APPLIED:[^\]]*/)[0].slice(0,300));}
// ---- units ----
const raw='COLLISION POINTS:\nD1 vs C1 (Matthew 1:18): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:18 "before they came together"\nKEYSTONE: D1 -- STANDS\nDEFENSE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCHALLENGE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCONCEDED LINKS: 0 -- none\nCHALLENGER CONCEDED LINKS: 0 -- Premise 1 is spared. Premise 2 is VOID (Commitment 6): the charge adds a negation the quote does not make.\nCLAUSE: HELD-1 -- n=2 w=0 k=0\nRESULT: UNDERDETERMINED -- r';
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const seg='Premise 2 is VOID (Commitment 6): the charge adds a negation the quote does not make.';const ap=(its)=>N.sbApply2024('u',raw,F0,its,null);
let r=ap([{sid:'S1',rule:'E-VOID',line:seg,ans:'CHANGE',to:'Premise 2 is NOT VOID; the quote carries it.'}]);
T('U1 a sentence change is applied inside its line',r.applied.includes('S1')&&/CHALLENGER CONCEDED LINKS: 0 -- Premise 1 is spared\. Premise 2 is NOT VOID; the quote carries it\./.test(r.text)&&!r.items.length);
r=ap([{sid:'S1',rule:'E-VOID',line:'Premise 1 is spared.',ans:'CHANGE',to:'Premise 1 is VOID.'}]);T('U2 a flagged text under 30 characters is not applied inside a line (NOT APPLIED, as base)',r.items.some(z=>z.sid==='S1'&&z.kind==='NOT APPLIED'));
r=ap([{sid:'S1',rule:'E-VOID',line:seg,ans:'CHANGE',to:'CONCEDED LINKS: 1 -- premise 2.'}]);T('U3 a change with its own line label is not put inside the sentence',!/Premise 1 is spared\. CONCEDED LINKS: 1/.test(r.text));
const raw2=raw.replace('CLAUSE:','NOTE: '+seg+'\nCLAUSE:');r=N.sbApply2024('u',raw2,F0,[{sid:'S1',rule:'E-VOID',line:seg,ans:'CHANGE',to:'Premise 2 is NOT VOID.'}],null);
T('U4 a sentence found in two lines: NOT APPLIED, as base',r.items.some(z=>z.sid==='S1'&&z.kind==='NOT APPLIED'));
r=ap([{sid:'S1',rule:'E-VOID',line:seg,ans:'CHANGE',to:'Premise 2 is NOT VOID.'},{sid:'S2',rule:'E-VOID',line:'the charge adds a negation the quote does not make',ans:'CHANGE',to:'x'}]);
T('U5 two changes in one line: the second, whose text the first removed, is recorded as replaced, no item',!r.items.length&&/S1 replaces S2/.test(r.audit),r.audit.slice(0,300));
const W=ap([{sid:'S1',rule:'E-PREM',item:'premise listed against the challenger 2',line:raw.split('\n')[6],ans:'CHANGE',to:'CHALLENGER CONCEDED LINKS: 0 -- Premises 1 and 2 are spared.'},{sid:'S2',rule:'E-VOID',line:seg,ans:'CHANGE',to:'Premise 2 is NOT VOID.'}]);
T('U6 whole-line change first, sentence change second: the whole line stands, S2 recorded as replaced',/CHALLENGER CONCEDED LINKS: 0 -- Premises 1 and 2 are spared\./.test(W.text)&&!W.items.length);
// ---- replay: every stored send-back answer, base vs pkgSGA ----
const chg=[];let seen=0;
for(const run of ['33040','33060','33083','33107','33129','33149','33160','33197','33218']){const GR=L(run,'Gate_Record')||L(run,'Send_Back_Record'),PC=L(run,'Panel_Cure_Check');if(!GR||!PC)continue;
 for(const bb of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=bb.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^[SG]/.test(x.sid));seen+=its.length;
  const a=O.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null),c=N.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null);
  if(JSON.stringify(a)!==JSON.stringify(c)){const na=new Set(a.items.map(z=>z.sid)),nc=new Set(c.items.map(z=>z.sid));chg.push(run+' '+seat+': items no longer raised '+JSON.stringify([...na].filter(z=>!nc.has(z)))+', new '+JSON.stringify([...nc].filter(z=>!na.has(z)))+'; result '+a.result+' -> '+c.result+'; fields '+(JSON.stringify(a.fields)===JSON.stringify(c.fields)?'same':JSON.stringify(a.fields)+' -> '+JSON.stringify(c.fields)));}}}
console.log('  REPLAY: '+seen+' stored S and G answers; seats whose output changed:\n   '+(chg.join('\n   ')||'none'));fs.writeFileSync('pkgSGA/replay_SGA.txt',seen+' answers\n'+(chg.join('\n')||'none')+'\n');
const EXP=['33040 gemini: items no longer raised [], new ["S4"]','33129 gemini: items no longer raised ["S5"], new []','33129 chatgpt: items no longer raised ["S8","S9"], new []','33149 gemini: items no longer raised [], new ["S17","S18","S19","S20"]','33218 chatgpt: items no longer raised ["S20","S21"], new []','33218 sol: items no longer raised ["S18","S19"], new []'];
T('replay: exactly the 6 expected seats change, no result or field changes anywhere',seen>0&&chg.length===EXP.length&&EXP.every(e=>chg.some(s=>s.startsWith(e)))&&chg.every(s=>/result (\S+(?: \S+)?) -> \1; fields same/.test(s)));
// the new items are lines base destroyed: base wrote a label-less sentence over a labelled count line
{const PC=L('33149','Panel_Cure_Check'),GR=L('33149','Gate_Record');const bb=PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x).find(b=>b.payload.judge_seat==='gemini');const its=GR.sb_items.filter(x=>x.seat==='gemini'&&/^[SG]/.test(x.sid));
 const a=O.sbApply2024('gemini',bb.payload.verdict_raw,F(bb),its,null),c=N.sbApply2024('gemini',bb.payload.verdict_raw,F(bb),its,null);const has=(t,re)=>t.split('\n').some(l=>re.test(l));
 T('33149 gemini: base lost both count labels (no CONCEDED LINKS and no CHALLENGER CONCEDED LINKS line left); pkgSGA keeps both and refuses S17-S20 to the gate',!has(a.text,/^\s*\**\s*CONCEDED LINKS\s*:/)&&!has(a.text,/^\s*\**\s*CHALLENGER CONCEDED LINKS\s*:/)&&has(c.text,/^\s*\**\s*CONCEDED LINKS\s*:/)&&has(c.text,/^\s*\**\s*CHALLENGER CONCEDED LINKS\s*:/)&&c.applied.includes('S16'));}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
