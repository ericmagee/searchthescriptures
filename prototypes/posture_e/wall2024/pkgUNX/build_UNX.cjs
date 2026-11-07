// pkgUNX (W3 2676, 2677, 2683): K-UNX, TRIAL, side-neutral. Base: the live nodes of e3030157 (fetchback_live_s10.json; run 33218: PTA A, LNX, FCB, RSA, RFL, JFL, GRA, KSC, L2R). The bases are kept in pkgUNX/base/.
// Run from wall2024/: node pkgUNX/build_UNX.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const LIB=fs.readFileSync('pkgUNX/unx_lib.js','utf8');const RSA=['Gate Build','Gate Record','Alt Gate Build','Alt Gate Record','Alternate Merge Seat','Alternate Merge'];
const FB='/mnt/project-files/wall2024/fetchback_live_s10.json';const LIVE=JSON.parse(fs.readFileSync(FB,'utf8')).nodes; // live e3030157 (run 33218), W3 2683 condition 1 and the 33218 write
const liveCode=n=>{const x=LIVE.find(z=>z.name===n);if(!x)throw new Error('not live: '+n);return x.parameters.jsCode||x.parameters.functionCode;};
const FCB=JSON.parse(fs.readFileSync('pkgFCB/plan_FCB.json','utf8')).nodes.map(n=>n.name);
const E={
 lib:["const KR_LINE=",LIB+"const KR_LINE=",1],
 drvP:["for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)marks.push(x);}","for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)marks.push(x);\n  {const UX=kunxLines(WT,PT);for(const x of UX.items)DRV.items.push(x);for(const x of UX.marks)marks.push(x);}} // pkgUNX: K-UNX (TRIAL)",1],
 drvX:["for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)raw+='\\n\\n'+x;}","for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)raw+='\\n\\n'+x;\n  {const UX=kunxLines(raw0,PT);for(const x of UX.items)DRV.items.push(x);for(const x of UX.marks)raw+='\\n\\n'+x;}} // pkgUNX: K-UNX (TRIAL)",1],
 enf:["'K-FC':'TRIAL',","'K-FC':'TRIAL','K-UNX':'TRIAL',",1],
 lst:["x.rule==='K-FC'||","x.rule==='K-FC'||x.rule==='K-UNX'||",3],
 cure:["if(x.rule==='K-LB'){const st=stmtOf(x);",
  "// pkgUNX K-UNX (TRIAL; W3 2676): cured by a STATEMENT for the item that names a layer the block does not exhibit, or by a CORRECTED COUNT for the\n"
 +"  // side below the count the item read (the premise taken out of the count; its fit is then graded at the collision, ruling 411).\n"
 +"  if(x.rule==='K-UNX'){const st=stmtOf(x);const nm=st?unxNamed(st,x.kinds).missing:[];if(nm.length)return res('CURED','TRIAL rule (K-UNX): the STATEMENT names a layer the block does not exhibit ([L'+nm.join('], [L')+'])',['STATEMENT: '+st]);\n"
 +"   const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX): CORRECTED COUNT '+cs[0].n+' takes the premise out of the count',cs.map(c=>c.line));\n"
 +"   return res('UNCURED','TRIAL rule (K-UNX): '+(st?'the STATEMENT names no layer the block lacks':'no STATEMENT for the item')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);}\n"
 +"  if(x.rule==='K-LB'){const st=stmtOf(x);",1],
 prm:["CONCEDED LINKS: <integer> -- the count of challenger-listed premises the defender CONCEDED or failed to exhibit its layer footing in [CR3]",
  "CONCEDED LINKS: <integer> -- the count of challenger-listed premises the defender CONCEDED or failed to exhibit its layer footing in [CR3] (UNEXHIBITED means a layer is missing: a premise you count UNEXHIBITED whose link-round block exhibits two or more layers names the layer it lacks, [L1], [L2], [L3] or [L4]; when its layers are there and you judge that its answer does not fit, grade that at its collision with a FORCED line and do not count it; K-UNX, a TRIAL check, reads this for both counts)",1]};
const plan={rulings:'W3 2676, 2677 (TRIAL, side-neutral)',nodes:[]};fs.mkdirSync('pkgUNX/base',{recursive:true});fs.mkdirSync('pkgUNX/patched',{recursive:true});
for(const n of FCB){const f=n.replace(/ /g,'_')+'.js';const base='live e3030157';const s0=liveCode(n);let s=s0;const done=[];
 for(const [k,[a,b,cnt]] of Object.entries(E)){if(k==='lib'&&!s0.includes('function kfLines'))continue;const c=s.split(a).length-1;if(!c)continue;if(c!==cnt)throw new Error(n+' '+k+': anchor x'+c+' (want '+cnt+')');s=s.split(a).join(b);done.push(k);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgUNX/base/'+f,s0);fs.writeFileSync('pkgUNX/patched/'+f,s);plan.nodes.push({name:n,file:f,base,base_sha:sha(s0),final_sha:sha(s),edits:done});
 console.log(n.padEnd(28),base.padEnd(15),sha(s0),'->',sha(s),done.join(','));}
fs.writeFileSync('pkgUNX/plan_UNX.json',JSON.stringify(plan,null,1));
