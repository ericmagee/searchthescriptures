const fs=require('fs');const L=require('./lib2.cjs');
const live=L('/mnt/project-files/wall2024/fetchback_live_s182.json').fns, nw=L('/mnt/project-files/w1/pkgCGR/parent_s182_CGR.json').fns;
const rows=JSON.parse(fs.readFileSync('rounds158.json'));const FL=JSON.parse(fs.readFileSync('/mnt/project-files/w2_grades/cgr/forced_lines.json'));
const Q=[];for(const r of rows){for(const p of live.kffPairs(live.__kfLB(r.t).replace(/[*_`]+/g,''))){if(live.krulNorm(p.q)!==nw.krulNorm(p.q))Q.push({rt:r.rt,k:r.k,o:' '+live.krulNorm(p.q)+' ',n:' '+nw.krulNorm(p.q)+' '});}}
const F=[];for(const l0 of FL){const l=String(l0).replace(/[*_`]+/g,'').trim();const lx=/FORCED/i.test(l)?l:'FORCED: '+l;const m=lx.match(live.KF_LINE)||l.match(live.KF_LINE);if(!m)continue;F.push({o:live.krulNorm(m[6]),n:nw.krulNorm(m[6])});}
let diff=0;for(const q of Q)for(const f of F){if(f.o.split(' ').filter(Boolean).length<4)continue;if(q.o.includes(' '+f.o+' ')!==q.n.includes(' '+f.n+' '))diff++;}
console.log('changed pair quotes',Q.length,'| FORCED quotes parsed',F.length,'of',FL.length,'| fn changed',F.filter(f=>f.o!==f.n).length,'| hit flips (all runs crossed)',diff);
