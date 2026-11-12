const fs=require('fs');
const lib=f=>{let j=JSON.parse(fs.readFileSync(f,'utf8'));j=j.data||j;j=j.workflow||j;const T=j.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');return JSON.parse(T.slice(a+8,b))[1201];};
const L0=lib('/mnt/project-files/wall2024/fetchback_live_s149.json'),L1=lib('/mnt/project-files/wall2024/parent_s149_RQI.json');
const ex=l=>{const m=l.match(/const kwRe=([^;]*;)/);return l.slice(l.indexOf('const kwRe='),l.indexOf('.test(t);',l.indexOf('const kwRe='))+9);};
console.log(ex(L1));
const mk=s=>{const src=s.replace('const kwRe=','return ');return new Function(src)();};
const f0=mk(ex(L0)),f1=mk(ex(L1));
const C={
 sol10:'REASSERTED IN [CR4] "So the seed of David is "made" of a woman, as Matthew 1:16 "of whom" traces."',
 sol10bs:'REASSERTED IN [CR4] "So the seed of David is \\"made\\" of a woman, as Matthew 1:16 \\"of whom\\" traces."',
 normal:'REASSERTED IN [CR4] "the seed of David according to the flesh"',
 curly:'REASSERTED IN [CR4] “the seed of David according to the flesh”',
 noquote:'REASSERTED IN [CR4] the seed of David according to the flesh',
 short_then_later:'REASSERTED IN [CR4] "seed" and later he wrote "made of a woman" here',
 apostrophe:"REASSERTED IN [CR4] David's seed is the Lord's own line",
 tooShort:'REASSERTED IN [CR4] "seed"',
 twolines:'REASSERTED IN [CR4] "seed of\nDavid in the flesh"',
};
for(const[k,v]of Object.entries(C))console.log(k.padEnd(18),'old',f0(v),'new',f1(v));
