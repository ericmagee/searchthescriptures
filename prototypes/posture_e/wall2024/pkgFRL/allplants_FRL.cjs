// pkgFUN FRL: every planted COUNTED answer from the graders' files and W1's, read by the live s98 (= s100) line and by the FRL line.
// The K-S3 COUNTED line is lifted from each library (pkgFUN/live_s98_line.txt from strip_KCB_base = live s98; pkgFUN/../pkgFRL/frl_line.txt from strip_FRL (rev 7 + six refusals)).
// Labels are each file's own: correct (should read CURED) or refusal. Required: no correct answer that live reads CURED reads UNCURED under FRL.
const fs=require('fs');const D=__dirname+'/../pkgFUN';const pred=f=>{const L=fs.readFileSync(f,'utf8').trim();const m=L.match(/^\{(?:let __f7=null;)?const c0=(.*?);if\((.*)\)return res\('CURED'/);if(!m)throw new Error('shape '+f);return new Function('rp','let __f7=null;const c0='+m[1]+';return !!('+m[2]+');');};
const LV=pred(D+'/live_s98_line.txt'),F3=pred(D+'/../pkgFRL/frl_line.txt');
const arr=(file,name)=>{const src=fs.readFileSync(file,'utf8');let i=src.indexOf(name+'=[');let o=name.length+1;if(i<0){i=src.indexOf(name+' [');}if(i<0)throw new Error(name+' in '+file);let k=i+o,d=0,q=null;for(;k<src.length;k++){const c=src[k];if(q){if(c==='\\'){k++;continue;}if(c===q)q=null;continue;}if(c==='"'||c==="'")q=c;else if(c==='[')d++;else if(c===']'){d--;if(!d)break;}}return eval(src.slice(i+o,k+1));};
const S=[];const add=(src,list,good)=>list.forEach(t=>S.push({src,t,good}));
add('W3 rev 1 table (w3_plant_FUN GOOD)',arr(D+'/w3_grade/w3_plant_FUN.cjs','GOOD'),true);add('W3 rev 1 table (w3_plant_FUN BAD)',arr(D+'/w3_grade/w3_plant_FUN.cjs','BAD'),false);
add('W3 closed list (GOOD)',arr(D+'/w3_grade/w3_closed_list_idea.cjs','GOOD'),true);add('W3 closed list (BAD)',arr(D+'/w3_grade/w3_closed_list_idea.cjs','BAD'),false);
add('W3 rev 2 (w3_good2)',JSON.parse(fs.readFileSync(D+'/w3_grade/w3_good2.json','utf8')),true);add('W3 rev 2 (w3_bad2)',JSON.parse(fs.readFileSync(D+'/w3_grade/w3_bad2.json','utf8')),false);
for(const [f,nm] of [[D+'/w4_grade/w4_plant_FUN.cjs','W4 rev 1'],[D+'/w4_grade2/w4_plant_FUN2.cjs','W4 rev 2']])arr(f,'T').forEach(([t,e])=>S.push({src:nm,t,good:!!e}));
add('W3 rev 3 (w3_plant_FUN3 GOOD)',arr(D+'/w3_grade/w3_plant_FUN3.cjs','GOOD'),true);add('W3 rev 3 (w3_plant_FUN3 BAD)',arr(D+'/w3_grade/w3_plant_FUN3.cjs','BAD'),false);add('W1 rev 2 plants (w1_plant_FUN2 A)',arr(D+'/w1/w1_plant_FUN2.cjs','A'),true);
arr(D+'/probe_FUN.cjs','of').forEach(x=>S.push({src:'W1 rev 1 probe (probe_FUN)',t:x[0],good:x[2]==='CURED'}));
const seen=new Map();for(const s of S){const k=s.t;if(!seen.has(k))seen.set(k,s);else{const o=seen.get(k);if(o.good!==s.good)o.conflict=(o.conflict||[o.src+': '+(o.good?'correct':'refusal')]).concat(s.src+': '+(s.good?'correct':'refusal'));o.src+=' + '+s.src;}}
let lost=0,goodN=0,goodCur=0,badN=0,badRef=0,badRefLive=0,gain=0;const L=[];
for(const s of seen.values()){const lv=LV(s.t),f3=F3(s.t);const st=b=>b?'CURED':'UNCURED';
 if(s.conflict){L.push('LABELS DIFFER  live '+st(lv)+' | FRL '+st(f3)+' | '+s.t+'  ['+s.conflict.join('; ')+']');continue;}
 if(s.good){goodN++;if(f3)goodCur++;if(lv&&!f3){lost++;L.push('LOST (correct, live CURED, FRL UNCURED) | '+s.t+'  ['+s.src+']');}else if(!lv&&f3)gain++;else if(!f3)L.push('correct read UNCURED by both | '+s.t+'  ['+s.src+']');}
 else{badN++;if(!f3)badRef++;else L.push('refusal read CURED by FRL (live '+st(lv)+') | '+s.t+'  ['+s.src+']');if(!lv)badRefLive++;}}
L.forEach(x=>console.log(x));
console.log('\n'+seen.size+' distinct planted answers. Correct: '+goodN+', FRL CURED '+goodCur+' (live CURED -> FRL UNCURED: '+lost+'; live UNCURED -> FRL CURED: '+gain+'). Refusals: '+badN+', FRL UNCURED '+badRef+' (live UNCURED '+badRefLive+').');process.exit(lost?1:0);
