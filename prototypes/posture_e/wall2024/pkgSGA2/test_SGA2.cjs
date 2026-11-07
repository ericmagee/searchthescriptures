// pkgSGA2 test. Run from wall2024/: node pkgSGA2/test_SGA2.cjs   (reads the repo and /mnt/project-files/wall2024/inputs only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgSGA2/plan_SGA2.json'));T('6 nodes; base = pkgSGA/patched; shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgSGA2/base/'+n.file))===n.base_sha&&sha(rd('pkgSGA/patched/'+n.file))===n.base_sha&&sha(rd('pkgSGA2/patched/'+n.file))===n.final_sha));
const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf('\nfunction ',i+10));};
T('sbApply2024 is the same in all 6 patched nodes, and nothing outside it changes',new Set(plan.nodes.map(n=>sha(fn(rd('pkgSGA2/patched/'+n.file))))).size===1&&plan.nodes.every(n=>{const b=rd('pkgSGA2/base/'+n.file),p=rd('pkgSGA2/patched/'+n.file);return b.replace(fn(b),'')===p.replace(fn(p),'');}));
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgSGA2/base/Alternate_Merge.js'),N=lib('pkgSGA2/patched/Alternate_Merge.js');
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:1};
const mk=l=>'COLLISION POINTS:\nKEYSTONE: D1 -- STANDS\nCONCEDED LINKS: 0 -- none\n'+l+'\nCLAUSE: HELD-1 -- n=2 w=0 k=0\nRESULT: UNDERDETERMINED -- r';
const run=(l,to,M)=>(M||N).sbApply2024('u',mk(l),F0,[{sid:'S1',rule:'E-PREM',item:'premise listed against the challenger 2',line:l,ans:'CHANGE',to}],null);
const L1='CHALLENGER CONCEDED LINKS: 1 -- Premise 1 is spared. Premise 2: UNEXHIBITED, its block gives no [L3].';
let r=run(L1,'Premise 2 is spared: its block gives [L3].');
T('U1 out of the count (UNEXHIBITED to spared): NOT APPLIED, the line stays',r.items.some(z=>z.sid==='S1'&&/out of the CHALLENGER CONCEDED LINKS count/.test(z.why))&&r.text.includes(L1),JSON.stringify(r.items).slice(0,200));
T('U1b pkgSGA applied it, leaving "1" beside no counted premise',run(L1,'Premise 2 is spared: its block gives [L3].',O).text.includes('CHALLENGER CONCEDED LINKS: 1 -- Premise 1 is spared. Premise 2 is spared'));
const L2='CHALLENGER CONCEDED LINKS: 0 -- Premise 1 is spared. Premise 2 is spared: its block gives [L3].';
r=N.sbApply2024('u',mk(L2),{...F0,challenger_conceded_links:0},[{sid:'S1',rule:'E-PREM',item:'premise listed against the challenger 2',line:L2,ans:'CHANGE',to:'Premise 2: UNEXHIBITED, its block gives no [L3].'}],null);
T('U2 into the count (spared to UNEXHIBITED): NOT APPLIED, the line stays',r.items.some(z=>z.sid==='S1'&&/into the CHALLENGER CONCEDED LINKS count/.test(z.why))&&r.text.includes(L2),JSON.stringify(r.items).slice(0,200));
const L3='CHALLENGER CONCEDED LINKS: 0 -- Premise 1 is spared. Premise 2 is VOID (Commitment 6): the charge adds a word.';
r=N.sbApply2024('u',mk(L3),{...F0,challenger_conceded_links:0},[{sid:'S1',rule:'E-PREM',item:'premise listed against the challenger 2',line:L3,ans:'CHANGE',to:'Premise 2 is NOT VOID and is spared.'}],null);
T('U3 VOID to NOT VOID (the 33218 case) moves nothing: applied',!r.items.length&&r.text.includes('Premise 2 is NOT VOID and is spared.'));
// ---- replay: every stored answer, pkgSGA vs pkgSGA2 ----
const D='/mnt/project-files/wall2024/inputs/';const L=(run,nn)=>{const f=D+run+'_'+nn+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const F=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
const chg=[];let seen=0;
for(const rn of ['33040','33060','33083','33107','33129','33149','33160','33197','33218']){const GR=L(rn,'Gate_Record')||L(rn,'Send_Back_Record'),PC=L(rn,'Panel_Cure_Check');if(!GR||!PC)continue;
 for(const bb of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=bb.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^[SG]/.test(x.sid));seen+=its.length;
  const a=O.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null),c=N.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null);
  if(JSON.stringify(a)!==JSON.stringify(c)){const na=new Set(a.items.map(z=>z.sid));const nw=c.items.filter(z=>!na.has(z.sid));chg.push(rn+' '+seat+': new '+JSON.stringify(nw.map(z=>z.sid))+' ('+nw.map(z=>z.why).join('; ').slice(0,200)+'); result '+a.result+' -> '+c.result);}}}
console.log('  REPLAY: '+seen+' stored S and G answers; seats whose output changed:\n   '+(chg.join('\n   ')||'none'));fs.writeFileSync('pkgSGA2/replay_SGA2.txt',seen+' answers\n'+(chg.join('\n')||'none')+'\n');
T('replay: only 33149 gemini S16 changes (Premise 1 UNEXHIBITED to SPARED under "CONCEDED LINKS: 2"), result unchanged; 33218 unchanged',seen===474&&chg.length===1&&/^33149 gemini: new \["S16"\] \(the change moves premise 1 out of the CONCEDED LINKS count/.test(chg[0])&&/result DEFENDER WINS -> DEFENDER WINS/.test(chg[0]));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
