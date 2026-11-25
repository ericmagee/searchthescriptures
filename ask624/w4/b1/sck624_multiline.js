const SCK624=(()=>{ /* ASK 624.5 (operator 19:08 CST 11-24, "Build; a KEEP is uncured"): a judgment whose own lines disagree after the gate is sent the disagreement before it is counted. It names the lines; the judge chooses which line changes (ruling 428). It states no reading of any verse and no side. */
 const N=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/\\+"/g,'"');
 const C=l=>String(l||'').replace(/[*_`]+/g,'').trim();
 const lines=t=>N(t).split('\n').map(C).filter(l=>l&&!/^\[(?:AUDIT|EXTRACTOR)\b/.test(l));
 const GR=/\b(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]{0,80}\))?\s*:\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|HELD|BROKEN|COLLISION)\b/;
 const SKIP=/^(?:RETRACTED|STATEMENT|PRESSED|RULING|P\d+)\s*[:\-]/;
 const q=s=>'"'+String(s).replace(/"/g,"'")+'"';
 /* (a) E-WHL AGREEMENT: WHL507.faults with the engine's recomputed verdict word as its tag (plan N2) */
 function whl(t,word){let f=[];try{f=WHL507.faults(N(t),word).filter(x=>x.item==='WHICH HOLDS AGREEMENT');}catch(e){f=[];}if(!f.length)return [];
  const res=lines(t).find(l=>/^RESULT\s*:/.test(l))||'(no RESULT line)';
  return [{kind:'WHICH HOLDS AGREEMENT',key:'SCK WHL',lines:[f[0].line,res],send:true,
   text:'Your WHICH HOLDS line and your verdict do not agree. Your WHICH HOLDS line: '+q(f[0].line)+'. Your verdict after the gate: '+word+', and your RESULT line: '+q(res)+'. WHICH HOLDS: CHALLENGER goes with BROKEN; WHICH HOLDS: DEFENDER goes with HELD or PARTIAL. CHANGE TO the one line you hold wrong, or KEEP with the words that decide it.'}];}
 /* (c) E-GCA: one pair, two grades (the pkgGCA reading of ASK 323, moved here so both paths use it) */
 function gca(t){const G=new Map();for(const l of lines(t)){if(/^(?:DEFENSE|CHALLENGE) STANDING\s*:/.test(l)||/^(?:RETRACTED|STATEMENT|PRESSED)\s*:/.test(l))continue;const m=l.replace(/^RESTATED\s*:\s*/,'').match(GR);if(!m)continue;const key=m[1]+' vs '+m[2];if(!G.has(key))G.set(key,new Map());const g=G.get(key);if(!g.has(m[3]))g.set(m[3],l);}
  const out=[];for(const [key,g] of G){if(g.size<2)continue;const [a,b]=[...g.values()];out.push({kind:'TWO GRADES',key:'SCK GCA '+key,pair:key,lines:[a,b],send:true,
   text:'You give '+key+' two different grades. Your line: '+q(a)+'. Your other line: '+q(b)+'. CHANGE TO the one line you hold wrong, or KEEP with the words that decide it.'});}return out;}
 /* (b) E-RTL: a retracted pair that a line still rests on. Sent only for a line the apply path can replace (a pair line, CONCEDED LINKS, CHALLENGER CONCEDED LINKS, KEYSTONE); a ruling or APPLIED line is recorded, not sent */
 function rtl(t){const L=lines(t);const R=new Map();for(const l of L){const m=l.match(/^RETRACTED\s*:?\s*(D\d+)\s+vs\.?\s+(C\d+)\b/);if(m&&!R.has(m[1]+' vs '+m[2]))R.set(m[1]+' vs '+m[2],l);}if(!R.size)return [];
  const out=[],seen=new Set();
  for(const [key,rl] of R){const [d]=key.split(' vs ');const vr=new Set();for(const l of L){const m=l.match(new RegExp('^(?:RESTATED\\s*:\\s*)?'+key.replace(' vs ','\\s+vs\\.?\\s+')+'\\s*\\(([^)]+)\\)'));if(m)vr.add(m[1].trim());}
   const otherBroken=L.some(l=>{const m=l.match(GR);return m&&m[1]===d&&(m[1]+' vs '+m[2])!==key&&!R.has(m[1]+' vs '+m[2])&&/BROKEN/.test(m[3])&&m[3]!=='CHALLENGER LINK BROKEN';});
   for(const l of L){if(l===rl||SKIP.test(l)||/^RESTATED\s*:/.test(l))continue;let hit=null;
    const m=l.match(GR);if(m&&(m[1]+' vs '+m[2])===key&&(m[3]==='DEFENDER LINK BROKEN'||m[3]==='BROKEN'))hit='pair';
    else if(!otherBroken&&new RegExp('\\b'+d+' is broken\\b|\\bbroken at '+d+'\\b','i').test(l))hit='ruling';
    else if(/^(?:CHALLENGER )?CONCEDED LINKS\s*:/.test(l)&&[...vr].some(v=>l.includes(v)))hit='conceded';
    if(!hit)continue;const k='SCK RTL '+key+' | '+l.slice(0,200);if(seen.has(k))continue;seen.add(k);
    const send=hit!=='ruling'&&/^(?:D\d+\s+vs|(?:CHALLENGER )?CONCEDED LINKS\s*:|KEYSTONE\s*:)/i.test(l);
    out.push({kind:'RETRACTION LEFT STANDING',key:k,pair:key,lines:[rl,l],send,
     text:'You retracted '+key+', and a line of yours still rests on it. Your retraction: '+q(rl)+'. Your line: '+q(l)+'. CHANGE TO that line so it no longer rests on '+key+', or KEEP with the words that decide it.'});}}
  return out;}
 const KEEP=' A KEEP does not cure this item.';
 function items(t,word){const all=[...whl(t,word),...rtl(t),...gca(t)];return all.map(x=>({...x,text:x.text+(x.send?KEEP:'')}));}
 function open(t,word,key){return items(t,word).some(x=>x.key===key);}
 return {items,open,whl,rtl,gca};})();
