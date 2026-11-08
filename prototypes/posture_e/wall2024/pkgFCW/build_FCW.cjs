// pkgFCW (W2, 11-08; W3 3174 W2 (a), D32 part 1: grok 33506 E-APPLY S9-S11 false NOT APPLIED). Library layer on pkgLIB/strip_RI2 (LIB v20_RI2 = v19_GDA + RI2).
// Fault: a K-G4 item the cure CURES with a FORCED line from the judge's cure reply ("forced link: a FORCED line for Dn vs Cm (ruling 411)") never gets
// that FORCED line into the judge's text: cureLines files a FORCED line as prose (CURE_KEY has no FORCED), so it survives only inside the
// "prose recorded, not read for a cure" mark. A later send-back that flags the FORCED line (CHANGE TO RETRACTED: Dn vs Cm) is then NOT APPLIED,
// "the flagged line is not in the judge text" (33506 grok S9-S11, 33592 gemini, 33461 grok). The gate already writes its curing FORCED line after the
// collision line (gateForced2024 forced_add, ruling 411); the cure path had no counterpart.
// Fix: cureForcedAdd2024 writes each such FORCED line into the judge text after its collision line (once; skipped when the text already holds it),
// before the recompute, in the three cure merges: Panel Cure Check (panel), Alternate Merge Seat (alternate), Cure Check (single).
// Run from wall2024/: node pkgFCW/build_FCW.cjs -> pkgLIB/strip_FCW/patched (22 files)
const fs=require('fs'),c=require('crypto');const sha=s=>c.createHash('sha256').update(s).digest('hex').slice(0,12);
const IN='pkgLIB/strip_RI2/patched/',OUT='pkgLIB/strip_FCW/patched/';fs.mkdirSync(OUT,{recursive:true});
const once=(s,a,b,nm)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,70));return s.replace(a,()=>b);};
const DEF="function cureRecompute(seat,text,F,items,v,reply){";
const FN=String.raw`function cureForcedAdd2024(raw,v,panel){let s=String(raw==null?'':raw);const added=[];const nl=l=>String(l==null?'':l).replace(/\\+/g,'').replace(/[*_\u0060]+/g,'').replace(/\s+/g,' ').trim();const enc=z=>JSON.stringify(String(z)).slice(1,-1); /* pkgFCW (D32): the FORCED line that cured a K-G4 item is written after its collision line, as the gate's forced_add does (ruling 411) */
 for(const x of (v||[])){try{if(!x||x.rule!=='K-G4'||x.status!=='CURED'||!/^forced link: a FORCED line\b/.test(String(x.why||'')))continue;const fl=String(x.statement||'').split(/ \/ (?=FORCED\b)/)[0].trim();const col=String(x.line||'').trim();if(!/^FORCED\b/i.test(fl)||!col)continue;
  const T=cureJText(s,!!panel).split('\n');if(T.some(l=>nl(l)===nl(fl)))continue;const tl=T.filter(l=>nl(l)===nl(col));if(tl.length!==1)continue;const t0=tl[0];
  if(panel&&s.split(enc(t0)).length===2)s=s.replace(enc(t0),()=>enc(t0)+'\\n'+enc(fl));else if(!panel&&s.split(t0).length===2)s=s.replace(t0,()=>t0+'\n'+fl);else continue;added.push(x.link);}catch(e){}}
 return {raw:s,added};}
`;
const SITES={
 'Panel_Cure_Check.js':["const rc=cureRecompute(s.seat,cureJText(b.payload.verdict_raw,true),F0,all,v,r?r.reply:null);",
  "{const __fa=cureForcedAdd2024(b.payload.verdict_raw,v,true);b.payload.verdict_raw=__fa.raw;} /* pkgFCW */ const rc=cureRecompute(s.seat,cureJText(b.payload.verdict_raw,true),F0,all,v,r?r.reply:null);"],
 'Alternate_Merge_Seat.js':["const rc=cureRecompute(a.seat,cureJText(b.payload.verdict_raw,true),F0,r.drv,v,c?c.reply:null);",
  "{const __fa=cureForcedAdd2024(b.payload.verdict_raw,v,true);b.payload.verdict_raw=__fa.raw;} /* pkgFCW */ const rc=cureRecompute(a.seat,cureJText(b.payload.verdict_raw,true),F0,r.drv,v,c?c.reply:null);"],
 'Cure_Check.js':["const RC=cureRecompute(null,cureJText(base.independent_verdict_raw,false),F0,all,v,r?r.reply:null);",
  "{const __fa=cureForcedAdd2024(base.independent_verdict_raw,v,false);base.independent_verdict_raw=__fa.raw;} /* pkgFCW */\nconst RC=cureRecompute(null,cureJText(base.independent_verdict_raw,false),F0,all,v,r?r.reply:null);"]};
// v2 (W3 hold, 33592 gemini D6 vs C4): pkgRFL keeps a FORCED line while its pair's collision line is still LINK BROKEN, but it runs before the
// keystone/contradiction checks. When one of those refuses the regrade of the collision line (S6), the line is BROKEN again while the FORCED line's
// retraction (S9) stays applied, and the gate re-read then raises a new K-G4 on that pair. The RFL check now runs again after those refusals.
const RA=" if(!map.size&&!items.length&&!resTo)return null;";
const RB=" {const P9b=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9b.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+' (its change was not applied), and a broken link keeps its FORCED line (ruling 411; pkgRFL, rechecked by pkgFCW v2)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}} /* pkgFCW v2 */\n"+RA;
const plan={base:'pkgLIB/strip_RI2',nodes:{}};
for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(IN+f,'utf8');const b=s;
 if(s.includes(DEF))s=once(s,DEF,FN+DEF,f+' def');if(SITES[f])s=once(s,SITES[f][0],SITES[f][1],f+' site');
 if(s.includes(RA))s=once(s,RA,RB,f+' rfl2');
 if(s!==b){try{new Function('$','$input','$json','$execution','$workflow',s);}catch(e){throw new Error(f+' syntax: '+e.message);}}
 fs.writeFileSync(OUT+f,s);plan.nodes[f]={before:sha(b),after:sha(s),changed:b!==s};}
fs.writeFileSync('pkgFCW/plan_FCW.json',JSON.stringify(plan,null,1));const ch=Object.entries(plan.nodes).filter(([k,v])=>v.changed);console.log(ch.length+' changed');
