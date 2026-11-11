// Direct test of W4's flagged 33497 line (H6.1 chatgpt, D1 vs C1) under old and new OPEN.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const L=w=>{const T=un(w).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const rx=l=>new Function(l.trim()+';return OPEN;')();
const O=rx(L('/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json')[1898]),N=rx(L('/mnt/project-files/wall2024/parent_s143_DFR.json')[1898]);
const l='D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- [CR3] answers Matthew 1:24, Matthew 1:19 and Matthew 1:25; the parties differ on the temporal force of coming together and not knowing -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost"; the record leaves the competing timing inferences open.';
console.log('old',O.test(l),'new',N.test(l),'| old match',JSON.stringify((l.match(O)||[''])[0]),'| new match',JSON.stringify((l.match(N)||[''])[0]));
const s=l.replace(/; the record leaves[^]*$/,'.');console.log('without the closing "leaves ... open" clause: old',O.test(s),'new',N.test(s));
