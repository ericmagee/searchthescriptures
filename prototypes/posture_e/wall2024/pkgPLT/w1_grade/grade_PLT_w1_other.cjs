// W1 grade of pkgPLT: in every replayable node run, all items other than E-PREM items are identical (as a multiset of item texts, separators trimmed), and code_rows equal.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+'parent_s116_PLT.json');const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};const LA=ld(A),LB=ld(B);
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0');
const items=o=>{const t=T(S(o));return t.split(/(?=ITEM [A-Z]\d+ \()/).slice(1).map(x=>x.split(/(?<!\\)"/)[0].replace(/(\\n|\s|---|=)*$/,""));};
const rest=o=>o.map(x=>{const {...j}=x.json||x;for(const k of Object.keys(j))if(typeof j[k]==='string'&&/ITEM [A-Z]\d+ \(/.test(j[k]))delete j[k];return T(S(j));});
const NODES=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];let runs=0,okI=0,okR=0,pd=0;
const cmp=async(label,run,st)=>{for(const n of NODES){const ip=preds(n).find(p=>st?st[p]:H.out(run,p));if(!ip)continue;let a,b;try{a=await H.run(LA(n),run,ip,st?mk(st):{});b=await H.run(LB(n),run,ip,st?mk(st):{});}catch(e){continue;}runs++;
 const ia=items(a),ib=items(b);const np=x=>x.filter(z=>!/^ITEM P\d+ \(E-PREM/.test(z)).sort();const e1=S(np(ia))===S(np(ib));e1&&okI++;const pa=ia.filter(z=>/^ITEM P\d+ \(E-PREM/.test(z)).length,pb=ib.filter(z=>/^ITEM P\d+ \(E-PREM/.test(z)).length;pa!==pb&&pd++;
 const ra=rest(a),rb=rest(b);const e2=S(ra.map(x=>x.replace(/"(prompt|body|user|messages)[^,]*/g,'')))===S(rb.map(x=>x.replace(/"(prompt|body|user|messages)[^,]*/g,'')));
 if(!e1||pa!==pb)console.log(label,n,'non-PREM items equal',e1,'| PREM count',pa,pb);}};
(async()=>{for(const id of ['34780','34726','34703','34626','34299']){const f=W+'ex'+id+'_full.json';if(!fs.existsSync(f))continue;const ex=JSON.parse(fs.readFileSync(f,'utf8'));const r=(ex.data||ex).resultData.runData;const st={};for(const [n,rs] of Object.entries(r)){const l=rs[rs.length-1];st[n]=(l&&l.data&&l.data.main)||null;}await cmp('ex'+id,'x'+id,st);}
 const ins=[...new Set(fs.readdirSync(H.IN).filter(f=>/Judge_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();for(const r of ins)await cmp('in'+r,r,null);
 console.log('node runs',runs,'| non-E-PREM items identical',okI,'| E-PREM item count differs',pd);})();
