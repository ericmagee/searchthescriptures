/* ASK 339 (W3 7113 as changed by 7116 and 7119; W1 and W2 AGREE; operator "Build 339" 20:02:41Z): S-C inline reader note. Format Markdown only. Recomputes S-C's line test as Build Save Body does, keeps a hit only when review_notes holds that same S-C item, places a note only when the hit stands on a charge line of LD (challenger round 2) or LC (defender round 3), and leaves every other byte as today. N1 verse source: Quote Report (MATCHES quotes) and Get Verse. Any error returns the text unchanged. */
const __SCNmk=(R,QRd,GVT,INFO)=>md=>{
 const RN=String((R&&R.review_notes)||'');if(!/SYNTHESIS CHECK \(S-C\) -- /.test(RN))return md;
 const QF=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
 const cut=s=>String(s).replace(/\s+/g,' ').trim().slice(0,200).replace(/[\[\]]/g,'');
 const lastAfter=(t,re)=>{t=String(t||'');let i=-1;for(const m of t.matchAll(re))i=m.index;return i<0?'':t.slice(i);};
 const LD=lastAfter(R.engine_r2,/UNSUPPORTED-L4 PREMISES/gi),LC=lastAfter(R.engine_r3,/CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES/gi);
 const REFX=/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})/g;const key=(b,c,v)=>b.replace(/\s/g,'').slice(0,3).toLowerCase()+' '+c+':'+v;
 /* line classes inside a span: charge = numbered premise text with its Quote, ASSUMES and ROWS GIVE, up to PRESSED WITH; witness = PRESSED WITH lines; means = "-- MEANS" lines; grant = grant sections; none = outside a premise */
 const classify=(span,nm)=>{const out=[];let st='none';for(const l0 of String(span).split('\n')){let l=l0;
   if(/^\s*#/.test(l)){st=/grant/i.test(l)?'grant':'none';out.push({span:nm,cls:st,t:l});continue;}
   if(/^\s*[*_]*\s*(?:I grant\b|(?:the\s+)?opponent.{0,2}s grants\b|grants?\s*[*_]*\s*:)/i.test(l)){st='grant';out.push({span:nm,cls:st,t:l});continue;}
   if(/^\s*[*_]*\s*PREMISE COUNT\b/i.test(l)){st='none';out.push({span:nm,cls:st,t:l});continue;}
   if(/^\s*[*_]*\s*\d+[.)]\s/.test(l))st='charge';
   if(st==='charge'){const k=l.search(/PRESSED WITH\s*[*_]*\s*:/i);if(k>=0){if(l.slice(0,k).trim())out.push({span:nm,cls:'charge',t:l.slice(0,k)});st='witness';out.push({span:nm,cls:'witness',t:l.slice(k)});continue;}
    if(/--\s*MEANS\b/.test(l)){out.push({span:nm,cls:'means',t:l});continue;}out.push({span:nm,cls:'charge',t:l});continue;}
   out.push({span:nm,cls:(st==='witness'&&/--\s*MEANS\b/.test(l))?'means':st,t:l});}return out;};
 const CL=classify(LD,'LD').concat(classify(LC,'LC'));
 /* charge text: charge lines joined, broken by " | " wherever a non-charge line stands between */
 let CT='',prev=false;for(const x of CL){if(x.cls==='charge'){CT+=(prev?' ':' | ')+QF(x.t);prev=true;}else prev=false;}
 const LT=QF(LD+'\n'+LC);
 const listRefs=new Set([...(LD+'\n'+LC).matchAll(REFX)].map(m=>key(m[1],m[2],m[3])));
 const chargeKeys=new Map();for(const x of CL)if(x.cls==='charge')for(const m of x.t.matchAll(REFX)){const k=key(m[1],m[2],m[3]);if(!chargeKeys.has(k))chargeKeys.set(k,x.span);}
 const keyClass=k=>{const o=[];for(const x of CL)for(const m of x.t.matchAll(REFX))if(key(m[1],m[2],m[3])===k)o.push(x.span+' '+x.cls);return o.length?[...new Set(o)].join(', '):'none';};
 const gramClass=g=>{const o=[];for(const x of CL)if(QF(x.t).includes(g))o.push(x.span+' '+x.cls);return o.length?[...new Set(o)].join(', '):'across lines';};
 /* N1 source: the words of every quotation the run's Quote Report found MATCHES, and the Get Verse text */
 const AH=[];try{if(QRd&&Array.isArray(QRd.items))for(const i of QRd.items)if(/^MATCHES\b/.test(String(i.status||''))){AH.push(QF(i.quote));if(Array.isArray(i.segs))i.segs.forEach(s=>AH.push(QF(s)));}}catch(e){}if(GVT)AH.push(QF(GVT));
 const kjvAtHand=g=>AH.some(a=>a.includes(g));
 /* a gram inside a quotation that a charge line ties to a reference is scripture wording; if that wording is not at hand, no note */
 const inRefQuote=g=>{for(const x of CL){if(x.cls!=='charge')continue;for(const m of x.t.matchAll(/["“]([^"”\n]{3,})["”]/g)){if(!QF(m[1]).includes(g))continue;const a=x.t.slice(Math.max(0,m.index-30),m.index),b=x.t.slice(m.index+m[0].length,m.index+m[0].length+30);if(/\d{1,3}:\d{1,3}\W*$/.test(a)||/^\W{0,4}\(?\s*(?:(?:[1-3]\s)?[A-Z][a-z]+(?:\s+of\s+[A-Z][a-z]+)?\.?\s+)?\d{1,3}:\d{1,3}/.test(b))return true;}}return false;};
 const NZ=s=>String(s||'').replace(/\[(?:L\d(?:\s*[–—-]\s*L?\d)?)\]/g,' ').replace(/(^|[\s*_])L\d(?:\s*[–—-]\s*L?\d)?(?=[\s*_:.,]|$)/g,'$1 ').replace(/[*_`#>\[\]]/g,'').replace(/\s+/g,' ').trim().replace(/^(?:[-•]|\d+[.)])\s+/,'').replace(/^L\d(?:\s*[–—-]\s*L?\d)?\s+/,'').toLowerCase().replace(/\s+/g,' ').trim();
 const SL=String(R.synthesis||'').split('\n');const notes=[];
 {let on=false;for(const l of SL){if(/^\s*#/.test(l)){on=/neither side|no charge\b[^\n]{0,60}\bcontests?|no charge on either|uncharged|uncontested|charges? neither/i.test(l);continue;}if(/neither side.s list charges|no charge on either side|no charge\b[^\n]{0,60}\bcontests?|charged by neither/i.test(l)){on=true;continue;}
  if(!on||!/^\s*(?:[-*•]|\d+[.)])\s+/.test(l))continue;const w=QF(l.replace(/["“][^"”\n]*["”]/g,' | ')).split(' ').filter(Boolean);
  let hit=null,hc=null;for(let k=0;k+5<=w.length;k++){const g=w.slice(k,k+5).join(' ');if(/\d+:\d+|\|/.test(g))continue;if(!hit&&LT.includes(g))hit=g;if(!hc&&CT.includes(g))hc=g;}
  if(hit){const stored=RN.includes('("'+hit+'"): "'+cut(l)+'"');let why=null;
   if(!stored)why='no stored S-C item for this line';else if(!hc)why='words stand only on '+gramClass(hit);else if(kjvAtHand(hc))why='N1: KJV wording at hand';else if(inRefQuote(hc))why='scripture quotation on the charge line, verse text not at hand';
   const it={kind:'words',line:cut(l),hit,gram:hc,where:hc?gramClass(hc):gramClass(hit),keyText:cut(l),note:why?null:'[SYSTEM CHECK S-C: the words "'+hc+'" stand in a premise of a premise list; this line says no side charged it.]',why};notes.push(it);continue;}
  let lb=null;const vh=[];for(const m of l.matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+(\d{1,3}):(\d{1,3})|\((\d{1,3}):(\d{1,3})\)/g)){if(m[1])lb=m[1];const b=(m[1]||lb||'');const c=m[2]||m[4],v=m[3]||m[5];if(b&&listRefs.has(key(b,c,v)))vh.push({ref:b+' '+c+':'+v,k:key(b,c,v)});}
  if(!vh.length)continue;const pre=String(l).replace(/^\s*(?:[-*•]|\d+[.)])\s+/,'').replace(/[*_]/g,'').slice(0,40).trim();const uniq=[...new Set(vh.map(x=>x.ref))];
  const stored=RN.includes(pre+' ('+uniq.join(', ')+')');const vc=[...new Set(vh.filter(x=>chargeKeys.has(x.k)).map(x=>x.ref))];
  const why=!stored?'no stored S-C item for this line':!vc.length?'verses stand only on '+[...new Set(vh.map(x=>keyClass(x.k)))].join(', '):null;
  notes.push({kind:'verse',line:pre,verses:uniq.map(r=>r+' ['+keyClass(vh.find(x=>x.ref===r).k)+']'),keyText:pre,note:why?null:'[SYSTEM CHECK S-C: '+(vc.length===1?vc[0]+' is':vc.slice(0,-1).join(', ')+' and '+vc[vc.length-1]+' are')+' named in a premise of a premise list; this line says no side charged '+(vc.length===1?'it':'them')+'.]',why});}}
 /* placement: unique prefix match of the S-C item's quoted line on the normalized rendered line */
 const ML=String(md).split('\n');const add=new Map();
 for(const n of notes){if(!n.note)continue;const k=NZ(n.keyText);if(k.length<12){n.why='key too short';n.note=null;continue;}const hits=[];ML.forEach((x,i)=>{if(NZ(x).startsWith(k))hits.push(i);});
  if(hits.length!==1){n.why=hits.length?'prefix shared by '+hits.length+' lines':'line not found in the rendered synthesis';n.note=null;continue;}n.at=hits[0];add.set(hits[0],(add.get(hits[0])||[]).concat(n.note));}
 if(INFO)INFO.push(...notes);if(!add.size)return md;
 return ML.map((x,i)=>add.has(i)?x.replace(/\s+$/,'')+' '+add.get(i).join(' '):x).join('\n');};
