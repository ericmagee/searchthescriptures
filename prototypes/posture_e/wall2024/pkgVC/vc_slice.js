// WALL-2024 Part 1, verified contradiction (W2 build, def WALL-2024 2153; W3 file none_found_and_stale_header_expectations.md; Eric 2026-11-05
// 19:37 CST "record words only"). A CONTRADICTION line of any panel judge whose two quotes stand in the rounds it names, EARLIER before LATER, and
// whose EARLIER quote overlaps a sentence K-W lists for that round, is a verified contradiction (VC). A seat that neither lists it nor answers it
// (CONTRADICTION, NOT HELD or REASSERTED IN quoting 6 consecutive words of it) gets a K-CON item in the record's words only. TRIAL: it removes no seat.
function vcParse2024(WT){const out=[];const RX=/CONTRADICTION\s*--\s*(DEFENDER|CHALLENGER)\s*--\s*EARLIER\s*\(\s*\[?\s*([CD]R[1-4])\s*\]?\s*,\s*["“]([\s\S]+?)["”]\s*\)\s*--\s*LATER\s*\(\s*\[?\s*([CD]R[1-4])\s*\]?\s*,\s*["“]([\s\S]+?)["”]\s*\)/gi;
 for(const l of String(WT||'').replace(/[*_`]+/g,'').split('\n')){RX.lastIndex=0;let m;while((m=RX.exec(l)))out.push({side:m[1].toUpperCase(),ek:m[2].toUpperCase(),q1:m[3],lk:m[4].toUpperCase(),q2:m[5]});}return out;}
function vcBuild2024(W,kw){const V=new Map();
 for(const w of W||[]){const R=w.R||{};let K=null;
  for(const c of vcParse2024(w.WT)){const n1=kvNorm(c.q1),n2=kvNorm(c.q2);if(n1.length<2||n2.length<2)continue;
   if(!kvNorm(R[c.ek]).includes(n1)||!kvNorm(R[c.lk]).includes(n2))continue;
   const e=PW_ORD.indexOf(c.ek),l=PW_ORD.indexOf(c.lk);if(e<0||l<0||e>=l)continue;
   if(!K)K=((kw(R)||{}).items||[]).filter(x=>x&&x.rule==='K-W');
   const g=K.find(x=>{if(x.side!==c.side||!String(x.line||'').startsWith('['+c.ek+']'))return false;const s=kvNorm((String(x.line).match(/:\s*"([\s\S]*)"\s*$/)||[])[1]||'');return s.length>=2&&(n1.includes(s)||s.includes(n1));});
   if(!g)continue;const id=c.side+'|'+c.ek+'|'+g.link+'|'+c.lk;
   if(!V.has(id))V.set(id,{id,side:c.side,ek:c.ek,lk:c.lk,kw:g.link,q1:c.q1,q2:c.q2,qs:[],by:[]});const v=V.get(id);v.qs.push([n1,n2]);v.by.push(w.seat);}}
 return [...V.values()];}
function vcCaught2024(WT,v){const nw=s=>kvNorm(s).split(' ').filter(Boolean);
 const L=String(WT||'').replace(/[*_`]+/g,'').split('\n').filter(l=>/^\s*(?:[-•>]|\d+[.)])?\s*(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)).map(l=>' '+nw(l).join(' ')+' ');
 if(!L.length)return false;const runs=q=>{const w=q.split(' ').filter(Boolean);if(w.length<6)return [w.join(' ')];const o=[];for(let i=0;i+6<=w.length;i++)o.push(w.slice(i,i+6).join(' '));return o;};
 for(const [a,b] of v.qs)for(const r of runs(a).concat(runs(b)))if(r&&L.some(l=>l.includes(' '+r+' ')))return true;return false;}
function vcItem2024(v,none){const line='['+v.lk+'] '+(none?'CONTRADICTIONS: NONE FOUND was written, but ':'')+'the record shows: EARLIER ['+v.ek+'] "'+String(v.q1).slice(0,240)+'" -- LATER ['+v.lk+'] "'+String(v.q2).slice(0,240)+'", and no CONTRADICTION, NOT HELD or REASSERTED IN line of this judge quotes it';
 return {item:{rule:'K-CON',side:v.side,link:'VERIFIED CONTRADICTION '+v.side+' '+v.ek+' to '+v.lk,line},
  mark:'[AUDIT v32: CONTRADICTION NOT CAPTURED (K-CON; Commitment 10; verified in the record) -- '+v.side+' '+v.ek+' to '+v.lk+': '+(none?'NONE FOUND written; ':'')+'EARLIER "'+String(v.q1).replace(/[\[\]"]/g,'').slice(0,200)+'" -- LATER "'+String(v.q2).replace(/[\[\]"]/g,'').slice(0,200)+'"; the judge answers CONTRADICTION, NOT HELD with a quote, or REASSERTED IN with the quote. TRIAL rule: it removes no seat. REVIEW THIS ROW.]'};}
function vcNone2024(WT){return /^\s*(?:[-•>]|\d+[.)])?\s*CONTRADICTIONS:\s*NONE FOUND/im.test(String(WT||'').replace(/[*_`]+/g,''));}
