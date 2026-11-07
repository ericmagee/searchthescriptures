// pkgKWR tests. Run from wall2024/ after the two builds (see build_KWR.cjs): node pkgKWR/test_KWR.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s28.json','utf8'));const L=(W.data||W).nodes;const live=n=>L.find(z=>z.name===n).parameters.jsCode;
const plan=JSON.parse(fs.readFileSync('pkgKWR/plan_KWR.json','utf8')),pl2=JSON.parse(fs.readFileSync('pkgKWR/plan_KWR_on_live.json','utf8'));const ua=JSON.parse(fs.readFileSync('pkgUNXA2/plan_UNXA2.json','utf8')).nodes;
T('A1 19 nodes; each base is the pkgUNXA2 final; patched shas hold',plan.nodes.length===19&&plan.nodes.every(n=>{const u=ua.find(z=>z.file===n.file);return u&&u.final_sha===n.base_sha&&sha(fs.readFileSync('pkgKWR/patched/'+n.file,'utf8'))===n.final_sha;}));
T('A2 --on-live: 19 nodes, each base is live 4f62e6cf',pl2.nodes.length===19&&pl2.nodes.every(n=>n.base_sha===n.live_sha&&sha(live(n.name))===n.live_sha));
{const cut=s=>s.replace(/const KWR_REF=[^\n]*?\*\/|\.replace\(KWR_REF,' '\)/g,'').replace("const fs0=(a>=0&&b>a?q.slice(a+1,b):q);","const fs0=a>=0&&b>a?q.slice(a+1,b):q;");
 T('A3 each patched node differs from its base only by the 3 KWR edits',plan.nodes.every(n=>cut(fs.readFileSync('pkgKWR/patched/'+n.file,'utf8'))===fs.readFileSync('pkgUNXA2/patched/'+n.file,'utf8')));}
// the reference regex and the run builder, taken from the patched node itself
const P=fs.readFileSync('pkgKWR/patched/Panel_Cure_Check.js','utf8');const REF=eval(P.match(/const KWR_REF=(\/.*?\/g);/)[1]);
const PK=P.slice(P.indexOf('if(KW_NH){'));const nwS=PK.match(/const nw=(s=>String\(s\|\|''\).*?\.filter\(Boolean\));/)[1],rnS=PK.match(/const __rn=(b0=>.*?\.join\(' '\)\));/)[1];const nw=eval(nwS),rn=eval(rnS);
const D=s=>s.replace(REF,' ').replace(/\s+/g,' ').replace(/\s+([.,;:])/g,'$1').trim();
T('R1 drops reference-only parentheses',D("I grant Isaiah's own children are signs (Isaiah 8:18).")==="I grant Isaiah's own children are signs."&&D('is said of men with fathers (Job 14:1, Matthew 11:11).')==='is said of men with fathers.'&&D("they came of Jacob's loins (46:26).")==="they came of Jacob's loins."&&D("David's seed in the flesh (Acts 2:30; Romans 1:3).")==="David's seed in the flesh."&&D('the spirit (1 John 4:2) confesses')==='the spirit confesses'&&D('a span (Luke 1:31–32) given')==='a span given');
T('R2 keeps other parentheses: "(as was supposed)", "([DR3])", "(Commitment 6)", "(cohabit conjugally)"',['being (as was supposed) the son','in ([DR3]) LINK 1','is VOID (Commitment 6): x','synerchomai G4905 (cohabit conjugally)'].every(s=>D(s)===s));
// 33276 chatgpt DEFENDER CR4 #10 (debate_results f2bd9ad3 drv_removed): the item line and the NOT HELD line as stored ( ) restored to [ ]
const line='[CR4] no link heading: "I grant Isaiah\'s own children are signs (Isaiah 8:18)."',st='NOT HELD: "Isaiah\'s own children are signs" does not withdraw the stated fulfilment.';
const runsOf=(q,ref)=>{const a=q.indexOf('"'),b=q.lastIndexOf('"');let f=a>=0&&b>a?q.slice(a+1,b):q;if(ref)f=f.replace(REF,' ');return rn(nw(f.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,'')));};
const hit=(runs,t)=>{const X=' '+nw(t).join(' ')+' ';return runs.some(r=>r&&X.includes(' '+r+' '));};
T('C1 33276 chatgpt #10: UNCURED before (runs hold "isaiah 8 18"), CURED now',!hit(runsOf(line,false),st)&&hit(runsOf(line,true),st),JSON.stringify(runsOf(line,true)));
T('C2 a NOT HELD that quotes nothing of the sentence still fails',!hit(runsOf(line,true),'NOT HELD: the fulfilment in Matthew is kept.'));
// replay: every K-W cure status, live vs patched_on_live (the KWR edits alone)
const NODES=[['Panel Cure Check','Panel Cure Needed?'],['Alternate Merge Seat','Alternate Calls?'],['Gate Record','Gate Call openrouter']];const walk=(o,f)=>{if(Array.isArray(o))o.forEach(v=>walk(v,f));else if(o&&typeof o==='object'){f(o);Object.values(o).forEach(v=>walk(v,f));}};
const kw=r=>{const m=new Map();walk(r,o=>{if(o.rule==='K-W'&&typeof o.status==='string'&&o.link)m.set([o.seat||'',o.link,o.n||''].join('|')+'|'+String(o.line||'').slice(0,80),o.status);});return m;};
const rows=[];const flips=[];
for(const RUN of ['33218','33222','33249','33261']){for(const [n,inp] of NODES){let a,b;try{a=harness(RUN)(live(n),inp);b=harness(RUN)(fs.readFileSync('pkgKWR/patched_on_live/'+n.replace(/ /g,'_')+'.js','utf8'),inp);}catch(e){rows.push(RUN+' '+n+': not replayable ('+String(e.message).slice(0,60)+')');continue;}
 const ka=kw(a),kb=kw(b);const fl=[...ka].filter(([k,v])=>kb.get(k)!==v).map(([k,v])=>k+' '+v+' -> '+kb.get(k));flips.push(...fl.map(f=>RUN+' '+n+': '+f));
 rows.push(RUN+' '+n+': K-W items '+ka.size+', CURED '+[...ka.values()].filter(v=>v==='CURED').length+' -> '+[...kb.values()].filter(v=>v==='CURED').length+', flips '+fl.length);
 if(!fl.length)T('P '+RUN+' '+n+': no K-W flip, output identical',JSON.stringify(a)===JSON.stringify(b));}}
{const r=harness('33261')(fs.readFileSync('pkgKWR/patched_on_live/Panel_Cure_Check.js','utf8'),'Panel Cure Needed?');const u=[];walk(r,o=>{if(o.rule==='K-W'&&o.status==='UNCURED')u.push(o.link);});
 T('N1 33261 sol K-W #4 and #9 (W3 2754: removed correctly) stay UNCURED; they are the only UNCURED K-W items of Panel Cure Check',u.length===2&&u.every(l=>/^DEFENDER CR3 LINK 1 #(4|9)$/.test(l)),u.join(' ; '));}
fs.writeFileSync('pkgKWR/replay_KWR.txt',rows.concat(['FLIPS: '+flips.length],flips).join('\n')+'\n');out.push(...rows.map(r=>'INFO '+r),'INFO flips: '+flips.length,...flips.map(f=>'INFO '+f));
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgKWR/test_KWR.txt',txt);console.log(txt);process.exit(bad?1:0);
