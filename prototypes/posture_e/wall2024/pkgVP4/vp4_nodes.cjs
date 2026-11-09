// pkgVP4 (W2; P4 of the verdict proposal, Wall 3708; test 3738 as changed by 3743/3747; ruling row 459): THE ASSUMPTION CHARGE CHECK.
// TRIAL, record-only. Four nodes between Judge Contradiction Record and Panel Cure Needed?; nothing here changes a grade, a cure or a seat.
const COMMON = String.raw`const VP4N=s=>String(s==null?'':s).toLowerCase().replace(/[“”"’‘'*_${'`'}\[\]()]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const VP4_STOP=new Set(['The','A','An','And','But','Or','Of','In','On','To','For','By','At','As','With','From','That','This','These','Those','He','His','Him','She','Her','It','Its','They','Their','I','We','Our','You','Your','Then','So','No','Not','Is','Was','Be','When','Where','Which','Who','Whom','Matthew','Mark','Luke','John','Acts','Romans','Genesis','Exodus','Isaiah','Numbers','Ruth','Samuel','Kings','Chronicles','Ezra','Corinthians','Galatians','Hebrews','Psalms','Psalm','Deuteronomy','Leviticus','Jeremiah']);
/* proper names of a fact: capitalized words, possessive 's dropped, book names and function words left out; "Holy Ghost" gives Holy and Ghost */
const vp4Names=f=>{const out=[];for(const m of String(f||'').replace(/["“”]/g,' ').matchAll(/\b([A-Z][a-z]+)(?:['’]s)?\b/g)){const w=m[1];if(!VP4_STOP.has(w)&&!out.includes(w))out.push(w);}return out;};
/* the UNSUPPORTED-L4 PREMISES list of one round: number, link, ASSUMES, ROWS GIVE */
const vp4List=(t,side)=>{t=String(t||"");const i=t.search(/UNSUPPORTED-L4 PREMISES/i);if(i<0)return [];let body=t.slice(t.indexOf("\n",i)+1);const e=body.search(/\n[ \t]*(?:#{1,3}\s|---[ \t]*\n|\*\*[A-Z][A-Z\x27 -]{4,}\*\*)/);if(e>=0)body=body.slice(0,e);const out=[];
 for(const p of body.split(/\n(?=[ \t]*\**[ \t]*\d+[.)]\s)/)){const m=p.match(/^\s*\**\s*(\d+)[.)]\s+([\s\S]*)$/);if(!m)continue;const txt=m[2];
  const a=txt.match(/ASSUMES\s*:\s*([\s\S]*?)\s*(?:ROWS GIVE\s*:|\nPRESSED WITH|$)/i);if(!a)continue;const r=txt.match(/ROWS GIVE\s*:\s*([\s\S]*?)\s*(?:\nPRESSED WITH|$)/i);const lk=txt.match(/^\s*\**\s*LINK\s+(\d+)/i);
  out.push({side,n:+m[1],link:lk?+lk[1]:+m[1],assumes:a[1].replace(/\s+/g," ").trim(),rows_give:r?r[1].replace(/\s+/g," ").trim():""});}
 return out;};
/* the answering block: the other side's round 3 LINK k block, up to the next LINK block or the premise list */
const vp4Block=(t,k)=>{t=String(t||'');const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)\b[^\n]*/gmi)];const h=H.find(x=>+x[1]===k);if(!h)return '';const nx=H.find(x=>x.index>h.index);
 let e=nx?nx.index:t.length;const u=t.slice(h.index).search(/UNSUPPORTED-L4 PREMISES/i);if(u>=0&&h.index+u<e)e=t.lastIndexOf('\n',h.index+u);return t.slice(h.index,e).trim();};
/* the verse words a block quotes: every quotation in it */
const vp4Quotes=b=>[...String(b||'').matchAll(/"([^"\n]{2,})"|“([^”\n]{2,})”/g)].map(m=>m[1]||m[2]);
/* reader 2, code: every proper name of the fact found among the quoted verse words of the block, read together */
const vp4Code=(fact,qs)=>{const nm=vp4Names(fact);const all=' '+VP4N(qs.join(' | '))+' ';if(!nm.length)return {answer:'NO NAMES',names:[],missing:[]};
 const missing=nm.filter(w=>!all.includes(' '+w.toLowerCase()+' '));return {answer:missing.length?'NOT STATED':'POSSIBLY STATED',names:nm,missing};};
`;

const PROMPT = "You are the assumption enforcer. A premise below was listed against a side as UNSUPPORTED-L4, with the words ASSUMES: <fact>. Your one task: does the answering block's own quoted scripture state each assumed fact?\n"
 + "The rule the judges were given: \"UNEXHIBITED also fires, whatever label the side gave the link (SUPPORTED, NARROWED TO or KEPT), when the link ASSUMES as given a fact about a person, house, time or act (for example, that a named person is of a named house) and no quoted row gives that fact.\" And: \"What a link INFERS from its rows is its [L4]: it is graded by the two-layer rule and by the meaning of the verses pressed against it, and never as a missing row (DG-61); an inferred act, such as a begetting or a knowing, is never an ASSUMES.\"\n"
 + "Commitment 3: scripture is read \"one verse or many read together, precept upon precept; no count of verses decides it.\"\n"
 + "For each premise: split ASSUMES into its separate facts (a fact joined to another by \"and\" is its own fact). For each fact answer one of:\n"
 + "STATED: the verse words quoted in the answering block, one verse or several read together, give the fact. Quote the words, word for word as the block quotes them, with their reference.\n"
 + "NOT STATED: no verse words quoted in the block give the fact; the block reaches it only by its own reasoning ([L4]) or not at all.\n"
 + "INFERRED ACT: the fact is an inferred act (such as a begetting or a knowing), which the rule says is never an ASSUMES.\n"
 + "Read only the words given to you. Bring no doctrine, no training knowledge and no verse the block does not quote. The side's own sentences are not scripture; only quoted verse words count.\n"
 + "Reply with one line per fact and nothing else:\n"
 + "ASSUME-CHECK: <DEFENDER|CHALLENGER> PREMISE <n> -- FACT <k> \"<the fact>\" -- STATED -- <reference> \"<verse words>\" -- <one sentence>\n"
 + "ASSUME-CHECK: <DEFENDER|CHALLENGER> PREMISE <n> -- FACT <k> \"<the fact>\" -- NOT STATED -- <one sentence>\n"
 + "ASSUME-CHECK: <DEFENDER|CHALLENGER> PREMISE <n> -- FACT <k> \"<the fact>\" -- INFERRED ACT -- <one sentence>";

const SYS = 'You check whether quoted scripture states a fact. You bring nothing from outside the words given to you: no doctrine, no training knowledge, no reading of your own. You do not judge who is right.';

const BUILD = String.raw`// pkgVP4 (W2, P4 of Wall 3708, test 3738/3747): ASSUME CHECK BUILD. TRIAL, record-only. One DeepSeek call per run, after the panel.
// For each UNSUPPORTED-L4 premise with ASSUMES (the list against the defender in [DR2], against the challenger in [CR3]), it gives DeepSeek the
// assumed fact and the answering block (the other side's round 3 LINK block). It passes the incoming item on (Assume Check Record returns it).
` + COMMON + String.raw`const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F=null;try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F=null;}
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
const P=F?vp4List(F.gr2,'DEFENDER').concat(vp4List(F.cr3,'CHALLENGER')):[];
const prem=P.map(p=>{const blk=vp4Block(p.side==='DEFENDER'?F.cr3:F.dr3,p.link);return {...p,answer_round:(p.side==='DEFENDER'?'CR3':'DR3'),block:blk,quotes:vp4Quotes(blk)};});
if(!F||!ds||!prem.length)return [{json:{acx_skip:true,why:!F?'no rounds found':!ds?'no DeepSeek model_config row':'no UNSUPPORTED-L4 premise carries ASSUMES',prem,run_token:S.run_token}}];
const PROMPT=` + JSON.stringify(PROMPT) + String.raw`;
const user=PROMPT+'\n\n'+prem.map(p=>'######## '+p.side+' PREMISE '+p.n+' (listed against the '+p.side.toLowerCase()+', LINK '+p.link+') ########\nASSUMES: '+p.assumes+'\nROWS GIVE (as the lister wrote them): '+(p.rows_give||'(none)')+'\n\nTHE ANSWERING BLOCK, ['+p.answer_round+'] LINK '+p.link+':\n'+(p.block||'(no LINK '+p.link+' block found in ['+p.answer_round+'])')).join('\n\n');
const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,8000),temperature:0,messages:[{role:'system',content:'` + SYS.replace(/'/g, "\\'") + String.raw`'},{role:'user',content:user}]};
return [{json:{acx_skip:false,body,prem,model:ds.api_model,run_token:S.run_token}}];`;

const RECORD = String.raw`// pkgVP4 (W2, P4 of Wall 3708, test 3738/3747): ASSUME CHECK RECORD. TRIAL, record-only (E-ASSUME).
// Two readers per assumed fact: DeepSeek (STATED needs its verse words found in the block's quotations) and code (every proper name of the fact
// among the block's quoted verse words, read together). A judge that SPARED the premise gets an item only when both read NOT STATED.
// One log row per fact with both answers, and one row per judge item. It passes Judge Contradiction Record's item on unchanged, with acx and acx_log.
` + COMMON + String.raw`const IN=$('Judge Contradiction Record').first().json;const B=$('Assume Check Build').first().json;const RT=B.run_token||null;
const OUT=(acx,acx_log)=>[{json:{...IN,acx,acx_log}}];
const log=o=>({run_token:RT,seat:'assumption check',seat_role:'enforcer',judge_model:B.model||null,kind:'enforcer_check',rule:'E-ASSUME',reply_error:null,cure_status:null,flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,...o});
if(B.acx_skip)return OUT({skipped:true,why:B.why,facts:[],items:[]},[log({item:'NOT CHECKED',cure_status:'NOT CHECKED',cure_reason:'the assumption check did not run: '+B.why+' (RECORD-ONLY TRIAL, VP4)'})]);
/* the judges' CONCEDED LINKS lines (panel seats, then the single judge) */
function psG(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_${'`'}]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,q=>/[.!?]\s*["”]$/.test(q)?' . ':' ').replace(/(^|[\s(\[:;,])(['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’])(?=$|[\s.,;:!?)\]])/g,(x,a,q)=>a+(/[.!?]\s*['’]$/.test(q)?' . ':' '))
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig;
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ').replace(/\b(?:(?:are|is|were|was|be|been)\s+)?(?:not|never)\s+counted\b|\buncounted\b/ig,' spared ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};} /* = library psGrades (pkgRI3B/pkgPSQ) without the ri3Head2024 header form */
const jt=r=>String(r==null?'':r).replace(/\\n/g,'\n');
const judges=[];let PP=null;try{PP=$('Panel Payloads').first().json;}catch(e){PP=null;}
((PP&&PP.bodies)||[]).forEach((b,i)=>{let p=null;try{p=JSON.parse(b).payload;}catch(e){return;}judges.push({seat:p.judge_seat||((PP.summary||[])[i]||{}).seat||('panel '+(i+1)),raw:jt(p.verdict_raw)});});
try{if($('Extract Independent Verdict').isExecuted){const e=$('Extract Independent Verdict').first().json;judges.push({seat:'single judge',raw:jt(e.independent_verdict_raw)});}}catch(e){}
const gradeOf=(raw,side,n)=>{for(const l of raw.split('\n')){const r=psG(l);if(!r||r.side!==side)continue;return (n in r.g)?r.g[n]:(!Object.keys(r.g).length&&r.n===0?'SPARED':null);}return null;};
/* reader 1, DeepSeek */
const r=$input.first().json||{};let txt=null,err=null;try{txt=String(r.choices[0].message.content||'');}catch(e){err='no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')';}
const LN=/^[\s>*_-]*ASSUME-CHECK\s*:\s*\**\s*(DEFENDER|CHALLENGER)\s+PREMISE\s+(\d+)\s*\**\s*--\s*FACT\s+(\d+)\s*["“](.*?)["”]\s*--\s*(STATED|NOT STATED|INFERRED ACT)\s*(?:--\s*(.*?))?[\s*_]*$/i;
const ds=[];for(const line of String(txt||'').split('\n')){const s=line.trim();if(!s)continue;const m=s.match(LN);if(!m)continue;
 const x={side:m[1].toUpperCase(),n:+m[2],k:+m[3],fact:m[4],answer:m[5].toUpperCase(),rest:(m[6]||'').trim(),line:s.slice(0,1200)};
 if(x.answer==='STATED'){const p=B.prem.find(y=>y.side===x.side&&y.n===x.n);const q=[...x.rest.matchAll(/["“](.+?)["”]/g)].map(z=>z[1]);const qs=p?VP4N(p.quotes.join(' | ')):'';
  x.verse_words=q;x.found=q.length>0&&q.every(z=>{const v=VP4N(z);return v.split(' ').length>=2&&qs.includes(v);});if(!x.found)x.answer='STATED (verse words not found in the block)';}
 ds.push(x);}
const facts=[],items=[];
for(const p of B.prem){let mine=ds.filter(x=>x.side===p.side&&x.n===p.n);if(!mine.length)mine=[{side:p.side,n:p.n,k:0,fact:p.assumes,answer:err?'NO REPLY':'NO ANSWER',rest:'',line:null}];
 for(const x of mine){const code=vp4Code(x.fact,p.quotes);const both=x.answer==='NOT STATED'&&code.answer==='NOT STATED';const spared=judges.map(j=>({seat:j.seat,grade:gradeOf(j.raw,p.side,p.n)}));
  const fx={side:p.side,n:p.n,link:p.link,k:x.k,fact:x.fact,deepseek:x.answer,deepseek_line:x.line,code:code.answer,names:code.names,missing:code.missing,both_not_stated:both,grades:spared};facts.push(fx);
  if(both)for(const j of spared)if(j.grade==='SPARED')items.push({seat:j.seat,side:p.side,n:p.n,k:x.k,fact:x.fact});}}
const gtxt=g=>g.map(j=>j.seat+' '+(j.grade||'not read')).join(', ');
const prompt=((B.body||{}).messages||[])[1]?B.body.messages[1].content:null;
const acx_log=facts.map((f,i)=>log({item:f.side+' PREMISE '+f.n+' FACT '+(f.k||'?'),flagged_line:'ASSUMES: '+f.fact,prompt_sent:i===0?prompt:'[SAME prompt_sent AS the first E-ASSUME row]',full_reply:i===0?txt:'[SAME full_reply AS the first E-ASSUME row]',response_line:f.deepseek_line,reply_error:err,
  cure_status:f.both_not_stated?'BOTH NOT STATED':/^NO (ANSWER|REPLY)$/.test(f.deepseek)?'DEEPSEEK '+f.deepseek:(f.deepseek==='STATED'&&f.code!=='NOT STATED')?'NO ITEM (STATED)':f.deepseek==='INFERRED ACT'?'NO ITEM (INFERRED ACT)':'READERS DIFFER',
  cure_reason:'DEEPSEEK: '+f.deepseek+' -- CODE: '+f.code+(f.names.length?' (names '+f.names.join(', ')+(f.missing.length?'; not in the block\'s quoted verse words: '+f.missing.join(', '):'')+')':'')+' -- JUDGES: '+gtxt(f.grades)+' -- RECORD-ONLY TRIAL (VP4)'}))
 .concat(items.map(it=>log({seat:it.seat,seat_role:'judge',item:'premise listed against the '+it.side.toLowerCase()+' '+it.n+' FACT '+(it.k||'?'),flagged_line:'ASSUMES: '+it.fact,cure_status:'ITEM (TRIAL)',
  cure_reason:'E-ASSUME: the judge SPARED premise '+it.n+'; both readers find no verse quoted in the answering block that states "'+it.fact+'", and the ruling names none. RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed.'})));
return OUT({skipped:false,model:B.model||'',facts,items,errors:err?[err]:[]},acx_log);`;

module.exports = { COMMON, PROMPT, SYS, BUILD, RECORD };
