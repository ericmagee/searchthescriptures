const LAY=(()=>{ /* pkgLAY (ASK 346 rev 2, Wall 7231 + 7234; passes W3 7228, W1 7232, W2 7233; Eric 17:50 11-16 "UNDERDETERMINED, HELD, AND BROKEN INCLUDED"): every grade carries its layers. LIVE: [L1] on STANDS; RESULT and KEYSTONE name the deciding collision labels and carry an [L1]. TRIAL one run: the 6-word quotations on STANDS and UNDERDETERMINED (sent back and logged; no seat removed) */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’ʼ`]/g,"'").replace(/\[(?:l[1-4]|[cd]r[1-4])\]/g,' ').replace(/[\[\]]/g,'').replace(/'/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿]+/g,' ').replace(/\s+/g,' ').trim();
 const QR=/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g;
 const own=t=>N(String(t||'').replace(/[*_`]+/g,'').replace(QR,' | '));
 const LBL=/\bD\d+\s+vs\.?\s+C\d+\b/i;
 const COL=/^[\s>*_-]*(?:\d+[.)]\s*)?\**\s*(D\d+)\s+vs\.?\s+(C\d+)\b[^\n]{0,200}?:\s*\**\s*(STANDS|UNDERDETERMINED)\b/i;
 const RES=/^[\s>*_-]*\**\s*RESULT\s*:/i,KEY=/^[\s>*_-]*\**\s*KEYSTONE\s*:\s*\**\s*(D\d+)\b/i;
 const DERIVED=/derived by the engine|derived after the send-back|\brecomputed\b|BROKEN BY A CONFIRMED CLOSING CONTRADICTION/i;
 const l1=(t,ctx)=>{let c;try{c=ECL.check('FORCED: X -- GROUND: '+String(t||''),ctx||{});}catch(e){return {ok:true,s:'UNREAD'};}return {ok:c.l1==='COUNTED'||c.l1==='UNVERIFIABLE',s:c.l1};};
 const run6=(line,txt)=>{const T=' '+txt+' ';const qs=[];String(line||'').replace(/\\+"/g,'"').replace(QR,m=>{qs.push(m.slice(1,-1));return m;});for(const q of qs){const w=N(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(T.includes(' '+r+' '))return r;}}return null;};
 const sides=R=>{const k=s=>Object.keys(R||{}).filter(x=>new RegExp('^'+s+'R[1-4]$').test(x)).map(x=>own(R[x])).join(' | ');return {C:k('C'),D:k('D')};};
 /* the judge's own lines: returns [{kind,trial,label,line,why}] */
 function scan(text,R,ctx){const out=[];const S=sides(R);
  for(const raw of String(text||'').split('\n')){const l=raw.trim();if(!l||/^\s*\[(?:AUDIT|EXTRACTOR)\b/.test(l))continue;
   const m=l.replace(/[*_`]+/g,'').match(COL);
   if(m){const lab=m[1].toUpperCase()+' vs '+m[2].toUpperCase();const g=m[3].toUpperCase();
    if(g==='STANDS'){const a=l1(l,ctx);if(!a.ok){out.push({kind:'STANDS-L1',trial:false,label:lab,line:l,why:'a STANDS line with no counted [L1] (Commitment 13: every grade carries [L1], the verse words quoted as the record holds them)'+(a.s==='NOT COUNTED'?'; its [L1] words do not stand in the verse named':'')});continue;}
     const f=run6(l,S.C+' | '+S.D);if(!f)out.push({kind:'STANDS-FIT',trial:true,label:lab,line:l,why:'a STANDS line that quotes no 6 words in a row of the answer that fit (Commitment 13)'});continue;}
    const c=run6(l,S.C),d=run6(l,S.D);if(!c||!d)out.push({kind:'UND-SIDES',trial:true,label:lab,line:l,why:'an UNDERDETERMINED line that does not quote 6 words in a row from each side ('+(!c&&!d?'neither side':!c?'not the defender':'not the challenger')+') (Commitment 13)'});continue;}
   if(DERIVED.test(l))continue;
   const k=l.replace(/[*_`]+/g,'').match(KEY);const isR=RES.test(l.replace(/[*_`]+/g,''));if(!k&&!isR)continue;if(k&&/^\s*KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)?\s*WITHDRAWN\b/i.test(l.replace(/[*_`]+/g,'')))continue;
   const f=[];const lb=k?new RegExp('\\b'+k[1]+'\\s+vs\\.?\\s+C\\d+\\b','i'):LBL;if(!lb.test(l))f.push(k?'names no collision line of '+k[1].toUpperCase()+' by its label (for example "'+k[1].toUpperCase()+' vs C<m>")':'names no deciding collision line by its label (for example "D6 vs C6")');
   const a=l1(l,ctx);if(!a.ok)f.push('carries no counted [L1]');
   if(f.length)out.push({kind:k?'KEYSTONE':'RESULT',trial:false,label:k?k[1].toUpperCase():'RESULT',line:l,why:'a '+(k?'KEYSTONE':'RESULT')+' line that '+f.join(' and ')+' (Commitment 13)'});}
  return out;}
 function rule(i){if(!i||!i.lay)return '';const y=i.lay;const st=y.trial?'TRIAL for one run, pkgLAY: answer it; it removes no seat':'ENFORCED, pkgLAY';
  const what=y.kind==='STANDS-L1'?'a STANDS line carries after GROUND: [L1] <reference> "<the verse words the answer fits, as the record holds them>"':y.kind==='STANDS-FIT'?'a STANDS line quotes at least 6 words in a row of the answer that fit, and the verse words they fit':y.kind==='UND-SIDES'?'an UNDERDETERMINED line quotes at least 6 words in a row from each side, and the verse words that leave the point open':y.kind==='KEYSTONE'?'your KEYSTONE line names, by its full label, the collision line or lines of that link that decide it (for example "D6 vs C6"), and carries an [L1] <reference> "<verse words>"':'your RESULT line names, by label, the collision lines that decide it (for example "D6 vs C6"), and carries an [L1] <reference> "<verse words>"';
  return '\nTHE LAYERS RULE (Commitment 13, '+st+'): '+what+'. Cure it with CHANGE TO the line in that form, or RETRACTED for a collision line; a KEEP cures it only when its sentence gives what the line lacks.';}
 function cure(it,a,ctx,R){const y=it&&it.lay;const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!y)return res(false,'not a pkgLAY item');if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
  const to=String(a.ans==='CHANGE'?a.to:it.line||'').replace(/\\+"/g,'"'),w=String(a.why||'').replace(/\\+"/g,'"');
  if(a.ans==='CHANGE'&&/^\s*RETRACTED\b/i.test(to)&&y.kind!=='RESULT'&&y.kind!=='KEYSTONE')return res(true,'CHANGE TO RETRACTED');
  const t=to+' '+w;const S=sides(R);
  if(y.kind==='STANDS-L1'){if(a.ans==='CHANGE'&&!/\bSTANDS\b/.test(to)&&/\bvs\b/i.test(to)){const c=l1(t,ctx);return res(c.ok,c.ok?'CHANGE TO a regraded line with a counted [L1]':'CHANGE TO a regraded line with no counted [L1]');}const c=l1(t,ctx);return res(c.ok,c.ok?'[L1] '+c.s:'still no counted [L1]');}
  if(y.kind==='STANDS-FIT'){const f=run6(t,S.C+' | '+S.D);return res(!!f,f?'quotes the answer ("'+f+'")':'still quotes no 6 words in a row of the answer');}
  if(y.kind==='UND-SIDES'){if(a.ans==='CHANGE'&&!/\bUNDERDETERMINED\b/.test(to))return res(true,'CHANGE TO a line not graded UNDERDETERMINED');const c=run6(t,S.C),d=run6(t,S.D);return res(!!(c&&d),c&&d?'quotes the defender ("'+c+'") and the challenger ("'+d+'")':'still does not quote 6 words in a row from '+(!c&&!d?'either side':!c?'the defender':'the challenger'));}
  const lb=y.kind==='KEYSTONE'?new RegExp('\\b'+y.label+'\\s+vs\\.?\\s+C\\d+\\b','i'):LBL;const c=l1(t,ctx);const ok=lb.test(t)&&c.ok;return res(ok,ok?'names the label and carries a counted [L1]':(!lb.test(t)?'still names no collision label':'still carries no counted [L1]'));}
 return {scan,rule,cure,l1,LBL};})();