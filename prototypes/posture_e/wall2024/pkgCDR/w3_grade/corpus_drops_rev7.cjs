// W3 grade of pkgCDR rev 7: every sentence in rounds 1-3 of every stored debate that holds a drop verb, and whether rev 7 reads a dropped wording from it.
process.chdir(__dirname+'/../..');const fs=require('fs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const code=g('pkgCDR/parent_s103_CDR.json').nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;
const m=code.match(/const cecN=[^\n]*\n?/);if(!m)throw new Error('no cecN');
const fn=fs.readFileSync('pkgCDR/cdr_fn.js','utf8');
const mod=new Function(m[0]+'\n'+fn+'\nreturn {cdrObj,cdrSentsRaw,cdrCond,cecN};')();
const IN='/mnt/project-files/wall2024/inputs/';const broad=/\b(?:drop(?:s|ped|ping)?|withdr[a-z]+|retract[a-z]*|abandon[a-z]*|g[ai]ve\s+up|giving\s+up|strike|struck|take\s+back|took\s+back|no\s+longer|renounce[a-z]*|disavow[a-z]*|recant[a-z]*|set\s+aside|let\s+go)\b/i;
let nS=0,nR=0;const forms={};
for(const f of fs.readdirSync(IN).filter(f=>f.endsWith('_Final_Output.json')).sort()){let F;try{const x=JSON.parse(fs.readFileSync(IN+f,'utf8'));const a=Array.isArray(x)?x:[x];for(const e of a){const c=(e.data&&e.data.main&&e.data.main[0])||(e.main&&e.main[0]);if(c&&c[0]&&c[0].json)F=c[0].json;}}catch(e){}
 if(!F){console.log(f+' unreadable');continue;}
 for(const k of ['cr1','cr2','cr3','gr1','gr2','dr3'])for(const s of mod.cdrSentsRaw(F[k])){if(!broad.test(s))continue;nS++;
  const w=mod.cdrCond(s)?[]:[...new Set(s.split(/;\s+|,\s+(?:but|and)\s+(?=I\s)/).flatMap(mod.cdrObj))];if(w.length)nR++;
  console.log(f.split('_')[0]+' '+k+' '+(w.length?'READ ':'none ')+'| '+s.slice(0,260)+(w.length?'\n      => '+w.join(' || '):''));}}
console.log(nS+' sentences with a drop word in rounds 1-3; '+nR+' read as a drop of a wording');
