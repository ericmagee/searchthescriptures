const PASS=$('Send Back Record').first().json;
const skip=(why,nc)=>[{json:{rr_skip:true,rr_why:why,not_checked:nc||[]}}];
const want=(PASS.sb_items||[]).filter(x=>x&&x.ans==='CHANGE'&&String(x.to||'').trim()&&/^\(right\s*:/i.test(String(x.reason||'').trim()));
if(!want.length)return skip('no replaced line that DeepSeek had flagged');
let JB=[];try{JB=$('Judge Enforcer Build').all().map(x=>x.json).filter(j=>j&&j.je_skip!==true&&j.body&&Array.isArray(j.body.messages)&&j.body.messages.length>=2&&Array.isArray(j.ids));}catch(e){JB=[];}
if(!JB.length)return skip('the first enforcer calls could not be read',want.map(x=>x.seat+' '+x.sid));
const nrm=s=>String(s==null?'':s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const SYS=String(JB[0].body.messages[0].content||'');const U0=String(JB[0].body.messages[1].content||'');const at=U0.search(/\n\nITEM [A-Z]+\d+ \(/);
if(at<0)return skip('the first enforcer call holds no ITEM block',want.map(x=>x.seat+' '+x.sid));const RULES=U0.slice(0,at);
const blocks={};const ids=[];for(const j of JB){for(const p of String(j.body.messages[1].content||'').split(/\n\n(?=ITEM [A-Z]+\d+ \()/)){const m=p.match(/^ITEM ([A-Z]+\d+) \(/);if(m&&!(m[1] in blocks))blocks[m[1]]=p;}for(const x of j.ids)ids.push(x);}
const HEAD='SECOND READING. Each ITEM below is shown as it was first read. After that reading one judge was sent the enforcer\'s reason and replaced its line; the replaced line is given under the ITEM. Read only the replaced line, under the same rule and beside the same record, as the line of the id named. A replaced line is judged as it now stands: its grade, its ground and its quotations. Reply with exactly one ENFORCER line for each REPLY LINE DUE, in the form above, and nothing else.';
const CALL_CHARS=40000,MAX_CALLS=4;const calls=[[]];let used=0;const not_checked=[];
for(const x of want){const c=ids.filter(y=>y.seat===x.seat&&y.rule===x.rule&&String(y.item||'')===String(x.item||''));
 const line=nrm(x.line).slice(0,1200);const hit=c.filter(y=>nrm(y.flagged_line).slice(0,1200)===line);const y=hit.length===1?hit[0]:(c.length===1?c[0]:null);
 const blk=y?blocks[String(y.id).split('.')[0]]:null;if(!y||!blk){not_checked.push(x.seat+' '+x.sid+' ('+x.rule+'): '+(y?'its ITEM block was not found':'its line id was not found among the first calls'));continue;}
 const text=blk.replace(/\nREPLY LINES DUE FOR THIS ITEM:[^\n]*/,'')+'\nTHE REPLACED LINE of '+y.id+' ('+x.seat+'), written after the send-back in place of its line above:\n'+String(x.to).trim()+'\nREPLY LINE DUE: '+y.id;
 const it={id:y.id,seat:x.seat,sid:x.sid,rule:x.rule,item:x.item||null,to:String(x.to),reason:String(x.reason||''),text};const sz=text.length+50;
 if(used+sz>CALL_CHARS&&calls[calls.length-1].length){if(calls.length>=MAX_CALLS){not_checked.push(x.seat+' '+x.sid+' ('+x.rule+'): over the call limit');continue;}calls.push([]);used=0;}calls[calls.length-1].push(it);used+=sz;}
const C=calls.filter(c=>c.length);if(!C.length)return skip('no replaced line could be matched to its first reading',not_checked);
const model=JB[0].body.model;const run_token=JB[0].run_token||PASS.run_token||null;
return C.map((c,ci)=>({json:{rr_skip:false,call:ci+1,calls:C.length,model,run_token,not_checked:ci===0?not_checked:[],ids:c.map(x=>({id:x.id,seat:x.seat,sid:x.sid,rule:x.rule,item:x.item,to:x.to,reason:x.reason})),
 body:{model,max_tokens:Math.max(Number(JB[0].body.max_tokens)||0,8000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:RULES+'\n\n'+HEAD+'\n\n'+c.map(x=>x.text).join('\n\n')}]}}}));