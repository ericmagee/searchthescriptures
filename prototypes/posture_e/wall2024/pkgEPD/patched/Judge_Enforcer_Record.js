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
const R=$input.all().map(x=>x.json);const V={};const errors=[];const errAt={}; /* pkgJEC (a): each call's own error, by its index (33060: the labels shifted) */
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){const w='call '+(i+1)+': no reply ('+String(r&&r.error&&(r.error.message||JSON.stringify(r.error))||r&&r.message||('no message; reply keys: '+(Object.keys(r||{}).slice(0,8).join(',')||'none'))).slice(0,160)+')';errAt[i]=w;errors.push(w);return;}
 if(!txt.trim()){const w='call '+(i+1)+': empty content'+(r.choices[0].finish_reason?' (finish_reason '+r.choices[0].finish_reason+')':'');errAt[i]=w;errors.push(w);return;}
 for(const l of txt.split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPR]\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}});
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
/* pkgEPD (W3 2849) */const EPD_STATUS='TRIAL';
/* pkgEPD (W3 2849 item 4): an unlabelled COUNTED push that quotes 6 or more consecutive words of a sentence in the side's own block containing drop, withdraw or grant is a concession push: not held. */
function epdWords(s){return String(s||'').toLowerCase().replace(/[‘’']/g,'').replace(/[^a-z0-9Ͱ-Ͽ֐-׿]+/g,' ').trim().split(' ').filter(Boolean);}
function epdDrop(why,blk){const sents=String(blk||'').split(/(?<=[.;:!?])\s+|\n+/).filter(s=>/\b(?:drop|drops|dropped|withdraw|withdraws|withdrew|withdrawn|grant|grants|granted)\b/i.test(s));if(!sents.length)return null;
 const w=epdWords(why);if(w.length<6)return null;const runs=new Set();for(let i=0;i+6<=w.length;i++)runs.add(w.slice(i,i+6).join(' '));
 for(const s of sents){const t=epdWords(s);for(let i=0;i+6<=t.length;i++)if(runs.has(t.slice(i,i+6).join(' ')))return s.trim().slice(0,160);}return null;}
function epsHold(x,v){if(!x||x.rule!=='E-PREM'||!v||v.v!=='DISAGREE'||v.right!=='COUNTED')return null;if(/^\s*\(\s*CONCEDED\b/i.test(v.why))return null;const blk=__epsBlk[x.item]||'';if(!blk)return null;const __epd=epdDrop(v.why,blk);let k=[];try{k=lbFoot(blk,true);}catch(e){k=[];}if(k.length<2)return null;if(unxLack(v.why,k).missing.length)return null;
 return 'the push counts the premise but names no layer the block lacks; the block exhibits '+k.map(z=>'['+z+']').join(', ')+(__epd?'; TRIAL pkgEPD would send: it quotes the side drop '+__epd.replace(/[()]/g,' '):'');}
const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0,CONTRADICTED:0};const rows=[];
B.forEach((b,ci)=>{(b.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?ETC(x.rule,v.right,v.why):null;const verdict=__ec?'CONTRADICTED':(v?v.v:'NO VERDICT');tally[x.rule][verdict]=(tally[x.rule][verdict]||0)+1;
 let full=null;try{full=k===0?String(R[ci].choices[0].message.content||''):null;}catch(e){full=null;}
 rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',judge_model:b.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
  prompt_sent:k===0?b.body.messages[1].content:null,full_reply:full,reply_error:errAt[ci]||null,response_line:x.response_line,cure_status:null,
  cure_reason:(()=>{const __h=epsHold(x,v);const base='ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+(__ec?' [pkgETC: written '+v.v+' with right: '+v.right+', but its own reason concludes '+__ec+'; recorded, not sent back]':'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)';if(!__h)return base;const note=__h.replace(/[()]/g,' ');return EPS_STATUS==='LIVE'?base.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEPS, not sent; W3 2842: '+note+')'):base+' (TRIAL pkgEPS: would not be sent: '+note+')';})(),at:T});});});
rows.push(...CODE);
return [{json:{...PASS,enf428:{code_violations:CODE.length,skipped:false,calls:B.length,counts:first.counts||{},not_checked:(first.not_checked||[]).length,tally,errors},enf428_rows:rows}}];
