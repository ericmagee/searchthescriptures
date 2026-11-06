// pkgBAR C2B Extract: the round [DR2] after the barred-move re-call. A pass-through item (resend false), a failed re-call or an unread reply
// keeps C2 Extract's round unchanged, and nothing is VOID. Otherwise C2 Extract's own reading (below, unchanged but for its call source, C2B Build)
// reads the new reply. The replacement is kept unless it is under 60% of the first round's length; each sentence
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

const __RD=(own)=>{const o={};for(const [n,k] of [["D1 Extract","CR1"],["C1B Extract","DR1"],["D2B Extract","CR2"]]){try{if($(n).isExecuted){const j=$(n).first().json;if(j&&typeof j.raw==='string')o[k]=j.raw;}}catch(e){}}o['DR2']=own;return o;};
const __X1=$('C2 Extract').first().json;const __G=$('C2B Build').first().json;const __in=$input.first().json||{};
const __seat=(()=>{const c=(__G&&__G.call)||{};return (c.fam||__X1.fam||'?')+'/'+(c.model||__X1.model||'?');})();
const __rec=o=>({applies:!!(__G&&__G.bar_check&&__G.bar_check.applies),round:'DR2',node:'C2',seat:__seat,side:'CHALLENGER',first:(__G&&__G.bar_check)||null,...o});
const __keep=(why,o)=>[{json:{...__X1,bar:__rec({resent:!!(__G&&__G.resend),kept:'first',why,void:[],...(o||{})})}}];
if(!__G||!__G.resend)return __keep((__G&&__G.why)||'no re-call');
if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));
let __X2=null;try{__X2=(()=>{
// ======== judge_fix9 (PROVEN_STRUCTURE_DRAFT_v2; rulings 396-402): shared libraries ========
// judge_fix9 S4 (PROVEN_STRUCTURE_DRAFT_v2 section 5; Worker_E B2-B4, Worker_G1 D8): the [L2] check and the [L2] sheet, one library (L2C).
// An [L2] tag names a Hebrew or Greek word (script, transliteration or Strong's number). The word is matched to the lexicon's dictionary form
// (lexicon_words.transliteration / original_script), accents and the beta-code letters normalized (q theta, h eta, w omega, v final sigma, c chi,
// x xi, y psi, f phi), Hebrew attached prefixes stripped (ha-, ve-, be-, le-, ke-, mi-, she-; the table's "/" splits); the Strong's number of the
// matched row counts the tag when that number occurs (original_words) in a verse the same block cites. The inflected form of the verse
// (original_words.transliteration) is a second route; a Strong's number written directly is matched by itself. The block is the LINK block or the
// numbered premise item that holds the tag, otherwise its paragraph (the span the footing reader reads). Statuses per tag: COUNTED; NOT COUNTED
// ("not in the cited verse", or "no Hebrew or Greek word named", or "its block cites no verse"); UNVERIFIABLE (an Apocrypha verse: the
// original-words table holds the 66 books only; or the cited verse's words were not read this run); a tag that names no Hebrew or Greek word is
// no [L2] claim and is IGNORED (coordinator, 2026-11-03). Every cited verse is read: the reads are paginated, one request per batch of
// verses, with no verse cap. Counts of occurrences are recomputed from
// original_words in verses and in tokens; a count that matches neither is "DIFFERS FROM THE RECORD (n verses, m tokens)", not "wrong" (the table
// follows one text base per Testament; operational_doc 13). Only the matched words, statuses and counts reach the judges; no gloss does.
const L2C=(()=>{
 const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/';
 const APOC=/\b((?:1|2|I|II)\s+(?:Maccabees|Esdras)|Tobit|Judith|Wisdom(?:\s+of\s+Solomon)?|Sirach|Ecclesiasticus|Baruch|Susanna|Bel\s+and\s+the\s+Dragon|Prayer\s+of\s+Manass[eh]+s?|Letter\s+of\s+Jeremiah|Rest\s+of\s+Esther)\.?\s+(\d{1,3}):(\d{1,3})/g;
 const STOP=new Set(('the a an and or of in on at to for with by from as is are was were be been being this that these those it its his her their our your my thy thine '+
  'he she they we you i who whom which what when where how not no nor but if then than so here there same verb noun word words phrase form greek hebrew aramaic '+
  'means meaning mean root used use uses reads read says said gives give names name marks mark carries carry states state stated subject object active passive '+
  'participle tense present perfect aorist imperfect future indicative infinitive imperative genitive dative accusative nominative singular plural feminine '+
  'masculine neuter relative pronoun preposition article clause verse verses row rows also only just both each every one two three first last other another '+
  'same very more most much many some any all none whole lord god jesus christ joseph mary david holy ghost spirit son father man woman child do does did '+
  'not into upon unto under over before after till until has have had will would shall should can could may might must').split(' '));
 const strip=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g,'');
 // beta code (original_words, Greek, as the table writes it: c chi, x xi) to a plain transliteration
 const BETA={a:'a',b:'b',g:'g',d:'d',e:'e',z:'z',h:'e',q:'th',i:'i',k:'k',l:'l',m:'m',n:'n',x:'x',o:'o',p:'p',r:'r',s:'s',v:'s',t:'t',u:'u',f:'ph',c:'ch',y:'ps',w:'o'};
 const beta2lat=s=>String(s||'').toLowerCase().split('').map(c=>BETA[c]!=null?BETA[c]:c).join('');
 // Greek script to a plain transliteration (accents stripped first)
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 const grk2lat=s=>strip(s).toLowerCase().split('').map(c=>GRK[c]!=null?GRK[c]:c).join('');
 const isGrk=s=>/[Ͱ-Ͽἀ-῿]/.test(s),isHeb=s=>/[֐-׿]/.test(s);
 // one normal form for every Latin transliteration (debater, lexicon, original_words after beta2lat)
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 const skel=t=>t.replace(/[aeiou]/g,'');
 // a function word, by its morph code (the [L2] sheet leaves these out; the check still reads every word): Greek T (article), CONJ, COND,
 // PREP, PRT, INJ, and the pronouns P, R, C, D, K, I, X, Q, F, S; Hebrew (TAHOT, H + segments): the word's own segment (the last that is not a
 // suffix S...) a particle T..., a conjunction C/c, a preposition R or a pronoun P.
 const isFunc=r=>{const m=String(r&&r.morph||'').trim();if(!m)return false;if(/^H/.test(m)){const sg=m.slice(1).split(/[\/\s]/).filter(x=>x&&!/^S/.test(x));const main=sg[sg.length-1]||'';return /^[TCRPc]/.test(main);}
  return /^(?:T|CONJ|COND|PREP|PRT|INJ|P|R|C|D|K|I|X|Q|F|S)$/.test(m.split(/[\s-]/)[0]);};
 const hebScript=s=>strip(s).replace(/[^א-ת]/g,'');
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 // the forms a written word may take: itself, its parts after a hyphen or slash, and with one Hebrew prefix stripped
 const variants=w=>{const out=new Set();const raw=String(w||'');const parts=raw.split(/[-\/]/).filter(Boolean);
  const add=x=>{const n=norm(x);if(n.length>=2){out.add(n);if(/^h[aeiou]/.test(n))out.add(n.slice(1));}};add(raw);if(parts.length>1){add(parts[parts.length-1]);add(parts.join(''));}
  for(const n of [...out])for(const p of PREF)if(n.startsWith(p)&&n.length-p.length>=3)out.add(n.slice(p.length));return [...out];};
 const ed1=(a,b)=>{if(a===b)return true;if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
  return a.slice(i+1)===b.slice(i+1)||a.slice(i)===b.slice(i+1)||a.slice(i+1)===b.slice(i);};
 // ---------- reading the rounds ----------
 const vkey=(b,c,v)=>b+' '+c+':'+v;
 const refsIn=t=>{const out=[];try{for(const k of REFP.keys(String(t||''),{scoped:true,cap:12}))out.push(k.key);}catch(e){}return [...new Set(out)];};
 const apocIn=t=>{const out=[];APOC.lastIndex=0;let m;while((m=APOC.exec(String(t||''))))out.push(m[1].replace(/\s+/g,' ')+' '+m[2]+':'+m[3]);return [...new Set(out)];};
 // the block that holds position i: the LINK block or numbered premise item, otherwise the paragraph; with no verse in it, the paragraph before
 function blockAt(T,i){const t=String(T||'');const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b[^\n]*|\**\s*\d+[.)]\s+(?:LINK\b)?[^\n]*|#{1,4}\s[^\n]*|UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES[^\n]*|CHALLENGER.{0,2}S\s+UNSUPPORTED[^\n]*)$/gmi)].map(m=>m.index);
  let a=0,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const linkHead=/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)/i.test(t.slice(a,a+40));
  if(!linkHead){const pa=t.lastIndexOf('\n\n',i);const pb=t.indexOf('\n\n',i);const A=Math.max(a,pa<0?0:pa),B=Math.min(b,pb<0?t.length:pb);
   let blk=t.slice(A,B);const opens=/^[\s>*_#-]*(?:\d+[.)]\s*)?[*_]*\s*$/.test(t.slice(A,i));if((opens||(!refsIn(blk).length&&!apocIn(blk).length))&&A>0){const pp=t.lastIndexOf('\n\n',A-1);blk=t.slice(Math.max(a,pp<0?0:pp),B);}return blk;}
  return t.slice(a,b);}
 // the source words an [L2] tag names
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;
 function tagWords(seg){const s=String(seg||'');const out=[];const seen=new Set();const add=(w,kind)=>{const k=kind+'|'+String(w).toLowerCase();if(seen.has(k))return;seen.add(k);out.push({w:String(w),kind});};
  for(const m of s.matchAll(/\b([GH])0*(\d{1,5})\b/g))add(m[1]+m[2],'strongs');
  for(const m of s.matchAll(/[Ͱ-Ͽἀ-῿]+/g))add(m[0],'greek');
  for(const m of s.matchAll(/[֐-׿\/]+/g)){const x=m[0].replace(/\//g,'');if(x)add(x,'hebrew');}
  const latin=w=>{const x=String(w).replace(/^[\s"“”'‘’(]+|[\s"“”'‘’),.;:!?]+$/g,'');if(!x||/\d/.test(x)||isGrk(x)||isHeb(x))return;
   for(const p of x.split(/\s+/)){const q=p.replace(/^[^A-Za-zÀ-ɏḀ-ỿʼʻ']+|[^A-Za-zÀ-ɏḀ-ỿʼʻ']+$/g,'');if(q.length<2||STOP.has(strip(q).toLowerCase()))continue;add(q,'latin');}};
  for(const m of s.matchAll(W_IT))latin(m[1]);
  // a run of lowercase words written just before "(meaning)": the words back to punctuation, a capital or an English word
  const other=out.length>0||W_IT.test(s);W_IT.lastIndex=0;
  for(const m of s.matchAll(/\(\s*["“'‘]?[a-z]/g)){if(/[*_]\s*$/.test(s.slice(0,m.index)))continue;const before=s.slice(0,m.index).replace(/[*_]+/g,'');const toks=before.split(/(\s+)/);const run=[];
   for(let k=toks.length-1;k>=0;k--){const tk=toks[k];if(/^\s+$/.test(tk)||tk==='')continue;const c=tk.replace(/["“”'‘’]/g,'');
    if(/[,;:.!?)\]]$/.test(c)&&run.length)break;const q=c.replace(/[,;:.!?)\]]+$/,'');if(!q||/^[A-Z]/.test(q)||/\d/.test(q)||isGrk(q)||isHeb(q)||STOP.has(strip(q).toLowerCase())||!/^[a-zà-ɏḀ-ỿʼʻ'’-]+$/.test(q))break;run.unshift(q);if(/[,;:.!?]$/.test(c))break;}
   if(run.length&&(!other||run.some(q=>/[à-ɏḀ-ỿʼʻ']/.test(q))))latin(run.join(' '));}
  // words with marks of a transliteration (macrons, accents), anywhere in the tag
  for(const m of s.matchAll(/(?<![\wÀ-ɏḀ-ỿ])[a-z]*[āēīōūâêîôûáéíóúàèìòùʼʻ][a-zà-ɏḀ-ỿʼʻ']*/g))latin(m[0]);
  // a Hebrew word written with its prefix and a hyphen (ha-almah)
  for(const m of s.matchAll(/(?<![\w-])(?:ha|he|ve|va|be|ba|le|la|ke|ka|mi|me|she|u)-[a-zà-ɏḀ-ỿʼʻ']{3,20}(?![\w-])/g))latin(m[0]);
  // a single quoted lowercase word, when nothing else was found ('Luke 3:23's "enomizeto"')
  if(!out.length)for(const m of s.matchAll(/["“]([a-zà-ɏḀ-ỿʼʻ'-]{3,24})["”]/g))latin(m[1]);
  return out;}
 // every [L2] tag of the rounds ([[side, round, text], ...]), with its words and the verses its block cites
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));const __line=t.slice(__ls,__le);const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i)); /* s429 F4: a press line's [L2] is read against that line's verses */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   out.push({side,round,at:i,seg:seg.replace(/\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}
  return out;}
 // ---------- matching ----------
 // OW: original_words rows {book,chapter,verse,strongs_number,transliteration,original_script}; LEX: lexicon rows; READ: set of verse keys read
 function index(OW,LEX){const V={};for(const r of OW||[]){if(!r||!r.book)continue;const k=vkey(r.book,r.chapter,r.verse);(V[k]=V[k]||[]).push(r);}
  const X={};for(const r of LEX||[])if(r&&r.strongs_number)X[r.strongs_number]=r;return {V,X};}
 const numOf=s=>{const m=String(s||'').match(/^([GH])0*(\d+)/);return m?m[1]+m[2]:null;};
 function matchWord(wd,cands,IX){const nums=new Set(cands.map(r=>numOf(r.strongs_number)).filter(Boolean));
  if(wd.kind==='strongs')return nums.has(wd.w)?{ok:true,num:wd.w,route:'number'}:{ok:false};
  if(wd.kind==='greek'){const g=norm(grk2lat(wd.w));for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;if(norm(beta2lat(r.transliteration))===g)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};
    const L=IX.X[numOf(r.strongs_number)];if(L&&norm(grk2lat(L.original_script))===g)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}
   for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;const f=norm(beta2lat(r.transliteration));if(g.length>=5&&f.length>=5&&ed1(g,f))return {ok:true,num:numOf(r.strongs_number),route:'inflected (one letter)'};}return {ok:false};}
  if(wd.kind==='hebrew'){const h=hebScript(wd.w);if(h.length<2)return {ok:false};for(const r of cands){if(!/^H/.test(r.strongs_number||''))continue;const segs=String(r.original_script||'').split('/').map(hebScript).filter(Boolean);
    if(segs.includes(h)||segs.join('')===h)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};const L=IX.X[numOf(r.strongs_number)];if(L&&hebScript(L.original_script)===h)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}return {ok:false};}
  const V=variants(wd.w);if(!V.length)return {ok:false};
  const forms=[];for(const r of cands){const n=numOf(r.strongs_number);if(!n)continue;const L=IX.X[n];
   if(L)for(const x of variants(L.transliteration))forms.push({f:x,n,route:'dictionary',heb:n[0]==='H'});
   const it=n[0]==='G'?beta2lat(r.transliteration):String(r.transliteration||'');for(const x of variants(it))forms.push({f:x,n,route:'inflected',heb:n[0]==='H'});}
  for(const v of V)for(const f of forms)if(f.f===v)return {ok:true,num:f.n,route:f.route};
  for(const v of V)for(const f of forms)if(f.heb&&skel(v).length>=3&&skel(v)===skel(f.f))return {ok:true,num:f.n,route:f.route+' (consonants)'};
  for(const v of V)for(const f of forms)if(v.length>=6&&f.f.length>=6&&ed1(v,f.f))return {ok:true,num:f.n,route:f.route+' (one letter)'};
  return {ok:false};}
 function check(TG,OW,LEX,READ){const IX=index(OW,LEX);const RD=new Set(READ||Object.keys(IX.V));
  return (TG||[]).map(t=>{const vs=t.verses||[];const read=vs.filter(k=>RD.has(k));const cands=[].concat(...read.map(k=>IX.V[k]||[]));
   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null};});
   let status,why;
   if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length&&t.apoc&&t.apoc.length){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+'): the original-words table holds the 66 books only';}
   else if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length){status='NOT COUNTED';why='its block cites no verse';}
   else if(ws.every(w=>w.ok)){status='COUNTED';why=ws.map(w=>w.w+' = '+w.num).join(', ');}
   else if(read.length<vs.length){status='UNVERIFIABLE';why='the words of '+vs.filter(k=>!RD.has(k)).join(', ')+' were not read this run';}
   else if(t.apoc&&t.apoc.length&&!ws.some(w=>w.ok)){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+')';}
   else{status='NOT COUNTED';why='not in the cited verse: '+ws.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')';}
   return {...t,words:ws,status,why};});}
 // ---------- counts ----------
  function countClaims(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/(?<![:\d]\s?)\b(\d{1,4})\s+(verses?|tokens?|rows?|times|occurrences?|instances?)\b/gi)){if(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s*$/.test(t.slice(Math.max(0,m.index-20),m.index)))continue;const pre=t.slice(Math.max(0,m.index-90),m.index);
   const after=t.slice(m.index,m.index+80);if(!/\[L2\]|\b[GH]\d{1,5}\b|[Ͱ-Ͽἀ-῿֐-׿]|[*_][a-zà-ɏḀ-ỿ]/.test(pre+after))continue;
   const num=(pre.match(/\b([GH])0*(\d{1,5})\b(?![\s\S]*\b[GH]\d)/)||[]);let subj=num.length?num[1]+num[2]:null,word=null;
   if(!subj){const ws=tagWords(pre.slice(-70));const w=ws.filter(x=>x.kind!=='strongs').pop();if(w)word=w;}
   if(!subj&&!word)continue;const u=m[2].toLowerCase();
   out.push({side,round,at:m.index,n:+m[1],unit:/^verse/.test(u)?'verses':/^token/.test(u)?'tokens':null,said:m[0],subj,word,text:t.slice(Math.max(0,m.index-60),m.index+m[0].length).replace(/\s+/g,' ').trim()});}}
  return out;}
 // CR: original_words rows {book,chapter,verse,strongs_number} for the numbers claimed (all their occurrences); CAPPED: true when the read hit its row cap
 function countCheck(CL,CR,capped,TGres){const by={};if(CR&&!Array.isArray(CR)){for(const [n,x] of Object.entries(CR))by[n]={v:{size:x.verses},t:x.tokens};}else for(const r of CR||[]){const n=numOf(r.strongs_number);if(!n)continue;(by[n]=by[n]||{v:new Set(),t:0});by[n].t++;by[n].v.add(vkey(r.book,r.chapter,r.verse));}
  const wordNum={};for(const t of TGres||[])for(const w of t.words||[])if(w.ok&&w.num)wordNum[norm(w.w)]=w.num;
  return (CL||[]).map(c=>{const n=c.subj||(c.word?wordNum[norm(c.word.w)]||null:null);if(!n)return {...c,num:null,status:'UNVERIFIABLE',why:'the word could not be matched to a Strong\'s number'};
   const b=by[n];if(!b)return {...c,num:n,status:capped?'UNVERIFIABLE':'DIFFERS FROM THE RECORD (0 verses, 0 tokens)',why:capped?'the count was not read':null};
   if(capped&&b.t>=1000)return {...c,num:n,status:'UNVERIFIABLE',why:'over the row cap'};
   const nv=b.v.size,nt=b.t;const ok=c.unit==='verses'?c.n===nv:c.unit==='tokens'?c.n===nt:(c.n===nv||c.n===nt);
   return {...c,num:n,verses:nv,tokens:nt,status:ok?(c.unit?'MATCHES THE RECORD':'MATCHES THE RECORD (unit not named)'):'DIFFERS FROM THE RECORD ('+nv+' verses, '+nt+' tokens)'+(c.unit?'':' (unit not named)')};});}
 // ---------- requests (the read plans) ----------
 // the original_words rows of the verses keys (66 books; others return none), one request per batch of PER verses (each within URL_MAX
 // characters and well under the read's 1,000-row limit): every verse is read, none is left off for a cap.
 function wordsUrls(keys,o){const PER=(o&&o.per)||20;const URL_MAX=7000;const B=SB+'original_words?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&order=book,chapter,verse,word_position&limit=1000';
  const ks=[...new Set((keys||[]).filter(k=>/^(.+) (\d+):(\d+)$/.test(String(k))))];const out=[];
  const mk=b=>{const G=new Map();for(const k of b){const m=String(k).match(/^(.+) (\d+):(\d+)$/);const g=m[1]+'|'+m[2];if(!G.has(g))G.set(g,[]);G.get(g).push(+m[3]);}
   const conds=[...G].map(([g,vs])=>{const [bk,c]=g.split('|');return 'and(book.eq."'+bk+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';});return B+'&or='+encodeURIComponent('('+conds.join(',')+')');};
  let cur=[];for(const k of ks){const t=cur.concat([k]);if(cur.length&&(t.length>PER||mk(t).length>URL_MAX)){out.push({url:mk(cur),keys:cur});cur=[k];}else cur=t;}if(cur.length)out.push({url:mk(cur),keys:cur});return out;}
 // kept for one-request callers: the first batch
 function wordsUrl(keys,o){const U=wordsUrls(keys,o);return {url:U.length?U[0].url:SB+'original_words?select=book&id=eq.-1',read:U.length?U[0].keys:[],off:[].concat(...U.slice(1).map(x=>x.keys))};}
 // the lexicon rows of the Strong's numbers of the words read, in batches of 250 numbers; o.sheet: leave out the function words (sheet only), gloss read
 function lexUrls(OW,o){const sheet=!!(o&&o.sheet);const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(!n||/^H9\d{3}$/.test(n)||n==='G0')continue;(byN[n]=byN[n]||[]).push(r);}
  const S=Object.keys(byN).filter(n=>!sheet||!byN[n].every(isFunc));const cols='strongs_number,original_script,transliteration'+(sheet?',anchor_gloss':'');const out=[];
  for(let i=0;i<S.length;i+=250)out.push(SB+'lexicon_words?select='+cols+'&limit=1000&strongs_number=in.('+S.slice(i,i+250).join(',')+')');return out;}
 function lexUrl(OW){const U=lexUrls(OW,{sheet:true});return U.length?U[0]:SB+'lexicon_words?select=strongs_number&strongs_number=in.(NONE)';}
 function countsUrl(nums){const S=[...new Set((nums||[]).filter(Boolean))].slice(0,40);return SB+'original_words?select=book,chapter,verse,strongs_number&limit=1000&strongs_number=in.('+(S.length?S.join(','):'NONE')+')';}
 // ---------- the [L2] sheet (both debaters, rounds 2 to 4; not the judges) ----------
 // one row per distinct Strong's number in the verses read (pressed verses first, then the verses cited, in order of first citation), the
 // function words left out: the dictionary form, the number and the lexicon gloss quoted whole; capped at CAPC characters, every number left off listed.
 function sheet(OW,LEX,P){const IX=index(OW,LEX);const order=(P&&(P.l2_req||P.l2_read))||[];const seen=new Set();const rows=[],left=[],nolex=[];let ch=0,fw=0;const CAPC=26000;
  const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(n)(byN[n]=byN[n]||[]).push(r);}
  const got=new Set(Object.keys(IX.V));const unread=order.filter(k=>!got.has(k));
  for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n))continue;seen.add(n);if(byN[n].every(isFunc)){fw++;continue;}const L=IX.X[n];if(!L){if(!/^H9\d{3}$/.test(n)&&n!=='G0')nolex.push(n);continue;}
   const line=n+' '+String(L.original_script||'').trim()+' '+String(L.transliteration||'').trim()+': '+String(L.anchor_gloss||'');if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}
  if(!order.length)return '';
  const tail=[].concat(unread.length?['verses read with no rows (Apocrypha, no such verse, or the read failed): '+unread.join(', ')]:[],left.length?['numbers over the sheet cap of '+CAPC+' characters: '+left.join(', ')]:[],nolex.length?['numbers the lexicon does not hold: '+nolex.join(', ')]:[]);
  return '[L2] SHEET -- read by the system from the record\'s original-words table (original_words: the Greek of the TR, Scrivener 1894; the Hebrew of the Leningrad codex) and its lexicon (lexicon_words), for every verse cited so far in this debate (the verses pressed under PRESSED WITH first), served alike to both sides: one row per Strong\'s number, with the dictionary form and the lexicon gloss quoted whole; '+fw+' function words (articles, conjunctions, prepositions, particles, pronouns) are left out. An [L2] counts only when its word is in a verse its own block cites: name the word by its dictionary form, its transliteration or its Strong\'s number, with its meaning. A count of occurrences names its unit (verses or tokens).\n'+(rows.length?rows.join('\n'):'(no original-words row could be read this round)')+(tail.length?'\nLEFT OFF THE [L2] SHEET: '+tail.join('; ')+'.':'');}
 // the verse order of the sheet: the verses under PRESSED WITH first, then every verse cited, in order of first citation
 function sheetPlan(texts,keys){const pw=[];for(const t of texts||[]){const s=String(t||'');for(const m of s.matchAll(/PRESSED WITH\s*:/gi)){let seg=s.slice(m.index);const b=seg.search(/\n\s*\n|\n\s*\**\s*\d+[.)]\s/);if(b>=0)seg=seg.slice(0,b);for(const k of refsIn(seg))if(!pw.includes(k))pw.push(k);}}
  const order=pw.concat((keys||[]).filter(k=>!pw.includes(k)));return {l2_req:order,l2_urls:wordsUrls(order).map(x=>x.url)};}
 return {tags,tagWords,check,countClaims,countCheck,wordsUrl,wordsUrls,lexUrl,lexUrls,isFunc,countsUrl,sheet,sheetPlan,norm,variants,beta2lat,grk2lat,blockAt,refsIn,apocIn,numOf,index,matchWord};})();
// ======== end judge_fix9 libraries ========
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
// judge_fix5 G11 (operator: "if they have to pull from our source ... why is the spelling changing"; until now no debater was given KJV text):
// the VERSE SHEET. Before D2, C2, D3, C3, D4 and C4 the KJV text of every verse either side has cited so far (REFP, scoped; a range of more than
// 12 verses gives its first verse only) is read from kjv_verses in ONE request (the node "<round> Verse Sheet"), built here as Citation Scan builds
// its read: one condition per book and chapter (verse.in.(...)), conditions added in the order of first citation while the URL stays within
// 7,000 characters; a verse past that is left off and listed. The Build node prints the rows as stored (bracketed italics and margin notes kept),
// in the order of first citation, capped at SHEET_CAP_VERSES verses and SHEET_CAP_CHARS characters of verse text; every verse left off is listed.
// Round 1 has no sheet of verses cited; the Oracle seat's round 1 gets the verses its served rows name (Init with Guards), and the sheet says so.
const SHEET=(()=>{const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';const URL_MAX=7000;const CAP_V=150,CAP_C=24000;
 const req=texts=>{const seen=new Set();const out=[];for(const t of texts)for(const k of REFP.keys(String(t||''),{scoped:true,cap:12})){if(seen.has(k.key))continue;seen.add(k.key);const m=k.key.match(/^(.+) (\d+):(\d+)$/);if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}
  /* judge_fix8 R12 (guard DG-18: never quote Psalm 2:7 without its three NT occasions): a sheet that serves Psalms 2:7 or Acts 13:33 serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5 with it */
  if(seen.has('Psalms 2:7')||seen.has('Acts 13:33'))for(const k of ['Acts 13:33','Hebrews 1:5','Hebrews 5:5']){if(seen.has(k))continue;seen.add(k);const m=k.match(/^(.+) (\d+):(\d+)$/);out.push({book:m[1],c:+m[2],v:+m[3],key:k});}
  return out;};
 const url=ws=>{const G=new Map();for(const w of ws){const g=w.book+'|'+w.c;if(!G.has(g))G.set(g,[]);G.get(g).push(w.v);}
  const conds=[];const off=[];let ulen=BASE.length+'&limit=1000&or='.length+6;
  for(const [g,vs] of G){const [b,c]=g.split('|');const cnd='and(book.eq."'+b+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';const add=encodeURIComponent(cnd+',').length;
   if(ulen+add>URL_MAX){vs.forEach(v=>off.push(b+' '+c+':'+v));continue;}ulen+=add;conds.push(cnd);}
  return {url:conds.length?BASE+'&limit=1000&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1',off};};
 const plan=texts=>{const r=req(texts);const u=url(r);return {sheet_url:u.url,sheet_req:r.map(x=>x.key),sheet_off_url:u.off,...(typeof L2C!=='undefined'?L2C.sheetPlan(texts,r.map(x=>x.key)):{})};}; // judge_fix9 S4: the [L2] sheet's read
 // the sheet text from the rows read; head names what the sheet holds (round 1: the served rows; later: verses cited so far)
 const text=(rows,P,head)=>{const idx={};(rows||[]).forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)idx[r.book+' '+r.chapter+':'+r.verse]=String(r.text||'');});
  const keys=(P&&P.sheet_req)||[];const offU=new Set((P&&P.sheet_off_url)||[]);const lines=[],cap=[],miss=[];let n=0,ch=0;
  for(const k of keys){if(offU.has(k))continue;const t=idx[k];if(t==null){miss.push(k);continue;}if(n>=CAP_V||ch+t.length>CAP_C){cap.push(k);continue;}lines.push(k+' '+t);n++;ch+=t.length;}
  if(!keys.length)return '';const left=[].concat(offU.size?['not read (request size): '+[...offU].join(', ')]:[],cap.length?['over the cap of '+CAP_V+' verses or '+CAP_C+' characters: '+cap.join(', ')]:[],miss.length?['not in the KJV table as cited (no such verse, or the read failed): '+miss.join(', ')]:[]);
  return 'VERSE SHEET -- '+head+' Read by the system from the record\'s KJV table (kjv_verses), as stored: words in [brackets] are the KJV\'s italics or its margin notes. Quote only from this sheet, or from a verse you name with its full reference (book, chapter and verse) and quote exactly in the KJV.\n'+(lines.length?lines.join('\n'):'(no verse text could be read this round)')+(left.length?'\nLEFT OFF THE SHEET: '+left.join('; ')+'.':'');};
 return {req,url,plan,text,CAP_V,CAP_C};})();
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const readEnv=(fam,d)=>{let text=null,trunc=false,u={},cd=null,id=null;
 // claude_direct H4: direct Anthropic. input_tokens excludes the cache there; it is stored as the whole prompt (uncached + written + read), the
 // measure OpenRouter's prompt_tokens gave, so the run's sums keep their meaning; the cache diagnostics become one CACHE DIAG line.
 if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n'))||null;trunc=d.stop_reason==='max_tokens';const x=d.usage||{};const xi=Number(x.input_tokens)||0,xw=Number(x.cache_creation_input_tokens)||0,xr=Number(x.cache_read_input_tokens)||0;u={input_tokens:xi+xw+xr,output_tokens:Number(x.output_tokens)||0,cache_creation_input_tokens:xw,cache_read_input_tokens:xr,input_uncached_tokens:xi};id=typeof d.id==='string'?d.id:null;const dg=d.diagnostics;const cm=dg&&typeof dg==='object'?dg.cache_miss_reason:undefined;const why=(dg===null||dg===undefined)?(DP?'null (no divergence)':'null (first Claude call of the seat, previous_message_id=null)'):(cm===null||cm===undefined)?'pending (comparison not finished)':(String(cm.type||'unknown')+(cm.cache_missed_input_tokens!==undefined&&cm.cache_missed_input_tokens!==null?'; cache_missed_input_tokens='+cm.cache_missed_input_tokens:''));cd='[CACHE DIAG C2: cache_miss_reason='+why+'; read='+xr+'; write='+xw+'; uncached='+xi+'; previous_message_id='+(DP||'null')+'; message_id='+(id||'none')+']';}
 else if(fam==='gemini'){const c=(d.candidates||[])[0]||{};text=(((c.content||{}).parts||[]).filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join(''))||null;trunc=c.finishReason==='MAX_TOKENS';const x=d.usageMetadata||{};u={input_tokens:x.promptTokenCount||0,output_tokens:(Number(x.candidatesTokenCount)||0)+(Number(x.thoughtsTokenCount)||0),cache_creation_input_tokens:0,cache_read_input_tokens:x.cachedContentTokenCount||0};}
 else{const c=(d.choices||[])[0]||{};text=(c.message&&c.message.content)||null;trunc=(c.finish_reason==='length'||c.finish_reason==='model_context_window_exceeded');const x=d.usage||{};u={input_tokens:x.prompt_tokens||0,output_tokens:x.completion_tokens||0,cache_creation_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||x.prompt_cache_hit_tokens||0};}
 return {text,trunc,u,cd,id};};
const B=$('C2B Build').first().json.call;const DP=B&&B.diag_prev?B.diag_prev:null;const e=readEnv(B.fam,$input.first().json||{});
// ORDER (BB-6755): a provider refusal is a failed call, not a round: it throws, and the error output takes it to Failure Salvage as a no-text reply does.
const RF=(()=>{const d=$input.first().json||{};if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal'+(d.stop_details&&d.stop_details.category?' (category '+d.stop_details.category+')':''):null;const GB=['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'];if(B.fam==='gemini'){const pf=d.promptFeedback||{};if(pf.blockReason)return 'promptFeedback.blockReason='+pf.blockReason;const f=((d.candidates||[])[0]||{}).finishReason;return GB.includes(f)?'finishReason='+f:null;}const c=(d.choices||[])[0]||{};if(c.finish_reason==='content_filter')return 'finish_reason=content_filter';if(c.native_finish_reason==='content_filter'||c.native_finish_reason==='refusal'||GB.includes(c.native_finish_reason))return 'native_finish_reason='+c.native_finish_reason;if(c.message&&typeof c.message.refusal==='string'&&c.message.refusal.trim()!=='')return 'message.refusal: '+c.message.refusal.trim().slice(0,200);return null;})();
const RFT=(e.text&&/^\s*The request was rejected because it was considered high risk\.?\s*$/i.test(e.text))?'reply text is the provider rejection "'+String(e.text).trim().slice(0,80)+'"':null; // BB-6904 rev 8: 27177
if(RF||RFT)throw new Error('VALIDATION: C2 (CHALLENGER, '+B.fam+' '+B.model+') refused by the provider: '+(RF||RFT)+'; output_tokens='+e.u.output_tokens+'. A refusal is not a debate round.'+RT);
 // ORDER J (BB-6200): a no-text reply names what the provider reported, so the cause is on the record.
if(!e.text||String(e.text).trim()===''){const d0=$input.first().json||{};const c0=(d0.choices||[])[0]||{};const g0=(d0.candidates||[])[0]||{};const x0=d0.usage||{};const fin=d0.stop_reason||g0.finishReason||c0.finish_reason||null;const rt=(x0.completion_tokens_details&&x0.completion_tokens_details.reasoning_tokens)||(d0.usageMetadata&&d0.usageMetadata.thoughtsTokenCount)||0;const rc=(c0.message&&typeof c0.message.reasoning==='string')?c0.message.reasoning.length:0;const er=d0.error?String(d0.error.message||JSON.stringify(d0.error)).slice(0,200):null;throw new Error('VALIDATION: C2 (CHALLENGER, '+B.fam+' '+B.model+') returned no text: finish_reason='+fin+'; output_tokens='+e.u.output_tokens+'; reasoning_tokens='+rt+'; reasoning_chars='+rc+(er?'; error='+er:'')+'.'+RT);}
let raw=e.text;if(e.trunc){raw+='\n\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]';}
// judge_fix8 R8 (run 32306: the defender's round 2 wrote "Noted. Not conceding here. Goes to review." three times; the synthesis praised it) and R9
// (its challenger round 2 was headed "Round 3 (close)"): the placeholder is stripped from a defender round, and a heading in the first lines that names
// another round number is set to this round's; each is recorded (round_fix) and Build Save Body writes a review line.
const __RFX=(()=>{const n=2;const fx={heading:null,placeholder:0};const L=raw.split('\n');for(let i=0,k=0;i<L.length&&k<3;i++){if(!L[i].trim())continue;k++;const h=L[i].match(/^([ \t#*_>-]*)(.*?\bRound\s+)(\d)\b(\s*\((?:close|closing|close round|link round|link)\)|\s*[-–—:]?\s*(?:close|closing)\b(?:\s+round)?)?(.*)$/i);if(!h||(!/^[ \t]*(?:#|\*\*|__)/.test(L[i])&&L[i].length>160))continue;if(+h[3]===n)break;fx.heading=L[i].trim();L[i]=h[1]+h[2]+n+(n===4?' (close)':n===3?' (link round)':'')+h[5];break;}if(fx.heading)raw=L.join('\n');return fx;})();
const I=$('Init with Guards').first().json;const labelled=I.lab.C+' -- ROUND 2, CLOSING AND PREMISE LIST\n\n'+raw;
const __SP=(()=>{try{return SHEET.plan([$('D1 Extract').first().json.raw,$('C1B Extract').first().json.raw,$('D2B Extract').first().json.raw,raw]);}catch(x){return {sheet_url:null,sheet_req:[],sheet_off_url:[]};}})(); // judge_fix5 G11: the next round's verse sheet
return [{json:{run_token:TOK,round:'C2',raw,round_fix:__RFX,labelled,usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id,...__SP}}];

})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}
let __c2=null;try{__c2=BAR.check('DR2',__X2.raw,__RD(__X2.raw));}catch(e){__c2=null;}
const __n1=String(__X1.raw||'').length,__n2=String(__X2.raw||'').length;
const __worse=false;
const __k2=!!(__c2&&__c2.applies&&__n2>=0.6*__n1&&!__worse);const __K=__k2?__X2:__X1;const __cK=__k2?__c2:__G.bar_check;
const __why=__k2?'the replacement round ('+__n1+' -> '+__n2+' chars; barred sentences '+__G.bar_check.hits.length+' -> '+__c2.hits.length+')':(!__c2?'the replacement was not checked':__n2<0.6*__n1?'the replacement is under 60% of the first round ('+__n1+' -> '+__n2+' chars)':'the replacement has more  faults');
const __S=BAR.strike(__K.raw,__cK.hits),__SL=BAR.strike(__K.labelled,__cK.hits);
const __void=__cK.hits.map(h=>({seat:__seat,side:'CHALLENGER',round:'DR2',id:h.id,sentence:h.sentence,move:h.move.name,struck:__S.struck.includes(h.id)}));
return [{json:{...__K,raw:__S.raw,labelled:typeof __K.labelled==='string'?__SL.raw:__K.labelled,bar:__rec({resent:true,kept:__k2?'second':'first',why:__why,second:__c2,void:__void,struck:__S.struck,unfound:__S.unfound,first_raw_chars:__n1})}}];
