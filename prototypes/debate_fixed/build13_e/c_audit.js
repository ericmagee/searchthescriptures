// DoD 26 (2) prototype (Worker_E): C-LABEL OFF THE GUIDE. cLinks(dr3): the verses each [DR3] LINK block names, LINK j -> keys (cureRefs).
// cOff(text, links): every collision line "D<i> vs C<j>[/C<k>...] (<verses>)" of the judgment whose label is off the guide: a number above the
// count of [DR3] LINK blocks, or a line whose verses (when it gives any) meet none of the verses its labelled LINKs name (compound labels: the union).
function cLinks(dr3){const t=String(dr3||'');const hr=/^[ \t>*#_-]*LINK\s+(\d+)/gmi;const H=[];let h;while((h=hr.exec(t)))H.push({n:+h[1],at:h.index});
 return H.map((x,i)=>({n:x.n,keys:new Set(cureRefs(t.slice(x.at,i+1<H.length?H[i+1].at:t.length)).map(r=>r.key))}));}
function cOff(text,links){const out=[];const s=String(text||'').replace(/\\n/g,'\n');const N=links.length;
 for(const ln of s.split('\n')){const m=ln.trim().match(/^[*_>-]*\s*(D\d+)\s+vs\s+(C\d+(?:\s*\/\s*C\d+)*)\s*(?:\(([^)]*)\))?/);if(!m)continue;
  const js=m[2].split('/').map(x=>+x.trim().slice(1));const why=[];
  if(js.some(j=>j<1||j>N))why.push('C'+js.filter(j=>j<1||j>N).join(', C')+' is above the '+N+' LINK blocks of [DR3]');
  else if(m[3]){const want=cureRefs(m[3]).map(r=>r.key);const U=new Set();js.forEach(j=>links[j-1].keys.forEach(k=>U.add(k)));
   if(want.length&&!want.some(k=>U.has(k)))why.push('[DR3] LINK '+js.join('/')+' names none of '+m[3].trim());}
  if(why.length)out.push({label:m[1]+' vs '+m[2].replace(/\s+/g,'')+(m[3]?' ('+m[3].trim()+')':''),why:why.join('; ')});}
 return out;}
