// pkgRFL test. Run from wall2024/ after build_RFL.cjs: node pkgRFL/test_RFL.cjs   (reads the repo and /mnt/project-files/wall2024/inputs only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgRFL/plan_RFL.json'));T('6 nodes; base (= pkgRSA/patched) and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgRFL/base/'+n.file))===n.base_sha&&sha(rd('pkgRSA/patched/'+n.file))===n.base_sha&&sha(rd('pkgRFL/patched/'+n.file))===n.final_sha));
const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf('\nfunction ',i+10));};
T('sbApply2024 is the same in all 6 patched nodes',new Set(plan.nodes.map(n=>sha(fn(rd('pkgRFL/patched/'+n.file))))).size===1);
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgRFL/base/Alternate_Merge.js'),N=lib('pkgRFL/patched/Alternate_Merge.js');
// ---- units on the 33197 shape ----
const FL='FORCED: D1 vs C1 -- MEANS [CR3]: "she is found with child before any coming together, so no knowing falls before the finding" -- ANSWER [DR3]: "So Matthew 1:18 dates the finding before the taking into the house, inside the espousal." -- FAILS: "hath betrothed a wife, and hath not taken her" -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"';
const COL='D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"';
const raw=t=>'COLLISION POINTS:\n'+t+'\n'+FL+'\nD2 vs C2 (Matthew 1:25): UNDERDETERMINED -- y -- GROUND: [L1] Matthew 1:25 "knew her not"\nKEYSTONE: D2 -- STANDS\nDEFENSE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCHALLENGE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCONCEDED LINKS: 0 -- none\nCHALLENGER CONCEDED LINKS: 0 -- none\nCLAUSE: HELD-1 -- n=2 w=0 k=0\nRESULT: UNDERDETERMINED -- r';
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const s31={sid:'S31',rule:'E-COL',item:'COLLISION D1 vs C1',line:FL,ans:'CHANGE',to:'RETRACTED: D1 vs C1'};
const b=O.sbApply2024('chatgpt',raw(COL),F0,[s31],null),n=N.sbApply2024('chatgpt',raw(COL),F0,[s31],null);
T('base: S31 NOT APPLIED, "no line form" (as stored in 33197)',!b.applied.includes('S31')&&b.items.some(z=>z.sid==='S31'&&/no line form/.test(z.why)));
T('pkgRFL: S31 applied; the FORCED line is gone and the D1 vs C1 collision line stays',n.applied.includes('S31')&&!n.items.length&&!n.text.includes('FORCED: D1 vs C1')&&n.text.includes(COL)&&n.rp.some(([o,t])=>o===FL&&t===''));
T('pkgRFL: result, fields and verdict unchanged ('+n.result+', '+n.tag+')',n.result===b.result&&JSON.stringify(n.fields)===JSON.stringify(b.fields)&&n.tag===b.tag);
const BRK='D1 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"';
const n2=N.sbApply2024('chatgpt',raw(BRK),{...F0,challenge_standing:'PROP-DEPENDENT'},[s31],null);
T('pkgRFL: a FORCED line under a collision still graded LINK BROKEN stays, NOT APPLIED with its reason',!n2.applied.includes('S31')&&n2.text.includes('FORCED: D1 vs C1')&&n2.items.some(z=>z.sid==='S31'&&/still graded CHALLENGER LINK BROKEN/.test(z.why)),JSON.stringify(n2.items.map(z=>z.why)));
const s1={sid:'S1',rule:'E-COL',item:'COLLISION D1 vs C1',line:BRK,ans:'CHANGE',to:COL};
const n3=N.sbApply2024('gemini',raw(BRK),{...F0,challenge_standing:'PROP-DEPENDENT'},[s1,{...s31,sid:'S2'}],null);
T('pkgRFL: the 33197 gemini order (S1 regrades the pair UNDERDETERMINED, S2 retracts its FORCED line): both applied',n3.applied.includes('S1')&&n3.applied.includes('S2')&&!n3.text.includes('FORCED: D1 vs C1')&&n3.text.includes(COL));
const n4=N.sbApply2024('chatgpt',raw(COL),F0,[{...s31,to:'RETRACTED: D2 vs C2'}],null),b4=O.sbApply2024('chatgpt',raw(COL),F0,[{...s31,to:'RETRACTED: D2 vs C2'}],null);
T('a RETRACTED for another pair than the FORCED line\'s is read as before (NOT APPLIED)',JSON.stringify(n4)===JSON.stringify(b4));
const n5=N.sbApply2024('chatgpt',raw(COL),F0,[{...s31,line:COL}],null),b5=O.sbApply2024('chatgpt',raw(COL),F0,[{...s31,line:COL}],null);
T('a RETRACTED on a collision line (not a FORCED line) is read as before',JSON.stringify(n5)===JSON.stringify(b5));
T('no RETRACTED change: byte-equal output',JSON.stringify(O.sbApply2024('g',raw(COL),F0,[],null))===JSON.stringify(N.sbApply2024('g',raw(COL),F0,[],null)));
// ---- replay: every stored send-back (S) and gate (G) item of 33040 to 33197, base vs pkgRFL ----
const D='/mnt/project-files/wall2024/inputs/';const L=(run,nn)=>{const f=D+run+'_'+nn+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const Fx=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
const out=[];let seen=0,rt=0,runs=[];
for(const run of ['33040','33060','33083','33107','33129','33149','33160','33175','33197']){const GR=L(run,'Gate_Record'),PC=L(run,'Panel_Cure_Check');if(!GR||!PC){out.push(run+': no saved Gate Record / Panel Cure Check input');continue;}runs.push(run);
 for(const bb of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=bb.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^[SG]/.test(x.sid));seen+=its.length;
  const R=its.filter(x=>x.ans==='CHANGE'&&/^\s*["“]?\s*RETRACTED\s*:/i.test(String(x.to||'')));rt+=R.length;
  const a=O.sbApply2024(seat,bb.payload.verdict_raw,Fx(bb),its,null),c=N.sbApply2024(seat,bb.payload.verdict_raw,Fx(bb),its,null);
  for(const x of R){const ap=c&&c.applied.includes(x.sid);const ni=c&&c.items.find(z=>z.sid===x.sid);out.push(run+' '+seat+' '+x.sid+' '+String(x.to).trim()+' on "'+String(x.line||'').slice(0,60)+'...": base '+(a&&a.applied.includes(x.sid)?'APPLIED':'NOT APPLIED')+' -> pkgRFL '+(ap?'APPLIED (FORCED line removed)':'NOT APPLIED ('+(ni?ni.why:'?')+')'));}
  if(JSON.stringify(a)!==JSON.stringify(c)){const f=(r)=>r?r.tag+' '+r.result+' D '+r.fields.defense_standing+' '+r.fields.conceded_links+' C '+r.fields.challenge_standing+' '+r.fields.challenger_conceded_links:'null';
   out.push('   '+run+' '+seat+' derived: base '+f(a)+' | pkgRFL '+f(c)+(f(a)===f(c)?'  (counts and result unchanged)':'  (CHANGED)')+'; NOT APPLIED items '+(a?a.items.length:0)+' -> '+(c?c.items.length:0));}}}
console.log('  REPLAY of runs '+runs.join(', ')+': '+seen+' stored S and G items, '+rt+' RETRACTED changes:\n   '+out.join('\n   '));fs.writeFileSync('pkgRFL/replay_RFL.txt',out.join('\n')+'\n');
T('replay ran on stored items, and 33197 is in it',seen>0&&runs.includes('33197'));
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
