// pkgEPK (W1 Wall 2758; scope W3 2759; TRIAL, enforcer fix, side-neutral). Send Back Build and Alt Send Back Build:
// (a) an E-PREM "(right: COUNTED ...)" push on a premise whose answering block exhibits 2 or more layer kinds, with a reason naming no layer the
//     block lacks (unxLack), is still sent with the enforcer's reason (ruling 428), and the engine adds the K-UNX count note (ruling 411).
// (b) a reason carrying a run of 6 words found in another judge's line (and not in this judge's own text or the debate record) is sent with
//     those words cut; the full reason is recorded on the item (reason_full). Eric: "record words only".
// The reader functions (ciRounds, lbBlockText, lbFoot, unxLack, gatePromptText2024 and what they use) are copied byte for byte from the
// stack's Gate Record (lib_extract.cjs), so no second reader is written. Base: live s25 (396a2d54).
// Run from wall2024/: npm ci --prefix pkgEPK; node pkgEPK/build_EPK.cjs [fetch-back]
const fs=require('fs'),path=require('path'),crypto=require('crypto');const {closure,decls}=require('./lib_extract.cjs');
const SRC=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s25.json';const OUT=path.join(__dirname,'out'),PAT=path.join(__dirname,'patched');[OUT,PAT].forEach(d=>fs.mkdirSync(d,{recursive:true}));
const W0=JSON.parse(fs.readFileSync(SRC,'utf8'));const W=W0.data||W0;const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const cnt=(s,a)=>s.split(a).length-1;
const GR=W.nodes.find(n=>n.name==='Gate Record').parameters.jsCode;if(!GR.includes('function unxLack('))throw new Error('base Gate Record has no unxLack (UNXW not in base)');
const LIB=closure(GR,['ciRounds','lbBlockText','lbFoot','unxLack','gatePromptText2024']);
const NOTE="A count of UNEXHIBITED must name the layer the block lacks (K-UNX). A failure of fit is graded at the collision (a FORCED line, ruling 411), not counted.";
const CUTMARK="[words from another judge's line cut: record words only (pkgEPK)]";
const A1="ksc:x.ksc||null,src:x}));";
const B1=A1+"\n /* pkgEPK (W1 2758; W3 2759; TRIAL) */{let PT9='';try{PT9=gatePromptText2024(j.body);}catch(e){}let R9={};try{R9=PT9?ciRounds(PT9):{};}catch(e){}\n"
+"  const NW9=s=>String(s==null?'':s).toLowerCase().replace(/[\\u2018\\u2019]/g,\"'\").replace(/[^a-z0-9' ]+/g,' ').replace(/'(?![a-z])|(?<![a-z])'/g,' ').replace(/\\s+/g,' ').trim(); /* a quote mark is not part of a word: 'of' = \"of\" */\n"
+"  const own9=' '+NW9(said[seat])+' ',rec9=' '+NW9(PT9)+' ',oth9=Object.keys(said).filter(s=>s!==seat).map(s=>' '+NW9(said[s])+' ');\n"
+"  for(const i of items){const rs=String(i.reason||'');\n"
+"   if(i.rule==='E-PREM'&&/\\(right:\\s*COUNTED/i.test(rs)){const m=String(i.item||'').match(/against the (challenger|defender)\\s+(\\d+)/i);if(m){const sd=m[1].toUpperCase();let k=[];try{const blk=lbBlockText(R9[sd==='CHALLENGER'?'DR3':'CR3'],+m[2]);k=blk?lbFoot(blk,true):[];}catch(e){k=[];}if(k.length>=2&&!unxLack(rs,k).missing.length)i.epk={side:sd,premise:+m[2],kinds:k};}}\n"
+"   const tk=rs.split(/(\\s+)/);const ix=[];tk.forEach((t,q)=>{if(/\\S/.test(t)&&NW9(t))ix.push(q);});const cutq=new Set();\n"
+"   const keep9=new Set();for(let a=0;a+6<=ix.length;a++){const ph=' '+ix.slice(a,a+6).map(q=>NW9(tk[q])).join(' ')+' ';if(own9.includes(ph)||rec9.includes(ph))ix.slice(a,a+6).forEach(q=>keep9.add(q));} /* words of the record or of this judge's own text are never cut */\n"
+"   for(let a=0;a+6<=ix.length;a++){const ph=' '+ix.slice(a,a+6).map(q=>NW9(tk[q])).join(' ')+' ';if(oth9.some(o=>o.includes(ph))&&!own9.includes(ph)&&!rec9.includes(ph))ix.slice(a,a+6).forEach(q=>{if(!keep9.has(q))cutq.add(q);});}\n"
+"   {let run=[];const flush=()=>{if(run.length<3)run.forEach(q=>cutq.delete(q));run=[];};ix.forEach(q=>{if(cutq.has(q))run.push(q);else flush();});flush();} /* a cut is 3 words or more; shorter leftovers next to record words stay */\n"
+"   if(cutq.size){const parts=[];const spans=[];let cur=null;tk.forEach((t,q)=>{if(cutq.has(q)){if(!cur){cur=[];parts.push(null);}cur.push(t);}else if(cur&&!/\\S/.test(t)&&cutq.has(q+1)){cur.push(t);}else{if(cur){spans.push(cur.join(''));cur=null;}parts.push(t);}});if(cur)spans.push(cur.join(''));\n"
+"    i.reason_full=rs;i.xcut=spans;i.reason=parts.map(p=>p===null?\""+CUTMARK.replace(/"/g,'\\"')+"\":p).join('');}}}\n";
const A2="+__kscR(i)).join('\\n\\n')";const B2="+__kscR(i)+(i.epk?'\\nTHE COUNT RULE (K-UNX, TRIAL, pkgEPK): "+NOTE.replace(/'/g,"\\'")+" You keep the decision.':'')).join('\\n\\n')";
const A3="ksc:i.ksc||null})),msg,body}});";const B3="ksc:i.ksc||null,epk:i.epk||null,reason_full:i.reason_full||null,xcut:i.xcut||null})),msg,body}});";
const plan={base:SRC,base_version:W.versionId||null,library:LIB.order,nodes:[]};let n9=0;
for(const n of W.nodes){if(!['Send Back Build','Alt Send Back Build'].includes(n.name))continue;let t=n.parameters.jsCode;const c0=t;
 const D=decls(t);for(const nm of LIB.order)if(D[nm])throw new Error(n.name+' already declares '+nm);
 for(const [a,b] of [[A1,B1],[A2,B2],[A3,B3]]){if(cnt(t,a)!==1)throw new Error(n.name+': anchor x'+cnt(t,a)+': '+a.slice(0,40));t=t.replace(a,()=>b);}
 t='// pkgEPK library: copied byte for byte from Gate Record ('+LIB.order.join(', ')+')\n'+LIB.text+'\n'+t;
 n.parameters.jsCode=t;n9++;const f=n.name.replace(/[^A-Za-z0-9]+/g,'_')+'.js';fs.writeFileSync(path.join(OUT,f),t);fs.writeFileSync(path.join(PAT,f),t);plan.nodes.push({name:n.name,file:f,base_sha:sha(c0),final_sha:sha(t)});}
if(n9!==2)throw new Error('expected 2 nodes, got '+n9);
fs.writeFileSync(path.join(OUT,'workflow_EPK.json'),JSON.stringify(W0));fs.writeFileSync(path.join(__dirname,'plan_EPK.json'),JSON.stringify(plan,null,1)+'\n');
console.log('pkgEPK: 2 nodes; library '+LIB.order.length+' declarations ('+LIB.text.length+' chars)');plan.nodes.forEach(x=>console.log('  '+x.name+' '+x.base_sha+' -> '+x.final_sha));
