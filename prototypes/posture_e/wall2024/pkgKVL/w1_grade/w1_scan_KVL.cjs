// W1: (1) entries pkgKVL takes as verse text (a quote right after a verse reference) that read like the debater's own words;
// (2) stored source lines in forms pkgKVL does not read (reference then dash, (KJV), says/reads/states, before a quote of 6+ words).
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs';const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
const VA=/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+(?::\d+)?)*\s*[:.,]?\s*(?:\*\*)?\s*[:,]?\s*("[^"\n]*"|“[^”\n]*”)|("[^"\n]*"|“[^”\n]*”)\s*\((?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+[^)]*\)/g;
const OTHER=/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+(?::\d+)?)*\s*(?:\(KJV\)\s*[:,]?|[—–]|--|\s(?:says|reads|states|records|writes)\s*[:,]?)\s*("[^"\n]*"|“[^”\n]*”)/g;
const OWN=/\b(?:grant|granted|concede|conceded|link|links|d[1-9]|c[1-9]|premise|keystone|defender|challenger|judge|chain|claim|biological|narrowed|collision|layer|row|witness|sense|reading|ordinary)\b/;
let runs=0,ents=0;const own=[];let oth=0;const oex=[];
for(const f of fs.readdirSync(IN).filter(f=>/Panel_Cure_Normalize_1\.json$/.test(f))){const RR=[];JSON.parse(fs.readFileSync(IN+'/'+f,'utf8'),(k,v)=>{if(k==='rounds'&&v&&typeof v==='object')RR.push(v);return v;});const R=RR[0];if(!R)continue;runs++;
 for(const k in R)for(const l of String(R[k]).split('\n')){for(const mm of l.matchAll(VA)){const n=N(mm[1]||mm[2]);if(n.split(' ').length<6)continue;ents++;if(OWN.test(n))own.push(f.split('_')[0]+' '+k+' '+(mm[1]||mm[2]).slice(0,110));}
  for(const mm of l.matchAll(OTHER)){const n=N(mm[1]);if(n.split(' ').length<6)continue;oth++;if(oex.length<8)oex.push(f.split('_')[0]+' '+k+' '+mm[0].slice(0,110));}}}
console.log(runs+' runs; '+ents+' quotes taken as verse text; '+own.length+' of them hold a debate word (grant, concede, link, D1, premise, keystone, judge, chain, claim, biological, row, witness, reading ...):');own.forEach(x=>console.log('  '+x));
console.log('source lines in forms pkgKVL does not read (dash, (KJV), says/reads): '+oth);oex.forEach(x=>console.log('  '+x));
