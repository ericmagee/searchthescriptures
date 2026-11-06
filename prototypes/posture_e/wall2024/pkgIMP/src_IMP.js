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
