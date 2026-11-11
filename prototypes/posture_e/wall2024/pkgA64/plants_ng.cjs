// W2: pkgA1N (O1NF) checks: the pointer test on planted answers, and the AU lines of s128 kept.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const lib=W=>JSON.parse(W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode.split('\n/*LIB*/')[1].split('\n/*MAP*/')[0]);
const A=lib(g('/mnt/project-files/wall2024/fetchback_live_s128.json')),B=lib(g('pkgA64/parent_s128_A64_O1NG.json'));
for(const s of ["const __ga=String(g.answer).replace(/\\\\+\"/g,'\"');","pkgEAF A: served for every answer","__eg(eaiBlock(R,__erk,__ga))"])console.log('AU text kept:',JSON.stringify(s.slice(0,40)),A.some(l=>l.includes(s)),B.some(l=>l.includes(s)));
console.log('lines changed:',B.map((l,i)=>l!==A[i]?i:-1).filter(i=>i>=0).join(', '),'| line count',A.length,B.length);
const line=B.find(l=>l.includes('pkgA1N'));const re=new RegExp(line.match(/matchAll\(\/(.*?)\/gi\)/)[1],'gi');
const P=[["This is the naming answered under link 3.",["3"]],["I answer it fully under LINK 4.",["4"]],["carried by the woman (Link 5).",["5"]],["See under link 2 and under Link 6.",["2","6"]],["(link 2) and again (Link 2)",["2"]],["It fits Link 1 and Link 2.",[]],["My link 3 stands.",[]],["linking 3 verses",[]],["under link3",[]],["under  Link\n7",["7"]]];
let bad=0;for(const [t,w] of P){const got=[...new Set([...t.matchAll(re)].map(m=>m[1]||m[2]))];const ok=JSON.stringify(got)===JSON.stringify(w);if(!ok)bad++;console.log(ok?'OK  ':'FAIL',JSON.stringify(t),'->',JSON.stringify(got));}
console.log('plants',P.length,'fail',bad);
