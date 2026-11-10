const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const df=f=>{const s=g(f).nodes.find(n=>n.name==='Send Back Record').parameters.jsCode;const i=s.indexOf('const __df=');const j=s.indexOf('<=15;',i);return new Function('return '+s.slice(i+11,j+4))();};
const c=df(__dirname+'/../parent_s98_KDV2.json');
const T=[ // want false: a sentence with content of its own
 ['The verse names no father, which is answered under Matthew 1:16.',false],['Joseph is the legal husband and not the begetter, as is answered under Matthew 1:16.',false],['The phrase is general and denies no father; it is answered with Job 14:1.',false],
 ['That objection fails because it was answered by Luke 1:35.',false],['It is not answered under Luke 9:34.',false],['Whether the cloud is the Father is answered in Luke 9:35.',false],['This cannot be answered by Matthew 1:16.',false],
 // want true: only a pointer
 ['This is answered under Luke 9:34.',true],['Answered under Luke 9:34.',true],['Matthew 17:5: answered under Luke 9:34.',true],['Matthew 17:5 is answered under Luke 9:34 and Matthew 3:17.',true],['Matthew 17:5 is answered under Luke 9:34 above.',true],['Matthew 17:5 is answered under Luke 9:34 (see above).',true],['For Matthew 17:5 see Luke 9:34.',true],['Matthew 17:5 was answered at Luke 9:34-35.',true],['Matthew 17:5 is answered under 1 John 5:1.',true],['Matthew 17:5 is answered under Song of Solomon 2:1.',true]];
let a=0;for(const [s,w] of T){const r=c(s);if(r!==w)a++;console.log((r===w?'ok   ':'DIFF ')+'want '+w+' got '+r+' | '+s);}console.log(a+' of '+T.length+' differ from what W3 expects');
