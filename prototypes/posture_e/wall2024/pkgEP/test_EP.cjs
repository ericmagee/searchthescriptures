// pkgEP test. Run from wall2024/: node pkgEP/test_EP.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK  ':'FAIL')+' '+n);c?ok++:bad++;};const plan=JSON.parse(rd('pkgEP/plan_EP.json'));
T('2 nodes; base shas = pkgCM/patched, final shas = pkgEP/patched',plan.nodes.length===2&&plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgEP/patched/'+n.file))===n.final_sha));
const R=f=>{const t=rd(f);const i=t.indexOf('const RULES=')+12;let j=i;while((j=t.indexOf(';',j+1))>0){try{return new Function('return '+t.slice(i,j))();}catch(e){}}return null;};
for(const n of plan.nodes){const a=R(plan.base+'/'+n.file),b=R('pkgEP/patched/'+n.file);
 T(n.name+': RULES evaluates; it equals the base plus exactly the two new sentences',typeof b==='string'&&b.replace(/ An answer that quotes the verse's own words[^]*?"It fits the link"\./,'').replace(/ A NARROWED premise \(the side drops a claim[^]*?that still assert it\./,'')===a);
 const s=rd('pkgEP/patched/'+n.file),s0=rd(plan.base+'/'+n.file);const cut=s.replace(/ An answer that quotes the verse\\'s own words[^]*?"It fits the link"\./,'').replace(/ A NARROWED premise \(the side drops a claim[^]*?that still assert it\./,'');
 T(n.name+': the source minus the two new sentences is byte-identical to the base',cut===s0);}
T('E-ANS and E-PREM stay RECORD-ONLY TRIAL (the row text is unchanged)',plan.nodes.every(n=>{const s=rd('pkgEP/patched/'+n.file);return (s.match(/RECORD-ONLY TRIAL, ruling 428/g)||[]).length===(rd(plan.base+'/'+n.file).match(/RECORD-ONLY TRIAL, ruling 428/g)||[]).length;}));
console.log(ok+' OK, '+bad+' FAIL');
