// W2 grade of pkgRQI: old (live s149) and new (package) kwRe, taken from the two library files, on the database corpus and on plants.
const fs=require('fs');const R=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));
const lib=w=>{const c=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;return JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));};
const grab=L=>{const l=L[1201];const m=l.match(/const kwRe=(t=>\/.*?\/i\.test\(t\));/);return eval(m[1]);};
const OLD=grab(lib(R('fetchback_live_s149.json'))),NEW=grab(lib(R('parent_s149_RQI.json'))),NEWJ=grab(lib(R('parent_s149_JOINT_SDS_FLR_RQI.json')));
let t=fs.readFileSync(process.argv[2],'utf8');try{t=JSON.parse(t).result}catch(e){}
const __a=JSON.parse(t.slice(t.indexOf("[{"),t.lastIndexOf("}]")+2))[0].a;const lines=typeof __a==="string"?JSON.parse(__a):__a;
let c={pp:0,ff:0,fp:0,pf:0};const fp=[];for(const l of lines){const o=OLD(l),n=NEW(l);if(NEW(l)!==NEWJ(l))throw 'joint differs';c[(o?'p':'f')+(n?'p':'f')]++;if(!o&&n)fp.push(l);}
console.log('database REASSERTED lines',lines.length,'old pass/new pass',c.pp,'fail/fail',c.ff,'fail->pass',c.fp,'pass->fail',c.pf);
for(const l of fp)console.log('  F->P:',l.slice(0,260));
const P={
 'sol #10 form':'REASSERTED IN [CR4] "So the seed of David is "made" of a woman, as Matthew 1:16 "of whom" traces." The retained...',
 'curly inner':'REASSERTED IN [CR4] “So the seed is “made” of a woman.”',
 'normal':'REASSERTED IN CR3 "the house of his fathers" stands.',
 'short quote then later quote (W1 limit)':'REASSERTED IN [CR4] "abc" and later "something else".',
 'no closing mark':'REASSERTED IN [CR4] "So the seed of David is made of a woman',
 'apostrophe only after open':'REASSERTED IN [CR4] "the fathers\' house is kept here',
 'quote over two lines':'REASSERTED IN [CR4] "So the seed of\nDavid is made" ok',
 'two lines, inner quote':'REASSERTED IN [CR4] "So the "seed" of\nDavid is made" ok',
 'no round':'REASSERTED "So the seed of David is "made" of a woman."',
 'negated':'It is not REASSERTED IN [CR4] "So the seed of David is "made" of a woman."',
};
for(const [k,v] of Object.entries(P))console.log(k.padEnd(42),'old',OLD(v),'new',NEW(v));
console.log('negated, no inner quote (pre-existing):','old',OLD('It is not REASSERTED IN [CR4] "the house of his fathers."'),'new',NEW('It is not REASSERTED IN [CR4] "the house of his fathers."'));
{const big='REASSERTED IN [CR4] "'+'ab"c '.repeat(20000);const t0=Date.now();NEW(big);OLD(big);console.log('100 KB worst-case line, ms',Date.now()-t0);}
