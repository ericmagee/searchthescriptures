  /* s425a (REVIEW_32677 item 7; A3_32643 section 8, the 5.5 flag): the claim passes when a quotation it gives (in the sentence, or in the block-quote
     lines that follow it) stands in that side's rounds with the verb (withdraw, concede, retract, drop) affirmed within 80 characters before or inside it */
  const qheld=(s,side,fr)=>{try{const qs=[...s.matchAll(/["“]([^"”\n]{12,})["”]/g)].map(m=>m[1]);const at=SY.indexOf(s);
   if(at>=0){for(const b of SY.slice(at+s.length).split('\n').slice(1)){if(!/^\s*>/.test(b))break;qs.push(b.replace(/^\s*>\s*/,'').replace(/^["“]|["”]$/g,''));}}
   const T=QF(SIDEC[side]);const F=new RegExp(fr.source,'gi');
   for(const q of qs){const x=QF(q);if(x.split(' ').length<4)continue;let p=T.indexOf(x);while(p>=0){const win=T.slice(Math.max(0,p-80),p+x.length);
    for(const m of win.matchAll(F)){const pre=win.slice(Math.max(0,m.index-25),m.index).split(' ').slice(-3).join(' ');if(!/\b(?:not|never|no)\b/.test(pre)&&!/^\s*(?:nothing|none)\b/.test(win.slice(m.index+m[0].length)))return true;}
    p=T.indexOf(x,p+1);}}return false;}catch(e){return false;}};
