// ASK 400 census: LINK STATE lines ("Dn: GRADE" / "Cn: GRADE") in the 624 stored judgments, by label side and grade; long-form overlap; prefixed long form.
const J=require('../a384/judgments_all.json');const E=require('./ev.cjs')(__dirname+'/../a386/t386.json');
const tally={},rows={};let pref=[];const brokenRows=[];
for(const j of J){const T=String(E.cureJText(j.v||'',true)).split('\n');const P=E.rcLines(T.join('\n'));const colD=new Set(P.col.map(z=>z.link.split(' ')[0]));
 for(const raw of T){const x=raw.replace(/[*_`]+/g,'').trim();const u=x.toUpperCase();
  if(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s*:\s*D\d+\s+VS\.?\s+C\d+/.test(u))pref.push(j.id);
  const q=E.ri5Rd2024(x.replace(/^[\s*\-•>#]+/,''));if(!q||q.form!=='LINK STATE')continue;const lab=String(q.f.link||'').toUpperCase();const side=lab[0];const g=String(q.f.grade||'').toUpperCase();
  const k=side+' '+g+(colD.has(lab)?' (long form same label)':'');tally[k]=(tally[k]||0)+1;(rows[k]=rows[k]||new Set()).add(j.id);
  if(/BROKEN/.test(g))brokenRows.push({id:j.id,seat:j.seat,lab,g,long_same_label:colD.has(lab),line:x.slice(0,120)});}}
console.log('LINK STATE lines by side and grade (lines / rows):');for(const k of Object.keys(tally).sort())console.log(' ',k,tally[k],'/',rows[k].size);
console.log('prefixed long form rows:',[...new Set(pref)].join(','));console.log('LINK BROKEN or BROKEN link-state lines:',brokenRows.length);for(const b of brokenRows)console.log(' ',JSON.stringify(b));
require('fs').writeFileSync(__dirname+'/ls_census_out.json',JSON.stringify({tally,rows:Object.fromEntries(Object.entries(rows).map(([k,v])=>[k,[...v]])),pref:[...new Set(pref)],brokenRows},null,1));
