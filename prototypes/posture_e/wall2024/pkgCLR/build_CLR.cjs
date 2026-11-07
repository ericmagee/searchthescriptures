// pkgCLR build (W1 work item 1 replacement, Wall 2701): pkgKSC reads the defender CONCEDED LINKS entries through the shared reader CLR
// (the label line plus its unlabelled continuation lines, every stored entry form; 99% of 176 stored count lines named exactly, against 77%).
// Three edits per KSC copy (5 copies), on pkgKSCL's output:
//  (1) the CLR library is placed before the KSC library;
//  (2) conceded(t) takes the counted entries of CLR.read(t,'DEFENDER') (a "D n" or "LINK n" names a link; a premise keeps its own "(LINK n" label);
//  (3) counts() maps a premise through the [DR2] list first, then through its own LINK label; and the cure reads a CHANGE TO count line through CLR.
// Run from wall2024/: node pkgCLR/build_CLR.cjs [in workflow JSON] [out workflow JSON]   (default in: pkgKSCL/out/workflow_KSCL.json = s12 + pkgKSCL)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const IN=process.argv[2]||'pkgKSCL/out/workflow_KSCL.json',OUTW=process.argv[3]||'pkgCLR/out/workflow_CLR.json';
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);
const lib=fs.readFileSync('pkgCLR/clr.cjs','utf8');const LIB=lib.slice(lib.indexOf('const CLR=(()=>{'),lib.indexOf('})();',lib.indexOf('const CLR=(()=>{'))+5)+' /* pkgCLR */\n';
const K0='const KSC=(()=>{';
const C0="const conceded=t=>{let c=null;for(const raw of String(t||'').split('\\n')){if(/^\\s*\\[/.test(raw))continue;const e=entries(raw);if(e)c={e,line:raw.trim()};}return c;};";
const C1="const clrE=r=>r.counted.filter(x=>x.ref!=='C').map(x=>({kind:x.ref==='LINK'||x.ref==='D'?'LINK':'PREMISE',num:x.num,tag:x.tag,own:x.link!=null&&x.link!=='none'?x.link:null})); /* pkgCLR */\n const conceded=t=>{const r=CLR.read(t,'DEFENDER');return r?{e:clrE(r),line:r.line+(r.cont?' (+'+r.cont+' line'+(r.cont>1?'s':'')+')':'')}:null;}; /* pkgCLR: label line + continuation lines */";
const N0="const counts=(e,n,pm)=>{for(const x of e||[]){const lk=x.kind==='LINK'?x.num:(pm&&pm[x.num]!=null?pm[x.num]:null);if(lk===n)return {...x,link:lk,via:x.kind==='LINK'?'LINK '+x.num:'Premise '+x.num+' = LINK '+lk+' ([DR2] list)'};}return null;};";
const N1="const counts=(e,n,pm)=>{for(const x of e||[]){const dm=x.kind==='PREMISE'&&pm&&pm[x.num]!=null;const lk=x.kind==='LINK'?x.num:(dm?pm[x.num]:(x.own!=null?x.own:null));if(lk===n)return {...x,link:lk,via:x.kind==='LINK'?'LINK '+x.num:'Premise '+x.num+' = LINK '+lk+(dm?' ([DR2] list)':' (its own LINK label)')};}return null;}; /* pkgCLR: [DR2] list first, then the premise's own label */";
const E0="const e=entries(to);if(e){";
const E1="const rr=CLR.read(to,'DEFENDER');const e=rr?clrE(rr):entries(to);if(e){ /* pkgCLR */";
const plan={base:IN,base_sha:sha(fs.readFileSync(IN,'utf8')),nodes:[]};
for(const n of w.nodes){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes(K0))continue;
 for(const [a,nm] of [[K0,'KSC'],[C0,'conceded'],[N0,'counts'],[E0,'cure entries']]){const k=s0.split(a).length-1;if(k!==1)throw new Error(n.name+': '+nm+' anchor found '+k+' times');}
 if(/\bconst CLR\b/.test(s0))throw new Error(n.name+': CLR already present');
 const s=s0.replace(K0,()=>LIB+K0).replace(C0,()=>C1).replace(N0,()=>N1).replace(E0,()=>E1);new Function('$','$input','$json','$execution',s);
 const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgCLR/base/'+f,s0);fs.writeFileSync('pkgCLR/patched/'+f,s);n.parameters.jsCode=s;plan.nodes.push({node:n.name,base_sha:sha(s0),final_sha:sha(s)});}
if(plan.nodes.length!==5)throw new Error('expected 5 KSC copies, found '+plan.nodes.length);
fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgCLR/plan_CLR.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(p=>p.node.padEnd(28)+p.base_sha+' -> '+p.final_sha).join('\n'));
