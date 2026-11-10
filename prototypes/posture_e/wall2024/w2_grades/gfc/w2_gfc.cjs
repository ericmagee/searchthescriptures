// W2 grade harness for pkgGFC (labels labels_GFC_w2.md). Usage: node w2_grades/gfc/w2_gfc.cjs [candidate write file]
const fs=require('fs');const run=require('../../pkgKSR/run_node.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const L=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const S110='/mnt/project-files/wall2024/fetchback_live_s110.json';const W={s110:L(S110)};const CF=process.argv[2];if(CF)W.C=L(CF);
const src=(s,n)=>{const w=W[s];const c=w.nodes.find(x=>x.name===n).parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,w.nodes.find(x=>x.name==='Shared Library').parameters.jsCode):c;};
const LD=f=>{const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));return (X.data||X).resultData.runData;};
const EX={'34626':LD('ex34626_full.json'),'34299':LD('ex34299_full.json')};const cl=x=>JSON.parse(JSON.stringify(x));
const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const GR='Gate Record',GC='Gate Call openrouter';
const withReply=(RD,f)=>{const r=cl(RD);const m=r[GC][0].data.main[0][0].json.choices[0].message;m.content=f(m.content);return r;};
const rec=async(s,RD)=>{const a=await run(src(s,GR),GR,RD);if(a&&a.err)return {err:a.err};const o=a[0];return {sum:(o.gate_rows||[]).map(r=>r.item.replace(/ \(.*$/,'')+':'+r.cure_status).join(' | '),seat:JSON.stringify(((o.gate||{}).seats||[]).map(x=>x.seat+' cured'+x.cured+' unc'+x.uncured_counted)),o};};
const FL='FORCED: D4 vs C2 -- MEANS [DR2]: “the angel\'s own sign for ‘how’ is a conception by a husband\'s seed under God\'s power.” -- ANSWER [CR3]: “The ground is God\'s power, not a husband\'s seed.” -- FAILS: “not a husband\'s seed.”';
const P={ /* plants on luna's stored reply in 34626 */
 G1:t=>t,
 G2:t=>t.split('FORCED: D4 vs C2').join('FORCED: D4 vs C3'),
 G3a:t=>t.split('.”; FORCED:').join('.” -- FORCED:'),
 G3b:t=>t.split('.”; FORCED:').join('.”\nFORCED:'),
 G3c:t=>t.split('.”; FORCED:').join('.” | FORCED:'),
 G4reason:t=>{const m=/(GATE: G5 \|\| CHANGE TO: [\s\S]*?); (FORCED: [\s\S]*?) \|\| ([\s\S]*)$/.exec(t);return t.slice(0,m.index)+m[1]+' || '+m[2];}, /* W3 g5_form: reason field holds the FORCED line only */
 G4reasonText:t=>t.split('.”; '+FL+' ||').join('.” || '+FL+' '), /* FORCED line then the judge's reason sentence */
 G4both:t=>{const m=/(GATE: G5 \|\| CHANGE TO: [\s\S]*?; (FORCED: [\s\S]*?)) \|\| ([\s\S]*)$/.exec(t);return t.slice(0,m.index)+m[1]+' || '+m[2];},
 G5none:t=>t.split('; '+FL).join(''),
 G5quoted:t=>t.split('; '+FL).join('').split('[L1] Luke 1:36 “thy cousin').join('[L1] Luke 1:36 “FORCED: thy cousin'),
 G6keep:t=>t.replace(/GATE: G1 \|\| CHANGE TO: [^\n]*?\|\| /,'GATE: G1 || KEEP || FORCED: D2 vs C1 -- MEANS [DR2]: “x.” -- ANSWER [CR3]: “y.” -- FAILS: “y.” '),
 G6keep0:t=>P.G6keep(P.G5none(t)),G6und0:t=>P.G6und(P.G5none(t)),
 lowC:t=>t.split('; FORCED: D4').join('; forced: D4'),
 lowR:t=>P.G4reason(t).split('|| FORCED: D4').join('|| forced: D4'),
 G6und:t=>t.replace('fits the verse’s “of whom” and the angel’s “born of thee.”','fits the verse’s “of whom” and the angel’s “born of thee.”; FORCED: D3 vs C1 -- MEANS [DR2]: “x.” -- ANSWER [CR3]: “y.” -- FAILS: “y.”').replace('(Matthew 1:16): STANDS','(Matthew 1:16): UNDERDETERMINED'),
};
(async()=>{const RD=EX['34626'];const a=await run(src('s110',GR),GR,RD);T(nt(a)===nt(RD[GR][0].data.main[0].map(x=>x.json)),'G0 s110 Gate Record rerun equals stored (34626)');
 const R={};for(const [k,f] of Object.entries(P)){const rd=withReply(RD,f);const chg=rd[GC][0].data.main[0][0].json.choices[0].message.content!==RD[GC][0].data.main[0][0].json.choices[0].message.content;
  R[k]={};for(const s of Object.keys(W)){R[k][s]=await rec(s,rd);}console.log('-- '+k+(k!=='G1'&&!chg?' (PLANT DID NOT APPLY)':''));for(const s of Object.keys(W))console.log('   '+s.padEnd(5),R[k][s].err||(R[k][s].seat+' '+R[k][s].sum));}
 /* 34299: three real lines with " | FORCED:" inside CHANGE TO */
 const X2=EX['34299'];const b2=await run(src('s110',GR),GR,X2);T(nt(b2)===nt(X2[GR][0].data.main[0].map(x=>x.json)),'G0b s110 Gate Record rerun equals stored (34299)');
 R.R34299r={};{const rd=cl(X2);const m=rd[GC][0].data.main[0][0].json.choices[0].message;m.content=m.content.split('\n').map(l=>{const i=l.indexOf(' | FORCED:');if(i<0)return l;const j=l.lastIndexOf(' || ');return l.slice(0,i)+' || '+l.slice(i+3,j);}).join('\n');R.R34299r.s110=await rec('s110',rd);console.log('-- 34299 reason-moved s110',R.R34299r.s110.seat+' '+R.R34299r.s110.sum);}
 R.R34299={};for(const s of Object.keys(W)){R.R34299[s]=await rec(s,X2);console.log('-- 34299 '+s.padEnd(5),R.R34299[s].err||(R.R34299[s].seat+' '+R.R34299[s].sum));}
 if(W.C){const E=(k,m)=>T(!R[k].C.err&&R[k].C.sum===R[k].s110.sum,k+' '+m+' (as live)');const g=(k,it)=>((R[k].C.o||{}).gate_rows||[]).filter(r=>r.item.startsWith(it)).map(r=>r.cure_status).join(',');
  T(g('G1','G5')==='CURED'&&!/K-G4|K-F/.test(R.G1.C.sum),'G1 stored G5: FORCED inside CHANGE TO read, G5 CURED, no K-G4 / K-F');
  T(['G1','G2','G3','G4'].every(i=>g('G1',i)===((R.G1.s110.o.gate_rows.find(r=>r.item.startsWith(i))||{}).cure_status)),'G1 items G1 to G4 as live');
  E('G2','FORCED naming another pair not read');
  ['G3a','G3b','G3c'].forEach(k=>console.log('   G3 record',k,'G5 '+g(k,'G5'),R[k].C.sum));
  T(R.G4both.C.sum===R.G4reason.C.sum&&R.G4both.C.sum===R.G4reason.s110.sum,'G4 both fields = reason only = s110 reason only');T(R.G1.C.sum===R.G4reason.s110.sum&&R.G1.C.seat===R.G4reason.s110.seat,'G1 stored form under C = reason-only form under s110');
  T(!/K-F.*K-F/.test(R.G4both.C.sum),'G4 no double count');
  E('G5quoted','quoted FORCED: in GROUND not read');E('G5none','no FORCED line');const G6=(k,i)=>T(!R[k].C.err&&g(k,i)===((R[k].s110.o.gate_rows.find(r=>r.item.startsWith(i))||{}).cure_status)&&R[k].C.sum===R.G1.C.sum,k+' planted item '+i+' as live; rest as the candidate on the stored reply');G6('G6keep','G1');G6('G6und','G2');
  T(R.G6keep0.C.sum===R.G6keep0.s110.sum&&R.G6und0.C.sum===R.G6und0.s110.sum,'G6 on a reply without the stored FORCED line: KEEP and UNDERDETERMINED plants equal live');
  T(R.lowC.C.sum===R.lowR.s110.sum&&R.lowC.C.seat===R.lowR.s110.seat,'lower case forced: in CHANGE TO under C = lower case as whole reason under s110 ('+R.lowR.s110.seat+')');
  T(R.R34299.C.sum===R.R34299r.s110.sum&&R.R34299.C.seat===R.R34299r.s110.seat,'G7b 34299 under C = same lines with FORCED moved to the whole reason field under s110 ('+R.R34299r.s110.seat+')');}
 console.log(ok+' OK, '+bad+' FAIL');})();
