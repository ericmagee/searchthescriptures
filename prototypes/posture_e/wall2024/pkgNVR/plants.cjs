// pkgNVR: planted lines through psGrades, live s130 vs NVR. Expected grade per premise written beside each plant.
const L=require('/mnt/project-files/w4/kwn/lib.cjs');
const ps=w=>{const x=L(w);const def=name=>{const i=x.Lb.findIndex(l=>new RegExp('function '+name+'\\b').test(l));let j=i,src='';while(j<x.Lb.length){src+=x.Lb[j]+'\n';try{new Function(src);return src;}catch(e){j++;}}};let src=def('psGrades');for(let k=0;k<20;k++){try{const f=new Function(src+';return psGrades;')();f('CONCEDED LINKS: 0 -- x');return f;}catch(e){const m=String(e.message).match(/(\w+) is not defined/);src=def(m[1])+src;}}};
const A=ps('/tmp/claude-0/live_now.json'),B=ps(process.argv[2]||'/tmp/claude-0/parent_s130_NVR.json');
const H='CHALLENGER CONCEDED LINKS: 0 -- ';
const P=[
 [H+'Premise 4 is not void.',{4:'SPARED'}],
 [H+'Premise 4 is NOT VOID and is spared.',{4:'SPARED'}],
 [H+'Premise 4 is never void.',{4:'SPARED'}],
 [H+'Premise 4 is not unexhibited.',{4:'SPARED'}],
 [H+'Premise 4 is not conceded.',{4:'SPARED'}],
 [H+'Premise 4 is not counted.',{4:'SPARED'}],
 [H+'Premise 4 VOID.',{4:'VOID'}],
 [H+'Premise 4 UNEXHIBITED.',{4:'COUNTED'}],
 [H+'Premise 4 is void, not spared.',{4:'VOID'}],
 [H+'Premises 1 through 6 are spared.',{1:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'SPARED'}],
 [H+'premises 2 to 4 are spared; premise 5 VOID.',{2:'SPARED',3:'SPARED',4:'SPARED',5:'VOID'}],
 [H+'Premises 1 through 6 are spared; premise 4 is not void.',{1:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'SPARED'}],
 [H+'Premises 1-6 are spared.',{1:'SPARED',2:'SPARED',3:'SPARED',4:'SPARED',5:'SPARED',6:'SPARED'}],
 [H+'Premise 2 VOID; premises 3 through 5 UNEXHIBITED.',{2:'VOID',3:'COUNTED',4:'COUNTED',5:'COUNTED'}],
 [H+'Premise 3 is not voided through its props.',{}],
 [H+'Premise 5 is not VOID: "reverses" paraphrases the quote. Premise 6 VOID.',{5:'SPARED',6:'VOID'}],
];
let ok=0,fixed=0,bad=0;for(const [l,e] of P){const a=A(l).g,b=B(l).g;const E=JSON.stringify(e),sa=JSON.stringify(a),sb=JSON.stringify(b);const r=sb===E?(sa===E?'OK (both)':'FIXED'):'WRONG';if(r==='WRONG')bad++;else if(r==='FIXED')fixed++;else ok++;console.log(r.padEnd(10),l.slice(H.length),'| live',sa,'| NVR',sb);}
console.log('plants',P.length,'both right',ok,'fixed by NVR',fixed,'NVR wrong',bad);
