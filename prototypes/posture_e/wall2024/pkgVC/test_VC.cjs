// WALL-2024 Parts 1 and 2 (W2) offline tests against /mnt/project-files/w3/none_found_and_stale_header_expectations.md (V1-V6, Y1-Y3, H1, H2, G1-G3).
// argv[2]: live fetch (8dd6d614); fixtures_runs4.json: debate_results rounds + independent_verdict_raw + debate_judgments for 32791, 32905, 32924, 32936.
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};live.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const pat=n=>fs.readFileSync('patched/'+n.replace(/ /g,'_')+'.js','utf8');
const pickF=(c,name)=>{const i=c.indexOf('function '+name+'(');if(i<0)throw new Error('no '+name);const ends=['\nfunction ','\nconst ','\nlet ','\nP.','\nreturn '].map(x=>c.indexOf(x,i+10)).filter(x=>x>0);const j=ends.length?Math.min(...ends):-1;return c.slice(i,j<0?undefined:j);};
const pickC=(c,name)=>{const i=c.indexOf('\nconst '+name+'=');if(i<0)throw new Error('no const '+name);return c.slice(i+1,c.indexOf('\n',i+1));};
let ok=true;const out=[];const T=(c,m)=>{out.push((c?'OK   ':'FAIL ')+m);if(!c)ok=false;};
const RUNS=JSON.parse(fs.readFileSync('fixtures_runs4.json','utf8'));const run=k=>RUNS.find(r=>r.run_token.includes(k));
const Rof=r=>({CR1:r.cr1,CR2:r.cr2,CR3:r.cr3,CR4:r.cr4,DR1:r.gr1,DR2:r.gr2,DR3:r.dr3,DR4:r.dr4});
// ---- Part 1 environment from the patched Panel Payloads
const PPc=pat('Panel Payloads');
const src=[pickC(PPc,'kvNorm'),pickC(PPc,'PW_ORD'),...['vcParse2024','vcBuild2024','vcCaught2024','vcItem2024','vcNone2024','netUnwrap','kwLines421','wpLines2024','kconLines2024','kcmtLines2024'].map(n=>pickF(PPc,n))].join('\n');
const E=new Function(src+'\nreturn {kvNorm,PW_ORD,vcParse2024,vcBuild2024,vcCaught2024,vcItem2024,vcNone2024,netUnwrap,kwLines421};')();
const KW=R=>E.kwLines421('',R);
const W=r=>r.judgments.map(j=>({seat:j.seat,WT:E.netUnwrap(j.verdict_raw),R:Rof(r)}));
// V1, V6, Y1
{const r=run('32936');const V=E.vcBuild2024(W(r),KW);
 T(V.length===1,'V1 32936: verified contradictions '+V.length+' (want 1)'+(V[0]?' :: '+V[0].side+' '+V[0].ek+' to '+V[0].lk+', by '+V[0].by.join(',')+' :: EARLIER "'+V[0].q1+'" LATER "'+V[0].q2+'"':''));
 T(V[0]&&V[0].by.length===3&&new Set(V[0].by).size===3,'V1 32936: all three panel lines verify to the same VC ('+(V[0]?V[0].by.join(','):'')+')');
 T(V[0]&&V[0].kw==='DEFENDER CR2 no link heading #2','V6 32936: gate admits it on K-W item "'+(V[0]?V[0].kw:'')+'"');
 const kwi=KW(Rof(r)).items.find(x=>x.link==='DEFENDER CR2 no link heading #2');T(kwi&&/"I withdraw it\."/.test(kwi.line),'V6 32936: that K-W item reads '+(kwi?kwi.line:'(none)'));
 for(const w of W(r))T(V.every(v=>E.vcCaught2024(w.WT,v)),'Y1 32936 '+w.seat+': captured, no K-CON item');
 // V2, V5: the single judge
 const ST=E.netUnwrap(r.independent_verdict_raw);const miss=V.filter(v=>!E.vcCaught2024(ST,v));
 T(E.vcNone2024(ST),'V2 32936 single: reasoning holds CONTRADICTIONS: NONE FOUND');
 T(miss.length===1,'V2 32936 single: K-CON items '+miss.length+' (want 1)'+(miss[0]?' :: '+E.vcItem2024(miss[0],true).item.line.slice(0,260):''));
 const AMc=pat('Alternate Merge');T(/seat:'single',seat_role:'single',judge_model:x\.judge_model\|\|null,kind:'enforcer_check',rule:'K-CON'/.test(AMc)&&/cure_status:null,cure_reason:'TRIAL rule \(recorded only, after the panel; no call was made; it removes no seat\)/.test(AMc),'V5 Alternate Merge: the single row goes to enforcer_log (kind enforcer_check, seat_role single, cure_status null, record only; W3 2179 item 4); no call node added');
 // V3, V4 synthetic
 const g=W(r).find(w=>w.seat==='grok');
 const v3=E.vcBuild2024([{...g,WT:'CONTRADICTION -- DEFENDER -- EARLIER ([CR2], "my bridge joined three words, and I withdraw it") -- LATER ([CR4], "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman")'}],KW);T(v3.length===0,'V3 synthetic EARLIER quote not in CR2: VCs '+v3.length+' (want 0)');
 const v4=E.vcBuild2024([{...g,WT:'CONTRADICTION -- DEFENDER -- EARLIER ([CR4], "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman") -- LATER ([CR2], "my bridge joined two words, and I withdraw it")'}],KW);T(v4.length===0,'V4 synthetic LATER round before EARLIER: VCs '+v4.length+' (want 0)');
 const v4b=E.vcBuild2024([{...g,WT:'CONTRADICTION -- DEFENDER -- EARLIER ([CR2], "my bridge joined two words") -- LATER ([CR4], "Genesis 24:16 and Genesis 24:43 fix the word on an unknown woman")'}],KW);T(v4b.length===0,'V6b synthetic EARLIER quote that neither contains nor lies inside the K-W sentence (gate boundary, def 2153 item 4): VCs '+v4b.length+' (want 0)');}
// Y3: stored runs from before Commitment 10
for(const k of ['32791','32905','32924']){const r=run(k);const V=E.vcBuild2024(W(r),KW);const lines=W(r).reduce((a,w)=>a+E.vcParse2024(w.WT).length,0);T(V.length===0,'Y3 '+k+': CONTRADICTION lines '+lines+', VCs '+V.length+' (want 0), no new item');}
// Y2: run the pass itself on 32936 payloads: only drv gains K-CON items and verdict_raw gains marks; tags, counts and drv_uncured unchanged
{const r=run('32936');const PASS=fs.readFileSync('vc_pass.js','utf8');
 const ENF=(PPc.match(/const ENF_STATUS=\{[^}]*\}/)||[])[0];T(ENF&&/'K-CON':'TRIAL'/.test(ENF),'Y2 Panel Payloads ENF_STATUS has K-CON TRIAL');
 const bodies=r.judgments.map(j=>JSON.stringify({payload:{judge_seat:j.seat,verdict_raw:j.verdict_raw,verdict_tag:j.verdict_tag,drv_uncured:0}}));const summary=r.judgments.map(j=>({seat:j.seat,drv:[],verdict_tag:j.verdict_tag}));
 const before=JSON.stringify({b:bodies.map(b=>{const p=JSON.parse(b).payload;return [p.verdict_tag,p.drv_uncured];}),s:summary.map(s=>s.verdict_tag)});
 const f=new Function('E','__VCW','bodies','summary','SJ','kwLines421',"const {vcBuild2024,vcCaught2024,vcItem2024,vcNone2024,netUnwrap}=E;\n"+PASS+"\nreturn {vc_single,vc_error};");
 const res=f(E,W(r),bodies,summary,{independent_verdict_raw:r.independent_verdict_raw,judge_model:'gemini-test'},E.kwLines421);
 const after=JSON.stringify({b:bodies.map(b=>{const p=JSON.parse(b).payload;return [p.verdict_tag,p.drv_uncured];}),s:summary.map(s=>s.verdict_tag)});
 T(before===after,'Y2 32936 pass: verdict tags and drv_uncured unchanged');T(summary.every(s=>s.drv.length===0),'Y1/Y2 32936 pass: no panel seat got a K-CON item');
 T(res.vc_error===null&&res.vc_single.length===1,'V2/V5 32936 pass: vc_single rows '+res.vc_single.length+' (want 1), error '+res.vc_error);
 // a panel seat that wrote NONE FOUND gets the item (synthetic: gemini's lines removed)
 const b2=r.judgments.map(j=>JSON.stringify({payload:{judge_seat:j.seat,verdict_raw:j.verdict_raw,verdict_tag:j.verdict_tag}}));const s2=r.judgments.map(j=>({seat:j.seat,drv:[]}));
 const W2=W(r).map(w=>w.seat==='gemini'?{...w,WT:w.WT.split('\n').filter(l=>!/^\s*(CONTRADICTION|NOT HELD|REASSERTED IN)\b/.test(l)).join('\n')+'\nCONTRADICTIONS: NONE FOUND.'}:w);
 const r2=f(E,W2,b2,s2,null,E.kwLines421);const gi=s2.findIndex(s=>s.seat==='gemini');
 T(s2[gi].drv.length===1&&s2[gi].drv[0].rule==='K-CON'&&/NONE FOUND was written, but the record shows: EARLIER \[CR2\]/.test(s2[gi].drv[0].line)&&!/chatgpt|grok|judge (?:wrote|found)/i.test(s2[gi].drv[0].line),'V2b synthetic panel NONE FOUND: 1 K-CON item in record words only :: '+(s2[gi].drv[0]?s2[gi].drv[0].line.slice(0,220):''));
 T(s2.filter((s,k)=>k!==gi).every(s=>s.drv.length===0),'Y1b synthetic: the other two seats get no item');
 T(/AUDIT v32: CONTRADICTION NOT CAPTURED \(K-CON; Commitment 10; verified in the record\)/.test(JSON.parse(b2[gi]).payload.verdict_raw),'V2b synthetic: gemini verdict_raw carries the AUDIT v32 mark');}
// ---- Part 2c (one final header; W3 2177): cureSupHead from the patched Panel Cure Check, run on the stored rows
const PC=pat('Panel Cure Check');const SH=new Function(pickF(PC,'rcObjEnd')+'\n'+PC.slice(PC.indexOf('function cureSupHead('),PC.indexOf('\n',PC.indexOf('function cureSupHead(')))+'\nreturn cureSupHead;')();
const objOf=s=>{const a=s.indexOf('{');let d=0,q=false,e=false;for(let i=a;i<s.length;i++){const ch=s[i];if(q){if(e)e=false;else if(ch==='\\')e=true;else if(ch==='"')q=false;continue;}if(ch==='"')q=true;else if(ch==='{')d++;else if(ch==='}'){d--;if(!d)return s.slice(a,i+1);}}return null;};
let gN=0;
for(const r of RUNS)for(const j of r.judgments){const o=JSON.parse(objOf(j.verdict_raw));const m=j.verdict_raw.match(/AUDIT v21: CORRECTED RESULT -- (?:SEAT: [^;]*; )?ORIGINAL: ([A-Z]+); COUNTED: ([A-Z]+)/);
 const t0=m?m[1]:o.verdict_tag;const s1=SH(j.verdict_raw,t0,o.verdict_tag);const o1=JSON.parse(objOf(s1));const id=r.run_token.slice(5,10)+' '+j.seat;
 if(t0!==o.verdict_tag){const h='SUPERSEDED BY CURE: verdict '+t0+' to '+o.verdict_tag+'; see the cure lines below\n';
  T(o1.reasoning===h+o.reasoning,(id.includes('32924')?'H1 ':'H2 ')+id+': reasoning opens "'+o1.reasoning.split('\n')[0]+'" then the judge\'s own text unchanged');
  T(!/keystone/i.test(o1.reasoning.split('\n')[0]),'H2 '+id+': the line names no keystone change (S21 unapplied)');
  T(SH(s1,t0,o.verdict_tag)===s1,'H '+id+': not doubled on a second pass');
  T(o1.verdict_tag===o.verdict_tag&&s1.slice(objOf(s1).length)===j.verdict_raw.slice(objOf(j.verdict_raw).length),'G2 '+id+': verdict_tag and the text after the object unchanged');}
 else{gN++;T(s1===j.verdict_raw,'G1 '+id+': byte-identical (no verdict change)'+(j.seat==='grok'&&r.run_token.includes('32936')?' [G3: opens with its CONTRADICTION line]':'')+(j.seat==='gemini'&&r.run_token.includes('32905')?' [cured without a verdict change]':''));}}
T(gN===10,'G1 count of unchanged judgments: '+gN+' (want 10)');
// the live failure: run 32949 chatgpt (stored row, before its CORRECTED RESULT line)
{const F=JSON.parse(fs.readFileSync('fixture_32949_chatgpt.json','utf8'));const x=SH(F.before_corr,'BROKEN','HELD');const ox=JSON.parse(objOf(x));
 T(ox.reasoning.startsWith('SUPERSEDED BY CURE: verdict BROKEN to HELD; see the cure lines below\nBROKEN. [L1]'),'H-live 32949 chatgpt: the header the live run lacked');
 // W3 2177 gap 2: two changes (BROKEN to HELD, then HELD to CONTESTED): one header naming the final tag
 const y=SH(x,'BROKEN','CONTESTED');const oy=JSON.parse(objOf(y));T(oy.reasoning.startsWith('SUPERSEDED BY CURE: verdict BROKEN to CONTESTED; see the cure lines below\nBROKEN. [L1]')&&oy.reasoning.split('SUPERSEDED BY CURE').length===2,'H-twice: a later change replaces the header and names the final tag');
 T(SH(x,'BROKEN','BROKEN')===F.before_corr,'H-back: a change undone by a later step leaves no header');}
// W3 2177 gap 1: the single judge (plain text)
{const st=RUNS.find(r=>r.run_token.includes('32936')).independent_verdict_raw;const z=SH(st,'BROKEN','HELD');T(z==='SUPERSEDED BY CURE: verdict BROKEN to HELD; see the cure lines below\n'+st,'H-single: plain text opens with the header');T(SH(st,'HELD','HELD')===st,'H-single: no change, byte-identical');}
// call sites
const CC=pat('Cure Check'),AM=pat('Alternate Merge');
T(PC.split('cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag)').length===2&&PC.includes('cureSupHead(b.payload.verdict_raw,F0.verdict_tag,b.payload.verdict_tag)'),'Sites: Panel Cure Check, once after every cure step, once on the tie path');
T(AM.split('cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag)').length===2,'Sites: Alternate Merge, once before the seat is seated or refused');
T(CC.includes('independent_verdict_raw:cureSupHead(RAW0+'),'Sites: Cure Check, the single judge');
const plan=JSON.parse(fs.readFileSync('plan_VC.json','utf8'));T(plan.nodes.length===4,'nodes changed: '+plan.nodes.length+' (Panel Payloads, Cure Check, Panel Cure Check, Alternate Merge); cureRewrite is no longer edited');
console.log(out.join('\n'));console.log(ok?'ALL OK':'FAILURES');
