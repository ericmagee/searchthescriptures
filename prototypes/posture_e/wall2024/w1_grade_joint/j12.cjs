// W1 grade of joint_s119_VP1B_KWN_G4Mr2.json: J1 structure and size, J2 runner literal $() reads
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const R=require('../pkgLIB/runner_model.cjs');
const P='/mnt/project-files/';const S=L(P+'wall2024/fetchback_live_s119.json'),J=L(P+'wall2024/joint_s119_VP1B_KWN_G4Mr2.json');
const V=L(P+'w3/parent_s119_VP1B_r2.json'),K=L(P+'wall2024/parent_s119_F1.json'),G=L(P+'wall2024/parent_s119_F2r2.json');
const W=x=>x.w.data?x.w.data:x.w;
const code=w=>w.nodes.reduce((a,x)=>a+((x.parameters&&x.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,x)=>{const p=Object.assign({},x.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
console.log('J1 code',code(S.w),'->',code(J.w),'=',code(J.w)-code(S.w),'| VP1B',code(V.w)-code(S.w),'KWN',code(K.w)-code(S.w),'G4M',code(G.w)-code(S.w),'| prompt',prm(J.w)-prm(S.w));
console.log('J1 connections equal',JSON.stringify(S.w.connections)===JSON.stringify(J.w.connections),'nodes',S.w.nodes.length,J.w.nodes.length);
const n=Math.max(S.Lb.length,J.Lb.length);const dl=[];for(let i=0;i<n;i++)if(S.Lb[i]!==J.Lb[i])dl.push(i);console.log('J1 library lines differ',dl.join(','),'| lib length',S.Lb.length,J.Lb.length);
for(const i of dl){const src=[V,K,G].filter(x=>x.Lb[i]!==S.Lb[i]);console.log('  line',i,'changed by',src.length,'package(s); equals that package line',src.length===1&&src[0].Lb[i]===J.Lb[i]);}
console.log('J1 MAP equal',JSON.stringify(S.M)===JSON.stringify(J.M));
let eqN=0,difN=[],other=[];for(const x of J.w.nodes){if(x.type!=='n8n-nodes-base.code'&&!(x.parameters&&x.parameters.jsCode))continue;const a=S.code(x.name),b=J.code(x.name);if(a===b)eqN++;else difN.push(x.name);
 const y=S.w.nodes.find(z=>z.name===x.name);if(x.name!=='Shared Library'&&JSON.stringify(x)!==JSON.stringify(y))other.push(x.name);}
console.log('J1 effective sources equal',eqN,'differ',difN.length,'| node objects differ (not library)',other.length?other.join(','):'none');
fs.writeFileSync(__dirname+'/differ_nodes.json',JSON.stringify(difN));
let bad=0,chk=0;for(const x of J.w.nodes){if(!(x.parameters&&x.parameters.jsCode)||x.name==='Shared Library')continue;chk++;
 const st=R.needs(x.parameters.jsCode),eff=R.needs(J.code(x.name));const miss=[...eff.nodes].filter(m=>!st.all&&!st.nodes.has(m));
 const live=R.needs(S.w.nodes.find(z=>z.name===x.name).parameters.jsCode);const same=JSON.stringify([...st.nodes].sort())===JSON.stringify([...live.nodes].sort());
 if(miss.length||!st.parsed||!same){bad++;console.log('J2 FAIL',x.name,'missing',miss,'parsed',st.parsed,'same as live',same);}}
console.log('J2 code nodes checked',chk,'fail',bad);
{let pd=0,nb=0;for(const k of new Set([...Object.keys(S.M),...Object.keys(J.M)])){if(JSON.stringify((S.M[k]||{}).p)!==JSON.stringify((J.M[k]||{}).p))pd++;if(J.M[k]&&J.M[k].n!==J.code(k).length)nb++;}
console.log('J1 MAP: part lists differ',pd,'| n (length) not equal to rebuilt source',nb,'(only the n lengths change with the edited lines)');}
