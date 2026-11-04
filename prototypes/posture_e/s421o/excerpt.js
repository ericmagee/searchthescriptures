// ruling 424 (run 32677): the enforcer reads the link's own blocks from every round of the side that holds it, not a window around the sentence.
const HD=/(?:^|\n)[ \t>#*-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,60}):/gi;
const blocksOf=t=>{t=clean(t);const hs=[...t.matchAll(HD)].map(m=>({at:m.index,lab:m[1]}));return hs.map((h,k)=>({lab:h.lab,text:t.slice(h.at,k+1<hs.length?hs[k+1].at:t.length).trim()}));};
const tokOf=lab=>{const m=String(lab||'').match(/LINK\s*\d+|\b[DC]\d+\b/i);return m?m[0].replace(/\s+/g,' ').toUpperCase():null;};
const SIDE_RK={CR:['CR1','CR2','CR3','CR4'],DR:['DR1','DR2','DR3','DR4']};
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const excerpt=(rk,s,lab)=>{if(!R||!rk)return '(round text not available)';const fam=rk.slice(0,2);const tok=tokOf(lab);const key=nzd(s).slice(0,60),key2=nzd(s).slice(0,30);const parts=[];let own=null;
 for(const r of SIDE_RK[fam]){const t=R[r];if(!t)continue;
  if(r.endsWith('1')){if(tok){const rx=new RegExp('\\b'+tok.replace(' ','\\s*')+'\\b','i');const ls=clean(t).split('\n').filter(l=>rx.test(l)).slice(0,4);if(ls.length)parts.push('['+r+'] '+ls.map(l=>cut(l,500)).join(' / '));}continue;}
  for(const b of blocksOf(t)){const bt=tokOf(b.lab);const mine=!!tok&&bt===tok;const nb=nzd(b.text);const hasS=nb.includes(key)||(!!key2&&nb.includes(key2));
   if(r===rk&&hasS&&(mine||!own))own={r,b,mine};if(mine)parts.push('['+r+'] '+cut(b.text,3500));}}
 if(!own){const k=nzd(R[rk]||'').indexOf(key);if(k<0)parts.unshift('(the sentence was not found in ['+rk+'])');}
 else if(!own.mine)parts.unshift('['+own.r+'] (the block holding the sentence) '+cut(own.b.text,3500));
 return cut(parts.join('\n\n'),9000)||'(no block of this link found)';};
