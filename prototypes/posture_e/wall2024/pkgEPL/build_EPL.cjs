// pkgEPL (W2, 11-07): the enforcer reply names each judge LINE, not the ITEM. Run 33442: call 5 of Judge Enforcer held 10 E-PREM items
// (P3..P12, 3 judge lines each, ids P3.1..P12.3); DeepSeek answered once per ITEM ("ENFORCER: P3 -- AGREE -- RIGHT: SPARED ..."), finish "stop".
// A bare label naming 3 lines maps to no single line (pkgEID rule), so all 30 E-PREM checks were NO VERDICT. The prompt's own form line
// invited it: "one line per ITEM id (the id alone, for example H2.1)" while the ITEM header carries the dotless id.
// Fix A, in the two DeepSeek prompt builders: (1) the form line asks for one line per LINE id and says the dotless ITEM id is never a label;
// (2) every item with 2+ judge lines ends with "REPLY LINES DUE FOR THIS ITEM: P3.1, P3.2, P3.3", added after calls are packed, so each
// call holds the same items as before; a pkgESR/ESS split half carries the line with its item.
// Fix B, the two Records: a bare ITEM label naming 2+ lines is applied to each line only when every seat's grade there is the same
// (E-PREM: each judge's count line reads CONCEDED LINKS: 0; other rules: same grade on the same line). Otherwise it stays NO VERDICT, as now.
// Fix C, the two Retry Builds (pkgESS): such a bare line counts as answering each of its lines, so the call is not resent for nothing.
// Base: live s48. Run from wall2024/: node pkgEPL/build_EPL.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R=[
 ["Reply with exactly one line per ITEM id (the id alone, for example H2.1; never the judge\\'s name, and never the name beside the id), and nothing else, in this form:\\nENFORCER: <item id> --",
  "Reply with exactly one line per LINE id, and nothing else. A LINE id has a dot (for example H2.1, P3.2); each ITEM lists its LINE ids under REPLY LINES DUE or beside each judge line. The ITEM id without the dot (for example P3) is never a reply label: an ITEM with three judge lines takes three reply lines, one for each LINE id, each graded on that judge\\'s own line. Write the id alone; never the judge\\'s name, and never the name beside the id. The form:\\nENFORCER: <line id> --"],
 ["content:RULES+'\\n\\n'+c.map(x=>x.text).join('\\n\\n')",
  "content:RULES+'\\n\\n'+c.map(x=>x.text+(Array.isArray(x.ids)&&x.ids.length>1?'\\nREPLY LINES DUE FOR THIS ITEM: '+x.ids.map(y=>y.id).join(', ')+' (one ENFORCER line for each; the ITEM id alone is not a label)':'')).join('\\n\\n') /* pkgEPL: 33442 call 5 answered P3..P12 once per ITEM, 30 NO VERDICT; added after packing, so the calls hold the same items */"]];
const HELPER=String.raw`const __eplOK=ids=>{if(!Array.isArray(ids)||ids.length<2||ids.some(x=>x.rule!==ids[0].rule))return false;const g=x=>x.rule==='E-PREM'?(/CONCEDED LINKS\s*:\s*0\b/i.test(String(x.flagged_line||''))?'SPARED':null):(String(x.grade||'')+'|'+String(x.flagged_line||''));const a=ids.map(g);return a[0]!==null&&a.every(y=>y===a[0]);}; /* pkgEPL: one reply line under a bare ITEM id stands for each of its judge lines only when every seat's grade there is the same (E-PREM: each judge counts 0 links, so each spares the premise; other rules: the same grade on the same line) */`;
const RREC=[ /* the two Records */
 ["const V={};const errors=[];const errAt={};", HELPER+"\nconst V={};const errors=[];const errAt={};"],
 ["if(__c.length!==1){", String.raw`if(__c.length>1&&__eplOK(__c)){for(const x of __c){const id=String(x.id).toUpperCase();if(!V[id])V[id]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}__eid.epl_fanout=(__eid.epl_fanout||0)+__c.length;continue;} /* pkgEPL: 33442 call 5, bare P3..P12 */`+"\n  if(__c.length!==1){"]];
const RRET=[ /* the two Retry Builds: the pkgESS short-reply count */
 ["const out=[];", HELPER+"\nconst out=[];"],
 [String.raw`const n=(txt.match(/^[ \t>*_` + "`" + String.raw`-]*ENFORCER\s*:/gim)||[]).length;`,
  String.raw`let n=(txt.match(/^[ \t>*_` + "`" + String.raw`-]*ENFORCER\s*:/gim)||[]).length;for(const l of txt.split('\n')){const mm=l.replace(/[*_` + "`" + String.raw`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPRS]\d+)\s*(?:--|—|–|-)/i);if(!mm)continue;const c=((b&&b.ids)||[]).filter(x=>String(x.id).toUpperCase().startsWith(mm[1].toUpperCase()+'.'));if(c.length>1&&__eplOK(c))n+=c.length-1;} /* pkgEPL: a bare Pk that the Record fans out answers each of its Pk.n lines */`]];
const RULES={'Judge_Enforcer_Build.js':R,'Alt_Judge_Enforcer_Build.js':R,'Judge_Enforcer_Record.js':RREC,'Alt_Judge_Enforcer_Record.js':RREC,'Judge_Enforcer_Retry_Build.js':RRET,'Alt_Judge_Enforcer_Retry_Build.js':RRET};
const plan={};for(const f of Object.keys(RULES)){let s=fs.readFileSync('pkgEPL/base_s48/'+f,'utf8');const s0=s;
 for(const [a,b] of RULES[f]){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': '+c+' x '+a.slice(0,60));s=s.replace(a,()=>b);}
 new Function('$','$input',s); /* syntax */
 fs.writeFileSync('pkgEPL/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(34),h(s0),'->',h(s));}
fs.writeFileSync('pkgEPL/patched.plan.json',JSON.stringify(plan,null,1));
