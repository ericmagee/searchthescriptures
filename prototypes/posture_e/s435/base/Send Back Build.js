// ruling 428, the send-back half (journal 2078: the record half was built in s428a and s429; this half was approved and not built). Every line
// an enforcer DISAGREES with (the withdrawal enforcer of rulings 421/424, and E-ANS, E-VOID, E-COL of ruling 428) goes back once to the panel
// judge that wrote it, in that judge's own conversation, with the enforcer's quoted reason. The judge keeps the decision: KEEP or CHANGE, with
// one sentence quoting the debate words that decide it. Both are recorded (Send Back Record). Transport limit, not a rule: at most 60 items per
// judge; an item past that is recorded NOT SENT, never dropped silently. A judge whose call family is not openrouter is recorded NOT SENT.
const PASS=$input.first().json; // Judge Enforcer Record's output, passed on unchanged
let PB=null;try{PB=$('Panel Build').first().json;}catch(e){PB=null;}
let PCC=null;try{PCC=$('Panel Cure Check').first().json;}catch(e){PCC=null;}
let E421=[];try{if($('Enforcer Record').isExecuted)E421=$('Enforcer Record').first().json.enf421_rows||[];}catch(e){E421=[];}
const E428=PASS.enf428_rows||[];
const skip=(why,ns)=>[{json:{...PASS,sb_skip:true,sb_why:why,sb_not_sent:ns||[]}}];
const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='panel'&&/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(String(x.cure_reason||'')) /* s432: a NO ANSWER row is a reported violation too */);
if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');
if(!PB||!Array.isArray(PB.judges))return skip('the panel judges\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})));
const textOf=raw=>String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const said={};for(const s of ((PCC&&PCC.bodies)||[])){try{const p=(typeof s==='string'?JSON.parse(s):s).payload||{};said[p.judge_seat]=textOf(p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();}catch(e){}}
const why=x=>String(x.cure_reason||'').replace(/^ENFORCER (?:DISAGREE|NO ANSWER)\s*:?\s*/,'').replace(/\s*\((?:judge cure [A-Z]+; )?(?:RECORD-ONLY )?TRIAL[^)]*\)\s*$/,'').trim();
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const MAX=60;const bySeat=new Map();for(const x of dis){if(!bySeat.has(x.seat))bySeat.set(x.seat,[]);bySeat.get(x.seat).push(x);}
const out=[];const not_sent=[];
for(const [seat,list] of bySeat){const j=PB.judges.find(q=>q.seat===seat);
 if(!j||!j.body||!Array.isArray(j.body.messages)){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'no panel request for this seat'}));continue;}
 if(j.fam!=='openrouter'){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'call family '+j.fam+' has no send-back route'}));continue;}
 if(!said[seat]){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'the judge\'s own judgment text could not be read'}));continue;}
 const items=list.slice(0,MAX).map((x,k)=>({sid:'S'+(k+1),rule:x.rule,item:x.item||'',line:x.flagged_line||x.response_line||'',reason:why(x),src:x}));
 list.slice(MAX).forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'over the '+MAX+'-item transport limit'}));
 const msg='An enforcer has read some of your lines against the debate record and reports a violation in each. Its reasons are quoted below. You keep the decision. For each item, KEEP your line or CHANGE it, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n\n'
  +items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\nYOUR LINE: '+cut(i.line,1500)+'\nTHE ENFORCER: '+cut(i.reason,900)).join('\n\n')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nSENDBACK: <item id> || KEEP || <one sentence quoting the words that decide it>\nSENDBACK: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';
 const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:said[seat]},{role:'user',content:msg}]};
 out.push({json:{sb_skip:false,seat,api_model:j.api_model,run_token:PB.run_token||null,items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason})),msg,body}});}
if(!out.length)return skip('no disagreement could be sent',not_sent);
out[0].json.sb_not_sent=not_sent;return out;
