// W2: run the alternate seating chain of stored 34726 on a given engine file (default s116), each node fed the chain's own earlier outputs; stored call replies kept.
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');const S=JSON.stringify;
const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const A=wf(process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s116.json');
const by={};A.nodes.forEach(n=>by[n.name]=n);const src=n=>{const c=by[n].parameters.jsCode;return /^\/\/ pkgLIB stub/.test(c)||c.includes('\nreturn await new Function(')?rebuild(c,by['Shared Library'].parameters.jsCode):c;};
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34726_full.json','utf8'));const r=(ex.data||ex).resultData.runData;const st={};for(const [n,runs] of Object.entries(r)){const l=runs[runs.length-1];st[n]=(l&&l.data&&l.data.main)||null;}
const stored=JSON.parse(S(st));const mk=o=>new Proxy(o,{has:()=>true,get:(t,k)=>k in t?t[k]:null});
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const chain=(process.env.CHAIN||'Alternate Payloads,Alternate Cure Build,Alternate Cure Normalize,Alternate Merge Seat,Alt Seated').split(',');
(async()=>{for(const n of chain){if(!by[n]){console.log(n,'not in engine');continue;}const ps=preds(n).filter(p=>st[p]);const ip=ps[0];if(!ip){console.log(n,'no stored input');continue;}
 let o;try{o=await H.run(src(n),'x34726',ip,mk(st));}catch(e){console.log(n,'ERROR',String(e.message).slice(0,200));continue;}
 const eq=S(o.map(z=>z.json)).replace(/"at":"[^"]+"/g,'')===S((stored[n]||[[]])[0].map(z=>z.json)).replace(/"at":"[^"]+"/g,'');st[n]=[o];console.log(n,'(input',ip+')','equal to stored:',eq);}
 const m=(st['Alternate Merge 1']||[[]])[0][0];const j=m&&m.json||{};console.log('panel_effective',S(j.panel_effective),'| substitution',S(j.substitution).slice(0,300),'| alt_needed',j.alt_needed);
 const g=(st['Alt Gate Record']||[[]])[0][0];const gj=g&&g.json||{};for(const x of (gj.gate_rows||[]))if(x.cure_status!=='CURED')console.log('UNCURED',x.seat,x.item,String(x.cure_reason).slice(0,200));
 const s0=(stored['Alternate Merge 1']||[[]])[0][0];console.log('STORED panel_effective',S(s0&&s0.json.panel_effective),'| substitution',S(s0&&s0.json.substitution).slice(0,300));
})();
// appended: compare Alternate Merge Seat outputs, s116 vs stored, field by field
