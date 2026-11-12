// test_BRS: C4P new-verse lists (ofD defender, of challenger) on every stored run, parent vs pkgBRS, plus planted forms.
// Usage: node test_BRS.cjs <parent json> <pkg json> <prompts file>...
const fs=require('fs');
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflow||j;const c=j.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
 const i0=c.indexOf('const REFP'),i1=c.indexOf('C4P=(()=>{'),i2=c.indexOf('return {',i1);const end=c.indexOf('})();',i2)+5;return new Function(c.slice(i0,end)+'\nreturn C4P;')();};
const A=load(process.argv[2]),B=load(process.argv[3]);const show=o=>JSON.stringify({fresh:[...o],named_earlier:o.u||[]});
let fail=0;const plant=(name,F,f,want)=>{const a=A[f](F),b=B[f](F);const got=[...b];const ok=JSON.stringify(got)===JSON.stringify(want);if(!ok)fail++;console.log(ok?'PASS':'FAIL',name,'| parent',show(a),'| pkg',show(b));};
const E={cr1:'',gr1:'',cr2:'',gr2:'',cr3:'',dr3:''};
plant('sentence-initial bare ref, verse named earlier in another book',{...E,cr1:'Matthew 1:18 tells the birth.',cr4:'Paul writes in 1 Corinthians 1:17 of the preaching. 1:18 places the word of the cross.'},'ofD',['1 Corinthians 1:17']);
plant('control: book written out stays new',{...E,cr1:'Matthew 1:18 tells the birth.',cr4:'1 Corinthians 1:18 places the word of the cross.'},'ofD',['1 Corinthians 1:18']);
plant('bare ref, verse never named earlier: still new',{...E,cr1:'Matthew 1:18 tells the birth.',cr4:'Paul writes in 1 Corinthians 1:17 of the preaching. 1:23 names Christ crucified.'},'ofD',['1 Corinthians 1:17','1 Corinthians 1:23']);
plant('KNOWN MISS: bare ref to a new verse whose chapter:verse was named earlier in another book',{...E,cr1:'Matthew 1:23 names Emmanuel.',cr4:'Paul writes in 1 Corinthians 1:17 of the preaching. 1:23 names Christ crucified.'},'ofD',['1 Corinthians 1:17']);
const R={};for(const f of process.argv.slice(4))Object.assign(R,require('../pkgCNP/rounds.cjs')(f));let d=0;
for(const k in R)for(const f of ['ofD','of']){const a=show(A[f](R[k])),b=show(B[f](R[k]));if(a!==b){d++;console.log('CHANGE',k,f,'\n   parent',a,'\n   pkg   ',b);}}
console.log('stored runs',Object.keys(R).length,'changed lists',d,'| planted fails',fail);
