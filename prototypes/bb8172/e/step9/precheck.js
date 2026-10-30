// BB-8172 step 9 (DoD 6, P2D revision 3 BB-8270/8272): the C3 listing pre-check. It DECIDES NOTHING: it lists, per premise a side
// listed, each negation, universal and content word of the charge absent from the quote, the quote being the quoted text found
// verbatim in an earlier round of the opponent (8219 (i)). Served to the judge only; no code reads it.
function preCheckSide(listText,oppTexts,side){const s=String(listText||'');const h=s.search(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);
 if(h<0)return [side+': no premise list found'];
 let body=s.slice(h);const stop=body.slice(1).search(/\n\s*(?:PREMISE COUNT\s*:|-{3,}|#{1,3}\s)/i);if(stop>=0)body=body.slice(0,stop+1);
 const items=body.split(/\n(?=[ \t]*(?:\*\*)?(?:\d+\.|LINK\s+\d+\s*:))/i).slice(1);
 if(!items.length)return [side+': no premise list found'];
 const opp=oppTexts.map(x=>String(x||'')).join('\n');
 const NEG=/^(?:no|not|never|none|nor|neither|without|cannot)$/,UNI=/^(?:all|none|only|never|every|always|alone)$/;
 const STOP=new Set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only'.split(' '));
 return items.map((it,k)=>{const qs=[];const pos=[];const qre=/["“”]/g;let m;while((m=qre.exec(it)))pos.push(m.index);
  for(let i=0;i+1<pos.length;i+=2)qs.push(it.slice(pos[i]+1,pos[i+1]).trim());
  const mk=it.search(/(?:words|Quote)\s*:\s*["“]/i);if(mk>=0){const tail=it.slice(mk).replace(/^[^"“]*["“]/,'').replace(/["”]\s*$/,'').trim();if(tail)qs.push(tail);}
  const q=qs.filter(x=>x.length>=8&&opp.includes(x)).sort((a,b)=>b.length-a.length)[0];const label=side+' item '+(k+1);
  if(!q)return label+': no verbatim quote found';
  let charge=it.slice(0,it.indexOf(q));qs.forEach(x=>{charge=charge.split(x).join(' ');});charge=charge.replace(/\b(?:the\s+)?(?:defender|challenger)(?:'s|\u2019s)?\s+(?:own\s+)?words\b|\bquote\b|\blink\s+\d+\b/gi,' ');
  const qw=new Set(q.toLowerCase().match(/[a-z]+/g)||[]);const out=[];const seen=new Set();
  (charge.toLowerCase().match(/[a-z]+/g)||[]).forEach(w=>{if(seen.has(w))return;seen.add(w);
   const flag=NEG.test(w)||UNI.test(w);if((flag||(w.length>=4&&!STOP.has(w)))&&!qw.has(w))out.push(flag?w.toUpperCase():w);});
  return label+': absent from its quote: '+(out.length?out.slice(0,30).join(', '):'none');});}
function preCheckBlock(r){const NLc=String.fromCharCode(10);
 const lines=[].concat(preCheckSide(r.gr2,[r.cr1,r.cr2],'CHALLENGER LIST [DR2]'),preCheckSide(r.cr3,[r.gr1,r.gr2],'DEFENDER LIST [CR3]'));
 return 'PRE-CHECK -- decides nothing. For each premise a side listed: the words of its charge (negations and universals in capitals, then content words) that the quote it carries does not contain; the quote is the quoted text found verbatim in an earlier round of the opponent. The VOID rule decides; this list does not.'+NLc+lines.join(NLc);}
