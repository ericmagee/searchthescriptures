const L=require('/mnt/project-files/w4/kwn/lib.cjs');const P='/mnt/project-files/wall2024/';
const N=L(P+'parent_s120_F1F2r2_EHF2.json'),F=L(P+'parent_s120_F1F2r2.json'),E=L(P+'parent_s120_EHF2.json'),S=L(P+'fetchback_live_s120.json'),J=L(P+'joint_s120_VP1B_KWN_G4Mr2_EHF2.json'),J0=L(P+'joint_s120_VP1B_KWN_G4Mr2.json');
const ld=(a,b)=>{const o=[];for(let i=0;i<Math.max(a.Lb.length,b.Lb.length);i++)if(a.Lb[i]!==b.Lb[i])o.push(i);return o;};
const tot=x=>x.w.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
const strip=x=>JSON.stringify({...x.w,nodes:x.w.nodes.map(n=>n.name==='Shared Library'?{...n,parameters:{...n.parameters,jsCode:null}}:n),versionId:null,meta:null});
console.log('Lb lengths N F E S',N.Lb.length,F.Lb.length,E.Lb.length,S.Lb.length);
const dNF=ld(N,F),dES=ld(E,S);console.log('lib lines N vs F',dNF.join(','),'| E vs S',dES.join(','));
console.log('changed lines identical text N==E at those lines',dNF.every(i=>N.Lb[i]===E.Lb[i]),'| F==S at those lines',dNF.every(i=>F.Lb[i]===S.Lb[i]));
console.log('N vs F outside Shared Library jsCode equal',strip(N)===strip(F),'| connections equal',JSON.stringify(N.w.connections)===JSON.stringify(F.w.connections));
const mk=Object.keys({...N.M,...F.M});const md=mk.filter(k=>JSON.stringify(N.M[k])!==JSON.stringify(F.M[k]));console.log('MAP entries differing N vs F',md.join(' ; '));
console.log('MAP p arrays equal N vs F',mk.every(k=>JSON.stringify(N.M[k]&&N.M[k].p)===JSON.stringify(F.M[k]&&F.M[k].p)));
md.forEach(k=>console.log(' ',k,'n N',N.M[k].n,'F',F.M[k].n,'| E',E.M[k].n,'S',S.M[k].n,'| N-F',N.M[k].n-F.M[k].n,'E-S',E.M[k].n-S.M[k].n,'| eff len N',N.code(k).length)); 
const nodes=N.w.nodes.map(n=>n.name);let bad=0;nodes.forEach(n=>{const a=N.code(n),b=F.code(n);if(a===b)return;const e=E.code(n),s=S.code(n);if(e===s){bad++;console.log('UNEXPECTED diff',n);}});console.log('nodes whose effective code differs N vs F only where E differs from S; unexpected',bad);
const dNJ=ld(N,J),dFJ0=ld(F,J0);console.log('N vs joint-EHF2 lib lines',dNJ.length,'| F vs three-part joint',dFJ0.length,'| same set',JSON.stringify(dNJ)===JSON.stringify(dFJ0));
console.log('code total N-S',tot(N)-tot(S),'F-S',tot(F)-tot(S),'E-S',tot(E)-tot(S),'J-S',tot(J)-tot(S));
{const d=ld(N,J);console.log('VP1B lines',d.join(','),'N==F there',d.every(i=>N.Lb[i]===F.Lb[i]),'J==J0 there',d.every(i=>J.Lb[i]===J0.Lb[i]));
const sn=x=>JSON.stringify({...x.w,nodes:x.w.nodes.map(n=>({...n,parameters:{...n.parameters,jsCode:null}})),versionId:null,meta:null});console.log('non-code JSON N==S',sn(N)===sn(S));}
{const R=require('../pkgLIB/runner_model.cjs');let bad=0,chk=0;for(const x of N.w.nodes){if(!(x.parameters&&x.parameters.jsCode)||x.name==='Shared Library')continue;chk++;const st=R.needs(x.parameters.jsCode),eff=R.needs(N.code(x.name));const miss=[...eff.nodes].filter(m=>!st.all&&!st.nodes.has(m));const lv=R.needs(S.w.nodes.find(z=>z.name===x.name).parameters.jsCode);if(miss.length||!st.parsed||JSON.stringify([...st.nodes].sort())!==JSON.stringify([...lv.nodes].sort()))bad++;}console.log('runner: code nodes',chk,'fail',bad);}
