const fs=require('fs');const D='/mnt/project-files/wall2024/';
const C=JSON.parse(fs.readFileSync(D+'parent_s120_ACX.json'));const g=n=>C.nodes.find(x=>x.name===n).parameters.jsCode;
const ex=s=>{const i=s.indexOf('const __ACX=');const j=s.indexOf('\n',s.indexOf('/* pkgACX */'));return s.slice(i,s.indexOf('})',j)+300)};
const a=g('Panel Build'),b=g('Build Independent Verdict');
const h=s=>{const i=s.indexOf('const __ACX=');let k=s.indexOf('\n const',i);return s.slice(i,i+2500)};
console.log(h(a));console.log('IDENT first2500',h(a)===h(b));
console.log('uses of __ACX in PB:',(a.match(/__ACX/g)||[]).length,'BIV',(b.match(/__ACX/g)||[]).length);
for(const m of a.matchAll(/__ACX\(/g))console.log('PB use:',a.slice(m.index-120,m.index+80).replace(/\n/g,' '));
for(const m of b.matchAll(/__ACX\(/g))console.log('BIV use:',b.slice(m.index-120,m.index+80).replace(/\n/g,' '));
for(const nm of ['Close Enforcer Record','Anticheat Record']){console.log('=====',nm);console.log(g(nm))}
