// pkgUNXA (W3 2721, 2727): K-UNX-A, TRIAL, side-neutral. Run from wall2024/: node pkgUNXA/build_UNXA.cjs
// Bases: the 6 gate-library nodes are built on pkgPSG/patched (s16 + GSL + PSG, the next two writes); the other 16 on live s16 (fetchback_live_s16.json).
// If PSG fails its grade, rebuild with BASE6=pkgGSL/patched; if GSL is not written either, BASE6=s16. The edits are anchor-based and hold on all three.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {patch}=require('./patch.cjs');const BASE6=process.env.BASE6||'pkgPSG/patched';
const SIX=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s16.json','utf8'));const LIVE=(W.data||W).nodes;
const NODES=LIVE.filter(n=>/function kunxLines/.test(n.parameters&&n.parameters.jsCode||'')).map(n=>n.name);
const CA="  if(x.rule==='K-UNX'){const st=stmtOf(x);const nm=";
const CB="  // pkgUNXA (TRIAL; W3 2721, 2727): an ASSUMES or unanswered item is cured by a STATEMENT that quotes the block's [L1] (6 words in a row, all of it when\n"
 +"  // shorter) and says what that verse lacks for the step (a negation outside the quotation), or by a CORRECTED COUNT below the count read. Naming a layer, or a KEEP, does not cure it.\n"
 +"  if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);const bare=String(st||'').replace(/[\"“][^\"”]*[\"”]/g,' ');const q=st&&x.l1&&UNX_MRUN(st,x.l1,6);const lack=/\\b(?:not|no|lacks?|lacking|without|silent|never|nothing|none|neither|nor)\\b/i.test(bare);\n"
 +"   if(q&&lack)return res('CURED','TRIAL rule (K-UNX-A): the STATEMENT quotes the block\\'s [L1] '+(x.l1ref||'')+' and says what it lacks',['STATEMENT: '+st]);\n"
 +"   const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX-A): CORRECTED COUNT '+cs[0].n+' takes the premise out of the count',cs.map(c=>c.line));\n"
 +"   return res('UNCURED','TRIAL rule (K-UNX-A): '+(!st?'no STATEMENT for the item':!q?'the STATEMENT does not quote the block\\'s [L1] '+(x.l1ref||''):'the STATEMENT quotes the [L1] but says nothing it lacks')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);}\n"
 +CA;
const plan={rulings:'W3 2721, 2727 (TRIAL, side-neutral)',base6:BASE6,base16:'live s16 (fetchback_live_s16.json, 7efcffc7)',nodes:[]};fs.mkdirSync('pkgUNXA/patched',{recursive:true});
for(const n of NODES){const f=n.replace(/ /g,'_')+'.js';const s0=SIX.includes(n)?fs.readFileSync(BASE6+'/'+f,'utf8'):LIVE.find(z=>z.name===n).parameters.jsCode;
 let s=patch(s0);const done=['lib','kunxLines'];const c=s.split(CA).length-1;if(c>1)throw new Error(n+': cure anchor x'+c);if(c===1){s=s.replace(CA,()=>CB);done.push('cure');}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgUNXA/patched/'+f,s);
 plan.nodes.push({name:n,file:f,base:SIX.includes(n)?BASE6:'s16',base_sha:sha(s0),final_sha:sha(s),edits:done});console.log(n.padEnd(28),(SIX.includes(n)?BASE6:'s16').padEnd(16),sha(s0),'->',sha(s),done.join(','));}
fs.writeFileSync('pkgUNXA/plan_UNXA.json',JSON.stringify(plan,null,1));console.log(NODES.length+' nodes');
