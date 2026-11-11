const fs=require('fs');const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
const get=f=>{const s=fs.readFileSync(f,'utf8');const e=s.indexOf('\nlet si=0;');return new Function('N','cut',s.slice(0,e).replace('if(t.length+o.p.length>3500)break;','')+'\nreturn giveUp;')(N,x=>x);};
const O=get('gu_old.js'),Nw=get('gu_new.js');
const own=/\bI\s+(?:withdraw|drop|grant|concede|have\s+(?:granted|conceded)|granted|conceded)\b/i;
const strip=p=>p.replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’|(?<![A-Za-z])'[^'\n]*'(?![A-Za-z])/g,' ');
let tot={drop:0,ownDrop:0,add:0,debates:0};const ex=[];
for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){
 const E=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));const rd=E.data.resultData.runData;
 // find a node output carrying cr1..dr4
 let R=null;for(const [n,r] of Object.entries(rd)){const j=r[0]&&r[0].data&&r[0].data.main&&r[0].data.main[0]&&r[0].data.main[0][0]&&r[0].data.main[0][0].json;if(j&&j.cr1&&j.dr3&&j.cr4){R=j;break;}}
 if(!R){console.log(f,'no rounds');continue;}tot.debates++;
 const SW={D:[R.cr1,R.cr2,R.cr3,R.cr4].join('\n'),C:[R.dr1||R.gr1,R.dr2||R.gr2,R.dr3,R.dr4].join('\n')};
 for(const sd of ['D','C']){const a=new Set(O(SW[sd],'',sd).split('\n').filter(Boolean)),b=new Set(Nw(SW[sd],'',sd).split('\n').filter(Boolean));
  for(const p of a)if(!b.has(p)){tot.drop++;const sents=strip(p).split(/(?<=[.!?])\s+/).filter(x=>own.test(x));if(sents.length){tot.ownDrop++;ex.push(f+' '+sd+': '+p.slice(0,260));}}
  for(const p of b)if(!a.has(p))tot.add++;}}
console.log(tot);ex.forEach(x=>console.log(' ',x));
