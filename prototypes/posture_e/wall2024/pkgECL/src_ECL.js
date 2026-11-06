// pkgECL (W3 Wall 2547, Eric 2026-11-06): the layer check on a judge's break line (E-COL, ENFORCED; Commitment 13). A FORCED line, or a LINK BROKEN
// line that does not rest on an unanswered press, gives its grounds in layers: a counted [L1] (a verse quoted with its reference under an [L1] tag,
// standing in the KJV verse as the record serves it, "Cited Verses"), and, when the ground turns on a word's meaning, a counted [L2] (the word stands
// in a verse the line cites: the [L2] tag check, L2C, on "L2 Words" and "L2 Lexicon"). The ANSWER and FAILS quotes are the answer's words, not grounds.
// A verse or word the run did not read is UNVERIFIABLE and raises nothing.
const ECL=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
 const PAIR=new RegExp(REF.source+'[^"“”\\n\\[]{0,40}?["“]([^"“”]{6,400})["”]','g');
 const MW=/\b(?:means|meaning|meant|sense|signif(?:y|ies|ied|ying)|denot(?:e|es|ed|ing)|the word|lexic\w*|connot\w*|defin\w*|translat\w*|render(?:s|ed|ing)?|Greek|Hebrew)\b/i;
 const UNANS=/\b(?:unanswered|not answered|no answer|never answered|not named)\b|\(\s*Commitment\s+5\s*\)/i;
 const RANK={COUNTED:3,UNVERIFIABLE:2,'NOT COUNTED':1,NONE:0};
 // the judge's own grounds: the line without its ANSWER and FAILS quotes (a FORCED line's GROUND follows its FAILS quote)
 const ground=l=>String(l||'').replace(/\\+"/g,'"').replace(/--\s*ANSWER\s*\[[^\]]*\]\s*:[\s\S]*?(?=--\s*GROUND\s*:|$)/i,' ');
 function l1(g,rows){const idx={};for(const r of rows||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;
  const out=[];const T=[...g.matchAll(/\[L([1-4])\]/g)];
  T.forEach((m,k)=>{if(m[1]!=='1')return;const a=m.index+4,b=k+1<T.length?T[k+1].index:g.length,pa=k>0?T[k-1].index+4:0;
   const before=g.slice(Math.max(pa,m.index-600),m.index);const bs=[...before.matchAll(PAIR)];let p=bs.length?bs[bs.length-1]:null;
   if(p&&before.slice(p.index+p[0].length).replace(/[\s;,.:)]+/g,'').length)p=null; /* the form <reference> "<words>" [L1]: the quote closes just before the tag */
   if(!p){const as=[...g.slice(a,Math.min(b,a+700)).matchAll(PAIR)];p=as.length&&as[0].index<=6?as[0]:null;} /* the form [L1] <reference> "<words>" */
   if(!p){out.push({status:'NOT COUNTED',why:'an [L1] tag with no verse quoted beside its reference'});return;}
   const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5];const ref=bk+' '+ch+':'+v1+(v2!==v1?'-'+v2:'');const parts=[];
   for(let v=v1;v<=v2;v++){const t=idx[bk+' '+ch+':'+v];if(t)parts.push(t);}
   if(parts.length!==v2-v1+1){out.push({status:'UNVERIFIABLE',ref,why:ref+' was not read this run'});return;}
   const kjv=parts.join(' ');out.push(kkjvIsVerseQuote(q,kjv)&&kkjvStands(q,kjv)?{status:'COUNTED',ref,why:ref+' "'+q.slice(0,80)+'"'}:{status:'NOT COUNTED',ref,why:ref+' "'+q.slice(0,80)+'" does not stand in the KJV verse'});});
  return out;}
 function l2(g,ow,lex){const TG=L2C.tags([['JUDGE','J',g]]);if(!TG.length)return [];
  return L2C.check(TG,ow||[],lex||[]).filter(t=>t.status!=='IGNORED').map(t=>({status:t.status,why:String(t.seg||'').slice(0,60)+': '+t.status+' ('+t.why+')'}));}
 function check(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const forced=/^\s*FORCED\b/i.test(L);ctx=ctx||{};
  if(!forced&&!/LINK BROKEN/.test(L))return {applies:false,faults:[],why:'not a FORCED or LINK BROKEN line'};
  if(!forced&&UNANS.test(L))return {applies:false,faults:[],why:'rests on an unanswered press (ruling 392), not on meaning'};
  const g=ground(L);const a=l1(g,ctx.rows),b=l2(g,ctx.ow,ctx.lex);const best=xs=>xs.reduce((m,x)=>RANK[x.status]>RANK[m]?x.status:m,'NONE');const s1=best(a),s2=best(b);
  const meaning=/\[L2\]/.test(g)||MW.test(g.replace(/\bMEANS\s*(?:\[[^\]]*\])?\s*:/g,' '));const faults=[];
  if(s1==='NONE')faults.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(s1==='NOT COUNTED')faults.push('no counted [L1]: '+a.map(x=>x.why).join('; '));
  if(meaning&&s2==='NONE')faults.push('the ground turns on a word\'s meaning and carries no [L2]');else if(meaning&&s2==='NOT COUNTED')faults.push('the ground turns on a word\'s meaning and no [L2] is counted: '+b.map(x=>x.why).join('; '));
  return {applies:true,forced,l1:s1,l2:s2,meaning,faults,why:faults.length?faults.join(' | '):'layers counted: [L1] '+s1+(meaning?'; [L2] '+s2:'')};}
 function ctxLive(){const g=n=>{try{return $(n).isExecuted?$(n).all().map(i=>i.json):[];}catch(e){return [];}};
  return {rows:g('Cited Verses').filter(r=>r&&r.book),ow:g('L2 Words').filter(r=>r&&r.book),lex:g('L2 Lexicon').filter(r=>r&&r.strongs_number)};}
 return {check,ground,ctxLive};})();
