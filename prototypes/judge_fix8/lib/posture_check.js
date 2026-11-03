// judge_fix8 P2 (JUDGE_POSTURE_DRAFT_v4 Part 3; TRIAL, marks only, posture mode only): the SILENCE block read against the ledger and the
// pressed lists, the SAME TEST block read for a test applied to one link of a collision line and not to the other. Recorded, never cured,
// never counted. Uses the checker's own readers (ciRounds, pwList, ciKeys, ks2Grounds, ks2Hit, netUnwrap).
function postureBlock(T,head){const L=T.split('\n');const i=L.findIndex(l=>new RegExp('^\\s*(?:[-•#>]\\s*)?'+head+'\\s*:','i').test(l));if(i<0)return null;
 const out=[L[i].replace(new RegExp('^\\s*(?:[-•#>]\\s*)?'+head+'\\s*:\\s*','i'),'')];
 for(let k=i+1;k<L.length;k++){const l=L[k];if(/^\s*(?:[-•#>]\s*)?(?:SILENCE|SAME TEST|RESULT|CLAUSE|VERDICT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CITATION CHECK|COLLISION POINTS|KEYSTONE)\b/i.test(l))break;if(!l.trim()){if(out.length>1)break;continue;}out.push(l);}
 return out.map(x=>x.replace(/^\s*(?:[-•*]|\d+[.)])\s*/,'').trim()).join('\n').split(/\n|;\s*(?=[1-3]?\s?[A-Z][a-z]+\.?\s+\d)/).map(x=>x.trim()).filter(Boolean);}
function postureCheck(text,ptext){const marks=[];if(typeof text!=='string')return {marks};const T=netUnwrap(text).replace(/[*_`]+/g,'');
 const tag=(k,m)=>'[AUDIT v28: POSTURE CHECK ('+k+', TRIAL) -- '+m.replace(/[\[\]]/g,'')+' Recorded, not cured, not counted.]';
 // SILENCE against the lists and the ledger
 const S=postureBlock(T,'SILENCE');
 if(!S)marks.push(tag('SILENCE','the judgment has no SILENCE line.'));
 else{const R=ciRounds(String(ptext||''));const PW=new Map();
  for(const side of ['DEFENDER','CHALLENGER']){const PL=pwList(R,side)||[];PL.forEach(p=>p.keys.forEach(k=>{if(!PW.has(k))PW.set(k,side.toLowerCase()+' premise '+p.n);}));}
  const said=new Set();
  for(const e of S){if(/^\s*none\b/i.test(e))continue;for(const k of ciKeys(e)){said.add(k);if(!PW.has(k))marks.push(tag('SILENCE','SILENCE counts '+k+' unanswered, but no listed premise carries it under PRESSED WITH within the cap of 8 (rulings 392, 393): "'+e.slice(0,160)+'".'));}}
  const nn=[];for(const l of String(ptext||'').split('\n')){const m=l.match(/^\s*premise \d+[^\n]*NOT NAMED: (.+)$/);if(m&&!/^none\b/i.test(m[1].trim()))for(const k of ciKeys(m[1]))nn.push(k);}
  for(const k of nn)if(!said.has(k))marks.push(tag('SILENCE','the ledger marks '+k+' NOT NAMED (unanswered by the rule); the SILENCE line does not count it.'));}
 // SAME TEST: a test written for one link of a collision line and not the other; an own-words ground on a collision line with no entry
 const Q=postureBlock(T,'SAME TEST');
 if(!Q)marks.push(tag('SAME TEST','the judgment has no SAME TEST line.'));
 else{const pairs=new Set();
  for(const e of Q){if(/^\s*none\b/i.test(e))continue;const d=e.match(/\bon\s+(D\d+)\b/i),c=e.match(/\bon\s+(C\d+)\b/i);
   if(d&&c)pairs.add(d[1].toUpperCase()+' vs '+c[1].toUpperCase());
   const one=!d||!c||/\bon\s+[CD]\d+\s*:\s*(?:not\s+applied|n\/a|none|not\s+tested|-|—|no\s+test)\b/i.test(e)||/\b(?:not\s+applied|only)\s+(?:to|on)\s+(?:D|C)\d+/i.test(e);
   if(one)marks.push(tag('SAME TEST','"'+e.slice(0,200)+'" applies a test to one link of a collision line and not to the other.'));}
  for(const l of T.split('\n')){const m=l.match(/^\s*(?:[-•]|\d+[.)])?\s*(D\d+)\s+vs\.?\s+(C\d+)\b/i);if(!m)continue;const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();
   if(!pairs.has(id)&&ks2Hit(ks2Grounds(l)))marks.push(tag('SAME TEST',id+' rests on a witness\'s-own-words test, and the SAME TEST line has no entry applying it to both links of that line.'));}}
 return {marks};}
