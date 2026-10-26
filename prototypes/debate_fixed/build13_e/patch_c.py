# Rev 9 DoD 26 patch (Worker_E): (1) Panel Build's C list; (2) the C-LABEL OFF THE GUIDE audit in Panel Payloads and Alternate Payloads.
def edit(P,pairs):
  s=open(P).read()
  for a,b in pairs: assert s.count(a)==1,(P,a[:70]); s=s.replace(a,b)
  open(P,'w').write(s)
edit('new13/Panel_Build.js',[
(" return {ledger,judgeBlock,roundBlock,citedBlock,DEF_RE,CH_RE};})();",
r""" // BB-7397 rev 9 DoD 26 (1): the C numbers, from [DR3] in its own order (the guide's), so every judge labels a challenger link alike. Each
 // [DR3] LINK block is listed with the verses it names; a [DR3] without LINK headings gives no list.
 const cList=F=>{const t=String(F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)/gmi))H.push({n:h[1],at:h.index});if(!H.length)return '';
  return ['CHALLENGER LINK NUMBERS -- computed by the system from [DR3], not by a model. In COLLISION POINTS, C<j> is the challenger\'s j-th LINK block of [DR3], its answer to the defender\'s premise j, in the order the challenger answered them; label a challenger link only by this list. The verses each block names:']
   .concat(H.map((x,i)=>{const blk=t.slice(x.at,i+1<H.length?H[i+1].at:t.length);const seen=[];for(const r of refs(blk)){const b=r.book||r.ctx;if(!b)continue;const l=b+' '+r.label.replace(/[–—]/g,'-');if(seen.indexOf(l)<0)seen.push(l);}
    return 'C'+(i+1)+' = [DR3] LINK '+x.n+': '+(seen.length?seen.join(', '):'(no verse reference)');})).join(LF);};
 return {ledger,judgeBlock,roundBlock,citedBlock,cList,DEF_RE,CH_RE};})();"""),
("const LEDGER=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3});",
 "const LEDGER=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3})+(t=>t?String.fromCharCode(10,10)+t:'')((()=>{try{return PWL.cList({dr3:F.dr3});}catch(e){return '';}})()); // BB-7397 rev 9 DoD 26 (1)"),
])
AUD=r"""// BB-7397 rev 9 DoD 26 (2): C-LABEL OFF THE GUIDE. A collision line "D<i> vs C<j>[/C<k>] (<verses>)" whose number is above the count of [DR3]
// LINK blocks, or whose verses (when it gives any) meet none of the verses its LINK blocks name (a compound label: their union), is recorded
// by one line. Not a violation, not an item, not counted; [DR3] is read from the text sent to the judge. The verse reader is the cure library's.
const C_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
function cRefs(t){const out=[];const s=String(t||'');let last=null;const re=/(?:((?:[1-3]\s)?[A-Z][a-z]+)\.?\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*,\s*(?:\d{1,3}:)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?)*)/g;let m;
 while((m=re.exec(s))){let bk=last;if(m[1]){const b=m[1].toLowerCase().replace(/\s+/g,' ');const n=b.match(/^([1-3]) (.+)$/);const base0=n?n[2]:b;bk=(n?n[1]+' ':'')+(C_BK[base0]||base0.slice(0,3));last=bk;}
  if(!bk)continue;const add=(c,v1,v2)=>{if(!v2||v2<v1||v2-v1>30)v2=v1;for(let v=v1;v<=v2;v++)out.push({key:bk+' '+c+':'+v,pos:m.index});};
  let ch=+m[2];add(ch,+m[3],m[4]?+m[4]:0);
  for(const p of (m[5]||'').split(',').map(x=>x.trim()).filter(Boolean)){const q=p.match(/^(?:(\d{1,3}):)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/);if(!q)continue;if(q[1])ch=+q[1];add(ch,+q[2],q[3]?+q[3]:0);}}
 return out;}
function cAudit(text,ptext){const P=String(ptext||'');const i=P.lastIndexOf('=== [DR3]');if(i<0)return [];const e=P.indexOf('\n=== ',i+1);const t=P.slice(P.indexOf('\n',i)+1,e<0?P.length:e);
 const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+\d+/gmi))H.push(h.index);if(!H.length)return [];
 const links=H.map((a,k)=>new Set(cRefs(t.slice(a,k+1<H.length?H[k+1]:t.length)).map(r=>r.key)));const N=links.length;const out=[];
 for(const ln of String(text||'').replace(/\\n/g,'\n').split('\n')){const m=ln.trim().match(/^[*_>-]*\s*(D\d+)\s+vs\s+(C\d+(?:\s*\/\s*C\d+)*)\s*(?:\(([^)]*)\))?/);if(!m)continue;
  const js=m[2].split('/').map(x=>+x.trim().slice(1));let why='';
  if(js.some(j=>j<1||j>N))why='C'+js.filter(j=>j<1||j>N).join(', C')+' is above the '+N+' LINK blocks of DR3';
  else if(m[3]){const want=cRefs(m[3]).map(r=>r.key);const U=new Set();js.forEach(j=>links[j-1].forEach(k=>U.add(k)));if(want.length&&!want.some(k=>U.has(k)))why='DR3 LINK block '+js.join('/')+' names none of '+m[3].trim();}
  if(why)out.push('[AUDIT v21: C-LABEL OFF THE GUIDE -- '+m[1]+' vs '+m[2].replace(/\s+/g,'')+(m[3]?' ('+m[3].trim()+')':'')+': '+why.replace(/[\[\]]/g,'')+'; recorded, not a violation, not counted.]');}
 return out;}
"""
for P,body in [('new13/Panel_Payloads.js','jd.body'),('new13/Alternate_Payloads.js','a.body')]:
  s=open(P).read();anchor="function drvPromptText(body){";assert s.count(anchor)==1;s=s.replace(anchor,AUD+anchor);open(P,'w').write(s)
  edit(P,[("for(const x of DB.marks)marks.push(x);","for(const x of DB.marks)marks.push(x);\n for(const x of cAudit(WT,drvPromptText("+body+")))marks.push(x); // BB-7397 rev 9 DoD 26 (2), recorded only")])
print('ok')
