// ASK 607 C2 (W4): controls, base (live 94b682a0) against target, through the real gateCure2024 of Gate Record (c1_607.cjs harness).
const fs=require('fs');const {mk,mkG,run,D,BE,TE}=require('./c1_607.cjs');const X=require('/mnt/project-files/ask549/w4/build2/gcx.js');
let fail=0;const ok=(b,m)=>{console.log((b?'PASS ':'FAIL ')+m);if(!b)fail++;};const S=x=>JSON.stringify(x);
const L={seat:'luna',jid:1122};const rows=D.log.filter(e=>e.id>=29283&&e.id<=29295);const G=mkG(rows);const REPLY=D.log.find(e=>e.id===29283).full_reply;
const st=r=>(r.cured?'CURED':'UNCURED')+', '+(r.live===false?'record-only':'counted')+', '+String(r.why).slice(0,110);
// (a) KEEP on a NOT APPLIED item; (b) a silent item: G3's gate line answered KEEP, or removed.
const lines=REPLY.replace(/\\n/g,'\n').split('\n');const g3=lines.findIndex(l=>/GATE:\s*G3\s*\|\|/.test(l));ok(g3>=0,'G3 gate line found in the stored reply');
const RK=lines.map((l,i)=>i===g3?l.replace(/CHANGE TO:\s*NONE/,'KEEP'):l).join('\n'),RS=lines.filter((l,i)=>i!==g3).join('\n');
for(const [lab,rep] of [['(a) KEEP on NOT APPLIED item G3',RK],['(b) silent item G3',RS]]){const b=run(BE,L,G,rep),t=run(TE,L,G,rep);const rb=b.res.find(r=>r.gid==='G3'),rt=t.res.find(r=>r.gid==='G3');
 console.log('   '+lab+': before '+st(rb)+' | after '+st(rt));ok(S(rb)===S(rt)&&(lab.includes('KEEP')?rb.cured:(!rb.cured&&rb.live!==false)),lab+': same row old and new ('+(lab.includes('KEEP')?'CURED':'UNCURED, counted')+')');}
// (c) an applied gate change: G1 and G2 (rows 29283, 29284, stored CURED); and every row other than G3 to G13 is byte-equal.
{const b=run(BE,L,G,REPLY),t=run(TE,L,G,REPLY);for(const gid of ['G1','G2']){const rb=b.res.find(r=>r.gid===gid),rt=t.res.find(r=>r.gid===gid);console.log('   (c) '+gid+': before '+st(rb)+' | after '+st(rt));ok(S(rb)===S(rt)&&rb.cured,'(c) applied gate change '+gid+': same row old and new, CURED');}
 const others=b.res.filter(r=>!/^G([3-9]|1[0-3])$/.test(r.gid)).map(r=>r.gid);ok(others.every(g=>S(b.res.find(r=>r.gid===g))===S(t.res.find(r=>r.gid===g))),'(c) every gate row other than G3 to G13 is byte-equal old and new: '+others.join(', '));}
// (d) a pkgPS and a pkgSGA refusal: still record-only with their own names (gateItems2024 stubbed with the refusal items, as test549).
{const mkS=f=>{const r=X(f,'Gate Record','gateCure2024',['gateItems2024']);return st=>new Function('$','gateItems2024',r.code+'\nreturn gateCure2024;')(()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}}),st);};
 const R1={items:[{sid:'G1',kind:'NOT APPLIED',why:'the change ... write the whole line with its label (pkgSGA)',to:'x',lines:['o'],rfs:'pkgSGA'},{sid:'G2',kind:'NOT APPLIED',why:'the change ... stays inside the premises its items name)',to:'x',lines:['o'],rfs:'pkgPS'}],applied:[]};
 const GG=[{gid:'G1',kind:'NOT APPLIED',src:'E-APPLY S9',sid:'S9',key:'S9|NA',live:true,lines:['o']},{gid:'G2',kind:'NOT APPLIED',src:'E-APPLY S10',sid:'S10',key:'S10|NA',live:true,lines:['o']}];
 const rep='GATE: G1 || CHANGE TO: CHALLENGER CONCEDED LINKS: 0 -- NONE || r\nGATE: G2 || CHANGE TO: CHALLENGER CONCEDED LINKS: 0 -- NONE || r';
 const go=f=>mkS(f)(()=>({items:[],R1,T1:''}))('sol62','',{},[],JSON.parse(S(GG)),rep,{});const b=go(BE),t=go(TE);
 for(const [gid,nm] of [['G1','pkgSGA'],['G2','pkgPS']]){const rb=b.res.find(r=>r.gid===gid),rt=t.res.find(r=>r.gid===gid);console.log('   (d) '+nm+': before '+st(rb)+' | after '+st(rt));ok(S(rb)===S(rt)&&!rt.cured&&rt.live===false&&rt.why.startsWith(nm+' refused the gate change'),'(d) a '+nm+' refusal: same row old and new, record-only, named '+nm);}}
// (e) row 31511 (luna, debate 26d9f86b, judgment 1134): a placement refusal stays counted.
{const E=JSON.parse(fs.readFileSync(__dirname+'/data607_31511.json','utf8'));const J=E.judgments[0];const row=E.log.find(e=>e.id===31511);const GG=mkG([row]);
 const F={verdict_tag:J.verdict_tag,defense_standing:J.defense_standing,challenge_standing:J.challenge_standing,conceded_links:J.conceded_links,challenger_conceded_links:J.challenger_conceded_links};
 const go=f=>mk(f,'Gate Record')('luna',J.verdict_raw,F,[],JSON.parse(S(GG)),row.full_reply,{R:{}});const b=go(BE),t=go(TE);const rb=b.res.find(r=>r.gid==='G1'),rt=t.res.find(r=>r.gid==='G1');
 console.log('   (e) 31511: before '+st(rb)+' | after '+st(rt));ok(S(rb)===S(rt)&&rt.live!==false&&!/^pkgFRM/.test(rt.why),'(e) row 31511: same row old and new, never record-only (on the stored final text today\'s engine applies the change; the 11-11 placement refusal is not reproduced, and the plan keeps 31511 out of the class)');}
console.log(fail?'FAILURES: '+fail:'C2 ALL PASS');
