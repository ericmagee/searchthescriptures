// pkgKCMF (W3 grade_33083, LIVE false charge): the grouped K-CMT item cures when every contested line is answered on K-CMTL.
// Run from wall2024/: node pkgKCMF/build_KCMF.cjs [base, default pkgRCLN] [out, default pkgKCMF]. Base pkgRCLN = the stack live in 2a23bc90 (via pkgLIB).
// Run 33083 gemini: the 6 K-CMTL items (one per contested grade line) were all CURED, each with its own Commitment N, but gemini also wrote a
// bare grouped "RESPONSE: K-CMT | Accepted mark; commitments supplied for all contested lines." That own RESPONSE names no Commitment N, and it
// blocks pkgKCL's fallback (the joined K-CMTL answers), so the LIVE grouped item stayed UNCURED and gemini was not counted.
// Fix: after the cure items are read, a grouped K-CMT item still UNCURED is CURED when the same cure has K-CMTL items and every one of them is
// CURED. It never uncures anything; with no K-CMTL items the K-CMT result is as before.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const HELP="function kcmf2024(v){try{const L=(v||[]).filter(y=>y&&y.rule==='K-CMTL');if(!L.length||L.some(y=>y.status!=='CURED'))return v;\n"
+" return v.map(x=>x&&x.rule==='K-CMT'&&x.status==='UNCURED'?{...x,status:'CURED',why:'every contested line is answered on K-CMTL ('+L.length+' line'+(L.length>1?'s':'')+', each naming its commitment or NOT A GRADE); the grouped RESPONSE alone named none (pkgKCMF, W3 grade_33083)'}:x);}catch(e){return v;}} /* pkgKCMF */\n";
const A1="return items.map(x=>{const res=(status,why,lines,kinds)=>{";const A1N="return kcmf2024(items.map(x=>{const res=(status,why,lines,kinds)=>{";
const A2="return res('UNCURED','unknown rule',null);}).concat(krulRestated(items,reply,R));";const A2N="return res('UNCURED','unknown rule',null);}).concat(krulRestated(items,reply,R))); /* pkgKCMF */";
const BASE=(process.argv[2]||'pkgRCLN')+'/patched';const OUT=process.argv[3]||'pkgKCMF';const plan={base:BASE,nodes:[]};fs.rmSync(OUT+'/patched',{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 const k1=t.split(A1).length-1,k2=t.split(A2).length-1;if(k1!==k2||k1>1)throw new Error(f+' anchors '+k1+' '+k2);
 if(k1){const i=t.indexOf('function cureVerdicts(');if(i<0)throw new Error(f+' cureVerdicts');t=t.slice(0,i)+HELP+t.slice(i);t=t.replace(A1,()=>A1N).replace(A2,()=>A2N);ed.push('kcmf2024 after the cure items');}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_KCMF.json',JSON.stringify(plan,null,1));console.log(plan.nodes.filter(n=>n.edits.length).length+' nodes edited of '+plan.nodes.length);
