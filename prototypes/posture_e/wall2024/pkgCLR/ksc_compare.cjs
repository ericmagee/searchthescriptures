// pkgCLR: pkgKSC's rule read through pkgCLR (line + continuation lines, all forms) against the pkgKSCL reader, on the 201 stored panel
// judgments (count_chunks.json: the CONCEDED LINKS and KEYSTONE text). Each verdict whose result differs is listed for a hand check.
const C=require('./clr.cjs');const fs=require('fs');const K=(()=>{const s=fs.readFileSync('pkgKSCL/patched/Send_Back_Build.js','utf8');const i=s.indexOf('const KSC=(()=>{');return new Function(s.slice(i,s.indexOf('})();',i)+5)+';return KSC;')();})();
const X=require('./data/count_chunks.json');const DD={};for(const x of require('../pkgKSC/data/dr2_lists.json'))DD[x.run]=x.dr2;
let a=0,b=0,nodr=0;const ch=[];
for(const v of X){const t=(v.chunks||[]).map(c=>String(c).replace(/\\n/g,'\n')).join('\n');const ks=(v.ks||[]).map(c=>String(c).replace(/\\n/g,'\n')).join('\n');
 const k=K.keystone(ks);if(!k||k.state!=='STANDS')continue;const dr2=DD[v.run];if(!dr2)nodr++;const pm=K.premiseMap(dr2)||{};
 const r=C.read(t,'DEFENDER');const hitN=r?r.counted.filter(e=>(e.ref==='LINK'||e.ref==='D'?e.num:(pm[e.num]!=null?pm[e.num]:(e.link!=null&&e.link!=='none'?e.link:null)))===k.n):[];
 const old=K.items(t.split('\n').filter(l=>!/^\s*\[/.test(l)).join('\n').replace(/KEYSTONE[^\n]*/g,'')+'\n'+k.line,dr2).length>0;const nw=hitN.length>0;a+=old;b+=nw;
 if(old!==nw)ch.push(v.run.slice(5,10)+' '+v.seat.padEnd(8)+' D'+k.n+' STANDS: KSCL '+(old?'hit':'none')+' -> CLR '+(nw?'HIT via '+hitN.map(e=>e.ref+' '+e.num+(e.link!=null?' (own LINK '+e.link+')':' = LINK '+pm[e.num]+' [DR2]')+' '+e.tag).join('; '):'none')+' | '+(r?r.body.slice(0,160):''));}
const o='panel judgments with KEYSTONE STANDS: KSCL reader '+a+' hits, pkgCLR '+b+' hits ('+nodr+' runs without a stored [DR2] list); differ:\n  '+(ch.join('\n  ')||'none');fs.writeFileSync('pkgCLR/ksc_compare_out.txt',o+'\n');console.log(o);
