// pkgKW test. Run from wall2024/: node pkgKW/test_KW.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {execSync}=require('child_process');
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKW/plan_KW.json'));
T('22 nodes; base shas = '+plan.base+', final shas = pkgKW/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgKW/patched/'+n.file))===n.final_sha));
T('every node: K-W LIVE; both K-W marks state the forms and the LIVE rule; 19 cure nodes carry the NOT HELD cure',plan.nodes.every(n=>{const t=rd('pkgKW/patched/'+n.file);return t.includes("'K-W':'LIVE'")&&!t.includes("'K-W':'TRIAL'")&&t.split('or NOT HELD with a reason that quotes it. LIVE rule').length-1===2;})&&plan.nodes.filter(n=>rd('pkgKW/patched/'+n.file).includes('const KW_NH=true')).length===19);
// raise side
const P=require('./probe_KW.cjs');const gone=P.runs.flatMap(r=>r.gone.map(g=>r.run+' '+g)),add=P.runs.flatMap(r=>r.added);
T('raise: exactly 4 items go, the 4 false raises of the promotion read (33014 DR3 LINK 3 quoting the defender; 33020 CR2 heading; 33020 DR4 "concede none"; 33021 DR3 LINK 4 quoting the defender); none added',gone.length===4&&add.length===0&&/^33014 CHALLENGER DR3 LINK 3 #1/.test(gone[0])&&gone.some(g=>/^33020 DEFENDER CR2 no link heading #1/.test(g))&&gone.some(g=>/^33020 CHALLENGER DR4 no link heading #1/.test(g))&&gone.some(g=>/^33021 CHALLENGER DR3 LINK 4 #1/.test(g)));
// unit: the three skips, and a true withdrawal on a sentence heading is kept
{const AM=rd('pkgKW/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {kwLines421};')(()=>{throw 0},null);const n=t=>L.kwLines421('',{CR3:t}).items.filter(x=>x.rule==='K-W').map(x=>x.line);
 T('unit: "I concede none of the six." raises nothing',n('I add no witness, and I concede none of the six.').length===0);
 T('unit: a quoted grant of the other side raises nothing',n('The challenger grants, in his own words, "I grant the offer was refused."').length===0);
 T('unit: a title heading "## 0. What I concede, so the rest can stand" raises nothing',n('## 0. What I concede, so the rest can stand\nText.').length===0);
 T('unit: a heading line with a full withdrawal sentence still raises it',n('## LINK 6: NARROWED TO: Matthew 1:19 gives his standing. I drop "mercy" and drop "excludes."').length===1);
 T('unit: a plain grant still raises it',n('I grant the taking follows.').length===1);}
// cure side: whole-node cure replay vs pkgKC2
{const a=execSync('node corpus/replay_cure_node.cjs pkgKC2',{encoding:'utf8'}).split('\n').filter(l=>/^  \d/.test(l)),b=execSync('node corpus/replay_cure_node.cjs pkgKW',{encoding:'utf8'}).split('\n').filter(l=>/^  \d/.test(l));
 const nw=b.filter(l=>!a.includes(l));console.log(nw.map(l=>'   '+l.trim()).join('\n'));
 T('cure: the only new rows are K-W UNCURED -> CURED (NOT HELD with a quote): 12 rows; no other rule moves',nw.length===12&&nw.every(l=>/K-W\|.*\|UNCURED -> K-W\|.*\|CURED/.test(l)));}
// gate: pkgKW equals pkgKC2 on every fixture seat
{const mk=p=>{const AM=rd(p+'/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);};
 const G=(Lb,X,seat)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!b||!its.length)return null;const PT=Lb.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:Lb.ciRounds(PT),DL:Lb.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const R=Lb.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];const c=rep&&R.items.length?Lb.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};return JSON.stringify({G:R.items.map(g=>g.gid+g.kind+g.src+g.live),c:c.res.map(r=>r&&r.cured),n:c.uncured});};
 const A=mk('pkgKC2/patched'),B=mk('pkgKW/patched');let seats=0,diff=0;for(const f of fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f))){const X=JSON.parse(rd('corpus/'+f));for(const s of [...new Set(X.sb_items.map(x=>x.seat))]){seats++;if(G(A,X,s)!==G(B,X,s)){diff++;console.log('   gate differs '+f+' '+s);}}}
 T('gate: pkgKW equals pkgKC2 on all '+seats+' fixture seats',diff===0);}
console.log(ok+' OK, '+bad+' FAIL');
