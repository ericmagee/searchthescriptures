/* pkgD38 (W2, W3 3087 ruling 2 + 3089): after a cure or send-back, the stored count, keystone and collision grades must agree with the RULING cards and grounds left in the judge's own text. */
const D38_STATUS={COL:'LIVE',KEY:'LIVE',PREM:'LIVE',BASIS:'LIVE'}; /* W3 sets each type LIVE (sent back; uncured = a gate fault) or TRIAL (record-only) */
function d38Items2024(T0,T1,raw){const out=[];const U=s=>String(s==null?'':s).toUpperCase();const one=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 const P=rcLines(T1),P0=rcLines(T0);const cards=[];for(const l of String(T1||'').split('\n')){let r;try{r=__RL.readLine(l);}catch(e){r=null;}if(r&&r.form==='RULING'&&r.f&&!r.f.restated)cards.push({raw:l.trim(),subj:one(r.f.subject),grade:U(one(r.f.grade)).replace(/\s*\(.*$/,'')});}
 const colG=lk=>{const c=P.col.find(z=>U(z.link).replace(/\s+VS\.?\s+/,' VS ')===lk);return c?{grade:c.grade,raw:c.raw}:null;};
 const CG=/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)$/;
 for(const c of cards){const m=c.subj.match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(!m||!CG.test(c.grade))continue;const lk=U(m[1]+' VS '+m[2]);const g=colG(lk);if(!g||!g.grade||g.grade===c.grade)continue;
  out.push({type:'COL',key:'D38|COL|'+lk,why:'your RULING card grades '+m[1]+' vs '+m[2]+' '+c.grade+', but your collision line for '+m[1]+' vs '+m[2]+' now grades it '+g.grade+'. Change one of the two lines so they agree.',lines:[c.raw,g.raw]});}
 const km=P.key?P.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/):null;
 if(km)for(const c of cards){const m=c.subj.match(/^(?:KEYSTONE\s+(D\d+)|(D\d+)\s*\(?\s*KEYSTONE\s*\)?)$/i);if(!m||!/^(STANDS|BROKEN)$/.test(c.grade))continue;const d=U(m[1]||m[2]);if(d!==km[1]||c.grade===km[2])continue;
  out.push({type:'KEY',key:'D38|KEY|'+d,why:'your RULING card grades KEYSTONE '+d+' '+c.grade+', but your KEYSTONE line now reads '+d+' '+km[2]+'. Change one of the two lines so they agree.',lines:[c.raw,P.key.raw]});}
 const cntOf=sd=>{const y=P.cn[sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS'];const m=y&&y.u.match(/CONCEDED LINKS\s*:\s*(\d+)/);return m?{n:+m[1],raw:y.raw}:null;};
 for(const c of cards){if(!/^(UNEXHIBITED|CONCEDED)$/.test(c.grade))continue;const s=c.subj;let sd=null,n=null;let m;
  if((m=s.match(/^(challenger|defender)(?:-directed)?\s+premise\s+(\d+)$/i))){sd=U(m[1]);n=+m[2];}
  else if((m=s.match(/^premise\s+(\d+)\s*\(?\s*against\s+(?:the\s+)?(challenger|defender)\s*\)?$/i))){sd=U(m[2]);n=+m[1];}
  else if((m=s.match(/^LINK\s+(?:D)?(\d+)$/i))){sd='DEFENDER';n=+m[1];}
  if(!sd)continue;const k=cntOf(sd);if(!k||k.n!==0)continue;
  out.push({type:'PREM',key:'D38|PREM|'+sd+'|'+n,why:'your RULING card grades '+sd.toLowerCase()+' premise '+n+' '+c.grade+', which counts it, but your '+(sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS')+' line counts 0. Change one of the two lines so they agree.',lines:[c.raw,k.raw]});}
 for(const sd of ['DEFENDER','CHALLENGER']){const G=sd+' LINK BROKEN';const k=cntOf(sd);if(!k||k.n<1)continue;const lab=sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';
  const y0=P0.cn[lab];const same=!!y0&&one(y0.raw)===one(k.raw);const am=String(raw||'').match(new RegExp('counted_premises_'+sd.toLowerCase()+'\\\\?"\\s*:\\s*\\[([^\\]]*)\\]'));
  const arr=am?(am[1].match(/\d+/g)||[]).map(Number):null;if(!same||!arr||arr.length!==k.n)continue;
  const pn=z=>{const m=U(z.link).match(/^D(\d+)\s+VS\.?\s+C(\d+)$/);return m?+(sd==='DEFENDER'?m[1]:m[2]):null;};
  for(const n of arr){const was=P0.col.filter(z=>pn(z)===n&&z.grade===G);if(!was.length)continue;const now=P.col.filter(z=>pn(z)===n);if(now.some(z=>z.grade===G)||!now.length)continue;
   const moved=was.map(z=>now.find(q=>U(q.link)===U(z.link))).filter(q=>q&&q.grade&&q.grade!==G);if(!moved.length)continue;
   const ln=U(k.raw);if(new RegExp('\\b(?:PREMISES?|LINK|D|P)\\s*'+n+'\\b[^;.]*\\b(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\\b').test(ln))continue;
   if(cards.some(c=>/^(UNEXHIBITED|CONCEDED)$/.test(c.grade)&&new RegExp('(?:PREMISE|LINK)\\s+(?:D)?'+n+'$').test(U(c.subj))&&(sd==='DEFENDER'?!/CHALLENGER/.test(U(c.subj)):/CHALLENGER/.test(U(c.subj)))))continue;
   out.push({type:'BASIS',key:'D38|BASIS|'+sd+'|'+n,why:'your '+lab+' line counts '+k.n+' with '+sd.toLowerCase()+' premise '+n+' among them (counted premises '+arr.join(', ')+'), but '+moved.map(z=>z.link).join(', ')+' is now graded '+moved.map(z=>z.grade).join(', ')+' (it was '+G+'), and no line left in your text grounds premise '+n+' as conceded or unexhibited. Recount the line, or regrade the collision.',lines:moved.map(z=>z.raw).concat([k.raw])});}}
 return out;}
