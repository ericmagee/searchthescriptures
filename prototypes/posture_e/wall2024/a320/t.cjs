// ASK 320 test: parse the built node; run its list code (vp4List .. P) on every stored debate whose engine_r1 lists ASSUMES; count gr2 premises gained from gr1, and print 37281.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const c=W.nodes.find(n=>n.name==='Assume Check Build').parameters.jsCode;
let e=null;try{new Function('$',c);}catch(x){e=x.message;}console.log((e?'FAIL':'PASS')+' parse Assume Check Build'+(e?': '+e:''));
const a=c.indexOf('const VP4_STOP'),b=c.indexOf('const S=$(');const lib=c.slice(a,b);const pa=c.indexOf('/* pkgEAG'),pb=c.indexOf("const P=F?");const add=c.slice(pa,pb);
const run=new Function('F',lib+add+"return {old:vp4List(F.gr2,'DEFENDER'),gain:vp4G1(F.gr1,F.gr2)};");
const raw=JSON.parse(fs.readFileSync(process.argv[3],'utf8')).result;const rows=JSON.parse(raw.slice(raw.indexOf('[{"j"'),raw.lastIndexOf('}]')+2))[0].j;
let deb=0,gained=0,prem=0,oldEmpty=0,fixed=0;
for(const r of rows){const o=run({gr1:r.g1,gr2:r.g2});deb++;prem+=o.gain.length;if(o.gain.length)gained++;if(!o.old.length){oldEmpty++;if(o.gain.length)fixed++;}
 if(/^ODV1-37281/.test(r.rt||'')){console.log('37281: gr2 ASSUMES premises',o.old.length,'| gained from gr1:',JSON.stringify(o.gain.map(g=>({gr2_n:g.n,link:g.link,from_gr1:g.from_gr1,assumes:g.assumes}))));}}
console.log('debates',deb,'| with any gr1 gain',gained,'| premises gained',prem,'| gr2 list had no ASSUMES premise',oldEmpty,'of which now non-empty',fixed);
