// ASK 349 rev 2: set every Shared Library MAP n to the rebuilt length (W3 fail 7356).
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const [inF,outF]=process.argv.slice(2);
const live=JSON.parse(fs.readFileSync('live.json'));const lv=unpack(live);
const lvMapTxt=lv.T.slice(lv.T.lastIndexOf('\n/*MAP*/')+8,lv.T.lastIndexOf('\n/*END*/'));
if(JSON.stringify(lv.M)!==lvMapTxt)throw new Error('MAP serialization differs from JSON.stringify; stop');
let liveBad=0;for(const k in lv.M)if(rb(lv.L,lv.M[k]).length!==lv.M[k].n)liveBad++;
console.log('live MAP entries',Object.keys(lv.M).length,'live n mismatches',liveBad);
const w=JSON.parse(fs.readFileSync(inF));const u=unpack(w);const fixed=[];
for(const k in u.M){const len=rb(u.L,u.M[k]).length;if(len!==u.M[k].n){fixed.push(k+' '+u.M[k].n+'->'+len);u.M[k].n=len;}}
const T=u.T;const iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const nT=T.slice(0,iM+8)+JSON.stringify(u.M)+T.slice(iE);
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=nT;
fs.writeFileSync(outF,JSON.stringify(w));
console.log('fixed',fixed.length);fixed.forEach(x=>console.log('  '+x));
