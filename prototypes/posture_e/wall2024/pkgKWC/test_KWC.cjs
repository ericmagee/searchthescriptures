// pkgKWC test. Run from wall2024/: node pkgKWC/test_KWC.cjs
const fs=require('fs'),path=require('path'),os=require('os');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {execFileSync}=require('child_process');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(fs.readFileSync('pkgKWC/plan_KWC.json','utf8'));
T('19 nodes; base and final shas match',plan.nodes.length===19&&plan.nodes.every(n=>sha(fs.readFileSync(n.base+'/'+n.file,'utf8'))===n.base_sha&&sha(fs.readFileSync('pkgKWC/patched/'+n.file,'utf8'))===n.final_sha));
const R=new Function('return '+fs.readFileSync('pkgKWC/patched/Panel_Cure_Check.js','utf8').match(/const kwCo=t=>(\/.*?\/)\.test/)[1])();
const R0=new Function('return '+fs.readFileSync('pkgKGW/patched/Panel_Cure_Check.js','utf8').match(/const kwCo=t=>(\/.*?\/)\.test/)[1])();
[["33149 chatgpt: \"Fact: the claim. CONCEDED in that form: [DR3] drops it\"",1],["CONCEDED: x",1],["x. CONCEDED.",1],["CONCEDED -- x",1],["x. CONCEDED for the narrowed claim — y",1],
 ["33149-class sol: \"x. CONCEDED as an independently sufficient limb.\" (no colon or dash)",0],["\"That limb is CONCEDED; x\" (mid-sentence)",0],["CONCEDED LINKS: 1",0],["5 words then a colon: \"x. CONCEDED in part and limited to this: y\"",0],["lowercase prose: \"the point is conceded: y\"",0]]
 .forEach(([t,w])=>{const s=t.replace(/^[^"]*"|"[^"]*$/g,'')||t;T('kwCo '+(w?'reads ':'does not read ')+t,R.test(s)===!!w);});
const all=plan.nodes.map(n=>fs.readFileSync('pkgKWC/patched/'+n.file,'utf8').match(/const kwCo=t=>.*?\.test\(String\(t\)\);/)[0]);T('one kwCo text in all 19 nodes',new Set(all).size===1);
const D=fs.mkdtempSync(path.join(os.tmpdir(),'kwc'));fs.mkdirSync(D+'/patched');for(const f of fs.readdirSync('pkgKGW/patched'))fs.copyFileSync('pkgKGW/patched/'+f,D+'/patched/'+f);for(const f of fs.readdirSync('pkgKWC/patched'))fs.copyFileSync('pkgKWC/patched/'+f,D+'/patched/'+f);
for(const r of ['33040','33060','33083','33107','33129','33149']){const s=execFileSync('node',['corpus/regrade_run.cjs',r,'pkgKGW',D]).toString();const b=s.slice(s.indexOf('BASE'),s.indexOf('PATCHED')).split('\n').slice(1).join('\n').trim(),p=s.slice(s.indexOf('PATCHED')).split('\n').slice(1).join('\n').trim();
 if(r==='33149')T('33149 replay: chatgpt K-W CHALLENGER DR3 LINK 5 cured, DR3 LINK 1 stays uncured; nothing else changes',/chatgpt +HELD +drv_uncured 1 .*\[K-W CHALLENGER DR3 LINK 1 #1\]/.test(p)&&b.split('\n').filter(l=>!/chatgpt/.test(l)).join()===p.split('\n').filter(l=>!/chatgpt/.test(l)).join());
 else T(r+' replay: unchanged from live (pkgKGW)',b===p);}
console.log('\n'+ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
