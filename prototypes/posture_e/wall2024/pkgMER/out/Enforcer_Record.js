// ruling 421 (TRIAL): the DeepSeek enforcer's verdicts, one debate_enforcer_log row (kind enforcer_check) per judge answer; the panel cure output
// passes through unchanged (Alternate Needed? and every later node read it as before). A failed or unread call is recorded, never thrown.
const PCC=$('Panel Cure Check').first().json;const B=$('Enforcer Build').first().json;const T=new Date().toISOString();
let rep=null;try{if($('Enforcer Call deepseek').isExecuted)rep=$('Enforcer Call deepseek').first().json;}catch(e){rep=null;}
/* pkgMER: when the call failed, Enforcer Retry Build cut it into parts of whole ITEMs and Enforcer Retry Call deepseek sent each once; the parts' replies take the call's place.
   A part that fails again leaves its ids NO VERDICT, with that part's failure as their reply_error. */
let __MP=[];try{if($('Enforcer Retry Call deepseek').isExecuted){const RB=$('Enforcer Retry Build').all().map(x=>x.json);const RC=$('Enforcer Retry Call deepseek').all().map(x=>x.json);__MP=RB.map((x,i)=>({x,rep:RC[i]})).filter(z=>z.x&&z.x.esr_retry===true);}}catch(e){__MP=[];}
const env=j=>{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content};
 if(j&&j.error){const e=j.error;return {ok:false,why:String(typeof e==='string'?e:(e.message||JSON.stringify(e))).slice(0,300)};}return {ok:false,why:j?'no reply text ('+Object.keys(j).join(',')+')':'no call made'};};
const rows=[];let tally=null;
const __mEnv=j=>{const v=env(j);if(v.ok&&!String(v.text).trim()){const c=j&&j.choices&&j.choices[0];return {ok:false,why:'empty content (finish_reason '+((c&&c.finish_reason)||'none')+')'};}return v;}; /* pkgMER: an empty reply is a failure */
if(!B.enf_skip){let e=env(rep);const __ME={};if(__MP.length){const ps=__MP.map(z=>({ids:(z.x.ids||[]).map(y=>String(y.id).toUpperCase()),e:__mEnv(z.rep),part:z.x.esr_part}));
 for(const p of ps)if(!p.e.ok)for(const id of p.ids)__ME[id]='pkgMER retry part '+p.part+' of '+ps.length+': '+p.e.why;
 e=ps.some(p=>p.e.ok)?{ok:true,text:ps.filter(p=>p.e.ok).map(p=>p.e.text).join('\n')}:{ok:false,why:'pkgMER: every retry part failed ('+ps.map(p=>p.e.why).join(' | ').slice(0,280)+')'};}const V={},GV={},GL={};
 if(e.ok)for(const l of String(e.text).split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?(?:(?:G|ITEM\s*)?(\d+)\s*[\/:,]\s*)?(A(\d+)\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(.*)$/i);if(m&&(!m[1]||m[1]===m[3]))V[m[2].toUpperCase()]={v:m[4].toUpperCase(),why:m[5].trim()}; /* pkgEGA: "G<k>/A<k>.<n>" (also "ITEM k/", "k/") reads as A<k>.<n> when the k agree (33506) */
  else{const g=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM\s+)?G(\d+)|(\d+))\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(.*)$/i);if(g){const gk=g[1]||g[2];if(!GV[gk])GV[gk]={v:g[3].toUpperCase(),why:g[4].trim()};(GL[gk]=GL[gk]||[]).push({v:g[3].toUpperCase(),why:g[4].trim()});} /* pkgEGL v2: G<k> or bare <k> */}}
 /* pkgEGL (33497): an item-label verdict (G<k>) is applied to the item's answers only when none has its own line and all open with one form */
 const FORM=s=>{const m=String(s||'').replace(/[*_`"\u201c]+/g,'').trim().match(/^(COUNTED|TOUCHES NO LINK|STANDS WITHOUT IT|CONCEDED|NOT HELD|REASSERTED)\b/i);return m?m[1].toUpperCase():null;};
 for(const [k,gv] of Object.entries(GV)){const A=(B.ids||[]).filter(x=>new RegExp('^A'+k+'\\.\\d+$','i').test(x.id));if(!A.length||A.some(x=>V[x.id.toUpperCase()]))continue;const f=A.map(x=>FORM(x.response_line));
  if(f[0]&&f.every(z=>z===f[0]))for(const x of A)V[x.id.toUpperCase()]={v:gv.v,why:gv.why+' [pkgEGL: the enforcer answered item '+k+' as a whole; applied to each of its '+A.length+' answers, all '+f[0]+']'};
  else{const L=GL[k]||[];const N=z=>String(z||'').replace(/[*_`"'\u2018\u2019\u201c\u201d]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
   const op=x=>{const t=N(x.response_line).replace(/^(counted|touches no link|stands without it|conceded|not held|reasserted)\s*:?\s*/,'');return t.length>=25?t.slice(0,25):null;};const O0=A.map(op),O=O0.map((o,i)=>o&&!N(A[i].flagged_line).includes(o)&&!A.some((y,j)=>j!==i&&N(y.response_line).includes(o))?o:null);
   const cross=L.some((ln,i)=>{const w=N(ln.why);return !(O[i]&&w.includes(O[i]))&&O.some((o,j)=>j!==i&&o&&w.includes(o));});
   if(A.length>1&&L.length===A.length&&!cross)A.forEach((x,i)=>{V[x.id.toUpperCase()]={v:L[i].v,why:L[i].why+' [pkgEGP: item '+k+' answered line by line, '+L.length+' G'+k+' lines for '+A.length+' answers; line '+(i+1)+' read as '+x.id+']'};});
   else for(const x of A)V[x.id.toUpperCase()]={v:'NO VERDICT',why:'group-labelled reply, answers differ'+(L.length!==A.length?' and '+L.length+' G'+k+' lines for '+A.length+' answers':', a line quotes another answer')+' (pkgEGL/pkgEGP)'};}}
 tally={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};
 (B.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const verdict=v?v.v:'NO VERDICT';tally[verdict]=(tally[verdict]||0)+1;
  rows.push({run_token:B.run_token,seat:x.seat,seat_role:x.seat_role||'panel',judge_model:B.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
   prompt_sent:k===0?(B.body&&B.body.messages?B.body.messages[1].content:null):null,full_reply:k===0&&e.ok?e.text:null,reply_error:__MP.length?(e.ok?(__ME[String(x.id).toUpperCase()]||null):e.why):(e.ok?null:e.why),response_line:x.response_line,
   cure_status:null,cure_reason:'ENFORCER '+verdict+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge cure '+(x.cure_status||'?')+'; TRIAL, ruling 421)',at:T});});}
return [{json:{...PCC,enf421:{skipped:!!B.enf_skip,why:B.why||null,groups:B.groups||0,answers:(B.ids||[]).length,tally,...(__MP.length?{mer:{retried:__MP[0].x.esr_why,parts:__MP.length,failed_parts:__MP.filter(z=>!__mEnv(z.rep).ok).map(z=>z.x.esr_part)}}:{})},enf421_rows:rows}}];
