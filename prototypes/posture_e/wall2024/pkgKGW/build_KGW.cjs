// pkgKGW (W3 grade_33129 fixes 1-2; Wall 2580/2583). Base: pkgNHE/patched 155f3d3 (graded PASS) = live 7796fc67 + pkgNHE on the 22 library nodes.
// Run from wall2024/: node pkgKGW/build_KGW.cjs
//  (1) K-W labels: the link heading is cut to its link token (D3, LINK 2); the old regex stopped at the colon of a verse reference and gave
//      "DEFENDER CR2 D3 (Luke 1 #1" (33129 chatgpt). All 22 nodes that make K-W ids.
//  (2) K-W matching (19 cure-reading nodes): a RESPONSE or STATEMENT answers a K-W item when side, round, link token and #n agree, ignoring a
//      parenthetical reference fragment, so a judge copying either label form is read.
//  (3) (a2, W3 2582) the recompute applies no retraction, and no RESTATED regrade, to a link whose K-G4 item the cure left UNCURED (ruling
//      421: a meaning break is cured only by FORCED): the stored text is the text the enforcer accepted. 33129 chatgpt wrote both a RETRACTED
//      and a RESTATED line for D4 vs C6. 33129 chatgpt: stored BROKEN, not HELD. Record only (the seat is uncured either way).
//  (4) (a3) the generic RETRACTED paragraph of the send-back states the ruling 421 exception the K-G4 item mark already states.
//  Not built (Wall 2584/2586): any change to how K-G4 classes a break. Whether an honest retraction of a meaning break cures is Eric's decision.
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
const RX0="so that one line cures every item flagged on it (layer, count, pressing).";
const RX1="so that one line cures every item flagged on it (layer, count, pressing), except a K-G4 item marked MEANING BREAK: only one FORCED line cures that item, and a retraction leaves it uncured (ruling 421).";
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(BASE+'/'+f,'utf8');if(!s0.includes(LAB0))continue;let s=s0,e=0;
 s=rep(s,LAB0,LAB1,f);e++;
 if(s.includes(NZ0)){s=rep(s,NZ0,NZ1,f);s=rep(s,RS0,RS1,f);s=rep(s,ST0,ST1,f);s=rep(s,WD0,WD1,f);s=rep(s,RL0,RL1,f);s=rep(s,RX0,RX1,f);e+=6;}
 new Function('$','$input','$json',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s),edits:e});console.log(f.padEnd(34),sha(s0),'->',sha(s),e+' edits');}
fs.writeFileSync('pkgKGW/plan_KGW.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
