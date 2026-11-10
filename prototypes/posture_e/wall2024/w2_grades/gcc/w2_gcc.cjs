// W2 grade harness for pkgGCC (labels labels_GCC_w2.md). Gate Record on execution 34626 with plants; s110 vs candidate.
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json'),C:L(process.argv[2]||'/mnt/project-files/wall2024/parent_s110_GCC.json')};
const src=(s,n)=>{const w=W[s];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD0=(X.data||X).resultData.runData;const cl=x=>JSON.parse(JSON.stringify(x));
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const GR='Gate Record',GC='Gate Call openrouter',SB='Send Back Record';
const CNT=s=>'[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: luna; ITEMS: '+s+' (E-UNG COLLISION D2 (pressed: [DR2] premise 2): the CHANGE TO has no graded D2 vs C<j> line); counted in drv_uncured. REVIEW THIS ROW.]';
const plant=(o)=>{const rd=cl(RD0);const sb=rd[SB][0].data.main[0][0].json;const k=sb.bodies.findIndex(b=>JSON.parse(b).payload.judge_seat===(o.seat||'luna'));const b=JSON.parse(sb.bodies[k]);
 if(o.line){b.payload.verdict_raw+='\n'+o.line;if(o.add!==false)b.payload.drv_uncured=(b.payload.drv_uncured||0)+1;}sb.bodies[k]=JSON.stringify(b);
 if(o.reply){const m=rd[GC][0].data.main[0][0].json.choices[0].message;m.content=o.reply(m.content);}return rd;};
const G=async(s,rd)=>{const a=await run(src(s,GR),GR,rd);if(a&&a.err)return {err:a.err};const o=a[0];const drv=o.bodies.map(b=>{const p=JSON.parse(b).payload;return p.judge_seat+':'+p.drv_uncured;}).join(' ');
 const g1=(o.gate_rows||[]).filter(r=>/^G1 /.test(r.item)&&r.seat==='luna').map(r=>r.cure_status+' '+String(r.cure_reason).slice(-60)).join('');const off=o.bodies.some(b=>/send-back count comes off/.test(JSON.parse(b).payload.verdict_raw));return {o,drv,g1,off};};
const G1KEEP=t=>t.replace(/GATE: G1 \|\| CHANGE TO: [^\n]*/,'GATE: G1 || KEEP || [CR3] says the narrowed motive is kept as it stands.');
const G1OTHER=t=>t.replace('GATE: G1 || CHANGE TO: D2 vs C1 (Matthew 1:19)','GATE: G1 || CHANGE TO: D5 vs C4 (Matthew 1:19)');
(async()=>{const a0=await G('s110',RD0),c0=await G('C',RD0);T(nt(a0.o)===nt(RD0[GR][0].data.main[0][0].json),'G0 s110 rerun equals stored');T(nt(c0.o)===nt(a0.o),'C1 34626 as stored: candidate Gate Record output equals s110');
 const P={C2:{line:CNT('S10')},C3:{line:CNT('S10'),reply:G1KEEP},C4:{line:CNT('S10'),reply:G1OTHER},C5:{line:CNT('S99')},C6:{line:CNT('S10').replace('SEAT: luna','SEAT: sol'),add:true},C7:{line:CNT('S10').replace('counted in drv_uncured','RECORD-ONLY, not counted')}};
 const R={};for(const [k,o] of Object.entries(P)){const rd=plant(o);R[k]={s:await G('s110',rd),c:await G('C',rd)};console.log('-- '+k+'  s110 '+R[k].s.drv+' | C '+R[k].c.drv+' | G1 '+R[k].c.g1+(R[k].c.off?' | count-off note':''));}
 const d=k=>+R[k].s.drv.split(' ')[0].split(':')[1]-(+R[k].c.drv.split(' ')[0].split(':')[1]);
 T(d('C2')===1,'C2 G1 CHANGE applied: count comes off (luna -'+d('C2')+')');T(d('C3')===0,'C3 G1 KEEP (change stays unapplied): count stays (luna -'+d('C3')+')');T(d('C4')===0,'C4 G1 change not applied: count stays');
 for(const k of ['C5','C6','C7'])T(R[k].s.drv===R[k].c.drv,k+' count stays ('+R[k].c.drv+')');
 console.log(ok+' OK, '+bad+' FAIL');})();
