const fs=require('fs');
const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).result;const a0=R.indexOf('\n[{"j":')+1,a1=R.lastIndexOf(']\n</untrusted')+1;const F=JSON.parse(R.slice(a0,a1))[0].j;
const mk=f=>{const c=JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='C4 Extract').parameters.jsCode;const i=c.indexOf('const REFP'),j=c.indexOf('const C4P');const mm=c.slice(j).match(/\n\s*return \{[^\n]*\};?\s*\}\)\(\);/);const k=j+mm.index+mm[0].length;return new Function(c.slice(i,j)+'\n'+c.slice(j,k)+'\nreturn C4P;')();};
const O=mk('../nrw/target.json'),N=mk('./target.json');
console.log('old',O.fresh([F.gr1,F.gr2,F.dr3],F.dr4));console.log('new',N.fresh([F.gr1,F.gr2,F.dr3],F.dr4));
const syn={gr1:'Luke 1:27 says espoused.',gr2:'',dr3:'',dr4:'Precept upon precept (Isaiah 28:10), the rows stand.\n- [L1] Isaiah 28:10 "precept must be upon precept" -- MEANS: x.\nLine upon line (Isa 28:13) and Romans 1:3.'};
console.log('syn old',O.fresh([syn.gr1],syn.dr4),'new',N.fresh([syn.gr1],syn.dr4));
