// ASK 638 A, W1 F1 (Wall 12059): replay the gate of sol in 42528, old and new array, and report the D38 BASIS items and their effect on drv_uncured. node t638g.cjs base_eng.json target_engine_638.json fx/g42528_sol.json
const fs=require('fs');const ld=require('./libload638.cjs');const [,,BA,TG,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8')),X=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
(async()=>{
const N=['gateItems2024','d38Items2024','cureJText','sbApply2024','gatePromptText2024','ciRounds','drvLinks','D38_STATUS'];
const O=await ld(B,'Gate Build',N),W=await ld(T,'Gate Build',N);
console.log('loaded:',N.map(k=>k+':'+typeof O[k]).join(' '));
const p=X.payload;const raw0=p.verdict_raw;const rx=/("counted_premises_challenger"\s*:\s*)\[[^\]]*\]/;ok(rx.test(raw0),'the gate-time raw holds the array');
const raw1=raw0.replace(rx,(_,h)=>h+'[3]'); /* what the new cureRewrite stores for 42528 (t638 C1) */
const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
console.log('gate-time fields:',JSON.stringify(F),'| array old',raw0.match(rx)[0],'| new',raw1.match(rx)[0]);
const PT=X.pb_judge?O.gatePromptText2024(X.pb_judge.body):'';const ctx={R:PT?O.ciRounds(PT):null,DL:PT?O.drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
const G=(L,raw)=>L.gateItems2024('sol',raw,F,X.sb_items,ctx);
let go,gn,eo=null,en=null;try{go=G(O,raw0);}catch(e){eo=e.message;}try{gn=G(W,raw1);}catch(e){en=e.message;}
if(eo||en){console.log('gateItems2024 did not run offline:',eo,'|',en);}
// the D38 check alone, on the same T0 and T1 the gate uses
const R1=O.sbApply2024('sol',raw0,F,X.sb_items,ctx.R);const T0=O.cureJText(raw0,true),T1=R1.text;
const dO=O.d38Items2024(T0,T1,raw0),dN=W.d38Items2024(T0,T1,raw1);
const R1n=W.sbApply2024('sol',raw1,F,X.sb_items,ctx.R);ok(R1n.text===T1,'T1 is the same text under the new array');
console.log('D38 items old:',dO.length,JSON.stringify(dO.map(x=>x.key)));console.log('D38 items new:',dN.length,JSON.stringify(dN.map(x=>x.key)));
const bO=dO.filter(x=>x.type==='BASIS'),bN=dN.filter(x=>x.type==='BASIS');console.log('BASIS old',bO.length,'new',bN.length);for(const x of bN)console.log('  NEW BASIS:',x.key,'|',x.why);
ok(JSON.stringify(dO)===JSON.stringify(dN),'42528 sol: the D38 items are equal old and new');
if(go&&gn){const k=g=>g.items.map(x=>x.key+'|'+x.live);console.log('gate items old',go.items.length,'new',gn.items.length);ok(JSON.stringify(k(go))===JSON.stringify(k(gn)),'42528 sol: every gate item is equal old and new');}
// why the BASIS test is quiet for 42528: its inputs on the challenger side
const cnt=s=>{const m=String(s).split('\n').map(l=>l.replace(/[*_`]+/g,'').trim()).find(l=>/^CHALLENGER CONCEDED LINKS\s*:/i.test(l));return m||null;};
console.log('T0 challenger count line:',String(cnt(T0)).slice(0,160));console.log('T1 challenger count line:',String(cnt(T1)).slice(0,160));
const pair=t=>String(t).split('\n').map(l=>l.replace(/[*_`]+/g,'').trim()).filter(l=>/^(?:FORCED\s*:\s*)?D\d+\s+vs\.?\s+C3\b/i.test(l)).map(l=>l.slice(0,90));
console.log('T0 lines on C3:',JSON.stringify(pair(T0)));console.log('T1 lines on C3:',JSON.stringify(pair(T1)));

// synthetic: a side whose count the cure lowered, a collision on a kept premise moved by the send-back. Old skips (array length differs from the count); new tests it.
{const t0=['D1 vs C3 (Romans 1:3): CHALLENGER LINK BROKEN (Commitment 8) -- POINT: P1','D2 vs C4 (Acts 2:30): STANDS (Commitment 8) -- POINT: P2','CHALLENGER CONCEDED LINKS: 1 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 1)'].join('\n');
 const t1=t0.replace('D1 vs C3 (Romans 1:3): CHALLENGER LINK BROKEN','D1 vs C3 (Romans 1:3): STANDS');
 const rO='{"challenger_conceded_links": 1, "counted_premises_challenger": [3, 4]}',rN='{"challenger_conceded_links": 1, "counted_premises_challenger": [3]}';
 const so=O.d38Items2024(t0,t1,rO),sn=W.d38Items2024(t0,t1,rN);console.log('SYNTHETIC D38 old',JSON.stringify(so.map(x=>x.key)),'new',JSON.stringify(sn.map(x=>x.key)),'| LIVE:',W.D38_STATUS.BASIS);
 ok(so.filter(x=>x.type==='BASIS').length===0&&sn.filter(x=>x.type==='BASIS').length===1,'synthetic: a BASIS item now arises where the old code skipped (LIVE, so uncured it counts in drv_uncured)');if(sn[0])console.log('  why:',sn[0].why);}
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
