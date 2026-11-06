// pkgMK test. Run from wall2024/: node pkgMK/test_MK.cjs. Citation Scan (base vs patched) on the rounds of runs 33083 and 33060, then the live
// Quote Compare on the KJV rows of every cited chapter (pkgMK/kjv_rows.json, read from kjv_verses). Lists every status change.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {scan}=require(__dirname+'/cs_run.cjs');let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgMK/plan_MK.json'));T('plan: base and final shas match',sha(rd('pkgMK/base/Citation_Scan.js'))===plan.base_sha&&sha(rd('pkgMK/patched/Citation_Scan.js'))===plan.final_sha);
const rows=JSON.parse(rd('pkgMK/kjv_rows.json'));const QC=rd('pkgMK/base/Quote_Compare.js');
const compare=cs=>new Function('$','$input','$json',QC)(n=>{if(n==='Citation Scan')return {first:()=>({json:cs})};if(n==='Cited Verses')return {all:()=>rows.map(r=>({json:r}))};throw new Error(n);},null,{})[0].json;
const res={};
for(const run of ['33083','33060']){const a=compare(scan('pkgMK/base/Citation_Scan.js',run)),b=compare(scan('pkgMK/patched/Citation_Scan.js',run));
 const ka=i=>i.side+' '+i.round+' '+i.ref+' @'+(i.at!=null?i.at:'')+' '+String(i.quote).slice(0,50);
 console.log('   '+run+': '+a.items.length+' items base, '+b.items.length+' patched');const ch=[];
 b.items.forEach((y,k)=>{const x=a.items[k];if(!x||x.status!==y.status||x.ref!==y.ref)ch.push((x?x.status:'none')+' -> '+y.status+' | '+y.side+' '+y.round+' '+y.ref+' | '+String(y.quote).slice(0,170));});
 ch.forEach(c=>console.log('     '+c));res[run]={a,b,ch};}
const c83=res['33083'].ch;
T('33083: the Oracle\'s (CHALLENGER) Isaiah 8:8 [R3, R4] and Matthew 1:23 [R3] margin-note quotations go from PENDING (reported WORDING DIFFERS) to MATCHES',['Isaiah 8:8','Matthew 1:23'].every(r=>c83.some(c=>/^PENDING/.test(c)&&/-> MATCHES/.test(c)&&c.includes('CHALLENGER R3 '+r)))&&c83.filter(c=>c.includes('CHALLENGER R4 Isaiah 8:8')&&/-> MATCHES/.test(c)).length>=1);
T('every change in both runs is a non-match becoming MATCHES (nothing that matched is lost)',Object.values(res).every(r=>r.ch.every(c=>/-> MATCHES/.test(c)&&!/^MATCHES/.test(c))));
T('same number of items in both runs',Object.values(res).every(r=>r.a.items.length===r.b.items.length));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
