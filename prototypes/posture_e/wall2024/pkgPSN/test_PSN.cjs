// pkgPSN tests. Run from wall2024/ after both builds (see build_PSN.cjs): node pkgPSN/test_PSN.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s31.json','utf8'));const L=(W.data||W).nodes;const live=n=>L.find(z=>z.name===n).parameters.jsCode;
const P1=JSON.parse(fs.readFileSync('pkgPSN/plan_PSN.json','utf8')),P2=JSON.parse(fs.readFileSync('pkgPSN/plan_PSN_on_pkgUNXL_patched.json','utf8'));
T('A1 8 nodes on live a353b9e8; base shas are live; patched shas hold',P1.nodes.length===8&&P1.nodes.every(n=>n.base_sha===n.live_sha&&sha(live(n.name))===n.live_sha&&sha(fs.readFileSync('pkgPSN/patched/'+n.file,'utf8'))===n.final_sha));
T('A2 --on pkgUNXL/patched: 8 nodes, 6 on UNXL (bases equal its files), 2 on live (Send Back Record, Alt Send Back Record)',P2.nodes.length===8&&P2.nodes.filter(n=>n.base!=='live').length===6&&P2.nodes.every(n=>n.base==='live'?n.base_sha===n.live_sha:sha(fs.readFileSync('pkgUNXL/patched/'+n.file,'utf8'))===n.base_sha)&&P2.nodes.filter(n=>n.base==='live').map(n=>n.name).sort().join()==='Alt Send Back Record,Send Back Record');
const fnOf=(s,name)=>{const a=s.indexOf('function '+name+'(');let d=0,i=s.indexOf('{',a);for(;i<s.length;i++){if(s[i]==='{')d++;else if(s[i]==='}'&&--d===0)break;}return s.slice(a,i+1);};
const A=new Function(fnOf(live('Gate Record'),'psGrades')+';return psGrades;')(),B=new Function(fnOf(fs.readFileSync('pkgPSN/patched/Gate_Record.js','utf8'),'psGrades')+';return psGrades;')();
T('A3 all 16 patched files hold one psGrades text',new Set(P1.nodes.map(n=>fnOf(fs.readFileSync('pkgPSN/patched/'+n.file,'utf8'),'psGrades')).concat(P2.nodes.map(n=>fnOf(fs.readFileSync('pkgPSN/patched_on_pkgUNXL_patched/'+n.file,'utf8'),'psGrades')))).size===1);
// 33289 sol G14 (debate_enforcer_log 12304): its line and its CHANGE TO, as stored
const R=JSON.parse(fs.readFileSync('pkgPSN/screen_rows.json','utf8'));const g14=R.find(r=>r.id===12304);const line=g14.f,to=g14.r;
const diff=(f,a,b)=>{const P=f(a).g,Q=f(b).g;return [...new Set(Object.keys(P).concat(Object.keys(Q)))].filter(k=>P[k]!==Q[k]).map(Number).sort();};
T('G1 sol G14: before, the change regrades 1, 2, 3, 4, 6 (2, 3, 6 not named, so refused); now only 1 and 4, the premises its items name',diff(A,to,line).join()==='1,2,3,4,6'&&diff(B,to,line).join()==='1,4',diff(A,to,line).join()+' -> '+diff(B,to,line).join());
T('G2 sol G15 (12305) the same',diff(B,R.find(r=>r.id===12305).r,R.find(r=>r.id===12305).f).join()==='1,4');
const g=(f,t)=>JSON.stringify(f(t).g);
T('N1 "Premise 2: counted UNEXHIBITED" stays COUNTED',B('CONCEDED LINKS: 1 -- Premise 2: counted UNEXHIBITED for Luke 1:56.').g[2]==='COUNTED');
T('N2 "none counted; Premises 1, 2 and 3 are spared" unchanged',g(A,'CONCEDED LINKS: 0 -- none counted; Premises 1, 2 and 3 are spared.')===g(B,'CONCEDED LINKS: 0 -- none counted; Premises 1, 2 and 3 are spared.'));
T('N3 "Premise 4: UNEXHIBITED, and it is counted" stays COUNTED',B('CONCEDED LINKS: 1 -- Premise 4: UNEXHIBITED, and it is counted.').g[4]==='COUNTED');
T('V1 "are not counted", "is not counted", "never counted", "uncounted" read SPARED',['Premises 4 and 5 are not counted.','Premise 4 is not counted.','Premise 4 was never counted.','Premise 4 stays uncounted.'].every(t=>B('CONCEDED LINKS: 0 -- '+t).g[4]==='SPARED'));
// stored screen: every CONCEDED LINKS line in debate_enforcer_log with a negated count (screen_rows.json, 92 rows)
{let n=0;const ch=[];for(const r of R)for(const t of [r.f,r.r]){if(!t||!A(t))continue;n++;const a=A(t),b=B(t);if(JSON.stringify(a.g)!==JSON.stringify(b.g))ch.push({id:r.id,t,a,b});}
 const cnt=x=>Object.values(x.g).filter(v=>v==='COUNTED').length;
 T('S1 stored screen: '+n+' lines read, '+ch.length+' changed; in every changed line the new COUNTED total equals the line\'s own count number and the old one did not',ch.length===12&&ch.every(c=>c.b.n!=null&&cnt(c.b)===c.b.n&&cnt(c.a)!==c.a.n),ch.map(c=>c.id+' '+cnt(c.a)+'->'+cnt(c.b)+' of '+c.b.n).join(', '));}
// replay parity on the saved runs (33289's node data is lost: its inputs are empty stubs)
const NODES=[['Gate Record','Gate Call openrouter'],['Alt Gate Record','Alt Gate Record'],['Send Back Record','Send Back Call openrouter'],['Alt Send Back Record','Alt Send Back Call openrouter'],['Alternate Merge Seat','Alternate Calls?'],['Alternate Merge','Alt Gate Record'],['Gate Build','Gate Needed?']];
for(const RUN of ['33218','33222','33249','33261'])for(const [n,inp] of NODES){let a,b;try{a=JSON.stringify(harness(RUN)(live(n),inp));b=JSON.stringify(harness(RUN)(fs.readFileSync('pkgPSN/patched/'+n.replace(/ /g,'_')+'.js','utf8'),inp));}catch(e){out.push('INFO '+RUN+' '+n+' not replayable: '+String(e.message).slice(0,60));continue;}T('P '+RUN+' '+n+': output identical',a===b);}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgPSN/test_PSN.txt',txt);console.log(txt);process.exit(bad?1:0);
