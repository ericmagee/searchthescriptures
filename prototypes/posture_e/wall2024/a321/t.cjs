// ASK 321 test: parse the built node; run cecDeclared/cecDlinks/cecCblocks/cecLinks/cecNar/cecNrh on every stored debate (W2's data set, r383/data) and count candidates; print 37281.
const fs=require('fs'),zlib=require('zlib');const D=process.argv[3];
const c=JSON.parse(fs.readFileSync(process.argv[2])).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
let e=null;try{new Function('$',c);}catch(x){e=x.message;}console.log((e?'FAIL':'PASS')+' parse Close Enforcer Build'+(e?': '+e:''));
const L=c.split('\n');const pick=nm=>L.find(l=>l.startsWith('const '+nm+'='));const g=k=>{const i=L.findIndex(l=>l.startsWith('const '+k+'='));let s=L[i]+'\n';for(let j=i+1;j<L.length&&L[j].trim()&&!/^(?:const|let) /.test(L[j]);j++)s+=L[j]+'\n';return s;};
const src=['cecDeclared','cecDlinks','cecCblocks','cecLinks','cecNar','cecNrh'].map(g).join('');
const fx=new Function(src+';return {cecLinks,cecNrh};')();
const rows=JSON.parse(zlib.gunzipSync(fs.readFileSync(D+'/rounds8.json.gz')));const R=JSON.parse(fs.readFileSync(D+'/runs.json','utf8'));const all=Object.values(R).map(x=>x.r).concat(rows);
const seen=new Set();let n=0,hit=0;const out=[];
for(const r of all){if(!r||seen.has(r.id))continue;seen.add(r.id);n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};
 const cs=fx.cecNrh(F,fx.cecLinks(F),[]);if(cs.length){hit++;out.push(String(r.id).slice(0,8)+' '+JSON.stringify(cs.map(x=>({n:x.n,er:x.earlier_round,eq:x.earlier_q.slice(0,120),cq:x.closing_q.slice(0,120),why:x.why.slice(-150)}))));}}
console.log('debates',n,'with a pkgNRH candidate',hit);console.log(out.join('\n'));
