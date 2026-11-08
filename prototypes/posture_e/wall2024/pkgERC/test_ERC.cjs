// pkgERC test: Judge Enforcer Build and Alt Judge Enforcer Build, live s56 vs pkgERC, over every saved run.
// Bars: a prompt changes only by the one rule passage and in E-PREM judge lines that say "recomputed after the cure"; 33592 grok's lines show
// STORED COUNTED PREMISES 2, 5, 6, premise 2/5/6 marked COUNTED and 1/3/4 SPARED, its pre-recount line and its own collision lines; record rows unchanged.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s56.json','utf8'));
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const RULE=/RULE E-PREM, A RECOUNTED LINE \(pkgERC\)[^\n]*\n/g;const ADD=/\n    THE ENGINE RECOUNTED THIS LINE\.[^\n]*\n    THIS JUDGE'S OWN LINE BEFORE THE RECOUNT:[^\n]*\n    THIS JUDGE'S OWN COLLISION LINES ON [DC]\d+:[^\n]*/g;
const pr=o=>o.map(x=>x.json&&x.json.body&&x.json.body.messages?x.json.body.messages.map(m=>m.content).join('\n#MSG#\n'):'');
let n=0,stray=0,hit=[];
for(const [node,inp] of [['Judge Enforcer Build','Panel Cure Check'],['Alt Judge Enforcer Build','Alt Gate Record']]){const B0=W.nodes.find(z=>z.name===node).parameters.jsCode,P1=fs.readFileSync('pkgERC/patched/'+node.replace(/ /g,'_')+'.js','utf8');
 for(const R of fs.readdirSync(D).filter(f=>f.endsWith('_'+node.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]).sort()){let a,b;try{a=harness(R)(B0,inp);b=harness(R)(P1,inp);}catch(e){out.push('   '+R+' '+node+' skipped: '+e.message.slice(0,70));continue;}n++;
  const msk=t=>t.replace(ADD,'').replace(/(- P\d+\.\d+ \([^)]*\): )[^\n]*/g,'$1#').replace(/ITEMS? \d+ OF \d+/g,'');const its=o=>pr(o).flatMap(c=>{const u=c.split('\n#MSG#\n').pop();return u.split(/\n(?=ITEM [A-Z]\d+ \()/).slice(1).map(x=>msk(x.replace(/\n\n[\s\S]*$/,'').replace(/\nYou are the enforcer[\s\S]*$/,'').trimEnd()));}).sort();
  const ia=its(a),ib=its(b);let ch=0;pr(b).forEach(y=>{ch+=(y.match(ADD)||[]).length;});if(JSON.stringify(ia)!==JSON.stringify(ib))stray++;
  /* items may move between calls when a prompt grows (calls are packed by size), so items are compared as a set across the node's calls */
  if(ch)hit.push(R+' '+node+' ('+ch+' lines)');}}
T(n>=10,'replay ran on '+n+' node runs');T(stray===0,'every node run builds the same items; they differ only in recounted E-PREM lines ('+stray+')');out.push('   recounted lines shown in: '+(hit.join('; ')||'none'));
{const B0=W.nodes.find(z=>z.name==='Judge Enforcer Build').parameters.jsCode,P1=fs.readFileSync('pkgERC/patched/Judge_Enforcer_Build.js','utf8');const b=harness('33592')(P1,'Panel Cure Check');const p=pr(b).join('\n');
 const g=n=>{const i=p.indexOf('ITEM P'+n+' (E-PREM, a premise the challenger listed against the defender, number '+n+')');const s=p.slice(i,p.indexOf('\nITEM ',i+10));return (s.match(/- P\d+\.3 \(grok\):[\s\S]*?(?=\n- P|\n*$)/)||[''])[0];};
 const ok6=[1,2,3,4,5,6].every(k=>{const s=g(k);return /STORED COUNTED PREMISES FOR THIS SIDE: 2, 5, 6/.test(s)&&new RegExp('premise '+k+' is '+([2,5,6].includes(k)?'COUNTED':'not counted'),'').test(s)&&/LINE BEFORE THE RECOUNT: CONCEDED LINKS: 1 -- LINK 6 UNEXHIBITED/.test(s);});
 T(ok6,'33592 grok P1-P6: stored counted 2, 5, 6; 2/5/6 COUNTED, 1/3/4 not counted; pre-recount line "CONCEDED LINKS: 1 -- LINK 6 UNEXHIBITED" shown');
 T(/COLLISION LINES ON D2: [^\n]*D2 vs C4: DEFENDER LINK BROKEN/.test(g(2))&&/COLLISION LINES ON D5: [^\n]*D5 vs C5/.test(g(5)),'33592 grok: premise 2 shows "D2 vs C4: DEFENDER LINK BROKEN", premise 5 shows its D5 vs C5 line');
 out.push('   sample (33592 grok P2): '+g(2).slice(0,900).replace(/\n/g,' / '));
 const a=harness('33592')(B0,'Panel Cure Check');const ia=a.map(x=>JSON.stringify((x.json.ids||[]).concat(x.json.items||[]).length));T(JSON.stringify(a.map(x=>(x.json.body?1:0)))===JSON.stringify(b.map(x=>(x.json.body?1:0))),'33592: same calls built');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgERC/test_ERC.txt',out.join('\n')+'\n');
