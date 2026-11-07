// pkgRSA test. Run from wall2024/: node pkgRSA/test_RSA.cjs   (reads the repo and /mnt/project-files/wall2024/inputs only)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgRSA/plan_RSA.json'));T('6 nodes; base (= pkgFCB/patched) and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgRSA/base/'+n.file))===n.base_sha&&sha(rd('pkgFCB/patched/'+n.file))===n.base_sha&&sha(rd('pkgRSA/patched/'+n.file))===n.final_sha));
const fn=s=>{const i=s.indexOf('function sbApply2024');return s.slice(i,s.indexOf('\nfunction ',i+10));};
T('sbApply2024 is the same in all 6 patched nodes',new Set(plan.nodes.map(n=>sha(fn(rd('pkgRSA/patched/'+n.file))))).size===1);
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgRSA/base/Alternate_Merge.js'),N=lib('pkgRSA/patched/Alternate_Merge.js');
// ---- the 33197 gemini shape: every collision line UNDERDETERMINED, equal standings and counts, RESULT still DEFENDER WINS ----
const RES0='RESULT: DEFENDER WINS -- The scriptures in the record support the defender\'s chain that "that which is conceived in her is of the Holy Ghost" (Matthew 1:20) and not of a man\'s knowing.';
const raw='COLLISION POINTS:\nD1 vs C1 (Matthew 1:18): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:18 "before they came together"\nD2 vs C2 (Matthew 1:25): UNDERDETERMINED -- y -- GROUND: [L1] Matthew 1:25 "knew her not"\nKEYSTONE: D1 -- STANDS\nDEFENSE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCHALLENGE STANDING: SELF-SUPPORTED -- L=2 c=0 -- z\nCONCEDED LINKS: 0 -- none\nCHALLENGER CONCEDED LINKS: 0 -- none\nCLAUSE: HELD-1 -- n=2 w=0 k=0\n'+RES0;
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const TO='RESULT: UNDERDETERMINED -- The scriptures in the record leave open whether "of the Holy Ghost" (Matthew 1:20) names the physical begetter or covenant origin beside "made of the seed of David according to the flesh" (Romans 1:3).';
const g2={sid:'G2',rule:'E-GATE',item:'RESULT DIFFERS',line:RES0,ans:'CHANGE',to:TO};
const b=O.sbApply2024('gemini',raw,F0,[g2],null),n=N.sbApply2024('gemini',raw,F0,[g2],null);
T('33197 shape: the derived result is UNDERDETERMINED in base and patched ('+b.result+', '+n.result+')',b.result==='UNDERDETERMINED'&&n.result==='UNDERDETERMINED');
T('33197 shape: base does not count G2 applied ('+JSON.stringify(b.applied)+') and raises no RESULT DIFFERS',!b.applied.includes('G2')&&!b.items.some(z=>z.kind==='RESULT DIFFERS'));
T('33197 shape: pkgRSA counts G2 applied ('+JSON.stringify(n.applied)+')',n.applied.includes('G2')&&!n.items.length);
T('33197 shape: pkgRSA writes the judge\'s own RESULT line over the old one',n.rp.some(([o,t])=>o===RES0&&t===TO),JSON.stringify(n.rp.map(([o,t])=>[o.slice(0,30),t.slice(0,60)])));
const g2b={...g2,to:RES0};const n2=N.sbApply2024('gemini',raw,F0,[g2b],null),b2=O.sbApply2024('gemini',raw,F0,[g2b],null);
T('a RESULT change that still differs from the derived result: RESULT DIFFERS in base and patched, not applied',n2.items.some(z=>z.kind==='RESULT DIFFERS'&&z.sid==='G2')&&!n2.applied.includes('G2')&&JSON.stringify(b2.items)===JSON.stringify(n2.items)&&JSON.stringify(b2.rp)===JSON.stringify(n2.rp));
const OLD='RESULT: UNDERDETERMINED -- an older reason.';const raw4=raw.replace(RES0,OLD);const g3={...g2,line:OLD,to:'RESULT: UNDERDETERMINED -- a new reason in the judge\'s words.'};const n3=N.sbApply2024('gemini',raw4,F0,[g3],null),b3=O.sbApply2024('gemini',raw4,F0,[g3],null);
T('a RESULT change that keeps the derived result and rewrites the reason: base leaves the old line and G2 unapplied; pkgRSA applies it and writes the judge\'s line',!b3.applied.includes('G2')&&!b3.rp.some(([o])=>o===OLD)&&n3.result==='UNDERDETERMINED'&&n3.applied.includes('G2')&&n3.rp.some(([o,t])=>o===OLD&&t===g3.to));
T('no RESULT change: base and patched give the same rp and items',(()=>{const a=O.sbApply2024('g',raw,F0,[],null),c=N.sbApply2024('g',raw,F0,[],null);return JSON.stringify(a)===JSON.stringify(c);})());
// ---- replay: every stored send-back (S) and gate (G) item of 7 runs, base vs pkgRSA ----
const D='/mnt/project-files/wall2024/inputs/';const L=(run,nn)=>{const f=D+run+'_'+nn+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const F=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
const chg=[];let seen=0,res=0;
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const GR=L(run,'Gate_Record'),PC=L(run,'Panel_Cure_Check');if(!GR||!PC)continue;
 for(const bb of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=bb.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^[SG]/.test(x.sid));seen+=its.length;res+=its.filter(x=>/^\s*["“]?\s*RESULT\s*:/i.test(String(x.to||''))&&x.ans==='CHANGE').length;
  const a=O.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null),c=N.sbApply2024(seat,bb.payload.verdict_raw,F(bb),its,null);
  if(JSON.stringify(a)!==JSON.stringify(c))chg.push(run+' '+seat+': applied '+JSON.stringify(a&&a.applied)+' -> '+JSON.stringify(c&&c.applied)+'; result '+(a&&a.result)+' -> '+(c&&c.result));}}
console.log('  REPLAY: '+seen+' stored S and G items ('+res+' RESULT changes); runs whose output changed:\n   '+(chg.join('\n   ')||'none'));fs.writeFileSync('pkgRSA/replay_RSA.txt',(chg.join('\n')||'none')+'\n');
T('replay ran on stored items',seen>0);
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
