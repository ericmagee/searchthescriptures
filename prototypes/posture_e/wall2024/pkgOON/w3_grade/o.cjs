const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const load=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};
const LIVE=load('/mnt/project-files/wall2024/fetchback_live_s113.json'),CAND=load('/mnt/project-files/wall2024/parent_s113_OON.json');
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const r=(ex.data||ex).resultData.runData;const base={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];base[n]=(last&&last.data&&last.data.main)||null;}
const J=o=>JSON.parse(JSON.stringify(o));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
async function go(edit){const o=Object.assign({},base);if(edit){for(const [n,f] of Object.entries(edit)){o[n]=J(base[n]);f(o[n]);}}const run=mk(o);
 const a=(await H.run(LIVE('Gate Build'),'x34726','Reread Record',run)).map(x=>x.json);const b=(await H.run(CAND('Gate Build'),'x34726','Reread Record',run)).map(x=>x.json);return {a,b};}
const seatOf=j=>j.seat||j.who;const na=j=>(j.items||[]).filter(x=>/NOT APPLIED|E-APPLY/.test(JSON.stringify([x.kind,x.src,x.rule])));
const sum=arr=>arr.map(j=>seatOf(j)+': items '+(j.items||[]).length+', E-APPLY '+(j.items||[]).filter(x=>/E-APPLY/.test(String(x.src||x.rule||x.kind))).length).join(' | ');
module.exports={go,sum,J,base,seatOf};
if(require.main===module)(async()=>{const {a,b}=await go();console.log('keys',Object.keys(a[0]).join(','));console.log('item keys',Object.keys(a[0].items[2]||{}).join(','),JSON.stringify(a[0].items[2]).slice(0,300));console.log('LIVE',sum(a));console.log('CAND',sum(b));
 for(let i=0;i<a.length;i++)console.log(seatOf(a[i]),'equal',JSON.stringify(a[i])===JSON.stringify(b[i]));})();
