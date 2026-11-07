// pkgKSC scan (W3 2671): every stored verdict since 10-28 whose KEYSTONE Dn STANDS and whose CONCEDED LINKS line counts an entry numbered n or
// mapping to LINK n, with each entry's premise-to-link mapping through its run's [DR2] list. Run from wall2024/: node pkgKSC/scan_KSC.cjs
const fs=require('fs');const KSC=new Function(fs.readFileSync('pkgKSC/src_KSC.js','utf8')+';return KSC;')();
const V=JSON.parse(fs.readFileSync('pkgKSC/data/verdict_lines.json','utf8'));const D={};for(const x of JSON.parse(fs.readFileSync('pkgKSC/data/dr2_lists.json','utf8')))D[x.run]=x.dr2;
const rows=[];for(const r of V){const k=KSC.keystone(r.lines),c=KSC.conceded(r.lines);if(!k||k.state!=='STANDS'||!c)continue;const pm=KSC.premiseMap(D[r.run]);
 const touch=c.e.some(x=>x.num===k.n||(x.kind!=='LINK'&&pm&&pm[x.num]===k.n));if(!touch)continue;const its=KSC.items(r.lines,D[r.run]);
 rows.push({id:r.run.slice(5,10)+' '+r.seat,hit:its.length?its[0].via+' '+its[0].tag:null,line:r.run.slice(5,10)+' '+r.seat.padEnd(8)+' D'+k.n+': '+(its.length?'HIT  via '+its[0].via+' '+its[0].tag:'none')+'\n    counted: '+c.e.map(x=>x.kind==='LINK'?'LINK '+x.num+' '+x.tag:'Premise '+x.num+' -> '+(pm&&pm[x.num]!=null?'LINK '+pm[x.num]:'(no labeled entry)')+' '+x.tag).join('; ')+'\n    [DR2] list: '+(pm?Object.entries(pm).map(([p,n])=>p+'=LINK '+n).join(', '):'none found')});}
module.exports={rows};if(require.main===module){console.log(rows.map(r=>r.line).join('\n'));console.log(rows.filter(r=>r.hit).length+' hits of '+rows.length+' verdicts that count an entry numbered n or mapping to n ('+V.length+' read)');}
