const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const lib=f=>{const c=g(f).nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const mk=L=>{const i=L.findIndex(l=>l.startsWith('function psGrades('));let j=i;while(!/\/\* pkgRI3B \*\/\s*$/.test(L[j])||j===i)j++;const src=L.slice(i,j+1).join('\n');
 const r3=L.findIndex(l=>/function ri3Head2024\(/.test(l));let k=r3;let depth=0;// take ri3Head2024 line(s) until a line ends a function at depth 0: use eval of consecutive lines until it compiles
 let hs='';for(let q=r3;q<r3+40;q++){hs+=L[q]+'\n';try{new Function(hs+';return ri3Head2024;');break;}catch(e){}}
 return new Function(hs+src+';return psGrades;')();};
const A=mk(lib('/mnt/project-files/wall2024/fetchback_live_s130.json')),B=mk(lib('/mnt/project-files/wall2024/parent_s130_NVR.json'));
const P=[
 // [line, expected grades after fix (object), note]
 ['CONCEDED LINKS: 0 -- Premise 4 is not void.',{4:'SPARED'},'fixed: not void'],
 ['CONCEDED LINKS: 0 -- Premise 4 is never VOID.',{4:'SPARED'},'fixed: never void'],
 ['CONCEDED LINKS: 0 -- Premise 2 is not unexhibited.',{2:'SPARED'},'fixed'],
 ['CONCEDED LINKS: 0 -- Premise 3 was not conceded.',{3:'SPARED'},'fixed'],
 ['CONCEDED LINKS: 0 -- Premises 1 through 6 are spared.',{1:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'SPARED'},'fixed: range in words'],
 ['CONCEDED LINKS: 0 -- Premises 2 to 4 are spared; premise 5 is VOID.',{2:'SPARED',3:'SPARED',4:'SPARED',5:'VOID'},'fixed range + VOID'],
 ['CONCEDED LINKS: 1 -- Premise 4 is VOID.',{4:'VOID'},'must not change'],
 ['CONCEDED LINKS: 1 -- Premise 3 is UNEXHIBITED.',{3:'COUNTED'},'must not change'],
 ['CONCEDED LINKS: 1 -- Premise 3 is conceded.',{3:'COUNTED'},'must not change'],
 ['CONCEDED LINKS: 0 -- Premise 4 is not counted.',{4:'SPARED'},'must not change (old form)'],
 ['CONCEDED LINKS: 0 -- None counted. Premises 1-6 are spared.',{1:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'SPARED'},'must not change'],
 ['CONCEDED LINKS: 1 -- Premise 5 is VOID, not SPARED.',{5:'VOID'},'must not change'],
 ['CONCEDED LINKS: 0 -- Premise 4 is VOID-free? no: premise 4 is SUPPORTED.',{4:'SPARED'},'must not change'],
 ['CONCEDED LINKS: 1 -- Premise 4 is not void but UNEXHIBITED.',{4:'COUNTED'},'W1 limit (expect wrong)'],
 ['CONCEDED LINKS: 0 -- Premise 1 through 6 are spared.',{1:'SPARED',6:'SPARED'},'W1 limit singular'],
 ['CONCEDED LINKS: 0 -- Premise 4 cannot be void.',{4:'SPARED'},'not read before or after (expect no change)'],
 ['CONCEDED LINKS: 2 -- Premises 2 and 6 are conceded; premise 4 is not void.',{2:'COUNTED',6:'COUNTED',4:'SPARED'},'mixed'],
 ['CONCEDED LINKS: 0 -- Premise 4 is not voided by Luke 3:23.',{4:'SPARED'},'"voided" must not read as void'],
 ['CONCEDED LINKS: 0 -- The links 1 to 3 hold; premise 4 is not void.',{4:'SPARED'},'"links 1 to 3" must not expand'],
];
let fixed=0,same=0,wrong=0;for(const [l,exp,note] of P){const a=A(l),b=B(l);const ga=JSON.stringify(a&&a.g),gb=JSON.stringify(b&&b.g);const ok=Object.entries(exp).every(([k,v])=>b&&b.g[k]===v);
 const tag=ga===gb?(ok?'SAME-RIGHT':'SAME-WRONG'):(ok?'FIXED':'CHANGED-WRONG');if(tag==='FIXED')fixed++;else if(tag==='SAME-RIGHT')same++;else wrong++;console.log(tag.padEnd(14),note,'|',ga,'->',gb);}
console.log('fixed',fixed,'same right',same,'wrong/limit',wrong);
