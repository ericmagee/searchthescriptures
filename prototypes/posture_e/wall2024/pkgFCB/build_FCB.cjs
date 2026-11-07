// pkgFCB (W3 B7 rulings 00:05Z 11-07): K-FC, the CARRIED BY quote on a FORCED line, checked against the pressed verse's whole KJV text. TRIAL.
// Bases: pkgPTA/patched for its part A nodes (graded PASS, W3 2657), pkgLNX/patched for Extract Independent Verdict (PASS, W3 2661), otherwise
// live fetchback_live_1b49671d.json. Every anchor must occur the stated number of times. Run from wall2024/: node pkgFCB/build_FCB.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_1b49671d.json','utf8'));const W=w.data||w;const NS=(W.nodes||W.workflow?.nodes);
const PTA=JSON.parse(fs.readFileSync('pkgPTA/plan_PTA_A.json','utf8')).nodes.map(n=>n.node);
const LIB=fs.readFileSync('pkgFCB/kfc_lib.js','utf8');
const rep=(s,a,b,f,k=1)=>{const n=s.split(a).length-1;if(n!==k)throw new Error(f+': anchor x'+n+' (want '+k+'): '+a.slice(0,80));return s.split(a).join(b);};
const E={
 lib:["const KR_LINE=",LIB+"const KR_LINE="],
 drv:["{const F9=kfLines(text,R);F9.items.forEach(x=>items.push(x));F9.marks.forEach(x=>marks.push(x));}","{const F9=kfLines(text,R);F9.items.forEach(x=>items.push(x));F9.marks.forEach(x=>marks.push(x));}\n    {const FC=kfcLines(text,R);FC.items.forEach(x=>items.push(x));FC.marks.forEach(x=>marks.push(x));} // pkgFCB: K-FC (TRIAL)"],
 enf:["'K-F':'LIVE','K-R':'TRIAL'","'K-F':'LIVE','K-FC':'TRIAL','K-R':'TRIAL'"],
 lst:["x.rule==='K-F'||x.rule==='K-R'","x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-R'",2],
 keys:["x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-L2'","x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-L2'"],
 cure:["if(x.rule==='K-F'){if(wd.has(U(x.link)))",
  "// pkgFCB K-FC (TRIAL; W3 B7): cured by RETRACTED for the link, by a RESTATED line not graded LINK BROKEN, or by one FORCED line for the item whose\n"
 +"  // CARRIED BY words stand in the pressed verse as the run read it (a verse the run did not read is NOT CHECKED and cures).\n"
 +"  if(x.rule==='K-FC'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));\n"
 +"   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);\n"
 +"   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\\s*)?FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:/i.test(l)&&U(l).replace(/\\s+VS\\.?\\s+/g,' VS ').includes(U(x.link).replace(/\\s+VS\\s+/g,' VS ')));\n"
 +"   if(!fl.length)return res('UNCURED','TRIAL rule (K-FC): no FORCED line for '+x.link+' with CARRIED BY, no RETRACTED line and no RESTATED line regrading it',null);\n"
 +"   const chk=kfcLines(fl[0],R);if(chk.items.length)return res('UNCURED','TRIAL rule (K-FC): '+chk.items[0].why,[fl[0]]);\n"
 +"   return res('CURED','TRIAL rule (K-FC): the FORCED line carries CARRIED BY words that stand in the pressed verse'+(chk.report.length?' ('+chk.report[0]+')':''),[fl[0]]);}\n"
 +"  if(x.rule==='K-F'){if(wd.has(U(x.link)))"],
 r396:["-- FAILS: \\\"<the words of the layer of that answer that fails to show the fit, quoted from the ANSWER round>\\\" -- GROUND:",
  "-- FAILS: \\\"<the words of the layer of that answer that fails to show the fit, quoted from the ANSWER round>\\\" -- CARRIED BY: \\\"<the words of the pressed witness's own verse that state its MEANS sentence, quoted from the KJV>\\\" -- GROUND:"],
 r396b:["K-F, a TRIAL check, reads the three, and a forced-link grade without them is returned for cure.\";",
  "K-F, a TRIAL check, reads the three, and a forced-link grade without them is returned for cure. CARRIED BY shows that the pressed verse itself carries the MEANS sentence; K-FC, a TRIAL check, finds its words in that verse as the KJV reads it. A MEANS its own verse does not carry is no ground for a forced link.\";"]};
const OUT='pkgFCB/patched';fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync('pkgFCB/base',{recursive:true});const plan={rulings:'W3 00:05Z 11-07 (TRIAL; whole KJV verse)',nodes:[]};
for(const n of NS){const c0=(n.parameters||{}).jsCode;if(typeof c0!=='string')continue;const f=n.name.replace(/ /g,'_')+'.js';
 const has=k=>c0.includes(E[k][0]);const ks=Object.keys(E).filter(has);if(!ks.length)continue;
 const base=PTA.includes(n.name)?'pkgPTA/patched':(n.name==='Extract Independent Verdict'?'pkgLNX/patched':'live 1b49671d');
 const s0=base==='live 1b49671d'?c0:fs.readFileSync(base+'/'+f,'utf8');let s=s0;
 const want=[];if(s0.includes('function kfLines'))want.push('lib');for(const k of ['drv','enf','lst','keys','cure','r396','r396b'])if(s0.includes(E[k][0]))want.push(k);
 for(const k of want){const [a,b,cnt]=E[k];s=rep(s,a,b,n.name+' '+k,k==='lib'?1:(cnt||1));}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgFCB/base/'+f,s0);fs.writeFileSync(OUT+'/'+f,s);
 plan.nodes.push({name:n.name,file:f,base,base_sha:sha(s0),final_sha:sha(s),edits:want});console.log(n.name.padEnd(28),base.padEnd(16),sha(s0),'->',sha(s),want.join(','));}
fs.writeFileSync('pkgFCB/plan_FCB.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length,'nodes');
