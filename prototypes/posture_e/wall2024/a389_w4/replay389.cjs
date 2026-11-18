const fs=require('fs');const J=require('./jud.json');const FM=fs.readFileSync(__dirname+'/fm_s262.js','utf8');
const superOfSrc=FM.slice(FM.indexOf('const superOf = '),FM.indexOf('const superApply = '));const oldSA=FM.slice(FM.indexOf('const superApply = '),FM.indexOf('const panelText = '));
const NEW=fs.readFileSync(__dirname+'/superApply389.js','utf8'),LATE=fs.readFileSync(__dirname+'/lateCured389.js','utf8');
const O=new Function(superOfSrc+oldSA+'return {superOf,superApply};')();const N=new Function(superOfSrc+NEW+LATE+'return {superOf,superApply,superKey,superNorm,lateCured};')();
const reason=raw=>{const a=raw.indexOf('{'),b=raw.lastIndexOf('}');try{const o=JSON.parse(raw.slice(a,b+1));return (o.reasoning==null&&o.reason!=null?o.reason:o.reasoning)||null;}catch(e){return null;}};
const grp=x=>x.label==='LINE'?'LINE':'labelled';const st={LINE:{tags:0,old:0,neu:0,left:0,amb:0,headbad:0},labelled:{tags:0,old:0,neu:0,left:0,amb:0,headbad:0}};let seats=0,noparse=0,labDiff=0;const amb=[],unpl=[],bad=[];
const marks=s=>{const o=[];const L=s.split('\n');L.forEach((l,i)=>{if(l.endsWith(' *(corrected by the cure)*')){const m=(L[i+2]||'').match(/^> \*Superseded by the cure \(the judge's line before it\):\* (.*)$/);o.push({line:l.slice(0,-' *(corrected by the cure)*'.length),orig:m?m[1]:''});}});return o;};
for(const j of J){const raw=String(j.verdict_raw||'');const S=N.superOf(raw);if(!S.length)continue;const txt=reason(raw);if(txt==null){noparse++;continue;}seats++;
 const a=O.superApply(txt,raw),b=N.superApply(txt,raw);const ma=marks(a),mb=marks(b);const K=S.map(N.superKey);const lines=txt.split('\n').map(N.superNorm);
 S.forEach((x,i)=>{st[grp(x)].tags++;if(K[i]&&lines.filter(n=>n.startsWith(K[i])).length>1){st.LINE.amb++;if(amb.length<300)amb.push(j.id+' key "'+K[i]+'" x'+lines.filter(n=>n.startsWith(K[i])).length);}});
 const lab=S.filter(x=>x.label!=='LINE').map(x=>x.orig.replace(/\s+/g,' '));
 ma.forEach(m=>st[lab.includes(m.orig)?'labelled':'LINE'].old++);mb.forEach(m=>{const isLab=lab.includes(m.orig);st[isLab?'labelled':'LINE'].neu++;
  if(!isLab){const hk=N.superKey({label:'LINE',orig:m.orig.replace(/\((CR[1-4]|DR[1-4]|L[1-4])\)/g,'[$1]')});if(hk&&!N.superNorm(m.line).startsWith(hk)){st.LINE.headbad++;bad.push(j.id+' '+m.line.slice(0,100));}}});
 // labelled marks identical old vs new?
 const la=ma.filter(m=>lab.includes(m.orig)).map(m=>m.line+'|'+m.orig).join('\n'),lb=mb.filter(m=>lab.includes(m.orig)).map(m=>m.line+'|'+m.orig).join('\n');if(la!==lb)labDiff++;
 const left=(b.match(/line not found in the final text:\* ([^\n]*)/g)||[]);left.forEach(l=>{const o=l.replace(/^line not found in the final text:\* /,'');st[lab.includes(o)?'labelled':'LINE'].left++;if(unpl.length<600)unpl.push(j.id+' | '+o.slice(0,150));});}
console.log('seats with v27 tags',seats,'| unparsed verdict JSON',noparse,'| seats whose labelled marks differ old vs new',labDiff);
for(const g in st){const x=st[g];console.log(g,'tags',x.tags,'| placed old',x.old,'| placed new',x.neu,'| unplaced, printed at end',x.left,'| keys matching >1 line',x.amb,'| placed on a line whose head differs',x.headbad);}
fs.writeFileSync(__dirname+'/replay_unplaced.txt',unpl.join('\n'));fs.writeFileSync(__dirname+'/replay_ambiguous.txt',amb.join('\n'));fs.writeFileSync(__dirname+'/replay_headbad.txt',bad.join('\n'));
let ni=0,lateN=0;const late=[];for(const j of J){const raw=String(j.verdict_raw||'');for(const m of raw.matchAll(/\[AUDIT v\d+: E-GATE NEW ITEM[^\n]*?REVIEW THIS ROW\.?\]/g)){ni++;const isLate=/answered at the late gate/.test(m[0]);if(!isLate)continue;lateN++;const lc=N.lateCured(m[0],raw);late.push(j.id+' -> '+(lc?'Cured flag':'Review flag')+' | '+m[0].slice(30,230));}}
console.log('NEW ITEM rows',ni,'| answered at the late gate',lateN);console.log(late.join('\n'));
