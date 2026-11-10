// pkgFUN rev 8 (W1): every labeled K-S3 answer the seats have planted, in one file (pkgFUN/rev8/corpus_FUN8.json): the allplants_FUN7 sets,
// W2's 287 (w2_testset_FUN7_287_narrow.txt), W3's KRO and KSL good/bad sets. good=true is a correct answer, good=false a refusal.
process.chdir(__dirname+'/..');const fs=require('fs');const src=fs.readFileSync('allplants_FUN7.cjs','utf8');
const head=src.slice(0,src.indexOf('const seen=')).replace(/^const LV=.*$/m,'').replace(/const pred=.*?;\s*\n/,'\n');
const S=new Function('require','__dirname',head.replace(/^.*?\nconst fs=require\('fs'\);const D=__dirname;/s,"const fs=require('fs');const D=__dirname;")+';return S;')(require,process.cwd());
const out=S.map(s=>({t:s.t,good:s.good,src:s.src}));
for(const l of fs.readFileSync('w2_testset_FUN7_287_narrow.txt','utf8').split('\n')){const m=l.match(/\|\s*exp\s+(CURED|UNCURED)\s.*?\s("(?:[^"\\]|\\.)*")\s*$/);if(m)out.push({t:JSON.parse(m[2]),good:m[1]==='CURED',src:'W2 287'});}
for(const [f,g] of [['../pkgKRO/w3_grade/w3_good_kro.json',true],['../pkgKRO/w3_grade/w3_good_kro2.json',true],['../pkgKRO/w3_grade/w3_bad_kro.json',false],['../pkgKRO/w3_grade/w3_bad_kro2.json',false],['../pkgKSL/w3_grade/w3_good_ksl.json',true],['../pkgKSL/w3_grade/w3_good_ksl2.json',true],['../pkgKSL/w3_grade/w3_bad_ksl.json',false],['../pkgKSL/w3_grade/w3_bad_ksl2.json',false],['../pkgKSL/w3_grade/w3_bad_ksl2b.json',false]])
 for(const t of JSON.parse(fs.readFileSync(f,'utf8')))out.push({t:typeof t==='string'?t:t.t||t[0],good:g,src:f.split('/').pop()});
const seen=new Map();for(const x of out){const o=seen.get(x.t);if(!o)seen.set(x.t,x);else if(o.good!==x.good){o.conflict=true;o.src+=' + '+x.src;}}
const U=[...seen.values()];fs.writeFileSync('rev8/corpus_FUN8.json',JSON.stringify(U,null,0));console.log(out.length+' planted, '+U.length+' distinct, '+U.filter(x=>x.conflict).length+' with labels that differ, '+U.filter(x=>x.good&&!x.conflict).length+' correct, '+U.filter(x=>!x.good&&!x.conflict).length+' refusals');
