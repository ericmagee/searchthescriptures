// pkgKWI rule-table test (W2's bar, Wall 3420): a re-render of every K-W copy from pkgRTB/rule_table.cjs equals pkgKWI's patched text.
// For each K-W render: the table's render with the pkgKWI clause removed is the old render; every node (library strip_RTB4_8 + live s68
// prompt nodes) carries the old render N times and its pkgKWI copy carries the new render the same N times and the old render 0 times.
const fs=require('fs');const {KW}=require('../pkgRTB/rule_table.cjs');
const X='; quote marks inside the sentence do not end the six words: quote across them, leaving them out';
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s68.json','utf8'));const N=W.nodes||W.data.nodes;
const plan=JSON.parse(fs.readFileSync('pkgKWI/plan_KWI.json','utf8'));
const pairs=[];const LB='pkgLIB/strip_RTB4_8/patched/',LP='pkgLIB/strip_KWI/patched/';
for(const f of fs.readdirSync(LB).filter(f=>f.endsWith('.js')))pairs.push([f,fs.readFileSync(LB+f,'utf8'),fs.readFileSync(LP+f,'utf8')]);
for(const n of Object.keys(plan.prompt))pairs.push([n,N.find(x=>x.name===n).parameters.jsCode,fs.readFileSync('pkgKWI/patched/'+n.replace(/[ ?]/g,'_')+'.js','utf8')]);
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const R={agreement:KW.render.agreement(),audit:KW.render.audit(),cureAskTail:KW.render.cureAskTail(),enforcer:KW.render.enforcer(),form:KW.forms.find(f=>f.id==='NOT HELD').text};
for(const [k,nr] of Object.entries(R)){const or=nr.split(X).join('');T(nr.includes(X)&&or!==nr,k+': render carries the clause once ('+(nr.split(X).length-1)+')');
 let tot=0,bads=[];for(const [f,b,p] of pairs){const cb=b.split(or).length-1,cp=p.split(nr).length-1,co=p.split(or).length-1;tot+=cb;if(cp!==cb||co!==0)bads.push(f+' old '+cb+' new '+cp+' old-left '+co);}
 T(tot>0&&!bads.length,k+': '+tot+' copies in base, each re-rendered in pkgKWI ('+bads.join('; ')+')');}
// every pkgKWI clause in every node belongs to a table render or to the cure rule sentence (not table-owned)
const CR='of what follows its verb (all of it when shorter'+X+'), or the item stays uncured';
let stray=0;for(const [f,,p] of pairs){let q=p;for(const r of [...Object.values(R),CR])q=q.split(r).join('');stray+=q.split(X).length-1;}
T(stray===0,'every pkgKWI clause sits inside a table render or the K-W cure-rule sentence (stray '+stray+')');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgKWI/test_KWI_table.txt',out.join('\n')+'\n');
