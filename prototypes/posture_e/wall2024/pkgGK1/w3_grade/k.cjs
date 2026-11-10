const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const load=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);const c={};return n=>c[n]||(c[n]=rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode));};
const W='/mnt/project-files/wall2024/';const SRC={LIVE:load(W+'fetchback_live_s113.json'),GK1:load(W+'parent_s113_GK1.json'),OON:load(W+'parent_s113_OON.json'),JOINT:load(W+'parent_s113_OON_GK1.json')};
const ex=JSON.parse(fs.readFileSync(W+'ex34726_full.json','utf8'));const r=(ex.data||ex).resultData.runData;const base={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];base[n]=(last&&last.data&&last.data.main)||null;}
const J=o=>JSON.parse(JSON.stringify(o));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
async function run(which,node,inp,store){return (await H.run(SRC[which](node),'x34726',inp,mk(store))).map(x=>x.json);}
const store=(edit)=>{const o=Object.assign({},base);for(const [n,f] of Object.entries(edit||{})){o[n]=J(base[n]);f(o[n]);}return o;};
const seatInfo=(g,seat)=>{const s=(g.gate.seats||[]).find(x=>x.seat===seat)||{};const body=(g.bodies||[]).find(b=>b&&(b.seat===seat||b.who===seat));return s;};
module.exports={run,store,base,J,seatInfo,SRC};
if(require.main===module)(async()=>{const a=(await run('LIVE','Gate Record','Gate Call openrouter',store()))[0];console.log('seats',JSON.stringify(a.gate.seats).slice(0,900));console.log('bodies keys',Object.keys(a.bodies[0]).join(',').slice(0,400));
 const st=out=>out.gate_rows.filter(x=>x.seat==='luna').reduce((c,x)=>{const k=x.rule+' '+x.cure_status;c[k]=(c[k]||0)+1;return c;},{});console.log('LIVE luna gate_rows',JSON.stringify(st(a)));
 const stored=base['Gate Record'][0][0].json;console.log('replay equals stored run output (gate, rows minus at):',JSON.stringify(a.gate)===JSON.stringify(stored.gate),JSON.stringify(a.gate_rows.map(x=>({...x,at:0})))===JSON.stringify(stored.gate_rows.map(x=>({...x,at:0}))));})();
