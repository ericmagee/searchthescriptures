// W2: strip_KCB = my stack strip_FCDKNL5 with W3's A3 -> A4 in every file that has the K-S3 reading; nothing else differs.
const fs=require('fs');const W=__dirname+'/../..';const src=fs.readFileSync(W+'/pkgKCB/build_KCB.cjs','utf8');
const grab=n=>{const i=src.indexOf('const '+n+'=String.raw`')+('const '+n+'=String.raw`').length;return src.slice(i,src.indexOf('`;\n',i));};const A3=grab('A3'),A4=grab('A4');
let n=0,ch=0,bad=0;for(const f of fs.readdirSync(W+'/pkgLIB/strip_FCDKNL5/patched')){const s=fs.readFileSync(W+'/pkgLIB/strip_FCDKNL5/patched/'+f,'utf8'),k=fs.readFileSync(W+'/pkgLIB/strip_KCB/patched/'+f,'utf8');n++;
 const exp=s.includes(A3)?(ch++,s.split(A3).join(A4)):s;if(exp!==k){bad++;console.log('DIFF '+f);}}
console.log(n+' files; '+ch+' with the K-S3 line changed; '+bad+' differ from (my stack + A3->A4)');process.exit(bad?1:0);
