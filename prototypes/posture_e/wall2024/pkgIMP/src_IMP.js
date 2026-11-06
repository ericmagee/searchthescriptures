// pkgIMP (Eric 17:08 CST 2026-11-06: "the judges should flag comments where the model make requirements of scripture that the scripture itself
// doesn't hold or suggest"; W3 spec, Wall 2627; Commitment 14, IMPOSED REQUIREMENT, ENFORCED, both sides, not a DG).
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
 function harvest(R){const out=[];const seen=new Set();
  for(const k of ROUNDS){const t=String(R&&R[k]||'');if(!t)continue;let off=0;
   for(const para of t.split(/(\n\s*\n|\n(?=\s*(?:[-*•]|\d+[.)])\s))/)){const at=off;off+=para.length;if(!para.trim()||/^\s*#|^\s*\**\s*LINK\s+\d+\s*:\s*\**\s*\w+\**\s*$/i.test(para.trim()))continue;
    let so=0;for(const s0 of para.split(/(?<=[.!?]["”']?)\s+(?=["“(\[*]*[A-Z])/)){const pos=at+para.indexOf(s0,so);so=Math.max(so,pos-at+s0.length);
     const s=s0.replace(/\s+/g,' ').replace(/^[\s*_\-•]+|[\s*_]+$/g,'').trim();if(s.length<12||/^(?:PRESSED WITH|MEANS)\b/i.test(s))continue;
     const m=unq(s).match(AB);if(!m)continue;if(!REF.test(t.slice(Math.max(0,pos-600),pos+s0.length)))continue; /* rests on a verse: a reference in the sentence or the 600 characters before it */
     const key=k+'|'+W(s);if(seen.has(key))continue;seen.add(key);out.push({id:'I'+(out.length+1),round:k,side:k[0]==='C'?'DEFENDER':'CHALLENGER',sentence:s.slice(0,400),phrase:m[0]});}}}
  return out;}
 const has=(a0,b0,n)=>{const a=' '+W(a0)+' ',bw=W(b0).split(' ').filter(Boolean);if(!bw.length)return false;const k=Math.min(n||8,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
 const LINE=/^[\s>*_\-•]*IMPOSED\s*:\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]\s*--\s*asks\s+([\s\S]+?)\s+to\s+([\s\S]+?)\s*--\s*(NO ROW SETS IT|SET BY\b\s*([\s\S]*))\s*$/i;
 function lines(text){const o=[];for(const l of N(text).split('\n')){const m=l.match(LINE);if(m)o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],verse:m[3],req:m[4],no:/^NO ROW/i.test(m[5]),set:m[6]||null});}return o;}
 const AC=/^[\s>*_\-•]*ANSWER CHECK\s*:\s*([^\n]*?)\s*--\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*--[\s\S]*?ANSWER\s*:\s*["“]([\s\S]*?)["”]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 function items(text,H){const L=lines(text);const out=[];
  for(const h of H){if(L.some(l=>l.round===h.round&&has(l.quote,h.sentence,8)))continue;out.push({kind:'IMPOSED',id:h.id,round:h.round,side:h.side,sentence:h.sentence,phrase:h.phrase});}
  for(const l of N(text).split('\n')){const m=l.match(AC);if(!m||m[4].toUpperCase()!=='MEETS')continue;const f=L.find(z=>z.no&&z.round===m[2].toUpperCase()&&(has(m[3],z.quote,8)||has(z.quote,m[3],8)));
   if(f)out.push({kind:'CONTRADICTION',id:'AC '+m[1].trim()+' ['+m[2].toUpperCase()+']',round:m[2].toUpperCase(),line:l.trim(),imposed:f.raw,ref:m[1].trim()});}
  return out;}
 function setOk(set,ctx){if(!set)return {ok:false,l1:'NONE'};try{const c=ECL.check('FORCED -- GROUND: '+N(set),ctx||{});return {ok:c.l1==='COUNTED',l1:c.l1};}catch(e){return {ok:false,l1:'ERROR'};}}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w+' (pkgIMP, Commitment 14)'});const p=it.imp||{};
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure an imposed requirement');const to=N(a.to).trim();
  if(p.kind==='CONTRADICTION'){if(/^[\s*]*ANSWER CHECK\s*:/i.test(to)&&/--\s*(?:MISSES|FAILS)\b/.test(to)&&has(to,p.ref,2))return R(true,'CHANGE TO the ANSWER CHECK regraded MISSES or FAILS');
   const l=lines(to)[0];if(l&&!l.no){const s=setOk(l.set,ctx);return s.ok?R(true,'CHANGE TO the IMPOSED line SET BY a counted [L1]'):R(false,'the IMPOSED line is SET BY no counted [L1] ([L1] '+s.l1+')');}
   return R(false,'the CHANGE TO neither regrades the ANSWER CHECK MISSES or FAILS nor sets the requirement by a counted [L1]');}
  const l=lines(to)[0];if(!l)return R(false,'the CHANGE TO is not an IMPOSED line (IMPOSED: [<round>] "<the sentence>" -- asks <verse> to <what> -- NO ROW SETS IT, or SET BY [L1] <reference> "<KJV words>")');
  if(l.round!==p.round)return R(false,'the IMPOSED line names ['+l.round+'], the sentence is in ['+p.round+']');if(!has(l.quote,p.sentence,8))return R(false,'the IMPOSED line does not quote the sentence (8 words in a row, or all of it)');
  if(l.no)return R(true,'flagged: NO ROW SETS IT');const s=setOk(l.set,ctx);return s.ok?R(true,'SET BY a counted [L1]'):R(false,'SET BY gives no counted [L1] ([L1] '+s.l1+'); write NO ROW SETS IT, or quote the KJV row that sets it under [L1]');}
 return {AB,harvest,items,lines,cure,has};})();
