// pkgRP8 (reader phase 2, item 8, W3, 11-08): STATEMENT / RESPONSE reads. kconUnlabel (the K-CON / K-W contradiction cure: strips a RESPONSE or
// STATEMENT label so the NOT HELD / CONTRADICTION / REASSERTED IN test sees the answer) asks the shared reader first: a line the reader reads as
// STATEMENT (which RESPONSE or STATEMENT) gives its answer text f.text; any other line keeps the old regex (kconUnlabel0).
// respOf is NOT swapped: its labels already come from the reader (cureLines pushes o.response from R.form==='STATEMENT', f.item), so its
// .includes tests compare reader fields, not raw judge text (inventory second pass row "respOf", item 8).
// Run from wall2024/: node pkgRP8/build_RP8.cjs [base strip] [dest strip]   (default base pkgLIB/strip_RI6)
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI6').replace(/\/$/,'')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RP8').replace(/\/$/,'')+'/patched/';
const A='function kconUnlabel(l){return String(l';
const B="/* pkgRP8 (reader item 8): a RESPONSE or STATEMENT line as the shared reader reads it gives its answer text; any other line keeps the old read */\n"
 +"function kconUnlabel(l){try{const r=__RL.readLine(String(l==null?'':l).trim());if(r&&r.form==='STATEMENT'&&r.f&&!r.f.restated&&typeof r.f.text==='string'&&r.f.text.trim())return r.f.text;}catch(e){}return kconUnlabel0(l);}\n"
 +"function kconUnlabel0(l){return String(l";
fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const n=s.split(A).length-1;
 if(n>1)throw new Error(f+': anchor x'+n);
 if(n===1){if(!s.includes('const __RL='))throw new Error(f+': no reader');s=s.replace(A,()=>B);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgRP8/plan_RP8.json',JSON.stringify(plan,null,1)+'\n');console.log(Object.keys(plan.nodes).length+' nodes patched');
