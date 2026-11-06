// pkgBAR C4B Extract: the round [DR4] after the barred-move re-call. A pass-through item (resend false), a failed re-call or an unread reply
// keeps C4G Extract's round unchanged, and nothing is VOID. Otherwise C4 Extract's own reading (below, unchanged but for its call source, C4B Build)
// reads the new reply. The replacement is kept unless it is under 60% of the first round's length or its own grants_check has more faults; each sentence
// of the kept round that is still a barred move is VOID: struck from raw and labelled by the system's mark, and listed in bar.void.
// pkgIMP (Eric 17:08 CST 2026-11-06: "the judges should flag comments where the model make requirements of scripture that the scripture itself
// doesn't hold or suggest"; W3 spec, Wall 2627; Commitment 14, IMPOSED REQUIREMENT, ENFORCED, both sides, not a DG).
// Amended per W3 2629: grants, concessions, withdrawals and narrowings are skipped; only sentences inside an answer block are read; a third cure,
// NOT A REQUIREMENT -- rebuts [<round>] "<the opponent's words>", verified in code (6+ words standing in a round of the other side).
// IMP.harvest: every debater sentence of [CR2]-[CR4] and [DR1]-[DR4] whose words (quotations removed) rest on a verse not stating, naming or
// saying something (the ABS.AB absence forms, without the "both retained / compatible / leaves room" forms, which ask nothing of a verse), and that
// rests on a verse: a reference in the sentence or in the 600 characters of its round before it. IMP.items: one E-IMP item per harvested
// sentence for a judge, unless that judge's text already holds an IMPOSED line quoting it; plus a contradiction item for an ANSWER CHECK the
// judge grades MEETS on an answer its own IMPOSED line flags NO ROW SETS IT (W3 2627 (4)). IMP.cure: CHANGE TO an IMPOSED line for the sentence
// (NO ROW SETS IT, or SET BY a counted [L1], the ECL count); for a contradiction item, CHANGE TO the ANSWER CHECK graded MISSES or FAILS, or an
// IMPOSED line SET BY a counted [L1]. A KEEP does not cure.
const IMP=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject|tell|record)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bwithout\s+(?:asserting|stating|naming|saying|mentioning|specifying|denying|excluding)\b|\b(?:is|are|was|were)\s+(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|ruled\s+out|named|stated)\b/i;
 const REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const unq=s=>String(s||'').replace(/"[^"\n]*"|“[^”\n]*”/g,' " ');
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const ROUNDS=['CR2','DR1','DR2','CR3','DR3','CR4','DR4'];
 /* (W3 2629 (1)) a sentence that grants, concedes, withdraws or narrows is the debater's own ground given up, not a requirement */
 const GIVE=/\bI\s+(?:drop|withdraw|narrow|grant|concede|accept|allow|rest\s+nothing)\b|\bnarrow\s+(?:accordingly|it|the\s+link)\b|^\W*(?:Granted|Conceded|CONCEDED|Grant)\b|\bI\s+do\s+not\s+(?:say|claim|rest|hold|argue)\b|\bno\s+longer\s+(?:claims?|holds?|rests?)\b|\bin\s+(?:so\s+many\s+)?words\b|\bI\s+hold\s+(?:that|this|the)\s+limb\b/i;
 /* (W3 2629 (3)) answer blocks: a heading or label that answers a press ("Answer to ...", "Answers to the presses", "ANSWER: ...", "Pressed rows")
    and its lines, to the next heading of its kind; a markdown heading's block runs to the next markdown heading of the same or a higher level */
 const ANS=/\banswers?\s+to\b|^[\s#>*_-]*ANSWER\s*:|\bpressed\s+rows\b|\banswers?\s+(?:on|for)\s+the\s+press/i;
 function blocks(t){const L=String(t||'').split('\n');const out=[];let off=0,cur=null;
  const md=l=>{const m=l.match(/^\s*(#{1,6})\s/);return m?m[1].length:0;};const bold=l=>/^\s*\*\*[^*\n]{2,200}\*\*\s*:?\s*$/.test(l)||/^\s*[A-Z][A-Za-z' -]{2,40}:\s*$/.test(l);const link=l=>/^[\s#>*_-]*LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*$/.test(l);
  for(const l of L){const a=off;off+=l.length+1;const lv=md(l);
   if(cur){const end=cur.md?((lv&&lv<=cur.md)||(cur.md>1&&rule(l))):(lv||rule(l)||link(l)||bold(l));if(end){cur.e=a;out.push(cur);cur=null;}}
   if(!cur&&(lv||bold(l)||/^[\s>*_-]*\**\s*ANSWER\s*:/i.test(l))&&ANS.test(l))cur={s:a,md:lv,head:l.trim().slice(0,80)};}
  if(cur){cur.e=off;out.push(cur);}return out;}
 function harvest(R){const out=[];const seen=new Set();
  for(const k of ROUNDS){const t=String(R&&R[k]||'');if(!t)continue;const BL=blocks(t);if(!BL.length)continue;const inA=i=>BL.some(b=>i>=b.s&&i<b.e);let off=0;
   for(const para of t.split(/(\n)/)){const at=off;off+=para.length;if(!para.trim()||/^\s*#|^\s*\**\s*LINK\s+\d+\s*:\s*\**\s*\w+\**\s*$|^\s*\*\*[^*\n]{2,200}\*\*\s*:?\s*$|^\s*[A-Z][A-Za-z' -]{2,40}:\s*$/i.test(para.trim()))continue; /* one line at a time; headings and labels are not sentences */
    let so=0;for(const s0 of para.split(/(?<=[.!?]["”']?)\s+(?=["“(\[*]*[A-Z])/)){const pos=at+para.indexOf(s0,so);so=Math.max(so,pos-at+s0.length);
     const s=s0.replace(/\s+/g,' ').replace(/^[\s*_\-•]+|[\s*_]+$/g,'').trim();if(s.length<12||/^(?:PRESSED WITH|MEANS)\b/i.test(s))continue;
     if(!inA(pos))continue;const m=unq(s).match(AB);if(!m||GIVE.test(unq(s)))continue;if(!REF.test(t.slice(Math.max(0,pos-600),pos+s0.length)))continue; /* rests on a verse: a reference in the sentence or the 600 characters before it */
     const key=k+'|'+W(s);if(seen.has(key))continue;seen.add(key);const bl=BL.find(b=>pos>=b.s&&pos<b.e);out.push({id:'I'+(out.length+1),round:k,side:k[0]==='C'?'DEFENDER':'CHALLENGER',sentence:s.slice(0,400),phrase:m[0],block:bl?bl.head:null});}}}
  return out;}
 const has=(a0,b0,n)=>{const a=' '+W(a0)+' ',bw=W(b0).split(' ').filter(Boolean);if(!bw.length)return false;const k=Math.min(n||8,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
 const LINE=/^[\s>*_\-•]*IMPOSED\s*:\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]\s*--\s*(?:asks\s+([\s\S]+?)\s+to\s+([\s\S]+?)\s*--\s*(NO ROW SETS IT|SET BY\b\s*([\s\S]*))|(NOT A REQUIREMENT)\s*--\s*rebuts\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”])\s*$/i;
 function lines(text){const o=[];for(const l of N(text).split('\n')){const m=l.match(LINE);if(!m)continue;
  if(m[7])o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],nar:true,rround:m[8].toUpperCase(),rquote:m[9]});else o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],verse:m[3],req:m[4],no:/^NO ROW/i.test(m[5]),set:m[6]||null});}return o;}
 /* (W3 2629 (2)) NOT A REQUIREMENT: the sentence rebuts an opponent's claim. The quote stands word for word in a round of the other side, 6 words or more */
 function rebutOk(l,round,R){if(!l||!l.nar)return {ok:false,why:'not a NOT A REQUIREMENT line'};if(l.rround[0]===round[0])return {ok:false,why:'['+l.rround+'] is a round of the same side; a rebuttal answers the other side'};
  const q=W(l.rquote);if(q.split(' ').length<6)return {ok:false,why:'the rebutted quote has fewer than 6 words'};if(!R||!R[l.rround])return {ok:false,why:'round ['+l.rround+'] could not be read'};
  if(!W(R[l.rround]).includes(q))return {ok:false,why:'the quote does not stand word for word in ['+l.rround+']'};return {ok:true,why:'rebuts ['+l.rround+'] "'+String(l.rquote).slice(0,80)+'", which stands in that round'};}
 const RND=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;
 function rounds(t){t=String(t||'');const at=[];let m;RND.lastIndex=0;while((m=RND.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});const o={};at.forEach((x,i)=>{if(o[x.k]==null)o[x.k]=t.slice(x.e,i+1<at.length?at[i+1].s:t.length);});return o;}
 const roundsOf=b=>{try{const ms=(b&&b.body&&(b.body.messages||b.body.contents))||[];return rounds(ms.map(m=>typeof m.content==='string'?m.content:Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):Array.isArray(m.parts)?m.parts.map(c=>c&&c.text||'').join('\n'):'').join('\n'));}catch(e){return {};}};
 const AC=/^[\s>*_\-•]*ANSWER CHECK\s*:\s*([^\n]*?)\s*--\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*--[\s\S]*?ANSWER\s*:\s*["“]([\s\S]*?)["”]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 function items(text,H,R){const L=lines(text);const out=[];
  for(const h of H){if(L.some(l=>l.round===h.round&&has(l.quote,h.sentence,8)&&(!l.nar||rebutOk(l,h.round,R).ok)))continue; /* a NOT A REQUIREMENT line counts only when its rebuttal verifies */out.push({kind:'IMPOSED',id:h.id,round:h.round,side:h.side,sentence:h.sentence,phrase:h.phrase});}
  for(const l of N(text).split('\n')){const m=l.match(AC);if(!m||m[4].toUpperCase()!=='MEETS')continue;const f=L.find(z=>z.no&&z.round===m[2].toUpperCase()&&(has(m[3],z.quote,8)||has(z.quote,m[3],8)));
   if(f)out.push({kind:'CONTRADICTION',id:'AC '+m[1].trim()+' ['+m[2].toUpperCase()+']',round:m[2].toUpperCase(),line:l.trim(),imposed:f.raw,ref:m[1].trim()});}
  return out;}
 function setOk(set,ctx){if(!set)return {ok:false,l1:'NONE'};try{const c=ECL.check('FORCED -- GROUND: '+N(set),ctx||{});return {ok:c.l1==='COUNTED',l1:c.l1};}catch(e){return {ok:false,l1:'ERROR'};}}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w+' (pkgIMP, Commitment 14)'});const p=it.imp||{};
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure an imposed requirement');const to=N(a.to).trim();
  if(p.kind==='CONTRADICTION'){if(/^[\s*]*ANSWER CHECK\s*:/i.test(to)&&/--\s*(?:MISSES|FAILS)\b/.test(to)&&has(to,p.ref,2))return R(true,'CHANGE TO the ANSWER CHECK regraded MISSES or FAILS');
   const l=lines(to)[0];if(l&&!l.no&&!l.nar){const s=setOk(l.set,ctx);return s.ok?R(true,'CHANGE TO the IMPOSED line SET BY a counted [L1]'):R(false,'the IMPOSED line is SET BY no counted [L1] ([L1] '+s.l1+')');}
   return R(false,'the CHANGE TO neither regrades the ANSWER CHECK MISSES or FAILS nor sets the requirement by a counted [L1]');}
  const l=lines(to)[0];if(!l)return R(false,'the CHANGE TO is not an IMPOSED line (IMPOSED: [<round>] "<the sentence>" -- asks <verse> to <what> -- NO ROW SETS IT, or SET BY [L1] <reference> "<KJV words>", or NOT A REQUIREMENT -- rebuts [<round>] "<the opponent words>")');
  if(l.round!==p.round)return R(false,'the IMPOSED line names ['+l.round+'], the sentence is in ['+p.round+']');if(!has(l.quote,p.sentence,8))return R(false,'the IMPOSED line does not quote the sentence (8 words in a row, or all of it)');
  if(l.nar){const v=rebutOk(l,p.round,ctx&&ctx.R);return R(v.ok,v.ok?'NOT A REQUIREMENT: '+v.why:'NOT A REQUIREMENT not verified: '+v.why);}
  if(l.no)return R(true,'flagged: NO ROW SETS IT');const s=setOk(l.set,ctx);return s.ok?R(true,'SET BY a counted [L1]'):R(false,'SET BY gives no counted [L1] ([L1] '+s.l1+'); write NO ROW SETS IT, or quote the KJV row that sets it under [L1]');}
 return {AB,GIVE,blocks,harvest,items,lines,cure,has,rebutOk,rounds,roundsOf};})();

/* pkgBAR (Eric approved 17:21 CST 2026-11-06; W3 spec, Wall 2632, parts 1 and 2). Needs IMP (pkgIMP src_IMP.js) loaded before it.
   BAR.check(round,raw,R): the pkgIMP harvest on one debater round. Every harvested sentence is a barred move unless a NOT A REQUIREMENT
   line stands on its line or one of the next two lines and verifies (IMP.rebutOk: the quote, 6 words or more, stands word for word in a
   round of the other side). BAR.note: the one re-call's user turn. BAR.strike: each VOID sentence replaced in the round by the system's mark. */
const BAR=(()=>{
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const NAR=/NOT A REQUIREMENT\s*--\s*rebuts\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]/i;
 const MARK='[VOID (pkgBAR): a barred move struck by the system. The press this answered counts as unanswered.]';
 /* the sentence as it stands in the round: the harvest collapses spaces and trims markdown, so the words are matched with any run of
    spaces or markdown between them */
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 function loc(raw,s){const t=String(raw||'');const w=String(s||'').trim().split(/\s+/).filter(Boolean);if(!w.length)return null;
  const re=new RegExp(w.map(esc).join('[\\s*_]+'));const m=t.match(re);return m?{i:m.index,len:m[0].length}:null;}
 const move=s=>/\b(?:needs?|requires?|must|would\s+have\s+to|has\s+to)\b/i.test(s)
  ?{code:'b',name:'BARRED MOVE (b), a requirement the verse never sets'}:{code:'a',name:'BARRED MOVE (a), an answer from silence'};
 function check(round,raw,R){const out={applies:true,round,hits:[],rebutted:[]};const t=String(raw||'');if(!t){out.applies=false;return out;}
  const H=IMP.harvest({[round]:t});
  for(const h of H){const at=loc(t,h.sentence);let nar=null;
   if(at){const tail=t.slice(at.i).split('\n').slice(0,3).join('\n');const m=tail.match(NAR);
    if(m){const v=IMP.rebutOk({nar:true,rround:m[1].toUpperCase(),rquote:m[2]},round,R||{});nar={rround:m[1].toUpperCase(),rquote:m[2],ok:v.ok,why:v.why};}}
   const x={id:'B'+(out.hits.length+out.rebutted.length+1),round,sentence:h.sentence,phrase:h.phrase,block:h.block,move:move(h.sentence),found:!!at,nar};
   (nar&&nar.ok?out.rebutted:out.hits).push(x);}
  out.pass=!out.hits.length;return out;}
 function note(c){return "BARRED MOVES CHECK -- computed by the system from your round, not by a model. Each sentence below answers from what a verse does not name, state, say or deny. That is a barred move (BARRED MOVES, your instructions).\n"
  +"Write your whole round again, the same case in the same words, but replace each sentence below with a positive answer: quote the words a verse does state ([L1], with its reference) and say what they carry. "
  +"If a sentence only denies a requirement that the other side imposed, you may keep it and write directly under it the line NOT A REQUIREMENT -- rebuts [<the other side's round>] \"<their words, 6 or more, word for word>\". "
  +"A sentence that still answers from silence in the round you return is VOID: the system strikes it from the round, the press it answered counts as unanswered, and the offense is named in the run report. The sentences:\n"
  +c.hits.map(h=>h.id+' ['+h.round+'] "'+h.sentence+'" -- '+h.move.name+(h.nar&&!h.nar.ok?' (your NOT A REQUIREMENT line does not verify: '+h.nar.why+')':'')).join('\n')
  +"\nReturn the whole round; this is the only request of its kind. Repeated offenses will result in disqualification.";}
 function strike(raw,hits){let t=String(raw||'');const struck=[],unfound=[];
  for(const h of hits){const at=loc(t,h.sentence);if(!at){unfound.push(h.id);continue;}t=t.slice(0,at.i)+MARK+t.slice(at.i+at.len);struck.push(h.id);}
  return {raw:t,struck,unfound};}
 /* the rounds read so far, by label: a D node holds the defender's [CRn], a C node the challenger's [DRn] */
 const LABEL=n=>(n[0]==='D'?'CR':'DR')+n[1];
 return {check,note,strike,loc,move,LABEL,MARK,NAR};})();

const __RD=(own)=>{const o={};const rd=(k,f)=>{try{const j=f();if(j&&typeof j.raw==='string')o[k]=j.raw;}catch(e){}};if((()=>{try{return $('D1 Extract').isExecuted;}catch(e){return false;}})())rd('CR1',()=>$('D1 Extract').first().json);if((()=>{try{return $('C1B Extract').isExecuted;}catch(e){return false;}})())rd('DR1',()=>$('C1B Extract').first().json);if((()=>{try{return $('D2B Extract').isExecuted;}catch(e){return false;}})())rd('CR2',()=>$('D2B Extract').first().json);if((()=>{try{return $('C2B Extract').isExecuted;}catch(e){return false;}})())rd('DR2',()=>$('C2B Extract').first().json);if((()=>{try{return $('D3B Extract').isExecuted;}catch(e){return false;}})())rd('CR3',()=>$('D3B Extract').first().json);if((()=>{try{return $('C3B Extract').isExecuted;}catch(e){return false;}})())rd('DR3',()=>$('C3B Extract').first().json);if((()=>{try{return $('D4B Extract').isExecuted;}catch(e){return false;}})())rd('CR4',()=>$('D4B Extract').first().json);o['DR4']=own;return o;}; /* literal names: the task runner sends only these nodes' data */
const __X1=$('C4G Extract').first().json;const __G=$('C4B Build').first().json;const __in=$input.first().json||{};
const __seat=(()=>{const c=(__G&&__G.call)||{};return (c.fam||__X1.fam||'?')+'/'+(c.model||__X1.model||'?');})();
const __rec=o=>({applies:!!(__G&&__G.bar_check&&__G.bar_check.applies),round:'DR4',node:'C4',seat:__seat,side:'CHALLENGER',first:(__G&&__G.bar_check)||null,...o});
const __keep=(why,o)=>[{json:{...__X1,bar:__rec({resent:!!(__G&&__G.resend),kept:'first',why,void:[],...(o||{})})}}];
if(!__G||!__G.resend)return __keep((__G&&__G.why)||'no re-call');
if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));
let __X2=null;try{__X2=(()=>{
// pkgOGR (Eric 2026-11-06 16:22 CST, W3 spec Wall 2024): the Oracle (challenger) tracks every statement of its opponent that supports the claim
// it challenges, and presents them in its close round. Oracle seat only. Code harvests the defender's grant sentences from [CR1]-[CR4]; the
// [DR4] request carries the list and asks for an OPPONENT'S GRANTS section first; a check reads that section back.
// Harvest: a sentence of a defender round that withdraws or grants footing (the K-W words: "I do not claim", "I no longer claim", "I withdraw",
// "I grant", "I concede", "I drop") or that opens with "Granted", "Conceded" or "CONCEDED". As K-W: not inside a quotation, not a heading, not
// negated ("I grant nothing"). The sentence runs from the grant words to its end (220 characters at most); a sentence the defender repeats is
// listed once, under the first round that has it.
const OGR=(()=>{
 const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|(?:^|(?<=[.!?]["”')\]]?\s+)|(?<=\n[ \t>*#-]*))(?:Granted|Conceded|CONCEDED)\b/g;
 const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
 const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 function harvest(R){const out=[];const seen=new Set();
  for(const rk of ['CR1','CR2','CR3','CR4']){const t=N(R&&R[rk]);if(!t)continue;
   for(const m of t.matchAll(RX)){const ls=t.lastIndexOf('\n',m.index)+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);
    if(/^\s*#/.test(ln)&&!/[.!?]["')\]]?\s*$/.test(ln))continue; /* a heading */
    if((bf.match(/"/g)||[]).length%2===1)continue; /* inside a quotation */
    if(/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue; /* negated */
    const ss=t.slice(m.index).split(/(?<=[.!?])["')\]]?\s|\n/);let s=ss[0];if(s.split(/\s+/).length<7&&ss[1])s=s+' '+ss[1]; /* a short grant ("I concede three points.") carries the sentence after it */s=s.slice(0,260).trim();const k=W(s);if(k.split(' ').length<3||seen.has(k))continue;seen.add(k);
    out.push({g:out.length+1,round:rk,text:s});}}
  return out;}
 // the list as the [DR4] request gives it
 function block(G){if(!G.length)return '';return "THE DEFENDER'S GRANTS -- computed by the system from the transcript, not by a model: every sentence of the defender's rounds [CR1] to [CR4] that grants, concedes, withdraws or drops footing, word for word with its round:\n"
  +G.map(x=>'G'+x.g+' ['+x.round+'] "'+x.text+'"').join('\n')
  +"\n\nOPEN YOUR CLOSE ROUND WITH THIS SECTION, before anything else, one line for each grant above, in this form:\nOPPONENT'S GRANTS:\nG<n> [<round>] \"<the grant, word for word as listed>\" -- SUPPORTS: <the claim you challenge that this grant supports, in one line, with the verse it rests on>\n"
  +"Every grant listed must have its line; quote it word for word as listed and keep its round. If a grant supports none of your claims, write SUPPORTS: none -- <why, in one line>. "
  +"Then add, as G+ lines in the same form, any other sentence of the defender's rounds that supports a claim you challenge (for example a statement that no row names a point the defender's case needs), each quoted word for word with its round. "
  +"This section presses nothing new: it quotes only the defender's own words, and the verses you name in it must be verses you cited before. The system checks every quotation in it against the round named.";}
 // the check of a [DR4] text against the harvested list and the defender's rounds
 function check(dr4,G,R){const T=N(dr4);const i=T.search(/OPPONENT'?S GRANTS\s*:/i);const res={section:i>=0,missing:[],misquoted:[],ok:[]};if(!G.length)return {...res,applies:false};
  const sec=i<0?'':T.slice(i).split(/\n\s*\n(?!\s*G\d)/)[0];const lines=sec.split('\n').filter(l=>/^\s*[-*]?\s*G(?:\d+\b|\+)/.test(l));res.extra=[];
  for(const l of lines.filter(z=>/^\s*[-*]?\s*G\+/.test(z))){const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1]; /* the whole quotation: a grant may hold quotation marks of its own */const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];const ok=!!(q&&rk&&W(R[rk]||'').includes(W(q)));res.extra.push({ok,round:rk||null,q:q?q.slice(0,120):null});if(!ok)res.misquoted.push('G+ ('+(q?'"'+q.slice(0,60)+'" does not stand in ['+(rk||'no round')+']':'no quotation')+')');}
  for(const x of G){const l=lines.find(z=>new RegExp('^\\s*[-*]?\\s*G'+x.g+'\\b').test(z));if(!l){res.missing.push('G'+x.g);continue;}
   const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1]; /* the whole quotation: a grant may hold quotation marks of its own */const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];
   if(!q||!rk){res.misquoted.push('G'+x.g+' (no quotation or no round)');continue;}
   const inRound=W(R[rk]||'').includes(W(q));const same=W(q).includes(W(x.text))||W(x.text).includes(W(q))&&W(q).split(' ').length>=6;
   if(!inRound)res.misquoted.push('G'+x.g+' (the quotation does not stand in ['+rk+'])');else if(!same)res.misquoted.push('G'+x.g+' (not the listed grant)');else res.ok.push('G'+x.g);}
  return {...res,applies:true,pass:res.section&&!res.missing.length&&!res.misquoted.length};}
 return {harvest,block,check};})();

// judge_fix3 B1: C4 Extract, the challenger's close round; read, refusal and truncation checks as C3 Extract.
// judge_fix5 G5 (run 32284: the new-in-close check read "Luke 21:26, 35" as naming Luke 21:26 only and marked Luke 21:35 NEW IN CLOSE; the
// citation scan read "Isaiah 7:11, 7:14" as "Isaiah 7:11,7"): ONE reference parser, REFP, for every check (the ledger, the close-round checks,
// the citation scan, K-G4, K-G6, K-G9 and the C-label record). A reference is "Book c:v", with a range ("c:v-w") and a comma list after it: a
// bare verse number after a full reference in the same list takes that book and chapter ("Luke 21:26, 35" is Luke 21:26 and Luke 21:35); a
// comma list of full chapter:verse references is several references of that book ("Isaiah 7:11, 7:14" is Isaiah 7:11 and Isaiah 7:14). A
// reference with no book takes the last book named before it (ctx); scoped, only when no sentence ends between them (ruling 376). Each node keeps
// its own reading rules on top (range caps, verse-past-chapter drops) through a thin adapter.
const REFP=(()=>{const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',songofsongs:'Song of Solomon',canticles:'Song of Solomon',revelations:'Revelation',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles','1chron':'1 Chronicles','2chron':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
 const book=x=>{if(!x)return null;let b=BK[key(x)];if(!b){const w=String(x).split(/\s/).pop();b=BK[key(w)]||null;}return b;};
 const HEAD=/(?<![A-Za-z0-9:])(?:((?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
 const RNG=/^\s?[–—-]\s?(\d{1,3})(?!\d|:\d)/, FULL=/^\s?,\s?(\d{1,3}):(\d{1,3})(?!\d)/, BARE=/^\s?,\s?(\d{1,3})(?!\d|:\d|\s+[A-Z])/;
 const SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
 // parse(t,{scoped}): every reference, in order: {book (written with it, or the list head's), ctx (the book it takes when written without one),
 // c, v1, v2, at (start of its list head), pos (its own start), label ('c:v' or 'c:v-w'), head (true for the list head)}.
 const parse=(t,o)=>{const T=String(t||'');const sc=!!(o&&o.scoped);const out=[];
  const PO=[...T.matchAll(/(?<![A-Za-z0-9])((?:[1-3]\s)?[A-Z][A-Za-z]+)['’]s\b/g)].map(x=>({at:x.index,b:BK[key(x[1])]||null})).filter(x=>x.b);let pi=0,lastBook=null,lastAt=-1;
  HEAD.lastIndex=0;let m;while((m=HEAD.exec(T))){const b=book(m[1]);
   while(pi<PO.length&&PO[pi].at<m.index){if(PO[pi].at>lastAt){lastBook=PO[pi].b;lastAt=PO[pi].at;}pi++;}
   const ctx=b||((sc&&(lastAt<0||SENT.test(T.slice(lastAt,m.index))))?null:lastBook);if(b){lastBook=b;lastAt=m.index;}
   let c=+m[2];const items=[{book:b,ctx,c,v1:+m[3],v2:+m[3],at:m.index,pos:m.index+(m[1]?m[1].length+1:0),head:true}];let i=m.index+m[0].length,x;
   for(;;){const rest=T.slice(i);
    if((x=rest.match(RNG))){const it=items[items.length-1];const z=+x[1];if(z>it.v2)it.v2=z;i+=x[0].length;continue;}
    if((x=rest.match(FULL))){c=+x[1];items.push({book:b,ctx,c,v1:+x[2],v2:+x[2],at:m.index,pos:i+x[0].search(/\d/),head:false});i+=x[0].length;continue;}
    if((x=rest.match(BARE))){items.push({book:b,ctx,c,v1:+x[1],v2:+x[1],at:m.index,pos:i+x[0].search(/\d/),head:false});i+=x[0].length;continue;}
    break;}
   HEAD.lastIndex=i;items.forEach(it=>{it.label=it.c+':'+it.v1+(it.v2>it.v1?'-'+it.v2:'');it.end=i;out.push(it);});}
  return out;};
 // keys(t,{scoped,cap}): "Book c:v" for every verse named, each reference's book or ctx; a range longer than cap verses keeps its first verse only.
 const keys=(t,o)=>{const cap=(o&&o.cap)||30;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;const z=r.v2-r.v1>cap?r.v1:r.v2;for(let v=r.v1;v<=z;v++)out.push({key:b+' '+r.c+':'+v,pos:r.at,ref:b+' '+r.label});}return out;};
 return {parse,keys,book,BK,BOOKS};})();
// judge_fix3 B2 (operator ruling: the challenger's close is "not allowed to press in this round"): any verse reference in [DR4] that no earlier
// challenger round ([DR1]-[DR3]) names is a new press. It is MARKED for the judges as NOT COUNTED (not struck: the transcript the judges read and
// the one published stay word for word the same) and recorded in the review notes. judge_fix5 G5: references are read by REFP, the one parser
// ("Luke 21:26, 35" names Luke 21:35); a range counts as cited before when any verse of it was.
const C4P=(()=>{
 const refs=t=>{const out=[];for(const r of REFP.parse(t,{scoped:true})){const b=r.book||r.ctx;if(!b)continue;const z=Math.max(r.v1,Math.min(r.v2,r.v1+30));const vs=[];for(let x=r.v1;x<=z;x++)vs.push(b+' '+r.c+':'+x);out.push({label:b+' '+r.label,vs});}return out;};
 const fresh=(earlier,c4)=>{const S=new Set();earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(x))).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));};
 const __ogrS=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\u2019]?S GRANTS\s*:/i);if(i<0)return T;const L=T.slice(i).split('\n');const G=/^\s*[-*]?\s*\**\s*G(?:\d+|\+)/;let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\n');return T.slice(0,i)+sec.replace(/["\u201c][^"\u201d\n]*["\u201d]/g,'""')+T.slice(i+sec.length);}; /* pkgOGR (3): the quotations of the OPPONENT'S GRANTS section are the defender's words */const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],__ogrS(F.dr4)):[];
 const note=F=>{const n=of(F);return n.length?'\n\n[CLOSE-ROUND PRESS CHECK -- computed by the system, not by a model: [DR4] names '+n.length+' verse reference(s) that no earlier challenger round names: '+n.join(', ')+'. The close round may not press: each is a NEW PRESS and is NOT COUNTED as evidence, as a witness or as an answer.]':'';};
 // judge_fix4 F5: a verse reference in [CR4] that no earlier round of either side ([CR1]-[DR3]) names is NEW IN CLOSE, NOT COUNTED.
 const ofD=F=>F&&F.cr4?fresh([F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3],F.cr4):[];
 const noteD=F=>{const n=ofD(F);return n.length?'\n\n[CLOSE-ROUND NEW-VERSE CHECK -- computed by the system, not by a model: [CR4] names '+n.length+' verse reference(s) that no earlier round of either side names: '+n.join(', ')+'. Each is NEW IN CLOSE, NOT COUNTED: not evidence, footing, witness or answer. Material in [CR4] counts only as an answer to a witness already pressed against the defender; a sentence in [CR4] that grades or presses against a challenger link is disregarded.]':'';};
 // judge_fix5 G1 (run 32284: the defender's close "I have not seen the text of my round 1 declaration, so I take D1-D6 in the order the
 // challenger's blocks answer them: D1 Joseph did not beget the child, D2 ..."; the challenger's close "restate them now under my own numbers";
 // neither was flagged): the DECLARED CHAIN of [CR1] and the LINK blocks of [DR3], read by code; a close is flagged when it states a numbering of
 // its own, names a D or C number above those, or gives a D or C label to a block whose wording and verses match another declared link or
 // another [DR3] LINK block better than its own.
 const declared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
  for(const l of L.slice(1)){const num=/^\s*\**\s*\d+[.)]\s+\S/.test(l);if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
   if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
  return out.join('\n').replace(/\s+$/,'');};
 const dlinks=F=>{const t=declared(F);if(!t)return [];const L=[];let cur=null;for(const l of t.split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};L.push(cur);continue;}if(cur&&l.trim())cur.text+=' '+l.trim();}return L;};
 const cblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});
  return H.map((x,i)=>({j:i+1,n:x.n,head:x.head,text:t.slice(x.at,i+1<H.length?H[i+1].at:t.length)}));};
 const nDecl=F=>{const L=dlinks(F);return L.length?Math.max(...L.map(x=>x.n)):0;};
 const nLink=F=>cblocks(F).length;
 const RENUM=/\b(?:re-?number\w*|I\s+(?:now\s+)?number|number(?:ed|ing)?\s+(?:my|the|its|our|his)\s+(?:chain|links?|premises)|in\s+the\s+order\s+of\s+the\s+link\s+round|under\s+my\s+own\s+numbers?|(?:my|its|our)\s+own\s+number(?:s|ing)|in\s+the\s+order\s+(?:the|my|its|his|their)\s+[^.\n]{0,60}?\b(?:answer(?:s|ed)?|blocks?|list|took)\b|I\s+(?:now\s+)?(?:take|label|restate)\s+(?:them\s+)?[^.\n]{0,30}?\b[DC]1\s*[–—-]\s*[DC]\d|have\s+not\s+seen\s+the\s+text\s+of\s+my\s+(?:round\s+1\s+)?declaration)/i;
 const STOP=new Set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only link links chain round rounds verse verses text says said stated state states before after because under over about against other another child text rows row stands stand holds hold named names'.split(' '));
 const stems=s=>new Set((String(s).toLowerCase().replace(/[^a-z ]/g,' ').match(/[a-z]{4,}/g)||[]).filter(w=>!STOP.has(w)).map(w=>w.slice(0,5)));
 const vkeys=s=>new Set(REFP.keys(s,{scoped:true,cap:12}).map(k=>k.key));
 const score=(a,b)=>{let n=0;for(const x of a.w)if(b.w.has(x))n++;for(const x of a.v)if(b.v.has(x))n+=2;return n;};
 // each close label with the text it is given: a definition list ("D1 <words>, D2 <words>, ...", three or more) or a block headed by the label.
 // judge_fix6 H3 (run 32293: "C5, C6 -- SUPPORTED" was read as C5 and cut together with the next heading): a block runs to the end of its
 // paragraph and stops at the next heading or label line; a line that heads two labels at once ("C5, C6", "D2 and D3", "C1-C6") is skipped.
 const MULTI=/^[ \t>#*_-]*\**\s*[DC]\d+\**\s*(?:,|and\b|&|\/|[-–—]\s*\**[DC]?\d)\s*\**\s*[DC]?\d/i;
 const closeLabels=(t,sd)=>{const T=String(t||'');const out=[];const L=sd;
  const lists=[...T.matchAll(new RegExp('(?:^|[:;.]\\s+)((?:\\**'+L+'\\d+\\**\\s+[^,;\\n]{4,160}?(?:,\\s*(?:and\\s+)?|;\\s*|\\.\\s*$|\\.(?=\\s)|$)){3,})','gm'))];
  for(const m of lists)for(const x of m[1].matchAll(new RegExp('\\**'+L+'(\\d+)\\**\\s+([^,;\\n]{4,160}?)(?=,\\s*(?:and\\s+)?\\**'+L+'\\d|;|\\.\\s|\\.$|$)','g')))if(!/^(?:vs\b|and\b|[-–—]|to\b|through\b)/i.test(x[2]))out.push({n:+x[1],text:x[2],from:'list'});
  const H=[...T.matchAll(new RegExp('^[ \\t>#*_-]*'+L+'(\\d+)\\b[^\\n]*','gm'))].filter(h=>!/^\s*[^\n]*\bvs\.?\s/i.test(h[0])&&!/ANSWER\s*:/i.test(h[0])&&!MULTI.test(h[0]));
  H.forEach(h=>{if(out.some(o=>o.n===+h[1]))return;const from=h.index+h[0].length;const tail=T.slice(from);
   let e=tail.search(/\n\s*\n|\n[ \t]*#{1,6}\s|\n[ \t>*_-]*\**\s*[DC]\d+\b|\n[ \t>*_-]*\**\s*ANSWER\s*:/);e=e<0?tail.length:e;out.push({n:+h[1],text:T.slice(h.index,from+Math.min(e,2500)),from:'block'});});
  return out;};
 // judge_fix6 H3 (run 32293: both closes kept the declared numbers, and the check fired on both: "D4 ... matches declared D6 better than
 // declared D4", where the label quoted Isaiah 7:14 and Matthew 1:23, the words of its own declared D4): a label maps to a DIFFERENT link only
 // when it shares no verse and no distinctive word with its own (declared link n, or [DR3] LINK block n) and shares at least three points
 // (a verse counts two) with another. A distinctive word is one that stands in at most a third of the links (topic words such as "Joseph"
 // stand in every link and prove nothing). A better score elsewhere is not enough.
 const mismatch=(labels,targets,lab,tlab)=>{const out=[];const TG=targets.map(x=>({k:x.k,w:stems(x.text),v:vkeys(x.text)}));const df={};TG.forEach(x=>x.w.forEach(w=>{df[w]=(df[w]||0)+1;}));
  const lim=Math.max(1,Math.floor(TG.length/3));const dist=w=>(df[w]||0)<=lim;
  const sc=(a,b)=>{let n=0;for(const x of a.w)if(b.w.has(x)&&dist(x))n++;for(const x of a.v)if(b.v.has(x))n+=2;return n;};
  for(const c of labels){const a={w:stems(c.text),v:vkeys(c.text)};const own=TG.find(x=>x.k===c.n);if(!own)continue;const os=sc(a,own);if(os>0)continue;
   const best=TG.filter(x=>x.k!==c.n).map(x=>({k:x.k,s:sc(a,x)})).sort((p,q)=>q.s-p.s)[0];
   if(best&&best.s>=3)out.push(lab+c.n+' ("'+String(c.text).replace(/\s+/g,' ').replace(/[\[\]"*_#]/g,'').trim().slice(0,70)+'") shares no verse and no distinctive word with '+tlab+c.n+' and matches '+tlab+best.k+' (score '+best.s+')');}
  return out;};
 const renum=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const out=[];
  const rm=[...t.matchAll(new RegExp(RENUM.source,RENUM.flags.replace('g','')+'g'))].find(m=>!/\b(?:not|no|never|nor|without)\b[^.\n]{0,40}$/i.test(t.slice(Math.max(0,m.index-60),m.index)))||null; /* s429 F3: "I do not add links or renumber" keeps the numbering */if(rm&&/\b[DC]\d+\b/.test(t.slice(Math.max(0,rm.index-200),rm.index+400))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
  const nd=nDecl(F),nc=nLink(F);const hd=[...new Set([...t.matchAll(/\bD(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nd&&x>nd);const hc=[...new Set([...t.matchAll(/\bC(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nc&&x>nc);
  if(hd.length)out.push('D'+hd.join(', D')+' above the '+nd+' declared links');if(hc.length)out.push('C'+hc.join(', C')+' above the '+nc+' LINK blocks of [DR3]');
  try{const DL=dlinks(F).map(x=>({k:x.n,text:x.text}));if(DL.length)mismatch(closeLabels(t,'D'),DL,'D','declared D').forEach(x=>out.push(x));
   const CB=cblocks(F).map(x=>({k:x.j,text:x.text}));if(CB.length&&sd==='C')mismatch(closeLabels(t,'C'),CB,'C','[DR3] LINK block C').forEach(x=>out.push(x));}catch(e){}
  return out;};
 const noteR=(F,sd)=>{const r=renum(F,sd);return r.length?'\n\n[CLOSE-ROUND NUMBERING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] does not keep the declared numbering (a TRIAL check): '+r.join('; ')+'. Grade by the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; the close round\'s numbering does not govern.]':'';};
 // judge_fix5 G3 (run 32284: the challenger's close "D1 is refused ...", "The defender's D1, D2, D3 and D4 each stand on an inference the named
 // rows do not state"; the defender's close "By the challenger's own measure ...", "the challenger offered no reading of it"; ruling 377): a
 // sentence in a close round that grades or presses the other side's links is DISREGARDED, listed beside the close for the judges and in the
 // transcript, and recorded by a review line. Read in code: a sentence that names the other side or one of its links and grades it.
 const GRADE=[['own measure',/\b(?:by|on|in)\s+(?:the\s+)?(?:challenger|defender|defence|defense)['’]s\s+own\s+(?:measure|reading|terms|words|account|admission|rows?)\b/i],
  ['no reading offered',/\b(?:challenger|defender|defence|defense)\s+(?:has\s+|had\s+)?(?:offered|offers|gave|gives|has|had|left|leaves)\s+no\s+(?:reading|answer|footing|row|reply|response|account|ground)\b/i],
  ['concession claimed',/\b(?:(?:the\s+)?(?:challenger|defender)|\b[CD]\d+)\s+(?:has\s+|had\s+)?(?:conced(?:es|ed)|grant(?:s|ed)|admit(?:s|ted)|dropp(?:ed)|drops|abandon(?:s|ed)|gave\s+up|gives\s+up)\b/i],
  ['link graded',/\b[CD]\d+(?:\s*(?:,|and|&)\s*[CD]\d+)*\s+(?:is|are|was|were|stands?|lies)\s+(?:refused|broken|refuted|false|unfooted|unsupported|unexhibited|void|collapsed|defeated|overturned|answered|unanswered|fails?)\b/i],
  ['inference graded',/\b(?:each\s+)?(?:stands?|rests?)\s+on\s+(?:an?\s+)?inferences?\b[^.]{0,60}\b(?:do(?:es)?\s+not|never|no)\b/i],
  ['link argued against',/\b[CD]\d+\s+(?:answers|argues|claims|routes|reads|rests)\s+(?:by|that|on)\b|^\s*Against\s+that\b/i],
  ['link left unanswered',/\b(?:left|leaves)\s+[^.]{0,80}\bunanswered\b/i],
  ['ground conceded heading',/^#{1,4}\s*(?:ground|points?|links?)\s+(?:the\s+)?(?:challenger|defender)\s+(?:conceded|granted|dropped)\b/i],
  // judge_fix6 H4 (run 32293: "Not one of them says what D6 says", "is not stated by any verse the defender has shown" went unmarked)
  ['refused',/\brefused\b|\brefutes?\b|\brefuted\b/i],['fails',/\bfail(?:s|ed)?\b/i],
  ['does not stand',/\b(?:does|do|did)\s+not\s+(?:stand|hold|carry|follow|touch|show|name|state|say|reach|bear)\b|\bcannot\s+(?:stand|hold|carry|bear)\b|\bis\s+not\s+(?:stated|shown|written)\s+(?:by|in)\b/i],
  ['inference not stated',/\binferences?\b[^.]{0,80}\b(?:not|never)\s+(?:state|stated|say|said|written)\b/i],
  ['concedes',/\bconced(?:es|ed)\b|\bgrant(?:s|ed)\b|\badmit(?:s|ted)\b/i],
  ['breaks',/\b(?:breaks?|broke|collapses?|collapsed)\b/i],
  ['none of them',/\bnot\s+one\s+of\b|\bnone\s+of\s+(?:them|these|those|its|his|her|their)\b/i]];
 // judge_fix8 R1 (run 32306, Worker_E A1, Worker_G1 #6: the check disregarded 23 defender close sentences, among them its quotations of
 // Matthew 1:18-20 for its own link and its grants, and the challenger's restatement of its own rows): a close sentence is marked only when it
 // (a) states a grade or verdict of the other side's link (CONCEDED, BROKEN, UNEXHIBITED, fails, is circular, does not carry ...), naming that
 // side or one of its links in the same sentence, or (b) stands in a new list or press against it (a premise list heading, a PRESSED WITH: line,
 // and every sentence under such a heading). Never: a plain verse quotation for the side's own link, the side's own concession or grant, a
 // report of the other side's own words, or a side's restatement of its own rows. The marks under a heading or a link label alone are gone.
 const press=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];
  const other=sd==='D'?/\bchallenger(?:['’]s)?\b|\bC\d+\b/i:/\bdefen(?:der|ce|se)(?:['’]s)?\b|\bD\d+\b/i;
  const QW=x=>String(x).toLowerCase().replace(/[^a-z\u00c0-\u024f\u1e00-\u1eff ]+/g,' ').split(/\s+/).filter(w=>w.length>=4&&!/^(?:that|this|with|from|have|been)$/.test(w));
  const OS=(sd==='D'?[F.gr1,F.gr2,F.dr3,F.dr4]:[F.cr1,F.cr2,F.cr3,F.cr4]).map(x=>String(x||'').replace(/[*_]+/g,'')).join('\n').split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length);
  const said=q=>q.length>=2&&OS.some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}if(k===q.length&&e-st+1<=3*q.length)return true;}return false;});
  const REPORT=/^(?:[DC]\d+\W+)?(?:the\s+)?(?:defender|challenger)(?:['’]s)?\s+(?:grants|granted|says|said|holds|held|states|stated|writes|wrote|narrows|narrowed|answers|answered|concedes|conceded|admits|admitted|drops|dropped|files|filed|claims|claimed|reads|read)\b/i;
  const report=s=>{if(!REPORT.test(s)||/[—–]|\s--\s|;|\bbut\b|\byet\b|\bso\b/i.test(s))return false;return said(QW(s.replace(REPORT,'')));};
  // the side's own grant or concession, never a grade of the other side
  const OWN=/^(?:I|We)\s+(?:grant|concede|accept|withdraw|drop|narrow|do\s+not\s+(?:argue|claim|press|rest))\b|\b(?:I|we)\s+(?:grant|concede|accept|withdraw|drop)\b|\bis\s+accepted\b|^(?:Granted|Conceded)\b/i;
  const VERD=[['own measure',/\b(?:by|on|in)\s+(?:the\s+)?(?:challenger|defender|defence|defense)['’]s\s+own\s+(?:measure|reading|terms|words|account|admission|rows?)\b/i],
   ['no reading offered',/\b(?:offered|offers|gave|gives|has|had|left|leaves)\s+no\s+(?:reading|answer|footing|row|reply|response|account|ground)\b/i],
   ['concession claimed',/\b(?:(?:the\s+)?(?:challenger|defender)(?:['’]s\s+own\s+(?:answer|reading|round|close))?|\b[CD]\d+)\s+(?:has\s+|had\s+)?(?:conced(?:es|ed)|grant(?:s|ed)|admit(?:s|ted)|dropp(?:ed)|drops|abandon(?:s|ed)|gave\s+up|gives\s+up)\b/i],
   ['link graded',/\b[CD]\d+(?:\s*(?:,|and|&)\s*[CD]\d+)*\s+(?:is|are|was|were|stands?|lies)\s+(?:refused|broken|refuted|false|unfooted|unsupported|unexhibited|void|collapsed|defeated|overturned|unanswered|circular|conceded|withdrawn|floating)\b/i],
   ['grade word',/\b(?:CONCEDED|BROKEN|UNEXHIBITED|UNSUPPORTED|VOID|COLLAPSED)\b/],
   ['inference graded',/\b(?:stands?|rests?)\s+on\s+(?:an?\s+)?inferences?\b[^.]{0,60}\b(?:do(?:es)?\s+not|never|no)\b/i],
   ['left unanswered',/\b(?:left|leaves)\s+[^.]{0,80}\bunanswered\b/i],
   ['refused',/\brefused\b|\brefutes?\b|\brefuted\b/i],['fails',/\bfail(?:s|ed)?\b/i],['circular',/\bcircular\b|\bbegs\s+the\s+question\b/i],
   ['does not carry',/\b(?:does|do|did)\s+not\s+(?:stand|hold|carry|follow|reach|bear)\b|\bcannot\s+(?:stand|hold|carry|bear)\b|\bis\s+not\s+(?:stated|shown|written)\s+(?:by|in)\b/i],
   ['breaks',/\b(?:breaks?|broke|collapses?|collapsed)\b/i],['floats',/\bfloats?\b|\bunfooted\b/i]];
  // (b) a new list or press: a premise list heading, or a PRESSED WITH: line
  const LISTH=/\bUNSUPPORTED-?\s*\[?L4\]?\s*PREMISES\b|\bPREMISES?\s+(?:LIST|AGAINST)\b|\bPREMISE\s+COUNT\s*:/i;const PW=/\bPRESSED\s+WITH\s*:/i;
  const out=[];const seen=new Set();let list=null;
  const add=(s0,why)=>{const s=s0.replace(/\*+/g,'').replace(/\s+/g,' ').trim();if(s.length<12)return;const c=s.slice(0,220);if(seen.has(c))return;seen.add(c);out.push({why,s:c});};
  for(const p0 of t.split(/\n[ \t]*\n/)){let L=p0.split('\n');while(L.length&&/^[ \t]*#{1,6}\s/.test(L[0])){const h=L[0].replace(/^[ \t]*#+\s*/,'').replace(/[*_]+/g,'').trim();list=LISTH.test(h)?'new premise list "'+h.slice(0,60)+'"':null;L=L.slice(1);}
   const p=L.join('\n').trim();if(!p)continue;if(/^[ \t>*_-]*\**\s*ANSWER\s*:/i.test(p))continue; // an answer to a witness pressed against this side is not a press
   const bold=p.match(/^[ \t>_-]*\*\*([^*\n]{4,160})\*\*/);if(bold&&LISTH.test(bold[1]))list='new premise list "'+bold[1].trim().slice(0,60)+'"';else if(LISTH.test(p.split('\n')[0])&&p.split('\n')[0].length<160)list='new premise list "'+p.split('\n')[0].replace(/[*_#]+/g,'').trim().slice(0,60)+'"';
   for(const s0 of p.split(/\n|(?<=[.!?])["”'’)\]]*\s+(?=["“(\[*_]*[A-Z])/)){const s=s0.replace(/\*+/g,'').replace(/^[ \t>_-]+/,'').trim();if(s.length<12)continue;
    if(list){add(s,list);continue;}if(PW.test(s)){add(s,'PRESSED WITH line');continue;}
    if(report(s)||OWN.test(s))continue;if(!other.test(s))continue;const g=VERD.find(([k,rx])=>rx.test(s)&&(k!=='concession claimed'||/\b[CD]\d+\b|\b(?:link|chain|premise|ground|point|case)s?\b/i.test(s)));if(g)add(s,g[0]);}} // a concession claimed of a link, chain, ground or point; not a report of a granted reading
  return out;};
 // judge_fix8 R2 (run 32306: the judges were sent 34 sentences under the challenger's close, the transcript printed 37, because each node read
 // the check from a different set of rounds): the check is computed once, in Build Synthesis, from every round; stored in review_notes by Build
 // Save Body (one AUDIT v27 line per close, its sentences in full); and printed from the stored result for the judges and in the transcript.
 const noteL=(p,sd)=>p&&p.length?'\n\n[CLOSE-ROUND GRADING CHECK -- computed by the system, not by a model; a TRIAL check: ['+(sd==='D'?'CR4':'DR4')+'] holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links. A close round presses nothing (ruling 377): each is DISREGARDED, not a ground for any grade or count: '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+']':'';
 const noteP=(F,sd,stored)=>noteL(Array.isArray(stored)?stored:press(F,sd).map(x=>x.s),sd);
 const all=F=>({D:F&&F.cr4?press(F,'D').map(x=>x.s):[],C:F&&F.dr4?press(F,'C').map(x=>x.s):[]});
 const storeLine=(p,sd)=>'[AUDIT v27: CLOSE-ROUND GRADING CHECK ('+sd+'4) -- STORED, computed once from every round; a TRIAL check: the '+(sd==='D'?'defender':'challenger')+'\'s close round holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links; each is marked DISREGARDED for the judges'+(p.length?': '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+'. REVIEW THIS ROW.]':'.]');
 const stored=(notes,sd)=>{const m=String(notes||'').match(new RegExp('\\[AUDIT v27: CLOSE-ROUND GRADING CHECK \\('+sd+'4\\) -- STORED[^\\]]*?holds (\\d+) sentence\\(s\\)[^\\]]*\\]'));if(!m)return null;
  const p=[...m[0].matchAll(/\((\d+)\) "([^"]*)"/g)].map(x=>x[2]);return p.length===+m[1]?p:null;};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,all,storeLine,stored};})();
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const readEnv=(fam,d)=>{let text=null,trunc=false,u={},cd=null,id=null;
 // claude_direct H4: direct Anthropic. input_tokens excludes the cache there; it is stored as the whole prompt (uncached + written + read), the
 // measure OpenRouter's prompt_tokens gave, so the run's sums keep their meaning; the cache diagnostics become one CACHE DIAG line.
 if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n'))||null;trunc=d.stop_reason==='max_tokens';const x=d.usage||{};const xi=Number(x.input_tokens)||0,xw=Number(x.cache_creation_input_tokens)||0,xr=Number(x.cache_read_input_tokens)||0;u={input_tokens:xi+xw+xr,output_tokens:Number(x.output_tokens)||0,cache_creation_input_tokens:xw,cache_read_input_tokens:xr,input_uncached_tokens:xi};id=typeof d.id==='string'?d.id:null;const dg=d.diagnostics;const cm=dg&&typeof dg==='object'?dg.cache_miss_reason:undefined;const why=(dg===null||dg===undefined)?(DP?'null (no divergence)':'null (first Claude call of the seat, previous_message_id=null)'):(cm===null||cm===undefined)?'pending (comparison not finished)':(String(cm.type||'unknown')+(cm.cache_missed_input_tokens!==undefined&&cm.cache_missed_input_tokens!==null?'; cache_missed_input_tokens='+cm.cache_missed_input_tokens:''));cd='[CACHE DIAG C4: cache_miss_reason='+why+'; read='+xr+'; write='+xw+'; uncached='+xi+'; previous_message_id='+(DP||'null')+'; message_id='+(id||'none')+']';}
 else if(fam==='gemini'){const c=(d.candidates||[])[0]||{};text=(((c.content||{}).parts||[]).filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join(''))||null;trunc=c.finishReason==='MAX_TOKENS';const x=d.usageMetadata||{};u={input_tokens:x.promptTokenCount||0,output_tokens:(Number(x.candidatesTokenCount)||0)+(Number(x.thoughtsTokenCount)||0),cache_creation_input_tokens:0,cache_read_input_tokens:x.cachedContentTokenCount||0};}
 else{const c=(d.choices||[])[0]||{};text=(c.message&&c.message.content)||null;trunc=(c.finish_reason==='length'||c.finish_reason==='model_context_window_exceeded');const x=d.usage||{};u={input_tokens:x.prompt_tokens||0,output_tokens:x.completion_tokens||0,cache_creation_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||x.prompt_cache_hit_tokens||0};}
 return {text,trunc,u,cd,id};};
const B=$('C4B Build').first().json.call;const DP=B&&B.diag_prev?B.diag_prev:null;const e=readEnv(B.fam,$input.first().json||{});
// ORDER (BB-6755): a provider refusal is a failed call, not a round: it throws, and the error output takes it to Failure Salvage as a no-text reply does.
const RF=(()=>{const d=$input.first().json||{};if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal'+(d.stop_details&&d.stop_details.category?' (category '+d.stop_details.category+')':''):null;const GB=['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'];if(B.fam==='gemini'){const pf=d.promptFeedback||{};if(pf.blockReason)return 'promptFeedback.blockReason='+pf.blockReason;const f=((d.candidates||[])[0]||{}).finishReason;return GB.includes(f)?'finishReason='+f:null;}const c=(d.choices||[])[0]||{};if(c.finish_reason==='content_filter')return 'finish_reason=content_filter';if(c.native_finish_reason==='content_filter'||c.native_finish_reason==='refusal'||GB.includes(c.native_finish_reason))return 'native_finish_reason='+c.native_finish_reason;if(c.message&&typeof c.message.refusal==='string'&&c.message.refusal.trim()!=='')return 'message.refusal: '+c.message.refusal.trim().slice(0,200);return null;})();
const RFT=(e.text&&/^\s*The request was rejected because it was considered high risk\.?\s*$/i.test(e.text))?'reply text is the provider rejection "'+String(e.text).trim().slice(0,80)+'"':null; // BB-6904 rev 8: 27177
if(RF||RFT)throw new Error('VALIDATION: C4 (CHALLENGER, '+B.fam+' '+B.model+') refused by the provider: '+(RF||RFT)+'; output_tokens='+e.u.output_tokens+'. A refusal is not a debate round.'+RT);
 // ORDER J (BB-6200): a no-text reply names what the provider reported, so the cause is on the record.
if(!e.text||String(e.text).trim()===''){const d0=$input.first().json||{};const c0=(d0.choices||[])[0]||{};const g0=(d0.candidates||[])[0]||{};const x0=d0.usage||{};const fin=d0.stop_reason||g0.finishReason||c0.finish_reason||null;const rt=(x0.completion_tokens_details&&x0.completion_tokens_details.reasoning_tokens)||(d0.usageMetadata&&d0.usageMetadata.thoughtsTokenCount)||0;const rc=(c0.message&&typeof c0.message.reasoning==='string')?c0.message.reasoning.length:0;const er=d0.error?String(d0.error.message||JSON.stringify(d0.error)).slice(0,200):null;throw new Error('VALIDATION: C4 (CHALLENGER, '+B.fam+' '+B.model+') returned no text: finish_reason='+fin+'; output_tokens='+e.u.output_tokens+'; reasoning_tokens='+rt+'; reasoning_chars='+rc+(er?'; error='+er:'')+'.'+RT);}
let raw=e.text;if(e.trunc){raw+='\n\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]';}
// judge_fix8 R8 (run 32306: the defender's round 2 wrote "Noted. Not conceding here. Goes to review." three times; the synthesis praised it) and R9
// (its challenger round 2 was headed "Round 3 (close)"): the placeholder is stripped from a defender round, and a heading in the first lines that names
// another round number is set to this round's; each is recorded (round_fix) and Build Save Body writes a review line.
const __RFX=(()=>{const n=4;const fx={heading:null,placeholder:0};const L=raw.split('\n');for(let i=0,k=0;i<L.length&&k<3;i++){if(!L[i].trim())continue;k++;const h=L[i].match(/^([ \t#*_>-]*)(.*?\bRound\s+)(\d)\b(\s*\((?:close|closing|close round|link round|link)\)|\s*[-–—:]?\s*(?:close|closing)\b(?:\s+round)?)?(.*)$/i);if(!h||(!/^[ \t]*(?:#|\*\*|__)/.test(L[i])&&L[i].length>160))continue;if(+h[3]===n)break;fx.heading=L[i].trim();L[i]=h[1]+h[2]+n+(n===4?' (close)':n===3?' (link round)':'')+h[5];break;}if(fx.heading)raw=L.join('\n');return fx;})();
const I=$('Init with Guards').first().json;const labelled=I.lab.C+' -- ROUND 4, CLOSE ROUND\n\n'+raw;
// judge_fix3 B2: the new-press flow check on the challenger's close (recorded on this item; the judges see the same list, recomputed from the rounds).
const __ogrS2=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\u2019]?S GRANTS\s*:/i);if(i<0)return T;const L=T.slice(i).split('\n');const G=/^\s*[-*]?\s*\**\s*G(?:\d+|\+)/;let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\n');return T.slice(0,i)+sec.replace(/["\u201c][^"\u201d\n]*["\u201d]/g,'""')+T.slice(i+sec.length);}; /* pkgOGR (3): the quotations of the OPPONENT'S GRANTS section are the defender's words */
let new_press=[];try{new_press=C4P.fresh([$('C1B Extract').first().json.raw,$('C2B Extract').first().json.raw,$('C3B Extract').first().json.raw],__ogrS2(raw));}catch(x){new_press=[];}
/* pkgOGR (2): the OPPONENT'S GRANTS section read back against the harvested list (record only) */let grants=[],grants_check=null;try{const __R={CR1:$('D1 Extract').first().json.raw,CR2:$('D2B Extract').first().json.raw,CR3:$('D3B Extract').first().json.raw,CR4:$('D4B Extract').first().json.raw};grants=OGR.harvest(__R);grants_check=OGR.check(raw,grants,__R);}catch(x){grants_check={error:String(x&&x.message||x).slice(0,200)};}
let renumbered=[];try{renumbered=C4P.renum({cr1:$('D1 Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw,dr4:raw},'C');}catch(x){renumbered=[];} // judge_fix4 F5
// judge_fix8 R2: the close-round grading check is computed once, in Build Synthesis (judge_fix5 G3 computed it here, unused)
return [{json:{run_token:TOK,round:'C4',raw,round_fix:__RFX,labelled,usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id,new_press,renumbered,grants,grants_check}}];

})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}
let __c2=null;try{__c2=BAR.check('DR4',__X2.raw,__RD(__X2.raw));}catch(e){__c2=null;}
const __n1=String(__X1.raw||'').length,__n2=String(__X2.raw||'').length;
const __f=c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.misquoted||[]).length;const __worse=__f(__X2.grants_check)>__f(__X1.grants_check);
const __k2=!!(__c2&&__c2.applies&&__n2>=0.6*__n1&&!__worse);const __K=__k2?__X2:__X1;const __cK=__k2?__c2:__G.bar_check;
const __why=__k2?'the replacement round ('+__n1+' -> '+__n2+' chars; barred sentences '+__G.bar_check.hits.length+' -> '+__c2.hits.length+')':(!__c2?'the replacement was not checked':__n2<0.6*__n1?'the replacement is under 60% of the first round ('+__n1+' -> '+__n2+' chars)':'the replacement has more grants_check faults');
const __S=BAR.strike(__K.raw,__cK.hits),__SL=BAR.strike(__K.labelled,__cK.hits);
const __void=__cK.hits.map(h=>({seat:__seat,side:'CHALLENGER',round:'DR4',id:h.id,sentence:h.sentence,move:h.move.name,struck:__S.struck.includes(h.id)}));
return [{json:{...__K,grants_resend:__X1.grants_resend,raw:__S.raw,labelled:typeof __K.labelled==='string'?__SL.raw:__K.labelled,bar:__rec({resent:true,kept:__k2?'second':'first',why:__why,second:__c2,void:__void,struck:__S.struck,unfound:__S.unfound,first_raw_chars:__n1})}}];
