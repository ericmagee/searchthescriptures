/* pkgCDR rev 9 (W1): the closing enforcer is handed, as candidates, every sentence of a side's rounds 1 to 3 that holds a verb of the drop family,
   whole. The code does not extract a wording or look for the closing sentence: the enforcer names what the sentence gives up and finds whether the
   side's closing round asserts it again (revs 1 to 8 extracted the wording by rule; each revision hid true drops of a new form: W2 Wall 4014, W3
   grade_CDR8_w3.md). Filter by speaker only: the side's own rounds; system marks ("[VOID ...") are not the side's words. Close Enforcer Record
   checks every answer as before: a CONFIRMED line stands only when both quotations are found word for word in the rounds named. */
const cdrSentsRaw=raw=>String(raw||'').split(/\n+|(?<=[.!?]["”’')\]]*)\s+/).map(x=>x.trim()).filter(Boolean);
const cdrVerb=/\b(?:drop(?:s|ped|ping)?|withdr(?:aw|aws|awn|awing|ew|awal)|retract(?:s|ed|ing|ion)?|abandon(?:s|ed|ing)?|relinquish(?:es|ed|ing)?|renounc(?:e|es|ed|ing)|surrender(?:s|ed|ing)?|disavow(?:s|ed|ing)?|recant(?:s|ed|ing)?|forg(?:o|oes|one|oing)|foreg(?:o|oes|one|oing)|strik(?:e|es|ing)|struck|waiv(?:e|es|ed|ing)|rescind(?:s|ed|ing)?|discard(?:s|ed|ing)?|(?:give|gives|gave|given|giving)\s+(?:[^.;!?\n]{0,80}?\s+)?up|(?:take|takes|took|taken|taking)\s+(?:[^.;!?\n]{0,80}?\s+)?back|(?:walk|walks|walked|walking)\s+back|(?:back|backs|backed|backing)\s+away|(?:concede|concedes|conceded|conceding)\s+(?:[^.;!?\n]{0,80}?\s+)?away|(?:set|sets|setting|put|puts|putting|lay|lays|laid|laying)\s+aside|(?:let|lets|letting)\s+go|no\s+longer)\b/i;
const cdrLinkAt=(raw,sent)=>{const t=String(raw||'');const i=t.indexOf(sent);if(i<0)return null;let n=null;for(const h of t.slice(0,i).matchAll(/\bLINK\s+(\d+)\b/gi))n=+h[1];return n;};
const CDR_MAX=30;
const cecDropped=F=>{const out=[];const SD=[['DEFENDER',[['CR1','cr1'],['CR2','cr2'],['CR3','cr3']],'CR4'],['CHALLENGER',[['DR1','gr1'],['DR2','gr2'],['DR3','dr3']],'DR4']];
 for(const [side,early,cr] of SD){const seen=new Set();let k=0;
  for(const [er,ek] of early)for(const ds of cdrSentsRaw(F[ek])){if(/^\W*\[?VOID\b/i.test(ds)||!cdrVerb.test(ds))continue;const q=ds.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,'');const key=cecN(q);if(!key||seen.has(key))continue;seen.add(key);
   if(++k>CDR_MAX)break;out.push({id:'P'+(out.length+1),side,by:'the code check (a sentence of this side\'s earlier rounds with a drop, withdraw or give-up verb)',kind:'LINK',n:cdrLinkAt(F[ek],ds)||'?',earlier_round:er,earlier_q:q,closing_round:cr,closing_q:null,why:'find whether the closing round asserts again what this sentence gives up'});}}
 return out;};
