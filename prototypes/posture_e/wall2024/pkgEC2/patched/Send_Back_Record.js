// ruling 428, the send-back half: reads each judge's SENDBACK lines and records one debate_enforcer_log row (kind send_back) per item: the
// judge's line, the enforcer's reason, and the judge's answer (KEEP or CHANGE TO, with its sentence). The judge keeps the decision. NOT BUILT
// here: a CHANGE does not yet recompute the judge's counts or result; it is recorded and printed in the run document.
const PASS=$('Judge Enforcer Record').first().json;
const B=$('Send Back Build').all().map(x=>x.json);const first=B[0]||{};const T=new Date().toISOString();
const ns=(first.sb_not_sent||[]).map(x=>({run_token:null,seat:x.seat,seat_role:'panel',judge_model:null,kind:'send_back',rule:x.rule,item:x.item||null,flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));
if(first.sb_skip)return [{json:{...PASS,sendback:{skipped:true,why:first.sb_why||'',not_sent:ns.length,tally:{}},sb_rows:ns,sb_items:[]}}];
const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={}; /* pkgSBS: seat -> silent S numbers */
function psGrades(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,'$1 ')
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig; /* the clause's grade is its first grade word (a later "counted" or "VOID" in the prose does not regrade it) */
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}
// pkgEC2 (W3 Wall 2446): the LIVE cure reading for E-ANS and E-PREM send-backs. Record-only until W3 promotes the rules.
function enf428Cure(it,a,R,named){ /* named: the premise numbers of every E-PREM item the seat was sent on the same flagged line (pkgPS); default the item's own */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
 const side=k=>/^CR/i.test(k)?'C':/^DR/i.test(k)?'D':null;const has=(k,q)=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return !!t&&t.includes(' '+N(q)+' ');};
 const six=(why,ks)=>{const w=N(why).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ks.some(k=>has(k,r)))return r;}return null;};
 const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
 const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 const pieces=s=>String(s).split(/["'”’]\s*;\s*["'“‘]|\.{3}|…/).map(x=>x.trim()).filter(x=>N(x).split(' ').length>=3);
 if(it.rule==='E-ANS'){const f=String(it.line||'').replace(/\\+"/g,'"').match(AC);if(!f)return res(false,'the flagged line is not read as an ANSWER CHECK line');const fs=side(f[2]);const SR=Object.keys(R||{}).filter(k=>side(k)===fs);
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the answering side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the answering side\'s rounds');}
  const t=String(a.to||'').replace(/\\+"/g,'"').match(AC);if(!t)return res(false,'the CHANGE TO is not an ANSWER CHECK line');if(N(t[1])!==N(f[1]))return res(false,'the CHANGE TO names another verse ('+t[1]+')');
  if(/^(MISSES|FAILS)$/i.test(t[5]))return res(true,'CHANGE TO grades MISSES');const ks=t[2].split(/\s*[;,]\s*/).map(k=>k.toUpperCase());
  if(ks.some(k=>side(k)!==fs))return res(false,'the CHANGE TO moves the answer to the other side\'s round');const ps=pieces(t[4]);if(!ps.length)return res(false,'the CHANGE TO quotes no answer of 3 or more words');
  const miss=ps.filter(p=>!ks.some(k=>has(k,p)));if(miss.length)return res(false,'the CHANGE TO answer is not found word for word in ['+ks.join('; ')+']: "'+miss[0].slice(0,120)+'"');
  const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta))return res(false,'the CHANGE TO MEETS quotes the flagged answer again (or a shorter cut of it)');
  return res(true,'CHANGE TO MEETS with a fuller answer found in ['+ks.join('; ')+']');}
 if(it.rule==='E-PREM'){const m=String(it.item||'').match(/against the (defender|challenger)\s+(\d+)/i);if(!m)return res(false,'the item names no premise');const n=+m[2];const fs=/^d/i.test(m[1])?'C':'D'; /* the defender's premise is answered in the defender's rounds (CR) */
  const right=(String(it.reason||'').match(/\(right:\s*([A-Z ]+?)\)/)||[])[1]||null;const SR=Object.keys(R||{}).filter(k=>side(k)===fs);const ALL=Object.keys(R||{}).filter(k=>side(k));
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the side\'s rounds');}
  const to=String(a.to||'');let g=null;const P=typeof psGrades==='function'?psGrades(to):null;if(P&&(n in P.g))g=P.g[n];
  if(!g){const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(z){const k=z[1].toUpperCase();g=k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';}}
  if(!g)return res(false,'the CHANGE TO gives premise '+n+' no grade the engine reads');
  {const Q=typeof psGrades==='function'?psGrades(it.line):null;if(P&&Q){const nm=named&&named.size?named:new Set([n]);const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]&&!nm.has(k));
   if(out.length||P.side!==Q.side||(P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>nm.size))return res(false,'the CHANGE TO regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count or side')+' beyond its items (pkgPS refuses it)');}}const want=right&&/VOID/.test(right)?'VOID':right&&/COUNTED|UNEXHIBITED|CONCEDED/.test(right)?'COUNTED':right?'SPARED':null;
  if(want&&g!==want)return res(false,'the CHANGE TO grades premise '+n+' '+g+', not the enforcer\'s '+want);
  const qs=[...to.matchAll(/["“]([^"”]{8,240})["”]/g)].map(x=>x[1]).filter(q=>N(q).split(' ').length>=3);const miss=qs.filter(q=>!ALL.some(k=>has(k,q)));
  if(miss.length)return res(false,'a quote in the CHANGE TO is not found in any round: "'+miss[0].slice(0,120)+'"');return res(true,'CHANGE TO grades premise '+n+' '+g+(qs.length?', its quotes found in the rounds':''));}
 return res(false,'not an E-ANS or E-PREM item');}
let __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){__RD=c.rounds;break;}}}catch(e){}if(__RD)break;} /* pkgEC2: the rounds, read as Judge Enforcer Build reads them */
B.forEach((b,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);errors.push(b.seat+': '+err);}
 /* WALL-1963 reply 1965 DEFECT 1: a judge whose system message demands strict JSON may wrap its lines in a JSON string (run 32725, Panel Cure
  Call 2), so escaped line breaks and quotes are undone first and a SENDBACK line is read wherever it starts in a line. */
 const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();/* WALL-2024 2243 A (run 32980: gemini wrote "SENDBACK: ITEM S1 || ..." on all 17 items, and every one was logged NO ANSWER): the id may
   follow "ITEM" or "#", the colon may be missing, and the S and its number may be spaced; KEEP and CHANGE TO in any case; a CHANGE TO with no closing "|| reason" is read to the end of
   its line (32980 gemini S1 to S7, S11, S12, S14 to S17). */
  const m=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(m){m[1]=m[1].replace(/\s+/g,'');m[4]=m[4]||'';}
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}
 (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;
  let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'){try{const nm=it.rule==='E-PREM'?new Set((b.items||[]).filter(y=>y.rule==='E-PREM'&&String(y.line)===String(it.line)).map(y=>+((String(y.item||'').match(/(\d+)\s*$/)||[])[1]))):null;
   __ec=__RD?enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason},a||{ans:'NO ANSWER'},__RD,nm):{status:'UNREAD',why:'no rounds found in the Panel Cure Normalize nodes'};}catch(e){__ec={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgEC2 (W3 2446): record-only */
  const named=!a&&!err&&new RegExp('\\bS\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\d)').test(T2);const silent=!a&&!err&&!named;if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid); /* pkgSBS (W3 2274): silence counts; a written but unread answer does not */
  shown.push({seat:b.seat,sid:it.sid,rule:it.rule,item:it.item,line:it.line,reason:it.reason,ans,to:a?a.to:'',why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});
  rows.push({run_token:b.run_token,seat:b.seat,seat_role:'panel',judge_model:b.api_model,kind:'send_back',rule:it.rule,item:it.item||null,flagged_line:String(it.line).slice(0,1500),
   prompt_sent:k===0?b.msg:null,full_reply:k===0?(txt||null):null,reply_error:err,response_line:a?a.line.slice(0,1500):null,cure_status:null,
   cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':'')+(__ec?' | CURE (record-only until promoted): '+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});});});
let bodies=null,anySil=false;const silent_counted=[]; /* pkgSBS: add each seat's silent items to its drv_uncured, as Gate Record does for uncured gate items */
if(Object.keys(SIL).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
 for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
return [{json:{...PASS,...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted},sb_rows:rows,sb_items:shown}}];
