// ASK 386 (W1 8501, W2 8500, W3 8503): short-form link lines "Dn: GRADE" (read today by __RL.readLine as form LINK STATE) and the prefixed form "Dn: Dn vs Cm (...): GRADE" (read by nothing).
// Counts over the 624 stored judgments, and the tag word under: R3 = rev 3 as built; VT = short-form lines count in the tie test only; VA = short-form lines count in every rd386 test (the CHALLENGER LINK BROKEN test too).
const J=require('../a384/judgments_all.json');const D=require('./dbcols.json');const E=require('./ert_eval.cjs')(__dirname+'/t386_rev3.json');
const F=require('./stubload.cjs')(__dirname+'/t386_rev3.json','Alternate Merge Seat',['ri5Rd2024']);
const K=x=>String(x||'').toUpperCase().replace(/\s+VS\.?\s+/,' VS ').trim();
function rd(i,shortCol,mode){const w=String(i.verdict||'').toUpperCase();if(!/^(HELD|BROKEN|PARTIAL)$/.test(w))return null;const ex=new Set((i.retracted||[]).map(K));const col=(i.col||[]).filter(z=>!ex.has(K(z.link)));
 const longD=new Set(col.map(z=>(K(z.link).match(/^D\d+/)||[''])[0]));const sh=shortCol.filter(z=>!longD.has(z.link.toUpperCase()));const all=col.concat(sh);const cT=mode==='R3'?col:all,cC=mode==='VA'?all:col;
 let r;if(w==='BROKEN')r='CHALLENGER WINS';else if(w==='PARTIAL')r='UNDERDETERMINED';else{if(!i.cst)return null;r=(i.cst!=='SELF-SUPPORTED'||cC.some(z=>z.grade==='CHALLENGER LINK BROKEN'))?'DEFENDER WINS':'UNDERDETERMINED';}
 const tie=(mode==='R3'?(i.col||[]).length>0:cT.length>0)&&!!i.dst&&!!i.cst&&typeof i.cd==='number'&&typeof i.cc==='number'&&!cT.some(z=>!z.grade)&&!cT.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&i.dst===i.cst&&i.cd===i.cc;
 return (tie&&/WINS/.test(r))?'UNDERDETERMINED':r;}
let withShort=0,zero=0,zeroShort=0,zeroPref=0,zeroNone=0;const rows=[];
for(const j of J){const c=D.find(x=>x[0]===j.id);const t=E.cureJText(j.v,true);const ls=t.split('\n').map(l=>l.replace(/^[\s*\-•]+/,''));
 const shortCol=[];for(const l of ls){const r=F.ri5Rd2024(l);if(r&&r.form==='LINK STATE'&&/^D\d+$/i.test(String(r.f.link||'')))shortCol.push({link:String(r.f.link).toUpperCase(),grade:r.f.grade,raw:l});}
 const pref=ls.filter(l=>/^D\d+\s*:\s*D\d+\s+vs\.?\s+C\d+/i.test(l)).length;const col=E.rcLines(t).col;if(shortCol.length)withShort++;
 if(!col.length){zero++;if(shortCol.length)zeroShort++;else if(pref)zeroPref++;else zeroNone++;}
 const R=[];for(const m of String(j.v).matchAll(/\[AUDIT v21: CORRECTED RESULT -- SEAT: ([^;\]]*); ORIGINAL: \w+; COUNTED: \w+ \([A-Z]+-\d\)(?:; RETRACTED: ([^\]]*))?\]/g)){if(m[1]!==j.seat||!m[2])continue;for(const x of m[2].split(/\s*,\s*/))if(/^D\d+\s+vs\.?\s+C\d+$/i.test(x.trim()))R.push(x.trim());}
 const i={verdict:c[1],dst:c[2],cst:c[3],cd:c[4],cc:c[5],col,retracted:R};const w3=rd(i,shortCol,'R3'),wt=rd(i,shortCol,'VT'),wa=rd(i,shortCol,'VA');const w2=rd({...i},[], 'R3');
 if(w3!==wt||w3!==wa)rows.push({id:j.id,seat:j.seat,fields:c.slice(1,6),long:col.length,short:shortCol.map(z=>z.link+' '+z.grade).join('; ').slice(0,160),rev3:w3,tie_only:wt,every_test:wa});}
console.log({judgments:J.length,with_short_form_lines:withShort,zero_long_form:zero,of_which_short_form:zeroShort,prefixed_form_only:zeroPref,neither:zeroNone});
console.log('rows whose word differs from rev 3 under VT or VA:',rows.length);for(const r of rows)console.log(' ',JSON.stringify(r));
require('fs').writeFileSync(__dirname+'/short386_out.json',JSON.stringify(rows,null,1));
