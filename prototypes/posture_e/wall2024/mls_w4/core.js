/* pkgMLS core: MEANS-layer check (K-ML) and SENTENCE check (K-SU). Pure functions; rows = Cited Verses rows {book,chapter,verse,text}. */
const MLS_PH=['at all','in any way','in no way','by no means','of any kind','whatsoever','only','alone','solely','merely','exclusively','never','ever','always','all','every','none','nothing','no','not','neither','nor','any','entirely','wholly','completely','fully','absolutely'];
function mlsFold(s){return ' '+String(s==null?'':s).toLowerCase().replace(/n['’]t\b/g,' not').replace(/\bcannot\b/g,'can not').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';}
function mlsIdx(rows){const I={};(rows||[]).forEach(r=>{if(r&&r.book)I[r.book+'|'+r.chapter+'|'+r.verse]=String(r.text||'');});return I;}
const MLS_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
function mlsEnd(t){return String(t||'').replace(/\[[^\]]*:[^\]]*\]/g,'').trim().slice(-1);}
/* the whole sentence unit around book ch v1..v2: back while the verse before ends in : ; , and forward while the last verse does not end a sentence; 3 verses each way at most */
function mlsUnit(I,b,c,v1,v2){let a=v1,z=v2;const miss=[];for(let v=v1;v<=v2;v++)if(I[b+'|'+c+'|'+v]==null)miss.push(v);if(miss.length)return {ok:false,miss};
 for(let k=0;k<3;k++){const p=I[b+'|'+c+'|'+(a-1)];if(p==null||!/[:;,]/.test(mlsEnd(p)))break;a--;}
 for(let k=0;k<3;k++){const t=I[b+'|'+c+'|'+z];if(/[.?!]/.test(mlsEnd(t)))break;const n=I[b+'|'+c+'|'+(z+1)];if(n==null)break;z++;}
 const vs=[];for(let v=a;v<=z;v++)vs.push(I[b+'|'+c+'|'+v]);return {ok:true,a,z,text:vs.join(' '),ref:b+' '+c+':'+a+(z!==a?'-'+z:'')};}
/* phrases of the list in MEANS that the unit lacks; a matched longer phrase hides its own words */
function mlsAdded(means,unit){let M=mlsFold(means);const U=mlsFold(unit);const out=[];
 for(const p of MLS_PH){const k=' '+p+' ';if(!M.includes(k))continue;if(!U.includes(k))out.push(p);M=M.split(k).join(' | ');}return out;}
/* the block of the MEANS round where the quotation stands: from the quotation to the next item head, 1,500 characters at most */
function mlsBlock(round,q){const T=String(round||'');const f=mlsFold(q).trim();if(!f)return null;const w=f.split(' ');const key=w.slice(0,Math.min(6,w.length)).join(' ');
 const lines=T.split('\n');for(let i=0;i<lines.length;i++){if(!mlsFold(lines[i]).includes(' '+key+' ')&&!(i+1<lines.length&&mlsFold(lines[i]+' '+lines[i+1]).includes(' '+key+' ')))continue;
  const out=[lines[i]];for(let j=i+1;j<lines.length&&j<i+8;j++){const l=lines[j];if(!l.trim()||/^\s*(?:\d+[.)]\s|MEANS\b|LINK\s+\d|(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}\s*["“])/.test(l))break;out.push(l);}
  let b=out.join('\n');const p=mlsFold(b).indexOf(' '+key+' ');return b.slice(0,1500);}return null;}
/* carriers in the block: [L2] gloss text; [L3] verse rows read this run */
function mlsCarried(ph,block,I){const B=String(block||'');const k=' '+ph+' ';let nc=[];
 const L2=[...B.matchAll(/\[L2\]([^\[|]*)/g)].map(m=>m[1]);if(L2.some(g=>mlsFold(g).includes(k)))return {carried:true,by:'[L2]'};
 for(const m of B.matchAll(/\[L3\]\s*((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/g)){const b=m[1],c=+m[2],a=+m[3],z=+(m[4]||m[3]);const vs=[];let miss=false;for(let v=a;v<=z;v++){const t=I[b+'|'+c+'|'+v];if(t==null){miss=true;break;}vs.push(t);}
  const ref=b+' '+c+':'+a+(z!==a?'-'+z:'');if(miss){nc.push(ref);continue;}if(mlsFold(vs.join(' ')).includes(k))return {carried:true,by:'[L3] '+ref};}
 return {carried:false,nc};}
module.exports={MLS_PH,mlsFold,mlsIdx,mlsUnit,mlsAdded,mlsBlock,mlsCarried,mlsEnd};
