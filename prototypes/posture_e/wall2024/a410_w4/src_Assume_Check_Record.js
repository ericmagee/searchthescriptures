let __IN=null;try{__IN=$('Judge Contradiction Record').first().json;}catch(e){__IN=null;}
try{
const VP4N=s=>String(s==null?'':s).toLowerCase().replace(/[“”"’‘'*_`\[\]()]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const VP4_STOP=new Set(['The','A','An','And','But','Or','Of','In','On','To','For','By','At','As','With','From','That','This','These','Those','He','His','Him','She','Her','It','Its','They','Their','I','We','Our','You','Your','Then','So','No','Not','Is','Was','Be','When','Where','Which','Who','Whom','Matthew','Mark','Luke','John','Acts','Romans','Genesis','Exodus','Isaiah','Numbers','Ruth','Samuel','Kings','Chronicles','Ezra','Corinthians','Galatians','Hebrews','Psalms','Psalm','Deuteronomy','Leviticus','Jeremiah']);
const vp4Names=f=>{const out=[];for(const m of String(f||'').replace(/["“”]/g,' ').matchAll(/\b([A-Z][a-z]+)(?:['’]s)?\b/g)){const w=m[1];if(!VP4_STOP.has(w)&&!out.includes(w))out.push(w);}return out;};



const vp4Code=(fact,qs)=>{const nm=vp4Names(fact);const all=' '+VP4N(qs.join(' | '))+' ';if(!nm.length)return {answer:'NO NAMES',names:[],missing:[]};
 const missing=nm.filter(w=>!all.includes(' '+w.toLowerCase()+' '));return {answer:missing.length?'NOT STATED':'POSSIBLY STATED',names:nm,missing};};
const IN=__IN;if(!IN)throw new Error('Judge Contradiction Record has no item');const B=$('Assume Check Build').first().json;const RT=B.run_token||null;
const OUT=(acx,acx_log)=>[{json:{...IN,acx,acx_log}}];
const log=o=>{const r={run_token:RT,seat:'assumption check',seat_role:'panel',judge_model:B.model||null,kind:'enforcer_check',rule:'E-ASSUME',reply_error:null,cure_status:null,flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,...o};const st=r.cure_status;if(st!=null){r.cure_reason=st+(r.cure_reason?' -- '+r.cure_reason:'');r.cure_status=null;}r.seat_role=r.seat==='single judge'?'single':'panel';return r;};
if(B.acx_skip)return OUT({skipped:true,why:B.why,facts:[],items:[]},[log({item:'NOT CHECKED',cure_status:'NOT CHECKED',cure_reason:'the assumption check did not run: '+B.why+' (RECORD-ONLY TRIAL, VP4)'})]);
function psG(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,q=>/[.!?]\s*["”]$/.test(q)?' . ':' ').replace(/(^|[\s(\[:;,])(['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’])(?=$|[\s.,;:!?)\]])/g,(x,a,q)=>a+(/[.!?]\s*['’]$/.test(q)?' . ':' '))
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig;
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ').replace(/\b(?:(?:are|is|were|was|be|been)\s+)?(?:not|never)\s+counted\b|\buncounted\b/ig,' spared ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}
const jt=r=>String(r==null?'':r).replace(/\\n/g,'\n');
const judges=[];let PP=null;try{PP=$('Panel Payloads').first().json;}catch(e){PP=null;}
((PP&&PP.bodies)||[]).forEach((b,i)=>{let p=null;try{p=JSON.parse(b).payload;}catch(e){return;}judges.push({seat:p.judge_seat||((PP.summary||[])[i]||{}).seat||('panel '+(i+1)),raw:jt(p.verdict_raw)});});
try{if($('Extract Independent Verdict').isExecuted){const e=$('Extract Independent Verdict').first().json;judges.push({seat:'single judge',raw:jt(e.independent_verdict_raw)});}}catch(e){}
const gradeOf=(raw,side,n)=>{for(const l of raw.split('\n')){const r=psG(l);if(!r||r.side!==side)continue;return (n in r.g)?r.g[n]:(!Object.keys(r.g).length&&r.n===0?'SPARED':null);}return null;};
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
 .concat(items.map(it=>log({seat:it.seat,item:'premise listed against the '+it.side.toLowerCase()+' '+it.n+' FACT '+(it.k||'?'),flagged_line:'ASSUMES: '+it.fact,cure_status:'ITEM (TRIAL)',
  cure_reason:'E-ASSUME: the judge SPARED premise '+it.n+'; both readers find no verse quoted in the answering block that states "'+it.fact+'", and the ruling names none. RECORD-ONLY TRIAL (VP4): nothing is sent back and no seat is removed.'})));
return OUT({skipped:false,model:B.model||'',facts,items,errors:err?[err]:[]},acx_log);
}catch(__e){const m='Assume Check Record failed: '+String(__e&&__e.message||__e).slice(0,300);let rt=null;try{rt=$('Assume Check Build').first().json.run_token;}catch(e){}
 if(!__IN)throw __e;return [{json:{...__IN,acx:{skipped:true,why:m,facts:[],items:[]},acx_log:[{run_token:rt,seat:'assumption check',seat_role:'panel',judge_model:null,kind:'enforcer_check',rule:'E-ASSUME',item:'NOT CHECKED',flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,reply_error:m,cure_status:null,cure_reason:'NOT CHECKED -- '+m+' (RECORD-ONLY TRIAL, VP4)'}]}}];}