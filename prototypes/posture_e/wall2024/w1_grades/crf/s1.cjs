const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');
const unw=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflow||j;const t='/tmp/claude-0/_u_'+require('path').basename(p);fs.writeFileSync(t,JSON.stringify(j));return t;};
const A=LIB(unw('/mnt/project-files/wall2024/fetchback_live_s135.json')),B=LIB(unw('/mnt/project-files/wall2024/parent_s135_CRFb.json'));
const code=W=>W.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
console.log('code',code(A.w),code(B.w),code(B.w)-code(A.w),'| connections equal',JSON.stringify(A.w.connections)===JSON.stringify(B.w.connections),'| settings equal',JSON.stringify(A.w.settings)===JSON.stringify(B.w.settings));
const ma=Object.fromEntries(A.w.nodes.map(n=>[n.name,n]));const ch=[];for(const n of B.w.nodes){const o=ma[n.name];if(!o){ch.push('NEW '+n.name);continue}if(JSON.stringify(o)!==JSON.stringify(n))ch.push(n.name+' ('+((n.parameters.jsCode||'').length-(o.parameters.jsCode||'').length)+')')}
console.log('nodes changed',ch.length,ch.join(', '));
// library line diff
const dl=[];const N=Math.max(A.Lb.length,B.Lb.length);for(let i=0;i<N;i++)if(A.Lb[i]!==B.Lb[i])dl.push(i);console.log('library lines',A.Lb.length,B.Lb.length,'changed',dl);
for(const i of dl){const a=A.Lb[i]||'',b=B.Lb[i]||'';let s=0;while(s<a.length&&a[s]===b[s])s++;let e=0;while(e<a.length-s&&e<b.length-s&&a[a.length-1-e]===b[b.length-1-e])e++;console.log('L'+i,'len',a.length,'->',b.length,'\n  OLD: '+a.slice(Math.max(0,s-120),a.length-e+40)+'\n  NEW: '+b.slice(Math.max(0,s-120),b.length-e+40));}
// stub rebuilds
const names=Object.keys(B.M);let same=0,diff=[];for(const n of names){const x=A.code(n),y=B.code(n);if(x===y)same++;else{ // apply the same edits to x
 diff.push(n)}}console.log('stubs',names.length,'same',same,'differ',diff.length,diff.join(', '));
// map entries other than n identical?
let mo=[];for(const n of names){const a=JSON.stringify({...A.M[n],n:0}),b=JSON.stringify({...B.M[n],n:0});if(a!==b)mo.push(n)}console.log('map entries differing beyond n:',mo.length);
// stub n equals rebuilt length?
let bad=[];for(const n of names){if(B.M[n].n!==undefined&&B.M[n].n!==B.code(n).length)bad.push(n+' '+B.M[n].n+'/'+B.code(n).length)}console.log('stub n != rebuilt length:',bad.length,bad.slice(0,5));
fs.writeFileSync('/tmp/claude-0/crf_dl.json',JSON.stringify(dl));
