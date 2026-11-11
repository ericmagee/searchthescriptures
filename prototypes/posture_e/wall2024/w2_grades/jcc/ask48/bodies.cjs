// W2: ASK 48 replay bodies. Stored DeepSeek request bodies (unchanged = live) and the same with R1 inserted after the anchor.
const fs=require('fs'),cr=require('crypto');const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
const A='or differs only in wording.',R1=" Read each sentence within its own block, as that block narrowed or granted it; a contradiction must stand between the two sentences' own words, not between words your reason adds.";
const D='/mnt/project-files/wall2024/ask48_bodies/';fs.mkdirSync(D,{recursive:true});const man=[];
for(const [lab,f,n] of [['A','ex34726','Judge Contradiction Build'],['B','ex34780','Judge Contradiction Build'],['C','ex34703','Close Enforcer Build'],['D','ex34726','Close Enforcer Build']]){
 const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f+'_full.json'));const o=out((X.data||X).resultData.runData,n);
 o.forEach((it,k)=>{if(it.cec_skip)return;const b=it.body;const s=typeof b==='string'?b:JSON.stringify(b);if(s.split(A).length!==2){console.log(lab,k,'anchor count',s.split(A).length-1);return;}
  const r=s.replace(A,()=>A+R1.replace(/"/g,'\\"'));JSON.parse(r);const nm=lab+(o.length>1?'_'+(it.side||k):'');
  fs.writeFileSync(D+nm+'_live.json',s);fs.writeFileSync(D+nm+'_R1.json',r);
  const L=JSON.parse(s),R=JSON.parse(r);man.push([nm,f,n,it.side||'',(it.links||'').toString().slice(0,60),'live sha '+cr.createHash('sha256').update(s).digest('hex').slice(0,12),'R1 sha '+cr.createHash('sha256').update(r).digest('hex').slice(0,12),'chars +'+(r.length-s.length),'model '+L.model,'temp '+L.temperature].join(' | '));});}
console.log(man.join('\n'));fs.writeFileSync(D+'MANIFEST.txt',man.join('\n')+'\n');
