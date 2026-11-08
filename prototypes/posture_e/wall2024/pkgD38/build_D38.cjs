// pkgD38 (W2, 11-08; W3 3087 ruling 2 and 3089): a gate check after the send-back. The count, keystone and collision grades must agree with the
// RULING cards and count grounds left in the judge's own text. Library layer on pkgLIB/strip_R1B (live s56 = LIB v15_R1B).
// Run from wall2024/: node pkgD38/build_D38.cjs  -> pkgLIB/strip_D38/patched (22 files) + pkgD38/plan_D38.json
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC='pkgLIB/strip_R1B/patched/',DST='pkgLIB/strip_D38/patched/';fs.mkdirSync(DST,{recursive:true});
const FN=fs.readFileSync('pkgD38/d38.js','utf8').trim();
const A1='function gateItems2024(seat,raw,F,its,ctx){';
const A2=" const NK=gateNewK2024(T0,T1,F,R1.fields,ctx);for(const x of NK.items)items.push({kind:'RULE '+x.rule,src:'K re-read',key:x.key,why:x.why,lines:x.lines,live:x.live&&GATE_STATUS.RULE==='LIVE'});\n";
const B2=A2+" for(const x of d38Items2024(T0,T1,raw))items.push({kind:'CONTRADICTION',src:'E-GATE D38',key:x.key,why:x.why,lines:x.lines,live:D38_STATUS[x.type]==='LIVE'}); /* pkgD38: last, so earlier gate ids keep their numbers */\n";
const plan={base:'pkgLIB/strip_R1B (LIB v15_R1B, live s56)',nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A1)){if(s0.split(A1).length!==2||s0.split(A2).length!==2)throw new Error(f+' anchors');s=s0.replace(A1,()=>FN+'\n'+A1).replace(A2,()=>B2);new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgD38/plan_D38.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
