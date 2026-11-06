// pkgKGW (W3 grade_33129 fixes 1-2; Wall 2580/2583). Base: pkgNHE/patched 155f3d3 (graded PASS) = live 7796fc67 + pkgNHE on the 22 library nodes.
// Run from wall2024/: node pkgKGW/build_KGW.cjs
//  (1) K-W labels: the link heading is cut to its link token (D3, LINK 2); the old regex stopped at the colon of a verse reference and gave
//      "DEFENDER CR2 D3 (Luke 1 #1" (33129 chatgpt). All 22 nodes that make K-W ids.
//  (2) K-W matching (19 cure-reading nodes): a RESPONSE or STATEMENT answers a K-W item when side, round, link token and #n agree, ignoring a
//      parenthetical reference fragment, so a judge copying either label form is read.
//  (3) (a2, W3 2582) the recompute applies no retraction, and no RESTATED regrade, to a link whose K-G4 item the cure left UNCURED (ruling
//      421: a meaning break is cured only by FORCED): the stored text is the text the enforcer accepted. 33129 chatgpt wrote both a RETRACTED
//      and a RESTATED line for D4 vs C6. 33129 chatgpt: stored BROKEN, not HELD. Record only (the seat is uncured either way).
//  (4) Eric 15:18 CST 2026-11-06 (decision card; Wall 2588): a judge keeps its seat when it honestly retracts a wrong break with a quoted reason.
//      A RETRACTED line on a K-G4 meaning-class item cures it when its reason (the RETRACTED reason, the item's RESPONSE or STATEMENT) quotes 6+
//      words that stand in a round of the side holding the link in that round's own words (ownQ), or names a verse of the line that such a round
//      names (namedIn). A label alone cures nothing. The send-back's MEANING BREAK mark and K-G4 paragraph say so. The unanswered class is
//      unchanged (it already cured on RETRACTED). How a break is classed is unchanged (from its GROUND; no Commitment 5 label rule).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE='pkgNHE/patched',OUT='pkgKGW/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 7796fc67 ('+BASE+')',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor found '+n+' times: '+a.slice(0,80));return s.replace(a,()=>b);};
const LAB0="const lab=hd?hd[1].replace(/\\s+/g,' ').trim().slice(0,30):'no link heading';";
const LAB1="const lab=hd?(hd[1].match(/^(?:LINK\\s*\\d+|[DC]\\d+)\\b/i)||[hd[1]])[0].replace(/\\s+/g,' ').trim().slice(0,30):'no link heading'; /* pkgKGW (1): the link token only */";
const NZ0="const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\\s+/g,' ').trim();";
const NZ1=NZ0+"const KWK=s=>{const m=NZ(s).match(/\\b(DEFENDER|CHALLENGER)\\s+([CD]R[1-4])\\s+(LINK\\s*\\d+|[DC]\\d+)\\b[^#]{0,60}?#\\s*(\\d+)\\b/);return m?m[1]+' '+m[2]+' '+m[3].replace(/\\s+/g,'')+' #'+m[4]:null;}; /* pkgKGW (2): K-W key: side, round, link, #n */";
const RS0="const r=o.response.find(s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||";
const RS1=RS0+"(x.rule==='K-W'&&KWK(x.link)?o.response.find(s=>ruleOk(U(s.label))&&KWK(s.label)===KWK(x.link)):null)||";
const ST0="const st=o.statement.find(s=>x.link?HAS(s.label,x.link):";
const ST1="const st=o.statement.find(s=>x.link?(HAS(s.label,x.link)||(x.rule==='K-W'&&KWK(x.link)!=null&&KWK(s.label)===KWK(x.link))):";
const WD0="const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))):[];";
const WD1="const __g4u=l=>(v||[]).some(y=>y&&y.rule==='K-G4'&&y.status==='UNCURED'&&U(y.link)===U(l)); /* pkgKGW (3): a link whose K-G4 item stays uncured keeps the line the enforcer accepted */const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))&&!__g4u(w.link)):[];";
const RL0="for(const x of (v||[]).filter(y=>y.status==='CURED'&&/^D\\d+ vs C\\d+$/i.test(String(y.link||'')))){const c=col.find(z=>U(z.link)===U(x.link));if(!c||done.has(U(c.link)))continue;";
const RL1=RL0.replace("if(!c||done.has(U(c.link)))continue;","if(!c||done.has(U(c.link))||__g4u(x.link))continue;");
const MB0="if(__mb421&&wd.has(U(x.link)))return res('UNCURED','retracted, but the BROKEN grade rests on meaning: its GROUND names no pressed witness left unanswered; a meaning break is cured only by a FORCED line, never by a retraction (ruling 421)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));";
const MB1="if(__mb421&&wd.has(U(x.link))){ /* pkgKGW (4), Eric 15:18 CST 2026-11-06 (Wall 2588): a judge keeps its seat when it honestly retracts a wrong break with a quoted reason; the reader verifies the quote */\n"
 +"   const __wl=o.withdrawn.filter(w=>U(w.link)===U(x.link));const __rt=__wl.map(w=>String(w.reason||'')).concat([respOf(x)||'',stmtOf(x)||'']).join('\\n');\n"
 +"   const __hk=x.side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3','DR4'];let __ok=null;\n"
 +"   for(const q of stmtQ(__rt)){if(String(q).trim().split(/\\s+/).length<6)continue;const k=__hk.find(k=>typeof R[k]==='string'&&R[k]&&cureFound(q,R[k])&&ownQ(q,k));if(k){__ok='['+k+'] \"'+String(q).slice(0,120)+'\"';break;}}\n"
 +"   if(!__ok){const rk=new Set(cureRefs(__rt).map(r=>r.key));const z=namedIn(null).find(z=>z.n.some(n=>rk.has(n.ref)));if(z)__ok='['+z.k+'] names '+z.n.filter(n=>rk.has(n.ref)).map(n=>n.ref).join(', ');}\n"
 +"   if(__ok)return res('CURED','retracted with a quoted reason the transcript verifies: '+__ok+' (Eric 15:18 CST 2026-11-06)',__wl.map(w=>w.line));\n"
 +"   return res('UNCURED','retracted, but the BROKEN grade rests on meaning and the retraction gives no quoted reason the transcript verifies (a quotation of 6 or more words standing in a round of the side that holds the link, in its own words, or a verse of the line that such a round names); cure it with a FORCED line or such a quoted reason',__wl.map(w=>w.line));}";
const RX0="Only one FORCED line cures it. RETRACTED does not cure it: a retraction leaves the item uncured, and an uncured K-G4 item counts against your seat (LIVE rule).";
const RX1="One FORCED line cures it, or RETRACTED beside a quoted reason the system verifies: quote, word for word, 6 or more words of the holding side answer from its own round, or name the verse of this line that its later round names. Otherwise a retraction leaves the item uncured, and an uncured K-G4 item counts against your seat (LIVE rule).";
const RY0="A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: RETRACTED does not cure it, and only one FORCED line does (ruling 421).";
const RY1="A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: it is cured by one FORCED line, or by RETRACTED beside a quoted reason the system verifies (6 or more words of the holding side's own answer, word for word from its round, or the verse of the line its later round names; Eric 2026-11-06).";
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');if(!s0.includes(LAB0))continue;let s=s0,e=0;
 s=rep(s,LAB0,LAB1,f);e++;
 if(s.includes(NZ0)){s=rep(s,NZ0,NZ1,f);s=rep(s,RS0,RS1,f);s=rep(s,ST0,ST1,f);s=rep(s,WD0,WD1,f);s=rep(s,RL0,RL1,f);s=rep(s,MB0,MB1,f);s=rep(s,RX0,RX1,f);s=rep(s,RY0,RY1,f);e+=8;}
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:e});console.log(f.padEnd(34),sha(s0),'->',sha(s),e+' edits');}
fs.writeFileSync('pkgKGW/plan_KGW.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
