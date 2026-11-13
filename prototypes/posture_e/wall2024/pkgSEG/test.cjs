// pkgSEG test: the S-E object words and the affirmed test, taken from Build Save Body of live and new, on run 35856 and plants.
// Usage: node pkgSEG/test.cjs <live json> <new json>
const fs=require('fs');const R=require('/mnt/project-files/w3/grade_35856/rounds.json');
const mk=f=>{const w0=JSON.parse(fs.readFileSync(f));const W=(w0.data||w0).workflow||(w0.data||w0);const s=W.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
 const z=s.indexOf('const SY=String(d.synthesis');const cut=(a,b)=>{const i=s.indexOf(a,z);const j=s.indexOf(b,i);return s.slice(i,j);};
 const defs=cut('const STOPW=','const qheld=');const ob=cut('const objs=','\n   const held=');const QF=cut('const QF=','\n const DEF=');
 return new Function('T','s','verb','const d={};'+QF+defs+ob+'const fr=FAM[verb[0]===\'w\'?\'w\':verb[0]===\'c\'?\'c\':verb[0]===\'r\'?\'r\':\'d\'];return {objs,ok:affirmed(T,fr,objs)};');};
const [L,K]=process.argv.slice(2,4).map(mk);
const DEF35856=[R.claude_r1,R.claude_r2,R.engine_r3,R.defender_r4].join('\n');
const P=[['35856 synthesis sentence',DEF35856,'The defender supplied passage-based responses, withdrew or narrowed specified limbs, and continued to contest the challenger’s chain in its link and close rounds.','withdrew',true],
 ['named object present','I withdraw the Ezra 2:61 route.','The defender withdrew the Ezra route, and kept Luke.','withdrew',true],
 ['named object absent (must still flag)','I withdraw the Ezra 2:61 route.','The defender withdrew the Galatians witness, and kept Luke.','withdrew',false],
 ['negated withdrawal only (must flag)','I do not withdraw anything.','The defender withdrew specified limbs.','withdrew',false],
 ['object after comma not used','I withdraw the register claim.','The defender withdrew the register claim, then contested Bethlehem.','withdrew',true]];
let ok=0;for(const [nm,T,s,v,exp] of P){const l=L(T,s,v),k=K(T,s,v);const pass=k.ok===exp;if(pass)ok++;console.log((pass?'OK   ':'FAIL ')+nm+' | live held='+l.ok+' ['+l.objs.join(',')+'] | new held='+k.ok+' ['+k.objs.join(',')+'] | expect held='+exp);}
console.log('checks',ok,'of',P.length);
