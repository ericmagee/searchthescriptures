function preCheckSide(listText,oppTexts,side){const UNESC=x=>String(x||'').replace(/\\(["'\\])/g,'$1');  listText=UNESC(listText);oppTexts=(oppTexts||[]).map(UNESC);const s=String(listText||'');const h=s.search(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);
 if(h<0)return [side+': no premise list found'];
 let body=s.slice(h);const stop=body.slice(1).search(/\n\s*(?:PREMISE COUNT\s*:|-{3,}|#{1,3}\s)/i);if(stop>=0)body=body.slice(0,stop+1);
 const items=body.split(/\n(?=[ \t]*(?:\*\*)?(?:\d+\.|LINK\s+(?:\d+|[A-Za-z][A-Za-z\/]{0,9})\s*:))/i).slice(1);
 if(!items.length)return [side+': no premise list found'];
 const FOLD=x=>String(x).toLowerCase().replace(/["“”'‘’]/g,'"');
 const opp=FOLD(oppTexts.map(x=>String(x||'')).join('\n'));
 const NEG=/^(?:no|not|never|none|nor|neither|without|cannot)$/,UNI=/^(?:all|none|only|never|every|always|alone)$/;
 const STOP=new Set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only'.split(' '));
 return items.map((it,k)=>{it=String(it).split(/PRESSED WITH\s*:/i)[0].split(/\bASSUMES\s*:/i)[0].replace(/,?\s*which\s+(?:props|supports|carries)\b[^.;\n]*[.;]?/gi,' ').replace(/(^|[.!?]\s+)The\s+objection\s+(?:it|this)\s+props\s+is\b[^.\n]*\.?/gi,'$1');    const qs=[];const pos=[];const qre=/["“”]/g;let m;while((m=qre.exec(it)))pos.push(m.index);
  for(let i=0;i+1<pos.length;i+=2)qs.push(it.slice(pos[i]+1,pos[i+1]).trim());
  const mk=it.search(/(?:words|Quote)\s*:\s*["“]/i);if(mk>=0){const tail=it.slice(mk).replace(/^[^"“]*["“]/,'').replace(/["”]\s*$/,'').trim();if(tail)qs.push(tail);}
  const q=qs.filter(x=>x.length>=8&&opp.includes(FOLD(x))).sort((a,b)=>b.length-a.length)[0];const label=side+' item '+(k+1);
  if(!q)return label+': no verbatim quote found';
  let charge=it;qs.forEach(x=>{charge=charge.split(x).join(' ');});charge=charge.replace(/\b(?:the\s+)?(?:defender|challenger)(?:'s|’s)?\s+(?:own\s+)?words\b|\bquote\b|\blink\s+(?:\d+|[a-z][a-z\/]{0,9})\s*:/gi,' ');
  const qw=new Set(q.toLowerCase().match(/[a-z]+/g)||[]);const out=[];const seen=new Set();
  (charge.toLowerCase().match(/[a-z]+/g)||[]).forEach(w=>{if(seen.has(w))return;seen.add(w);
   const flag=NEG.test(w)||UNI.test(w);if((flag||(w.length>=4&&!STOP.has(w)))&&!qw.has(w))out.push(flag?w.toUpperCase():w);});
  const qNeg=[...qw].some(w=>NEG.test(w)||UNI.test(w)||/^(?:nothing|nowhere)$/.test(w));
  const U=[...new Set((charge.toLowerCase().match(/[a-z]+/g)||[]).filter(w=>(NEG.test(w)||UNI.test(w)||/^(?:reversed|any|nothing|nowhere|excludes?|excluded)$/.test(w))&&!qw.has(w)&&!(qNeg&&(NEG.test(w)||/^(?:nothing|nowhere|excludes?|excluded)$/.test(w)))))];
  return label+': absent from its quote: '+(out.length?out.slice(0,30).join(', '):'none')+' || UNIVERSAL TEST: '+(U.length?'the charge adds '+U.map(w=>w.toUpperCase()).join(', ')+', which its quote lacks':'no negation or universal word beyond its quote');});}