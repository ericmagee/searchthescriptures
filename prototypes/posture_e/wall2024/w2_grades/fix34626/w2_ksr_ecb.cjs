// W2 grade of pkgKSR and pkgECB (W1, Wall 4219) on execution 34626, labels w2_grades/fix34626/labels_fix34626_w2.md (a83bd195).
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const W={s110:L('/mnt/project-files/wall2024/fetchback_live_s110.json')};for(const s of ['KSR','ECB','ALL'])W[s]=L('pkgKSR/parent_s110_'+s+'.json');
const src=(set,n)=>{const w=W[set];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;
const cl=x=>JSON.parse(JSON.stringify(x));const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
const U=s=>nt(s).replace(/\\\\n/g,'\n').replace(/\\n/g,'\n');
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const KS=o=>[...U(o).matchAll(/KEYSTONE: D(\d+) -- (STANDS|BROKEN)/g)].map(m=>'D'+m[1]+' '+m[2]);
const cnt=(a,re)=>(U(a).match(re)||[]).length;
const BRK=/BROKEN BY A CONFIRMED CLOSING CONTRADICTION/;
const items=o=>(Array.isArray(o)?o:[]).flatMap(j=>(j.items||[]).map(i=>JSON.stringify(i)));
(async()=>{
 const PC='Panel Cure Check',SB='Send Back Build';
 // P2.1 34626 as stored
 const base=await run(src('s110',PC),PC,RD);T(nt(base)===nt(RD[PC][0].data.main[0].map(x=>x.json)),'H0 s110 Panel Cure Check rerun equals stored output');
 const out={};for(const s of ['KSR','ECB','ALL'])out[s]=await run(src(s,PC),PC,RD);
 const perSeat=o=>o.err?o.err:o[0].bodies.map((b,i)=>{const t=String(b).replace(/\\n/g,'\n');const m=[...t.matchAll(/(?:^|\n|")\s*KEYSTONE: D6 -- (STANDS|BROKEN)/g)].map(x=>x[1]);return o[0].summary[i].seat+':'+m.join('/');});
 console.log('   final KEYSTONE D6 per output item: s110',perSeat(base),'KSR',perSeat(out.KSR),'ECB',perSeat(out.ECB),'ALL',perSeat(out.ALL));
 T(cnt(out.KSR,/KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION/g)>0,'P2.1 KSR writes the engine KEYSTONE BROKEN line');
 const res=o=>[...U(o).matchAll(/\nRESULT: [^\n]{0,60}|\nCLAUSE: [^\n]{0,40}|\nDEFENSE STANDING: [A-Z-]+/g)].map(m=>m[0]).join('|');
 T(res(base)===res(out.KSR),'P2.1 RESULT, CLAUSE, DEFENSE STANDING unchanged by KSR');
 T(nt(out.ECB)===nt(base),'ECB alone leaves Panel Cure Check unchanged');
 T(nt(out.ALL)===nt(out.KSR),'ALL = KSR on Panel Cure Check');
 // plants on the closing-enforcer record: P2.2 break on D3 (non-keystone), P2.3 no closing break
 const cer=RD['Close Enforcer Record'];const plant=f=>{const r=cl(RD);const j=r['Close Enforcer Record'][0].data.main[0][0].json;f(j.cec);return r;};
 const r22=plant(c=>{c.confirmed.forEach(x=>x.link=3);c.rows.forEach(x=>x.link=3);});
 const b22=await run(src('s110',PC),PC,r22),k22=await run(src('KSR',PC),PC,r22);
 console.log('   P2.2 KEYSTONE D6 s110',perSeat(b22),'KSR',perSeat(k22),'break lines on D3:',cnt(k22,/LINK 3 BROKEN BY A CONFIRMED/g));
 T(!b22.err&&!k22.err&&cnt(k22,/KEYSTONE: D6 -- BROKEN -- LINK/g)===0&&nt(k22).replace(/K-RECHK[^\]]*\]/g,'')===nt(b22).replace(/K-RECHK[^\]]*\]/g,''),'P2.2 break on non-keystone D3: KSR writes no KEYSTONE change, output equals s110');
 const r23=plant(c=>{c.confirmed=[];c.rows=[];c.none=true;});
 const b23=await run(src('s110',PC),PC,r23),k23=await run(src('KSR',PC),PC,r23);
 console.log('   P2.3 KEYSTONE D6 s110',perSeat(b23),'KSR',perSeat(k23));
 T(!b23.err&&nt(k23)===nt(b23),'P2.3 no closing break: KSR output equals s110 (judge keystones as written)');
 // ECB
 const sb0=await run(src('s110',SB),SB,RD);T(nt(sb0)===nt(RD[SB][0].data.main[0].map(x=>x.json)),'H1 s110 Send Back Build rerun equals stored output');
 const sb={};for(const s of ['KSR','ECB','ALL'])sb[s]=await run(src(s,SB),SB,RD);
 const strip=x=>x.replace(/"id":"[^"]*"/g,'').replace(/\bS\d+\b/g,'S#');const I0=items(sb0),IE=items(sb.ECB);const IEs0=IE.map(strip);const gone=I0.filter(x=>!IEs0.includes(strip(x)));
 console.log('   items s110',I0.length,'ECB',IE.length,'removed',gone.length,'removed on break lines',gone.filter(x=>BRK.test(x)).length,'ECB items on break lines',IE.filter(x=>BRK.test(x)).length);
 const ns=U(sb.ECB.map(j=>j.sb_not_sent||[]));
 T(IE.filter(x=>BRK.test(x)).length===0,'P1.1 no item on a closing-break line is sent');
 T(gone.length===I0.length-IE.length&&gone.every(x=>BRK.test(x)),'P1.1 removed items: '+gone.length+', all on closing-break lines');
 const IEs=IE.map(strip);const keep=I0.filter(x=>!BRK.test(x)).map(strip);
 T(keep.length===IEs.length&&keep.every((x,i)=>x===IEs[i]),'P1.1 items not on a break line equal s110 ('+keep.length+'), S numbers aside');
 T(cnt(sb.ECB.map(j=>j.sb_not_sent||[]),/pkgECB/g)>=gone.length,'P1.1 each removed item listed in sb_not_sent ('+cnt(sb.ECB.map(j=>j.sb_not_sent||[]),/pkgECB/g)+')');
 T(nt(sb.KSR)===nt(sb0),'KSR alone leaves Send Back Build unchanged');T(nt(sb.ALL)===nt(sb.ECB),'ALL = ECB on Send Back Build');
 // P1.2: judge's own D6 break line without the engine AUDIT text: strip the AUDIT text from every node output the build reads
 const r12=cl(RD);const s12=JSON.stringify(r12).replace(/ -- \[AUDIT: LINK (\d+) BROKEN BY A CONFIRMED CLOSING CONTRADICTION[^\]]*\]/g,' -- the judge grades this link broken (planted)');
 const R12=JSON.parse(s12);const p0=await run(src('s110',SB),SB,R12),pE=await run(src('ECB',SB),SB,R12);
 console.log('   P1.2 items s110',items(p0).length,'ECB',items(pE).length,'remaining AUDIT break text in plant:',(s12.match(BRK)||[]).length);
 T(!pE.err&&items(pE).length===items(p0).length&&nt(pE)===nt(p0),'P1.2 judge-written D6 break lines (no engine AUDIT): ECB sends them exactly as s110');
 // P1.3: judge copies the AUDIT phrase into reasoning text but its grade line is its own
 console.log(ok+' OK, '+bad+' FAIL');})();
// Alt copies: rerun Alt Send Back Build on 34626 (luna's alternate path), and diff the three changed sources
(async()=>{const n='Alt Send Back Build';const {rebuild}=require('../../pkgLIB/unpack.cjs');
 const a=await run(src('s110',n),n,RD),b=await run(src('ECB',n),n,RD);console.log('ALT',n,'s110 items',a.err||items(a).length,'ECB items',b.err||items(b).length,'equal',nt(a)===nt(b));
 for(const m of ['Send Back Build','Alt Send Back Build','R2 Alt Send Back Build']){try{const x=src('s110',m),y=src('ECB',m);console.log('SRC',m,x.length,'->',y.length,'+'+(y.length-x.length));}catch(e){console.log('SRC',m,'n/a',e.message.slice(0,80));}}
})();
