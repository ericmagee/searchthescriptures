# BB-6904 portion 4: the Code-node bodies of the cure path. Each node's jsCode = drv_block (git 0b3cbac) + cure_lib.js + its body.
SINGLE_BUILD = r"""
const E=$input.first().json;const B=$('Build Independent Verdict').first().json;
const items=(E.debate_rule_violations||[]);const fam=CURE_FAMS[B.jidx];
let answer=null;try{answer=$('Verdict Normalizer').first().json.choices[0].message.content;}catch(e){answer=null;}
if(!fam||typeof answer!=='string'||!items.length)return [{json:{cure:{who:'single',skip:'no request could be built (family '+B.jidx+')',items}}}];
return [{json:{cure:{who:'single',seat:B.judge_model,fam,jidx:B.jidx,model:B.judge_model,items,broken:cureBroken(answer),rounds:cureRounds(B.verdictBody),body:cureBody(fam,B.verdictBody,answer,cureAsk(items,cureBroken(answer)))}}}];
"""
PANEL_BUILD = r"""
const PP=$input.first().json;const P=$('Panel Build').first().json;let R=null;try{if($('Reserve Build').isExecuted)R=$('Reserve Build').first().json;}catch(e){R=null;}
const out=[];
(PP.summary||[]).forEach((s,i)=>{const items=(s.drv||[]);if(!items.length)return;
 const jd=(s.substitute&&R&&R.seat===s.seat)?R:(P.judges||[]).find(j=>j.seat===s.seat);
 let answer=null,wt=null;try{const vr=JSON.parse(PP.bodies[i]).payload.verdict_raw;const k=vr.indexOf('\n\n[AUDIT v');answer=k>=0?vr.slice(0,k):vr;}catch(e){answer=null;}
 try{const o=JSON.parse(answer);wt=(o.reasoning!=null?o.reasoning:o.reason);}catch(e){wt=answer;} // the worked text, as portion 3 reads it
 const jidx=jd?CURE_FAMS.indexOf(jd.fam):-1;
 if(!jd||jidx<0||typeof answer!=='string'){out.push({json:{cure:{who:'panel',idx:i,seat:s.seat,skip:'no request body for this seat',items}}});return;}
 out.push({json:{cure:{who:'panel',idx:i,seat:s.seat,fam:jd.fam,jidx,model:jd.api_model,items,broken:cureBroken(wt),rounds:cureRounds(jd.body),body:cureBody(jd.fam,jd.body,answer,cureAsk(items,cureBroken(wt)))}}});});
if(!out.length)out.push({json:{cure:{who:'panel',skip:'no seat to cure',items:[]}}});
return out;
"""
NORMALIZE = r"""
// One item per cure request, in; one item out, each carrying its own request (by pairing) and the reply read without throwing.
return $input.all().map((it,i)=>{let src=null;try{src=$('__BUILD__').itemMatching(i).json.cure;}catch(e){src=null;}
 if(!src){try{src=$('__BUILD__').all()[i].json.cure;}catch(e){src=null;}}
 const reply=(it.json&&it.json.cure&&it.json.cure.skip)?{ok:false,text:null,why:it.json.cure.skip}:cureText(it.json);
 return {json:{cure:src||(it.json&&it.json.cure)||null,reply}};});
"""
SINGLE_CHECK = r"""
const base=$('Extract Independent Verdict').first().json;let rs=[];try{if($('Cure Normalize').isExecuted)rs=$('Cure Normalize').all().map(x=>x.json);}catch(e){rs=[];}
const all=base.debate_rule_violations||[];if(!all.length)return [{json:{...base,debate_rule_report:[]}}];
const r=rs[0]||null;const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
return [{json:{...base,independent_verdict_raw:base.independent_verdict_raw+'\n\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).join('\n'),debate_rule_report:v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why,statement:x.statement}))}}];
"""
PANEL_CHECK = r"""
const PP=$('Panel Payloads').first().json;let rs=[];try{if($('Panel Cure Normalize').isExecuted)rs=$('Panel Cure Normalize').all().map(x=>x.json);}catch(e){rs=[];}
const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));
summary.forEach((s,i)=>{const all=s.drv||[];s.cure=[];if(!all.length)return;
 const r=rs.find(x=>x.cure&&x.cure.idx===i)||null;
 const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made for this seat'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
 s.cure=v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why}));
 const b=JSON.parse(bodies[i]);b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureReport(s.seat,v).concat(cureProse(s.seat,r?r.reply:null)).join('\n');bodies[i]=JSON.stringify(b);});
return [{json:{...PP,bodies,summary}}];
"""
