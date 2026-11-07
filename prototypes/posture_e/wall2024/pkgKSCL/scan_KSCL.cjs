// pkgKSCL: the 260-verdict scan (pkgKSC/data) with the live reader (s12) and the pkgKSCL reader; each verdict whose result changes is listed.
// Run from wall2024/: node pkgKSCL/scan_KSCL.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const ld=s=>{const i=s.indexOf('const KSC=(()=>{');return new Function(s.slice(i,s.indexOf('})();',i)+5)+';return KSC;')();};
const O=ld(rd('pkgKSCL/base/Send_Back_Build.js')),N=ld(rd('pkgKSCL/patched/Send_Back_Build.js'));
const V=require('../pkgKSC/data/verdict_lines.json');const DD={};for(const x of require('../pkgKSC/data/dr2_lists.json'))DD[x.run]=x.dr2;const dr=r=>DD[r]||null;
let a=0,b=0;const ch=[];for(const v of V){const t=String(v.lines||v.text||'').replace(/\\n/g,'\n');const d=dr(v.run);const x=O.items(t,d).length,y=N.items(t,d).length;a+=x?1:0;b+=y?1:0;
 if(x!==y){const c=N.conceded(t);ch.push(v.run+' '+v.seat+': '+(x?'hit':'none')+' -> '+(y?'HIT '+N.items(t,d).map(i=>'D'+i.n+' via '+i.via+' '+i.tag).join('; '):'none')+' | '+(c?c.line.slice(0,150):''));}}
const o=V.length+' verdicts: live reader '+a+' hits, pkgKSCL reader '+b+' hits; changed:\n  '+(ch.join('\n  ')||'none');console.log(o);fs.writeFileSync('pkgKSCL/scan_KSCL.txt',o+'\n');
