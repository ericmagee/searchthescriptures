// ruling 428: records the enforcer's readings of the judges' ANSWER CHECK grades (E-ANS) and VOID rulings (E-VOID). RECORD-ONLY TRIAL: one
// debate_enforcer_log row per judge grade (kind enforcer_check); nothing goes back to a judge. Passes Enforcer Record's output on unchanged.
const PASS=$('Enforcer Record').first().json;
const B=$('Judge Enforcer Build').all().map(x=>x.json);const first=B[0]||{};
const CODE=first.code_rows||[]; /* s434: code-checked violations of the verdict lines (ruling 443) */
if(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||'',code_violations:CODE.length},enf428_rows:CODE}}];
const T=new Date().toISOString();
/* pkgETC (W2; coordinator 14:20Z on Eric 08:19 CST; 33311 rows 13335, 13350): a DeepSeek enforcer verdict whose "right:" label contradicts the ruling its
   own reason concludes. Returns the concluded ruling (string) when they contradict, else null. Quoted words are masked first, so a quote is never read as
   the enforcer's conclusion. Only an explicit conclusion counts: "the correct/right ruling is R", or "so/therefore/thus/hence ... is R" not followed by "but". */
const ETC=(rule,tag,why)=>{if(!tag||!why)return null;
 const w=String(why).replace(/"[^"]*"|“[^”]*”/g,' ').replace(/(^|[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,'$1 ');
 const R='(?:not\\s+|does\\s+not\\s+)?(?:counted|unexhibited|spared|void|meets|misses|broken|stands|underdetermined|follows|follow|true|overstated)';
 const NX='\\b(?!\\s+(?:follows|does\\s+not\\s+follow))';
 const P=[new RegExp('(?:correct|right|proper|true)\\s+(?:ruling|grade|reading|result)\\s+(?:is|would\\s+be|was)\\s+('+R+')'+NX,'i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:is|are|stands|remains|should\\s+be|must\\s+be)\\s+('+R+')'+NX+'(?![^.;]*\\bbut\\b)','i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:it|the\\s+answer|the\\s+grade|the\\s+line|the\\s+keystone|the\\s+collision|the\\s+result|the\\s+conclusion)\\s+((?:does\\s+not\\s+)?(?:meets|misses|stands|follows|follow))'+NX+'(?![^.;]*\\bbut\\b)','i')];
 let c=null;for(const p of P){const m=w.match(p);if(m){c=m[1].toUpperCase().replace(/\s+/g,' ');break;}}if(!c)return null;
 const neg=/^(?:NOT|DOES NOT) /.test(c);const base=c.replace(/^(?:NOT|DOES NOT) /,'').replace(/^UNEXHIBITED$/,'COUNTED').replace(/^FOLLOW$/,'FOLLOWS');
 const B3=['BROKEN','STANDS','UNDERDETERMINED'];const F={'E-ANS':['MEETS','MISSES'],'E-COL':B3,'E-HOLD':B3,'E-KEY':B3,'E-PREM':['COUNTED','SPARED','VOID'],'E-RES':['FOLLOWS'],'E-SYN':['TRUE','OVERSTATED'],'E-VOID':['VOID']}[rule];
 if(!F||!F.includes(base))return null;const t=String(tag).toUpperCase().replace(/\s+/g,' ');
 if(neg)return base===t?c:null;
 if(base===t)return null;if(t==='NOT VOID'&&(base==='SPARED'||base==='COUNTED'))return null;return c;};
const __eid={bare_number:0,seat_beside_id:0,mapped_by_order:0,calls_mapped:[],unmapped:0}; /* pkgEID */
const R=$input.all().map(x=>x.json);const V={};const errors=[];const errAt={}; /* pkgJEC (a): each call's own error, by its index (33060: the labels shifted) */
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){const w='call '+(i+1)+': no reply ('+String(r&&r.error&&(r.error.message||JSON.stringify(r.error))||r&&r.message||('no message; reply keys: '+(Object.keys(r||{}).slice(0,8).join(',')||'none'))).slice(0,160)+')';errAt[i]=w;errors.push(w);return;}
 if(!txt.trim()){const w='call '+(i+1)+': empty content'+(r.choices[0].finish_reason?' (finish_reason '+r.choices[0].finish_reason+')':'');errAt[i]=w;errors.push(w);return;}
 /* pkgEID (W3 2893) */const __sk=[];
 for(const l of txt.split('\n')){const __t=l.replace(/[*_`]+/g,'').trim();const m=__t.match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPR]\d+(?:\.\d+)?)(?:\s*(?:\(\s*[A-Za-z][\w.-]*\s*\)|,\s*[A-Za-z][\w.-]*))?\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(m&&!/\./.test(m[1])){const __c=((B[i]||{}).ids||[]).filter(x=>String(x.id).toUpperCase().startsWith(m[1].toUpperCase()+'.'));if(__c.length!==1){__eid.unmapped++;errors.push('call '+(i+1)+': reply label '+m[1]+' names no single item of the call; NO VERDICT (pkgEID label fault)');continue;}__eid.bare_number++;m[1]=__c[0].id;}
  if(m){if(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?[BVKYHZPR]\d+\.\d+\s*[(,]/i.test(__t))__eid.seat_beside_id++;V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};continue;}
  const s=__t.match(/^ENFORCER\s*:\s*(?:(?:JUDGE|SEAT)\s+)?([A-Za-z][\w.-]*)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);if(s&&!/^[BVKYHZPR]\d/i.test(s[1]))__sk.push(s);}
 if(__sk.length){const ids=((B[i]||{}).ids||[]);const seq=ids.map(x=>String(x.seat||'').toLowerCase()).join('|');
  if(ids.length===__sk.length&&__sk.map(s=>s[1].toLowerCase()).join('|')===seq){let n=0;ids.forEach((x,k)=>{const id=String(x.id).toUpperCase();if(V[id])return;const s=__sk[k];V[id]={v:s[2].toUpperCase(),right:(s[3]||'').toUpperCase(),why:s[4].trim()};n++;});__eid.mapped_by_order+=n;__eid.calls_mapped.push(i+1);}
  else{__eid.unmapped+=__sk.length;errors.push('call '+(i+1)+': '+__sk.length+' reply line(s) keyed by judge name, not item id, do not match the call\'s '+ids.length+' item line(s) in count and judge order; those items stay NO VERDICT (pkgEID label fault)');}}});
/* pkgEPS (W3 2842) */const EPS_STATUS='LIVE';
function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:(?:is|are)\s+)?(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/;
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');
 if(!full){const c=t.search(/^[ \t>*_#-]*(?:the\s+)?pressed(?:\s+(?:verses|witnesses))?\s*[.:]/im);if(c>0)t=t.slice(0,c);}
 const met=new Set();const src=/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b/i.test(t);let first=null;
 for(const s of t.split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const refs=[...s.matchAll(LB_REF)].map(m=>m[0].replace(/\.\s/,' '));
  const hasQ=/["“][^"”\n]{4,}?["”]|(?:^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/.test(s);

  for(const m of s.matchAll(LB_TL)){const w=m[2];const last=w.split(/\s+/).pop();if(DRV_TL_STOP.test(last)||DRV_TL_STOP.test(w.split(/\s+/)[0]))continue;
   if(DRV_SRC.test(w)||m[1]||src){met.add('L2');break;}}
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}} // an italic source word with its meaning
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');}
 // each quotation with the reference it carries (written just after it in brackets, or the nearest reference before it): the first verse quoted
 // is [L1]; any other verse quoted after it is [L3] (ruling 400). Quotations in one sentence are read one by one.
 {const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)].map(m=>({a:m.index,b:m.index+m[0].length}));
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}}
 return [...met].sort();}
const __epsBlk={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-PREM'&&typeof x.blk==='string'&&!(x.item in __epsBlk))__epsBlk[x.item]=x.blk;}));
/* pkgEPD (W3 2849) */const EPD_STATUS='LIVE';
/* pkgEPD (W3 2849 item 4): an unlabelled COUNTED push that quotes 6 or more consecutive words of a sentence in the side's own block containing drop, withdraw or grant is a concession push: not held. */
function epdWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿]+/g,' ').trim().split(' ').filter(Boolean);}
function epdDrop(why,blk){const sents=String(blk||'').split(/(?<=[.;:!?])\s+|\n+/).filter(s=>/\b(?:drop|drops|dropped|withdraw|withdraws|withdrew|withdrawn|grant|grants|granted)\b/i.test(s));if(!sents.length)return null;
 const w=epdWords(why);if(w.length<6)return null;const runs=new Set();for(let i=0;i+6<=w.length;i++)runs.add(w.slice(i,i+6).join(' '));
 for(const s of sents){const t=epdWords(s);for(let i=0;i+6<=t.length;i++)if(runs.has(t.slice(i,i+6).join(' ')))return s.trim().slice(0,160);}return null;}
/* pkgECQ (W3 2859) */const ECQ_STATUS='LIVE';
/* pkgECQ (W3 2859, DeepSeek lane D5): a "(CONCEDED)" E-PREM push is exempt from the EPS hold only when one of its quoted spans stands, 6+ consecutive
   words, in a give-up sentence (drop, withdraw, grant, concede, accept, give up, yield) of the counted side's OWN rounds, and that run is at least as long as
   the span's longest run in the OTHER side's rounds. Double-quoted text inside the rounds is not a side's own words and is removed first. */
function ecqWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿]+/g,' ').trim().split(' ').filter(Boolean);}
function ecqStripQ(t){return String(t||'').replace(/"[^"\n]*"/g,' ').replace(/“[^”\n]*”/g,' ');}
function ecqSents(t){return ecqStripQ(t).split(/(?<=[.;:!?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);}
function ecqRun(a,b){let best=0;const m=b.length;let prev=new Array(m+1).fill(0);for(let i=1;i<=a.length;i++){const cur=new Array(m+1).fill(0);for(let j=1;j<=m;j++)if(a[i-1]===b[j-1]){cur[j]=prev[j-1]+1;if(cur[j]>best)best=cur[j];}prev=cur;}return best;}
const ECQ_GIVE=/\b(?:drop|drops|dropped|withdraw|withdraws|withdrew|withdrawn|grant|grants|granted|concede|concedes|conceded|accept|accepts|accepted|give up|gives up|yield|yields|yielded)\b/i;
function ecqCheck(why,own,opp){const sp=[];String(why||'').replace(/"([^"\n]{8,})"|“([^”\n]{8,})”/g,(m,a,b)=>{sp.push(a||b);return m;});
 const spans=(sp.length?sp:[String(why||'')]).map(s=>ecqWords(s)).filter(w=>w.length>=6);
 const ownS=ecqSents(own).filter(s=>ECQ_GIVE.test(s)).map(ecqWords),oppS=ecqSents(opp).map(ecqWords);let bo=0,bp=0;
 for(const w of spans){let o=0,p=0;for(const s of ownS)o=Math.max(o,ecqRun(w,s));for(const s of oppS)p=Math.max(p,ecqRun(w,s));if(o>=6&&o>=p)return {ok:true,own:o,opp:p};if(o>bo||(o===bo&&p>bp)){bo=o;bp=p;}}
 return {ok:false,own:bo,opp:bp};}
let __rdRounds=null;let __ecqSides=null;{let R=null;for(const f of [()=>$('Panel Cure Normalize 1'),()=>$('Panel Cure Normalize 2'),()=>$('Panel Cure Normalize 3')]){try{const nd=f();if(nd.isExecuted)for(const it of nd.all()){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}}catch(e){}if(R)break;}__rdRounds=R;if(R)__ecqSides={D:[R.CR1,R.CR2,R.CR3,R.CR4].filter(Boolean).join('\n'),C:[R.DR1,R.DR2,R.DR3,R.DR4].filter(Boolean).join('\n')};} /* pkgECQ: the rounds read here, as Judge Enforcer Build reads them (no copy in the items) */const __ecqTrial=new Map();
function epsHold(x,v){if(!x||x.rule!=='E-PREM'||!v||v.v!=='DISAGREE'||v.right!=='COUNTED')return null;if(/^\s*\(\s*CONCEDED\b/i.test(v.why)){const sd=/against the defender/.test(x.item)?'D':/against the challenger/.test(x.item)?'C':'';if(!sd||!__ecqSides)return null;const q=ecqCheck(v.why,__ecqSides[sd],__ecqSides[sd==='D'?'C':'D']);if(q.ok)return null;return 'the (CONCEDED) quote is not the counted side own words in its rounds: longest run in its own give-up sentences '+q.own+' words, in the other side rounds '+q.opp+' words';}const blk=__epsBlk[x.item]||'';if(!blk)return null;if(epdDrop(v.why,blk))return null;let k=[];try{k=lbFoot(blk,true);}catch(e){k=[];}if(k.length<2)return null;if(unxLack(v.why,k).missing.length)return null;
 return 'the push counts the premise but names no layer the block lacks; the block exhibits '+k.map(z=>'['+z+']').join(', ');}
const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0,CONTRADICTED:0};const rows=[];
B.forEach((b,ci)=>{(b.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?ETC(x.rule,v.right,v.why):null;const verdict=__ec?'CONTRADICTED':(v?v.v:'NO VERDICT');tally[x.rule][verdict]=(tally[x.rule][verdict]||0)+1;
 let full=null;try{full=k===0?String(R[ci].choices[0].message.content||''):null;}catch(e){full=null;}
 rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',judge_model:b.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
  prompt_sent:k===0?b.body.messages[1].content:null,full_reply:full,reply_error:errAt[ci]||null,response_line:x.response_line,cure_status:null,
  cure_reason:(()=>{const __h=epsHold(x,v);const base='ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+(__ec?' [pkgETC: written '+v.v+' with right: '+v.right+', but its own reason concludes '+__ec+'; recorded, not sent back]':'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)';if(!__h)return base;const note=__h.replace(/[()]/g,' ');return EPS_STATUS==='LIVE'?base.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEPS, not sent; W3 2842: '+note+')'):base+' (TRIAL pkgEPS: would not be sent: '+note+')';})(),at:T});});});
/* pkgEFG (W3 2873) record half */const EFG_STATUS='LIVE';const __efgN={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-COL'&&x.efg)__efgN[x.item+'|'+x.seat+'|'+x.flagged_line]=x.efg;}));let __efgPushed=0;
for(const r of rows){if(r.rule!=='E-COL')continue;const n=__efgN[r.item+'|'+r.seat+'|'+r.flagged_line];if(!n)continue;const note=n.replace(/[()]/g,' ');const cr=String(r.cure_reason||'');
 if(EFG_STATUS!=='LIVE'){r.cure_reason=cr+' (TRIAL pkgEFG: '+note+')';continue;}
 if(/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(cr)){r.cure_reason=cr.replace(/ \(judge wrote /,' [pkgEFG code check: '+note+'] (judge wrote ');continue;}
 if(/^ENFORCER (?:AGREE|NO VERDICT)\b/.test(cr)){__efgPushed++;r.cure_reason='ENFORCER DISAGREE (right: UNDERDETERMINED): (pkgEFG code check) '+note+'. DeepSeek wrote: '+cr.replace(/^ENFORCER /,'').replace(/ \(judge wrote [\s\S]*$/,'').slice(0,300)+' (judge wrote FORCED; RECORD-ONLY TRIAL, ruling 428)';}}
/* pkgEAW (W3 2844) record half: an E-ANS DISAGREE with right MISSES whose reason says the answer is "only" a quoted X, where the answer block in the round
   goes on past X with a layer tag or with 12 or more words, is HELD: written "ENFORCER HELD (pkgEAW, not sent ...)", which the send-back filter
   (^ENFORCER DISAGREE|NO ANSWER) does not send. A bare "I grant it." with nothing after it is still sent. Rows of other rules are untouched. */
const EAW_STATUS='LIVE';
function eawHoldWhy(why,blk){if(!blk)return null;const m=String(why).match(/\b(?:says|states|gives|offers|grants|is)\s+only\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)|\bonly\s+(?:says|states|grants)\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)/i);if(!m)return null;
 const q=String(m[1]||m[2]).trim().replace(/[.,;:]+$/,'');if(q.length<2)return null;const __qf=s=>String(s).replace(/["\u201c\u201d'\u2018\u2019`]/g,''); /* pkgEAI: quote marks folded out on both sides */const __bf=__qf(blk);const lb=__bf.toLowerCase();const __q=__qf(q).trim().toLowerCase();const at=__q.length>=2&&lb.length===__bf.length?lb.indexOf(__q):-1;if(at<0)return null;
 const after=__bf.slice(at+__q.length);const lay=[...new Set(after.match(/\[L[1-4]\]/g)||[])];const words=after.replace(/[^A-Za-z\u00C0-\u024F0-9]+/g,' ').trim().split(' ').filter(Boolean).length;
 if(!lay.length&&words<12)return null;return 'the push says the answer is only "'+q+'", but the answer under the pressed verse goes on'+(lay.length?' with '+lay.join(', ')+',':'')+' '+words+' more words';}
const __eawBlk={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-ANS'&&typeof x.eaw_blk==='string'&&!(x.item in __eawBlk))__eawBlk[x.item]=x.eaw_blk;}));let __eawHeld=0;
for(const r of rows){if(r.rule!=='E-ANS')continue;const m=String(r.cure_reason||'').match(/^ENFORCER DISAGREE \(right: MISSES\): ([\s\S]*?) \(judge wrote /);if(!m)continue;const n=eawHoldWhy(m[1],__eawBlk[r.item]);if(!n)continue;__eawHeld++;const note=n.replace(/[()]/g,' ');
 r.cure_reason=EAW_STATUS==='LIVE'?r.cure_reason.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEAW, not sent; W3 2844: '+note+')'):r.cure_reason+' (TRIAL pkgEAW: would not be sent: '+note+')';}
/* pkgEAH (W3 2856) record half: an E-HOLD DISAGREE with right BROKEN whose reason calls a quoted "X" a bare grant (or says the answer is only "X"), where an
   answer block given for the item goes on past X with an [Ln] tag or 12 or more words, is HELD: "ENFORCER HELD (pkgEAH, not sent ...)", which the send-back
   filter does not send. A truly bare grant is still sent. */
function eahHoldWhy(why,blks){if(!Array.isArray(blks)||!blks.length)return null;const w=String(why);
 const m=w.match(/["“]([^"”]{1,200}?)["”]\s*,?\s+is\s+(?:only\s+)?a\s+bare\s+grant/i)||w.match(/\b(?:says|states|gives|offers|grants|is)\s+only\s+["“']([^"”]{1,200}?)["”'](?=[\s.,;:)]|$)/i);if(!m)return null;
 const q=String(m[1]).trim().replace(/[.,;:]+$/,'');if(q.length<2)return null;
 for(const blk of blks){const at=String(blk).toLowerCase().indexOf(q.toLowerCase());if(at<0)continue;const after=blk.slice(at+q.length);const lay=[...new Set(after.match(/\[L[1-4]\]/g)||[])];
  const words=after.replace(/[^A-Za-zÀ-ɏ0-9]+/g,' ').trim().split(' ').filter(Boolean).length;if(!lay.length&&words<12)continue;
  return 'the push calls "'+q+'" a bare grant, but the answer under the pressed verse goes on'+(lay.length?' with '+lay.join(', ')+',':'')+' '+words+' more words';}
 return null;}
const __eahBlk={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-HOLD'&&Array.isArray(x.eah_blk))__eahBlk[x.id]=x.eah_blk;}));const __eahById={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-HOLD')__eahById[x.seat+'|'+x.item+'|'+x.flagged_line]=x.id;}));
for(const r of rows){if(r.rule!=='E-HOLD')continue;const m=String(r.cure_reason||'').match(/^ENFORCER DISAGREE \(right: BROKEN\): ([\s\S]*?) \(judge wrote /);if(!m)continue;const n=eahHoldWhy(m[1],__eahBlk[__eahById[r.seat+'|'+r.item+'|'+r.flagged_line]]);if(!n)continue;const note=n.replace(/[()]/g,' ');
 r.cure_reason=r.cure_reason.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEAH, not sent; W3 2856: '+note+')');}
/* pkgEAX (W1 Wall 2904) */
/* pkgEAX (W3 grade_33389 fault 2; W1 check Wall 2900): an E-ANS DISAGREE (right: MISSES) whose reason calls the answer a grant ("only grants",
   "only says", "is only", "bare grant") (or says it gives no fit, or only restates) is HELD when the layered answer that holds the quoted words, in the round the item names, carries 3 or more
   distinct [Ln] tags, or 1 or more [Ln] tags and a fit sentence ("fits", or a "So ..." sentence) after the quoted words. A reason that names another defect (omits, ignores, nowhere, repeats or concedes the press) is never held. When the round holds the item's own "ANSWER: <verse>" block with 3+ tags, that block decides. When the block's header does not name the item's verse, the fit sentence must follow the quoted words on their own line. The quoted words must run 5+ words in that round, and the answer block must name the item's verse. Read from the round text. */
function eaxHold(why,item,RR){const w=String(why||'');
 if(!/\b(?:only|merely|bare|just)\b[^.]{0,40}\bgrant|\bgrants?\b[^.]{0,60}\b(?:only|no fit|giving no|shows no|with no)\b|\b(?:says|is)\s+only\s+["“]|\banswer is only\b|\b(?:giving|gives|shows?|with)\s+no\s+fit\b|\bno\s+fit\s+(?:is\s+)?shown\b|\bonly\s+restates\b/i.test(w))return null;
 if(/\b(?:omits?|omitted|ignores?|nowhere|leaves?\s+(?:out|unanswered)|does\s+not\s+(?:answer|address|meet|touch)|repeats?|verbatim|concedes?|withdraw(?:s|n|al)?|drops?|dropped|press(?:ed)?)\b/i.test(w))return null; /* a reason naming another defect is DeepSeek's to send */
 const rm=String(item||'').match(/\[((?:CR|DR)[1-4])\]/);if(!rm||!RR)return null;const T=String(RR[rm[1]]||'');if(!T)return null;
 const vm=String(item).match(/ANSWER CHECK (.+?) \[/);const verse=vm?vm[1].trim():'';
 const norm=s=>String(s).toLowerCase().replace(/\[[^\]]*\]/g,' ').replace(/[^a-z0-9:\s]/g,' ').split(/\s+/).filter(Boolean);
 const qs=[...w.matchAll(/["“]([^"”]{8,300})["”]/g)].map(m=>norm(m[1])).filter(q=>q.length>=5);if(!qs.length)return null;
 const L=T.split('\n');const isLay=l=>/^\s*[-*]\s*\[L[1-4]\]/.test(l);
 const blockAt=k=>{let a=k,b=k;if(isLay(L[k])){while(a>0&&isLay(L[a-1]))a--;if(a>0&&L[a-1].trim()&&!isLay(L[a-1]))a--;while(b+1<L.length&&isLay(L[b+1]))b++;}return {a,b};};
 const cands=[];
 for(let k=0;k<L.length;k++){const lw=norm(L[k]);if(!lw.length)continue;const ls=' '+lw.join(' ')+' ';
  for(const q of qs){let hit=null;for(let n=Math.min(q.length,12);n>=5;n--){for(let s=0;s+n<=q.length;s++){const run=q.slice(s,s+n).join(' ');if(ls.includes(' '+run+' ')){hit=run;break;}}if(hit)break;}
   if(hit){cands.push({k,hit});break;}}}
 const own=(()=>{const vref=verse.toLowerCase();if(!vref)return null;for(let k=0;k<L.length;k++){if(!/\banswer\s*:/i.test(L[k])||!L[k].toLowerCase().includes(vref))continue;let b=k;while(b+1<L.length&&isLay(L[b+1]))b++;const tg=new Set([...L.slice(k,b+1).join('\n').matchAll(/\[L([1-4])\]/g)].map(m=>m[1]));if(tg.size>=3)return {k,b,tg};}return null;})();
 const ownNote=o=>'the item\'s own answer block (ANSWER: '+verse+') in '+rm[1]+' carries ['+[...o.tg].sort().map(x=>'L'+x).join('], [')+'], so it is not a bare grant';
 if(!cands.length)return own?ownNote(own):null;
 const vref=verse.toLowerCase();const scored=cands.map(c=>{const {a,b}=blockAt(c.k);const head=L[a].toLowerCase();return {...c,a,b,pref:!!vref&&(head.includes('answer: '+vref)||head.includes(vref))};});
 const cv=(verse.match(/\d+:\d+/)||[''])[0];const inBlk=x=>{const t=L.slice(x.a,x.b+1).join('\n').toLowerCase();return !!vref&&(t.includes(vref)||(!!cv&&new RegExp('(^|[^0-9])'+cv.replace(':','\\:')+'([^0-9]|$)').test(t)));};const c=scored.find(x=>x.pref)||scored.find(inBlk);if(!c)return own?ownNote(own):null;
 const blk=L.slice(c.a,c.b+1).join('\n');const tags=new Set([...blk.matchAll(/\[L([1-4])\]/g)].map(m=>m[1]));
 const after=L.slice(c.k,c.b+1).join('\n');const at=after.toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').indexOf(c.hit);
 const tail=at>=0?after.toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').slice(at+c.hit.length):'';
 const fit=/\bfits?\b/.test(tail)||/(?:^|\s)so\s+\S+(?:\s+\S+){3,}/.test(tail);
 if(!c.pref&&own)return ownNote(own);
 if(!c.pref){const ql=L[c.k].toLowerCase().replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ');const qi=ql.indexOf(c.hit);const qt=qi>=0?ql.slice(qi+c.hit.length):'';if(!(/\bfits?\b/.test(qt)||/(?:^|\s)so\s+\S+(?:\s+\S+){3,}/.test(qt)))return null;return 'the answer line holding the quoted words in '+rm[1]+' goes on with a fit sentence after them, inside a layered block of '+tags.size+' tag(s), so it is not a bare grant';}
 if(tags.size>=3||(tags.size>=1&&fit))return 'the answer holding the quoted words in '+rm[1]+' carries '+(tags.size?'['+[...tags].sort().map(x=>'L'+x).join('], [')+']':'no layer tag')+(fit?' and a fit sentence after them':'')+', so it is not a bare grant';
 return null;}
const EAX_STATUS='TRIAL';let __eaxHeld=0;{const RR=__rdRounds; /* the rounds pkgECQ already read (one read per run; efficiency item 4) */
if(RR)for(const r of rows){if(r.rule!=='E-ANS')continue;const m=String(r.cure_reason||'').match(/^ENFORCER DISAGREE \(right: MISSES\): ([\s\S]*?) \(judge wrote /);if(!m)continue;let n=null;try{n=eaxHold(m[1],r.item,RR);}catch(e){n=null;}if(!n)continue;__eaxHeld++;const note=n.replace(/[()]/g,' ');
 r.cure_reason=EAX_STATUS==='LIVE'?r.cure_reason.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEAX, not sent; W1 2904: '+note+')'):r.cure_reason+' (TRIAL pkgEAX: would not be sent: '+note+')';}}
rows.push(...CODE);
return [{json:{...PASS,enf428:{code_violations:CODE.length,skipped:false,calls:B.length,counts:first.counts||{},not_checked:(first.not_checked||[]).length,tally,errors,eid:__eid},enf428_rows:rows}}];
