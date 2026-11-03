// judge_fix10 G (GLOSS CHECK): each lexicon meaning a debater quotes, against the record's entry for its Strong's number (the entry both debaters were served on their [L2] sheet).
//  GLOSS TRIMMED: the quotation gives the entry as a list (two or more parts, or an ellipsis) and leaves out a sense of the entry's definition.
//  WHOLE: no sense left out. PART: one sense or one rendering quoted alone (counted, not listed).
const __GLOSS=(tags,lex)=>{try{const G={};for(const r of lex||[]){const k=L2C.numOf(r&&r.strongs_number);if(k&&r.anchor_gloss)G[k]=String(r.anchor_gloss);}
 const nz=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
 const STOP=new Set(['the','and','for','from','that','which','into','upon','unto','with','but','also','its','his','her','one','any','not','are','was','who','whom']);
 const QUAL=new Set(['specially','properly','figuratively','literally','implication','extension','generally','especially','usually','often','chiefly','apparently','perhaps','sometimes','primarily','originally']);
 const LEAD=/^\s*(?:(?:a|an|the)\s+)?(?:from|prolong|primary|conjunction|particle|prepos|adverb|middle|reduplicat|contract|compar|superl|feminine|masculine|neuter|derivative|variation|apparently|probably|perhaps|of\s+(?:uncertain|unknown|foreign|hebrew|chaldee|latin)|immediately|denominative|plural|diminutive)[^;]*;\s*/i;
 const defOf=g=>{let d=String(g).split(':--')[0];for(let i=0;i<4&&LEAD.test(d);i++)d=d.replace(LEAD,'');return d;};
 const cw=s=>nz(s).split(' ').filter(w=>w.length>2&&!STOP.has(w));const out=[],seen=new Set();
 for(const t of tags||[]){if(!t||t.status==='IGNORED')continue;const seg=String(t.seg||'');const ws=(t.words||[]).filter(w=>w&&w.ok&&w.num);if(!ws.length)continue;
  const pos=ws.map(w=>({num:L2C.numOf(w.num),w:w.w,at:Math.max(seg.indexOf(String(w.w)),0)}));
  const QQ=[...seg.matchAll(/["“]([^"”]{3,250})["”]/g)].map(m=>({q:m[1],at:m.index,end:m.index+m[0].length}));
  const QP=[...seg.matchAll(/\(([^()]{6,200})\)/g)].filter(m=>!QQ.some(x=>m.index>=x.at&&m.index<x.end)&&!/["“”]/.test(m[1])&&!/\d+:\d+/.test(m[1])&&!/^\s*[GH]\d+\s*$/.test(m[1])).map(m=>({q:m[1].replace(/^[^,]*?\b[GH]\d+\b\s*,?\s*/,''),at:m.index}));
  for(const x of QQ.concat(QP)){const before=pos.filter(p=>p.at<=x.at);const p=before.length?before[before.length-1]:pos[0];const g=G[p.num];if(!g)continue;
   const qw=cw(x.q);if(!qw.length)continue;const gw=new Set(cw(g));if(qw.filter(w=>gw.has(w)).length/qw.length<0.6)continue;
   const qs=new Set(qw);const miss=[];for(const s of defOf(g).split(/[;,]/)){const c=cw(s).filter(w=>!QUAL.has(w));if(c.length&&!c.every(w=>qs.has(w)))miss.push(s.replace(/[()]/g,' ').replace(/\s+/g,' ').trim());}
   const list=/…|\.\.\./.test(x.q)||String(x.q).split(/[;,]/).filter(s=>cw(s).length).length>=2;
   const k=t.side+'|'+t.round+'|'+p.num+'|'+nz(x.q);if(seen.has(k))continue;seen.add(k);
   out.push({side:t.side,round:t.round,num:p.num,word:String(p.w||'').slice(0,40),quote:String(x.q).slice(0,200),status:!miss.length?'WHOLE':list?'GLOSS TRIMMED':'PART',missing:miss.join('; ').slice(0,300)});}}
 return out;}catch(e){return [];}};
