// ASK 362, W3 condition D1 (Wall 7602): on REAL 1214, before and after for every reader that counts by pair.
// Usage: node t362_d1.cjs <target> <base> <lib.cjs> <j1214.json> <rounds38106.json>
// REAL = stored judgment 1214 (grok, run 38106), log rows 43518-43520, and the stored rounds of run 38106 (debate_results).
// FIXTURE NOTE: the judge prompt is not stored. ctx is built from a prompt assembled from the stored rounds in the
// "=== [DRn] ===" form that ciRounds reads. Base and target get the same ctx, so the before/after comparison holds whatever ctx is.
const fs=require('fs');const {unpack,rb,load}=require(process.argv[4]);let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const tu=unpack(JSON.parse(fs.readFileSync(process.argv[2]))),bu=unpack(JSON.parse(fs.readFileSync(process.argv[3])));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const T=load(rb(tu.L,tu.M['Gate Build']),$),B=load(rb(bu.L,bu.M['Gate Build']),$);
const TS=load(rb(tu.L,tu.M['Gate Record']),$),BS=load(rb(bu.L,bu.M['Gate Record']),$);if(typeof TS.gcp2024!=='function'||typeof BS.gcp2024!=='function')throw new Error('gcp2024 not loaded from Gate Record');
const r=JSON.parse(fs.readFileSync(process.argv[5]));let cut=r.raw.length;try{JSON.parse(r.raw)}catch(e){cut=+String(e.message).match(/position (\d+)/)[1];}const p=JSON.parse(r.raw.slice(0,cut)),tail=r.raw.slice(cut);
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
const L=p.reasoning.split('\n');const fr={};for(const x of r.rows)fr[x.id]=x;const pairs=[['D1 vs C2',43518,'G1'],['D3 vs C1',43519,'G2'],['D3 vs C2',43520,'G3']];const its=[];
for(const [pr,id,g] of pairs){const ix=L.map((l,i)=>l.startsWith(pr+' (')?i:-1).filter(i=>i>=0);const to=L[ix[1]];L[ix[1]]=fr[id].flagged_line;its.push({sid:g,rule:'E-GATE',seat:'grok',ans:'CHANGE',line:fr[id].flagged_line,to});}
const raw=JSON.stringify({...p,reasoning:L.join('\n')})+tail;
const RD=JSON.parse(fs.readFileSync(process.argv[6]));const PT=['DR1','CR1','DR2','CR2','X3','CR3','DR4','CR4'].map(k=>'=== ['+(k==='X3'?'DR3':k)+'] ===\n'+(RD[k]||'')).join('\n\n');
const S=JSON.stringify;
for(const ask of [false,true]){
 const ctxB={R:B.ciRounds(PT),DL:B.drvLinks(PT),ask},ctxT={R:T.ciRounds(PT),DL:T.drvLinks(PT),ask};
 const tag=' [ask '+ask+']';
 if(!ask)console.log('ctx: rounds '+Object.keys(ctxB.R).join(',')+'; declared chain '+ctxB.DL.length+' links');
 const Gb=B.gateItems2024('grok',raw,F,its,ctxB),Gt=T.gateItems2024('grok',raw,F,its,ctxT);
 const Tb=Gb.R1.text,Tt=Gt.R1.text;
 // 1. rcLines: the collision grade per pair
 const cg=t=>{const P=B.rcLines(t);return (P.col||[]).map(c=>S(c)).sort();};
 const pg=t=>{const P=B.rcLines(t);const o={};for(const c of P.col||[]){(o[c.link]=o[c.link]||[]).push(c.grade);}return o;};
 const cb=cg(Tb),ct=cg(Tt);const ub=[...new Set(cb)],ut=[...new Set(ct)];
 ok('rcLines collision lines: the distinct graded entries are equal before and after'+tag,S(ub)===S(ut),'base '+cb.length+' entries ('+ub.length+' distinct), target '+ct.length+' ('+ut.length+' distinct)');
 if(!ask){console.log('   base per pair: '+S(pg(Tb)));console.log('   target per pair: '+S(pg(Tt)));}
 // 2. gate items (E-APPLY, gateAnsGround, gateNewK2024, d38, gateAnsOpen2024, gateVnv2024, rudPair2024)
 const gi=G=>G.items.map(x=>[x.src,x.kind,x.key].join(' | '));
 ok('gate items equal before and after (every gate reader)'+tag,S(gi(Gb))===S(gi(Gt)),gi(Gt).length+' items'+(gi(Gt).length?': '+gi(Gt).join(' ;; ').slice(0,400):''));
 ok('gateNewK2024 items equal'+tag,S(B.gateNewK2024(B.cureJText(raw,true),Tb,F,Gb.R1.fields,ctxB).items)===S(T.gateNewK2024(T.cureJText(raw,true),Tt,F,Gt.R1.fields,ctxT).items));
 ok('gateAnsOpen2024 items equal'+tag,S(B.gateAnsOpen2024(Tb,ctxB.R))===S(T.gateAnsOpen2024(Tt,ctxT.R)),B.gateAnsOpen2024(Tb,ctxB.R).length+' items');
 ok('gateVnv2024 items equal'+tag,S(B.gateVnv2024(Tb))===S(T.gateVnv2024(Tt)),B.gateVnv2024(Tb).length+' items');
 // 3. drv items (drvCheck, the deterministic reader behind drv_uncured and the K re-read)
 const dv=(X,t)=>{const D=X.drvCheck(t,Gb.R1.fields.conceded_links,Gb.R1.fields.challenger_conceded_links,Gb.R1.fields.defense_standing,Gb.R1.fields.challenge_standing,ask,ctxB.DL);return (D.items||[]).map(x=>S([x.rule,x.key||x.id||'',x.side||''])).sort();};
 const db=dv(B,Tb),dt=dv(T,Tt);ok('drvCheck items (drv_uncured count source) equal before and after'+tag,S(db)===S(dt),'base '+db.length+', target '+dt.length);
}
// 4. drv_uncured as stored is set from the cure check (enfUncured), a model call; it is not re-run here. pkgGCP and the removal text are its deterministic readers:
const body=d=>JSON.stringify({payload:{judge_seat:'grok',verdict_raw:raw,drv_uncured:d,...F}});
const PB0={judges:[{seat:'grok',body:{messages:[{content:PT}]}}]};
for(const d of [0,1,3])for(const pb of [null,PB0]){const gb=BS.gcp2024([body(d)],its,pb),gt=TS.gcp2024([body(d)],its,pb);ok('pkgGCP (gcp2024) equal before and after, drv_uncured '+d+(pb?', with the assembled prompt':', no prompt'),S(gb)===S(gt),gt===null?'no count-off on either side (null)':S(gt).slice(0,160));}
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));process.exit(f?1:0);
