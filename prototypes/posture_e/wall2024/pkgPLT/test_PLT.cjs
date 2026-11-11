// pkgPLT test (W2): Judge Enforcer Build (and Alt, R2 Alt) live s116 vs candidate on stored executions and on inputs/ runs; prints every differing item text.
const fs=require('fs');process.chdir(__dirname+'/..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const W='/mnt/project-files/wall2024/';const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+'parent_s116_PLT.json');const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};const LA=ld(A),LB=ld(B);
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
const NODES=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
const items=o=>{const t=S(o);return [...t.matchAll(/ITEM P\d+ \(E-PREM[\s\S]*?(?=ITEM [A-Z]\d+ \(|$)/g)].map(m=>m[0]);};
let runs=0,eq=0,dif=0;
const cmp=async(label,run,st)=>{for(const n of NODES){const ip=preds(n).find(p=>st?st[p]:H.out(run,p));if(!ip)continue;let a,b;try{a=await H.run(LA(n),run,ip,st?mk(st):{});b=await H.run(LB(n),run,ip,st?mk(st):{});}catch(e){console.log(label,n,'ERROR',String(e.message).slice(0,120));continue;}
 runs++;const T=s=>s.replace(/"at":"[^"]+"/g,'"at":0');const sa=T(S(a)),sb=T(S(b));if(sa===sb){eq++;continue;}dif++;const x=sa.replace(/\\n/g,'\n').replace(/\\"/g,'"'),y=sb.replace(/\\n/g,'\n').replace(/\\"/g,'"');
 const xa=x.split(/(?=ITEM [A-Z]\d+ \()/),ya=y.split(/(?=ITEM [A-Z]\d+ \()/);console.log('DIFF',label,n,'items',xa.length,ya.length);
 for(let i=0;i<Math.max(xa.length,ya.length);i++)if(xa[i]!==ya[i]){const h=(ya[i]||'').match(/^ITEM [^\n]*\nTHE LIST ENTRY: [^\n]{0,90}/);console.log('  ',h?h[0].replace(/\n/g,' | '):(ya[i]||'').slice(0,150));const bl=s=>{const m=(s||'').match(/THE ANSWERING SIDE'S LINK-ROUND BLOCK FOR IT[^:]*: ([^\n]{0,90})/);return m?m[1]:'?';};console.log('     live:',bl(xa[i]));console.log('     cand:',bl(ya[i]));}}};
(async()=>{for(const id of ['34780','34726','34703','34626','34299']){const f=W+'ex'+id+'_full.json';if(!fs.existsSync(f))continue;const ex=JSON.parse(fs.readFileSync(f,'utf8'));const r=(ex.data||ex).resultData.runData;const st={};for(const [n,rs] of Object.entries(r)){const l=rs[rs.length-1];st[n]=(l&&l.data&&l.data.main)||null;}await cmp('ex'+id,'x'+id,st);}
 const ins=[...new Set(fs.readdirSync(H.IN).filter(f=>/Judge_Enforcer_Build\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();for(const r of ins)await cmp('in'+r,r,null);
 console.log('node runs',runs,'equal',eq,'differ',dif);})();
