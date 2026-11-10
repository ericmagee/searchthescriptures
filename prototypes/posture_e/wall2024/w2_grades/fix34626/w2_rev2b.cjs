// W2 grade of pkgKSR + pkgECB rev 2b: labels labels_KSR_ECB_rev2b_w2.md.
const fs=require('fs');const chain=require('./w2_chain.cjs');
const S110='/mnt/project-files/wall2024/fetchback_live_s110.json',P=s=>'pkgKSR/parent_s110_'+s+'.json';
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const RD=(X.data||X).resultData.runData;
let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};const nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
const flat=r=>r.map(x=>x.json||x);const rowsOf=o=>flat(o).map(r=>r.payload||r);
const KS=r=>{const t=String(r.verdict_raw||'').replace(/\\n/g,'\n');const m=[...t.matchAll(/(?:^|\n|")\s*KEYSTONE: D6 -- (STANDS|BROKEN)/g)].map(x=>x[1]);return m[0]||'-';}; /* the verdict's own KEYSTONE line is the first; later ones are audit copies */
const sum=rows=>rows.map(r=>(r.judge_seat||r.seat)+':'+r.verdict_tag+'/'+KS(r)+'/drv'+r.drv_uncured);
const fields=rows=>JSON.stringify(rows.map(r=>{const o={...r};delete o.verdict_raw;delete o.created_at;return o;}));
(async()=>{const mode=process.argv[2]||'main';
 const stored=RD['Replay Rows'][0].data.main[0].map(x=>x.json);
 if(mode==='main'){
 const b=await chain(S110);T(!b.err&&nt(b.rows)===nt(stored),'L2 base chain equals the stored Replay Rows'+(b.err?' '+b.err:''));
 console.log('   Replay Rows keys',Object.keys(stored[0]).join(','));const R=rs=>rs.flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x.payload||x]);
 console.log('   base',JSON.stringify(sum(R(b.rows))));
 for(const s of ['ALL','ECB','KSR']){const c=await chain(P(s));if(c.err){T(false,s+' chain error '+c.err);continue;}console.log('   '+s,JSON.stringify(sum(R(c.rows))));
  if(s==='ALL'){T(R(c.rows).every(r=>KS(r)==='BROKEN'),'L3 both: final KEYSTONE D6 BROKEN for all three at Replay Rows');T(fields(R(c.rows))===fields(R(b.rows)),'L3 both: every written field but verdict_raw equal to base (drv_uncured included)');}}
 // L5 P1.3 plant under both
 const T1='this answer addresses the title, not the stated motives.';const mut=rd=>JSON.parse(JSON.stringify(rd).split(T1).join(T1+' Link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, so the motives matter here.'));
 const pb=await chain(S110,mut),pa=await chain(P('ALL'),mut);const sb=o=>(o.over['Send Back Build']||[[]])[0].flatMap(x=>(x.json.items||[]).filter(i=>/motives matter here/.test(i.line)).map(i=>i.sid));
 console.log('   L5 planted item sent: s110',JSON.stringify(sb(pb)),'both',JSON.stringify(sb(pa)));T(sb(pb).length===1&&sb(pa).length===1,'L5 judge line quoting the engine words on an E-ANS line is still sent');
 // L6 no confirmed closing contradiction
 const none=rd=>{const j=rd['Close Enforcer Record'][0].data.main[0][0].json;j.cec.confirmed=[];j.cec.rows=[];j.cec.none=true;return rd;};
 const nb=await chain(S110,none),na=await chain(P('ALL'),none);T(!nb.err&&!na.err&&nt(na.rows)===nt(nb.rows),'L6 no confirmed closing contradiction: both equals s110 at Replay Rows'+(na.err||nb.err?' '+(na.err||nb.err):''));
 // L7 confirmed break on D3 only
 const d3=rd=>{const j=rd['Close Enforcer Record'][0].data.main[0][0].json;j.cec.confirmed.forEach(x=>x.link=3);j.cec.rows.forEach(x=>x.link=3);return rd;};
 const db=await chain(S110,d3),da=await chain(P('ALL'),d3);
 if(db.err||da.err)T(false,'L7 error '+(db.err||da.err));else{console.log('   L7 s110',JSON.stringify(sum(R(db.rows))),'both',JSON.stringify(sum(R(da.rows))));
  const d6=o=>(o.over['Send Back Build']||[[]])[0].flatMap(x=>(x.json.items||[]).filter(i=>/D6 vs C/.test(i.line)).map(i=>x.json.seat+' '+i.item)).sort().join('|');
  T(d6(db)===d6(da),'L7 break on D3: the same D6 items are sent as in s110 ('+d6(da).split('|').filter(Boolean).length+')');T(nt(R(da.rows).map(KS))===nt(R(db.rows).map(KS)),'L7 KEYSTONE D6 as in s110');}
 console.log(ok+' OK, '+bad+' FAIL');}
 else{const c=await chain(mode);if(c.err){console.log('ABL ERR',c.err);return;}const R=rs=>rs.flatMap(x=>x.body?JSON.parse(x.body).p_rows:[x.payload||x]);const b=await chain(S110);console.log('ABL',mode,JSON.stringify(sum(R(c.rows))),'L3',R(c.rows).every(r=>KS(r)==='BROKEN')&&fields(R(c.rows))===fields(R(b.rows)));}})();
