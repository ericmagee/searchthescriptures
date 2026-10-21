// BB-6904 revision 8, step 3 (7206): the verdict table. Stored text only, no model call.
// Each judge's DEFENDER LINK BROKEN lines are tested for a ground under the rule the judge was given; a line with no
// ground is removed and the link graded under the remaining rules (the rulebook's ladder, first match wins).
// Usage: node verdict_table.cjs <five.json> <mod_new.js> <rule_b_rows comma list, e.g. 27259,27433>
// five.json keys: dr1/dr2/dlink = defender rounds CR1/CR2/CR3; cr1/cr2/clink = challenger rounds DR1/DR2/DR3.
const fs=require('fs');const [F,MN,RB]=process.argv.slice(2);const D=JSON.parse(fs.readFileSync(F,'utf8'));const N=require(MN);
const ruleB=new Set(String(RB||'').split(',').filter(Boolean));
const norm=s=>String(s||'').replace(/\s+/g,' ').toLowerCase();
const text=raw=>{const h=String(raw||'').split('\n\n[AUDIT')[0];try{return JSON.parse(h).reasoning||h;}catch(e){return h;}};
const keys=t=>new Set(N.cureRefs(String(t||'')).map(x=>x.key));
const QT=/"([^"]{15,})"|“([^”]{15,})”|'([^']{15,})'|‘([^’]{15,})’/g;
function judge(r,seat,raw){
 const t=text(raw);const L=t.split('\n');const g=(re)=>{const m=t.match(re);return m?m:null;};
 const cl=g(/CLAUSE:\s*\**\s*(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)\s*\**\s*[-–—]+\s*n\s*=\s*(\d+)\s*w\s*=\s*(\d+)\s*k\s*=\s*(\d+)/i);
 const res=(g(/RESULT:\s*\**\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;
 const ks=g(/KEYSTONE:\s*\**\s*D(\d+)\s*[-–—]+\s*(WITHDRAWN|BROKEN|STANDS)/);
 const ds=(g(/DEFENSE STANDING:\s*\**\s*(SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED)/)||[])[1]||null;
 const cs=(g(/CHALLENGE STANDING:\s*\**\s*(SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED)/)||[])[1]||null;
 const tag0=(t.trim().match(/^\W*(HELD|PARTIAL|BROKEN)\b/)||[])[1]||null;const tag=tag0||(cl?(cl[1].startsWith('BROKEN')?'BROKEN':cl[1].startsWith('PARTIAL')?'PARTIAL':'HELD'):null);
 const press=norm(r.cr1)+' || '+norm(r.cr2);const pk=new Set([...keys(r.cr1),...keys(r.cr2)]);const ck=keys(r.clink);
 const lines=[];let chBroken=0;
 L.forEach((l,i)=>{if(/CHALLENGER LINK BROKEN/.test(l)&&/^\W*D?C?\d*.*vs/.test(l))chBroken++;
  if(!(l.includes('DEFENDER LINK BROKEN')&&/^\W*D\d+\s*(:\s*D\d+\s+)?vs|^\W*D\d+:\s*D\d+\s+vs/.test(l.replace(/^\W*(D\d+):\s*/,'$1 ').replace(/^\W*D\d+\s+(D\d+\s+vs)/,'$1'))))return;
  let blk=l;for(const m of L.slice(i+1,i+4)){if(/^\W*D\d+(\s+vs|:)/.test(m)||/^[A-Z][A-Z -]{6,}:?(\s|$)/.test(m.trim())||!m.trim())break;blk+='\n'+m;}
  const id=(l.match(/D(\d+)\s+vs\s+C(\d+|none)/i)||[]);
  const par=(l.match(/\(([^)]*)\)/)||[])[1]||'';const wk=[...keys(par)];
  const named=/\bDR[12]\b/.test(blk);let qhit=0;for(const m of blk.matchAll(QT)){const q=m[1]||m[2]||m[3]||m[4];if(press.includes(norm(q)))qhit++;}
  const meetsB=named&&qhit>0;
  const late=wk.length>0&&wk.every(k=>!pk.has(k)&&ck.has(k));
  const cls1=N.cureNamed(l,r.dlink||'').map(x=>x.ref);
  const why=[];if(ruleB.has(row(r))&&!meetsB)why.push('no pressing sentence and round (rule b)');if(late)why.push('witness first raised in DR3, after the answering round (rule c)');
  lines.push({D:id[1]?+id[1]:null,C:id[2]||null,par,meetsB,named,qhit,late,cls1,why,removed:why.length>0});});
 const n=cl?+cl[2]:null,w=cl?+cl[3]:null,k=cl?+cl[4]:null;
 const brokenD=new Set(lines.map(x=>x.D));const keptD=new Set(lines.filter(x=>!x.removed).map(x=>x.D));
 const keptD1=new Set(lines.filter(x=>!x.removed&&!x.cls1.length).map(x=>x.D));
 const ladder=(k2)=>{if(n===null)return null;if(k2>=1)return'BROKEN-1';if(2*w>n||(ks&&ks[2]==='WITHDRAWN'))return'BROKEN-2';if(w>=1)return'PARTIAL-1';if(ds==='COLLAPSED')return'PARTIAL-2';return'HELD-1';};
 const tagOf=c=>c?(c.startsWith('BROKEN')?'BROKEN':c.startsWith('PARTIAL')?'PARTIAL':'HELD'):null;
 const resOf=tg=>tg==='BROKEN'?'CHALLENGER WINS':tg==='HELD'?((cs!=='SELF-SUPPORTED'||chBroken>0)?'DEFENDER WINS':'UNDERDETERMINED'):tg?'UNDERDETERMINED':null;
 const c2=ladder(keptD.size),c3=ladder(keptD1.size);
 return {seat,stored:{tag,clause:cl?cl[1]:null,n,w,k,res,ds,cs,keystone:ks?ks[1]+' '+ks[2]:null},brokenLinks:brokenD.size,lines,
  regrade:{k:keptD.size,clause:c2,tag:tagOf(c2),res:resOf(tagOf(c2))},regradeCls1:{k:keptD1.size,clause:c3,tag:tagOf(c3),res:resOf(tagOf(c3))}};}
const row=r=>r.tok.slice(5,10);
const panel=(tags)=>{const c={};for(const x of tags)if(x)c[x]=(c[x]||0)+1;const s=Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));const tot=tags.filter(Boolean).length;
 if(tot<2||(s[1]&&s[0][1]===s[1][1]))return{fv:'CONTESTED',out:'UNGRADED -- REVIEW',split:s.map(x=>x[1]).join('-')};
 return{fv:s[0][0],out:{HELD:'DEFENDER PREVAILS',BROKEN:'CHALLENGER PREVAILS',PARTIAL:'DEFENDER PREVAILS, WEAKENED'}[s[0][0]],split:(s.length===1?[s[0][1],0]:s.map(x=>x[1])).join('-')};};
const out=[];
for(const r of D){const js=[{seat:'single',raw:r.single}].concat((r.judges||[]).map(j=>({seat:j.seat,raw:j.raw})));
 const J=js.map(j=>judge(r,j.seat,j.raw));const P=J.filter(j=>j.seat!=='single');
 out.push({row:row(r),ruleB:ruleB.has(row(r)),judges:J,panelStored:panel(P.map(j=>j.stored.tag)),panelRegrade:panel(P.map(j=>j.regrade.tag)),panelRegradeCls1:panel(P.map(j=>j.regradeCls1.tag))});}
if(process.argv.includes('--json')){console.log(JSON.stringify(out,null,1));process.exit(0);}
for(const o of out){console.log('\n=== '+o.row+'  rule (b) given: '+(o.ruleB?'YES':'NO'));
 for(const j of o.judges){const s=j.stored;console.log(' '+j.seat.padEnd(8)+' STORED '+s.tag+' '+s.clause+' n='+s.n+' w='+s.w+' k='+s.k+' | '+s.res+' | def '+s.ds+' ch '+s.cs+' | keystone '+s.keystone);
  for(const l of j.lines)console.log('    D'+l.D+' vs C'+l.C+' ('+l.par.slice(0,60)+') namesDR1/2='+l.named+' quotesFound='+l.qhit+' lateDR3='+l.late+' CR3names=['+l.cls1.join(', ')+'] -> '+(l.removed?'REMOVED: '+l.why.join('; '):'kept'));
  console.log('    REGRADE (rules b, c): k='+j.regrade.k+' '+j.regrade.clause+' '+j.regrade.tag+' | '+j.regrade.res);
  console.log('    REGRADE (+ class 1 removed): k='+j.regradeCls1.k+' '+j.regradeCls1.clause+' '+j.regradeCls1.tag+' | '+j.regradeCls1.res);}
 console.log(' PANEL stored '+JSON.stringify(o.panelStored)+' | regrade '+JSON.stringify(o.panelRegrade)+' | regrade+class1 '+JSON.stringify(o.panelRegradeCls1));}
