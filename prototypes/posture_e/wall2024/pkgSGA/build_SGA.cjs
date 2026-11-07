// pkgSGA (33218 chatgpt S20, S21 and sol S18, S19; E-APPLY "the flagged line is not in the judge text"): an item that flags one sentence of a
// judge line (E-VOID flags "Premise 2 is VOID (Commitment 6): ..." inside the CHALLENGER CONCEDED LINKS line) is applied inside that line.
// The judge's CHANGE TO for the sentence replaces that sentence, and the line keeps the rest of its words. Only when every finder before it fails,
// the change has no line label of its own, the flagged text is 30 characters or more, and it occurs exactly once in the judgment, in one line.
// If an earlier change in the same reply already rewrote that whole line without the sentence, the earlier change stands ("replaces", the last
// whole-line change wins) and no item is raised. pkgPS (b) stays: whole-line labels are never substring-replaced.
// Second fix (33218 chatgpt S25, S26, E-PREM): a CHANGE TO with no line label ("Premise 6 is NOT VOID and is spared ...") over a labelled line
// (CHALLENGER CONCEDED LINKS) replaced the whole line, so the label and the other premises' sentences were lost and S26 erased S25. Now it
// replaces the one sentence of that line that begins "Premise N" for its premise; with none or several, it is NOT APPLIED and goes to the gate.
// Base: the live nodes of d5375c6e (fetchback_live_s12.json, run 33222). Run from wall2024/: node pkgSGA/build_SGA.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const FB='/mnt/project-files/wall2024/fetchback_live_s12.json';const LIVE=JSON.parse(fs.readFileSync(FB,'utf8'));
const N=['Alternate Merge Seat','Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge'];
const E={
 let:["  const to=one(String(x.to==null?'':x.to).replace(/\\\\+\"/g,'\"')).replace(","  let to=one(String(x.to==null?'':x.to).replace(/\\\\+\"/g,'\"')).replace(",1],
 seg:["  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}",
  "  if(!o&&!sbLabel(to)){const __sg=nrm(x.line);if(__sg.length>=30){const __h=lines.filter(l=>nrm(l).split(__sg).length===2); /* pkgSGA (33218 chatgpt S20, S21; sol S18, S19): an item that flags one sentence of a line (E-VOID) is applied inside that line */\n"
 +"   if(__h.length===1&&nrm(text).split(__sg).length===2){const __o=__h[0];const __p=map.get(__o);const __c=nrm(__p?__p.to:__o);if(__c.split(__sg).length===2){o=__o;to=__c.split(__sg).join(to);}else if(__p){__p.over=(__p.over||[]).concat(x.sid);continue;}}}}\n"
 +"  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}",1],
 lab:["  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads'",
  "  {const __lo=sbLabel(o);if(__lo&&!sbLabel(to)&&SB_FORM.test(to)){const __pn=(nrm(to).match(/^Premise\\s+(\\d+)\\b/i)||[])[1];const __p=map.get(o);const __c=nrm(__p?__p.to:o); /* pkgSGA (33218 chatgpt S25, S26): a change with no line label over a labelled line would drop the label and the line's other sentences */\n"
 +"   const __ss=__c.split(/(?:(?<=[.;])|(?<=--))\\s+(?=Premises?\\s+\\d)/);const __ix=__pn?__ss.map((z,i)=>new RegExp('^Premise\\\\s+'+__pn+'\\\\b','i').test(z)?i:-1).filter(i=>i>=0):[];\n"
 +"   if(__ix.length===1){__ss[__ix[0]]=to;to=__ss.join(' ');}else{items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change has no line label and would replace the whole '+__lo+' line'+(__pn?' (the line has '+(__ix.length?'more than one':'no')+' sentence for premise '+__pn+')':'')+': write the whole line with its label (pkgSGA)',to,lines:[o]});continue;}}}\n"
 +"  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads'",1]};
const plan={source:'33218 E-APPLY NOT APPLIED (W4 report live_test_33218)',live:LIVE.versionId,nodes:[]};fs.mkdirSync('pkgSGA/base',{recursive:true});fs.mkdirSync('pkgSGA/patched',{recursive:true});
for(const n of N){const f=n.replace(/ /g,'_')+'.js';const s0=LIVE.nodes.find(z=>z.name===n).parameters.jsCode;let s=s0;const done=[];
 for(const [k,[a,b,cnt]] of Object.entries(E)){const c=s.split(a).length-1;if(c!==cnt)throw new Error(n+' '+k+': anchor x'+c+' (want '+cnt+')');s=s.split(a).join(b);done.push(k);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgSGA/base/'+f,s0);fs.writeFileSync('pkgSGA/patched/'+f,s);plan.nodes.push({name:n,file:f,base_sha:sha(s0),final_sha:sha(s),edits:done});
 console.log(n.padEnd(22),sha(s0),'->',sha(s),done.join(','));}
fs.writeFileSync('pkgSGA/plan_SGA.json',JSON.stringify(plan,null,1));
