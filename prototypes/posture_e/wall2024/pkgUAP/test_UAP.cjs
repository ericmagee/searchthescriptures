// pkgUAP test. Run from wall2024/: node pkgUAP/test_UAP.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgUAP/plan_UAP.json'));T('6 nodes; base (pkgKWC/patched) and final shas match',plan.nodes.length===6&&plan.nodes.every(n=>sha(rd('pkgKWC/patched/'+n.file))===n.base_sha&&sha(rd('pkgUAP/patched/'+n.file))===n.final_sha));
const lib=p=>{const AM=rd(p);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgKWC/patched/Alternate_Merge.js'),N=lib('pkgUAP/patched/Alternate_Merge.js');const D='/mnt/project-files/wall2024/inputs/';
const L=(run,n)=>{const f=D+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(rd(f))[0];return (d.main||d.data.main)[0][0].json;};
const F=b=>({verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links});
const na=R=>R?R.items.filter(z=>z.kind==='NOT APPLIED').map(z=>z.sid):[];const chg=[];
for(const run of ['33040','33060','33083','33107','33129','33149','33160']){const GR=L(run,'Gate_Record'),PC=L(run,'Panel_Cure_Check');
 for(const b of PC.bodies.map(x=>typeof x==='string'?JSON.parse(x):x)){const seat=b.payload.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat&&/^S/.test(x.sid));
  const a=O.sbApply2024(seat,b.payload.verdict_raw,F(b),its,null),c=N.sbApply2024(seat,b.payload.verdict_raw,F(b),its,null);
  if(JSON.stringify(a&&a.rp)!==JSON.stringify(c&&c.rp)||JSON.stringify(na(a))!==JSON.stringify(na(c)))chg.push(run+' '+seat+': NOT APPLIED '+JSON.stringify(na(a))+' -> '+JSON.stringify(na(c))+'; fields '+JSON.stringify(a.fields)+' -> '+JSON.stringify(c.fields));
  if(run==='33160'&&seat==='gemini'){T('33160 gemini: S9, S11, S12, S13 (E-UNG, placeholder line) now applied onto D1 vs C6, D3 vs C4, D5 vs C3, D6 vs C1; S4 still refused',JSON.stringify(na(c))==='["S4"]'&&['D1 vs C6','D3 vs C4','D5 vs C3','D6 vs C1'].every(p=>c.rp.some(([o,n])=>o.startsWith(p)&&/STANDS/.test(o)&&n.startsWith(p)&&/UNDERDETERMINED/.test(n))));}}}
console.log('  REPLAY changes:\n   '+chg.join('\n   '));T('replay: the only change in 7 runs is 33160 gemini, and its verdict fields are unchanged (HELD)',chg.length===1&&/^33160 gemini/.test(chg[0]));
// units: a true missing line is added after the last collision line; a CHANGE TO for another link is still refused
const raw='COLLISION POINTS:\nD1 vs C1 (Matthew 1:16): UNDERDETERMINED -- x -- GROUND: [L1] Matthew 1:16 "Jacob begat Joseph"\nKEYSTONE: D1 -- STANDS\nRESULT: UNDERDETERMINED';
const F0={verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const add={sid:'S1',rule:'E-UNG',item:'COLLISION D3 (pressed: [DR2] premise 3)',line:'(no COLLISION POINTS line for D3)',ans:'CHANGE',to:'D3 vs C4 (Luke 1:35): UNDERDETERMINED -- y -- GROUND: [L1] Luke 1:35 "The Holy Ghost shall come upon thee"'};
const r1=N.sbApply2024('s',raw,F0,[add],null);T('unit: a pressed link with no line at all: the CHANGE TO is added after the last collision line',r1&&!na(r1).length&&r1.rp.some(([o,n])=>o.startsWith('D1 vs C1')&&n.split('\n')[1].startsWith('D3 vs C4')),JSON.stringify(r1&&r1.rp));
const r2=N.sbApply2024('s',raw,F0,[{...add,to:'D2 vs C4 (Luke 1:35): UNDERDETERMINED -- y -- GROUND: z'}],null);T('unit: a CHANGE TO for another link is refused as before',r2&&JSON.stringify(na(r2))==='["S1"]');
const r0=O.sbApply2024('s',raw,F0,[add],null);T('unit: base refuses the add',JSON.stringify(na(r0))==='["S1"]');
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
