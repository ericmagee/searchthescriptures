/* pkgCDR (W1): the dropped-then-restated check. Wording a side dropped or withdrew in its rounds 1-3 that the same side states again, as its own
   (not inside quote marks, not in a sentence that itself drops, withdraws or grants), in its closing round is listed as a candidate. The enforcer must
   answer each listed candidate; Close Enforcer Record checks every answer as before. The check names candidates only; it confirms nothing. */
const CDR_SW=new Set('a an the and or of to in on at by for from with as is are was were be been it its this that these those any all my his her their our your i we he she they not no nor but so if then than which who whom whose what when where there here only by itself alone also'.split(' '));
const cdrCore=x=>x.split(' ').filter(w=>w&&!CDR_SW.has(w)&&w.length>2).length;
const cdrUnq=s=>String(s).replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’/g,' ');
const cdrSentsRaw=raw=>String(raw||'').split(/\n+|(?<=[.!?]["”’')\]]*)\s+/).map(x=>x.trim()).filter(Boolean);
const cdrDrop=/\bI\s+(?:now\s+|also\s+|therefore\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\b/i;
const cdrSelf=/\b(?:drop|dropped|withdr[a-z]*|retract[a-z]*|gave\s+up|give\s+up|abandon[a-z]*|grant|granted|grants)\b/i;
const cdrWords=s=>{const W=[];for(const m of String(s).matchAll(/"([^"\n]+)"|“([^”\n]+)”|‘([^’\n]+)’/g)){const q=cecN(m[1]||m[2]||m[3]);if(q.split(' ').length>=3&&cdrCore(q)>=2)W.push(q);}
 const u=cdrUnq(s).replace(/[*_`]+/g,'');const m=u.match(/\b(?:claim|limb|wording|sentence|reading|premise|step)\s+that\s+((?:[^,;:\n]|:(?=\d))+?)(?:[,;]|:(?!\d)|\.\s*$|$)/i);
 if(m){const q=cecN(m[1]);if(q.split(' ').length>=5&&cdrCore(q)>=2)W.push(q);}return [...new Set(W)];};
const cdrLinkAt=(raw,sent)=>{const t=String(raw||'');const i=t.indexOf(sent);if(i<0)return null;let n=null;for(const h of t.slice(0,i).matchAll(/\bLINK\s+(\d+)\b/gi))n=+h[1];return n;};
const cecDropped=F=>{const out=[];const SD=[['DEFENDER',[['CR1','cr1'],['CR2','cr2'],['CR3','cr3']],['CR4','cr4']],['CHALLENGER',[['DR1','gr1'],['DR2','gr2'],['DR3','dr3']],['DR4','dr4']]];
 for(const [side,early,[cr,ck]] of SD){const close=cdrSentsRaw(F[ck]).filter(z=>!cdrSelf.test(z));let k=0;
  for(const [er,ek] of early)for(const ds of cdrSentsRaw(F[ek]).filter(z=>cdrDrop.test(z)))for(const w of cdrWords(ds))for(const cs of close){
   if(!cecN(cdrUnq(cs)).includes(w))continue;if(out.some(o=>o.side===side&&o.closing_q===cs&&o.earlier_q===ds))continue;if(++k>12)break;
   out.push({id:'P'+(out.length+1),side,by:'the code check (wording the side dropped, found again in its closing round)',kind:'LINK',n:cdrLinkAt(F[ek],ds)||'?',earlier_round:er,earlier_q:ds.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),closing_round:cr,closing_q:cs.replace(/^(?:[-•>]\s+|\d{1,2}[.)]\s+)/,''),why:'the closing sentence holds the dropped wording "'+w+'"'});}}
 return out;};
