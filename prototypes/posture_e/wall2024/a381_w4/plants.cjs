const fs=require('fs');const {lib,src,grabFn}=require('./stubs.cjs');
const pick=f=>{const {arr,M}=lib(f);const R={};for(const k of ['Gate Record','Send Back Record','Cure Check']){const s=src(arr,M[k].p);const fn=grabFn(s,'psGrades');const ri=s.indexOf('function ri3Head2024(');let ri3='';if(ri>=0){const j=s.indexOf('\n',s.indexOf('\n}',ri)+1);ri3=s.slice(ri,s.indexOf('function ',ri+10));}
 R[k]=new Function((/ri3Head2024/.test(fn)?ri3:'')+'\n'+fn+';return psGrades;')();}return R;};
const OLD=pick('rdf/fetchback_s262.json'),NEW=pick('a381/t381.json');
const H='CHALLENGER CONCEDED LINKS: 2 -- ',HD='DEFENDER CONCEDED LINKS: 2 -- ';
const plants=[
 ['38593 chatgpt line',H+'Premise 1 is NOT VOID but UNEXHIBITED because its proven press was left unmet; premise 2 is NOT VOID but UNEXHIBITED because its answers to its proven presses rely on absence.','{"1":"COUNTED","2":"COUNTED"}'],
 ['mirror, defender side',HD+'Premise 1 is NOT VOID but UNEXHIBITED because x; premise 2 is NOT VOID but UNEXHIBITED because y.','{"1":"COUNTED","2":"COUNTED"}'],
 ['plain not VOID',H+'Premise 1 is not VOID.','{"1":"SPARED"}'],
 ['no grade word after but',H+'Premise 1 is NOT VOID but, as pressed, the press is answered.','{"1":"SPARED"}'],
 ['not UNEXHIBITED but VOID',H+'Premise 1 is not UNEXHIBITED but VOID.','{"1":"VOID"}'],
 ['negated Y',H+'Premise 1 is NOT VOID but NOT COUNTED.','{"1":"SPARED"}'],
 ['but premise N (W2)',H+'Premise 1 is not counted but premise 2 is UNEXHIBITED.',null],
 ['Y then not X',H+'Premise 1 is UNEXHIBITED, not VOID.','{"1":"COUNTED"}'],
 ['comma before but, it is',H+'Premise 1 is not VOID, but it is UNEXHIBITED.','{"1":"COUNTED"}'],
 ['rather',H+'Premise 1 is never VOID but rather CONCEDED.','{"1":"COUNTED"}'],
];
let bad=0;for(const [nm,l,exp] of plants){for(const k of Object.keys(NEW)){const o=JSON.stringify(OLD[k](l).g),n=JSON.stringify(NEW[k](l).g);const ok=exp==null||n===exp;if(!ok)bad++;
 if(k==='Gate Record'||!ok||o!==JSON.stringify(OLD['Gate Record'](l).g))console.log((ok?'PASS':'FAIL'),'|',nm,'|',k,'| old',o,'| new',n,exp?'| want '+exp:'');}}
console.log(bad?'FAILURES '+bad:'ALL PLANTS PASS (3 variants)');
