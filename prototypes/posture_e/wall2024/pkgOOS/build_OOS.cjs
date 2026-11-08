// pkgOOS (W1, 11-08; 33731 grok S13, Wall 3238/3239): an E-OOR item (an OUT-OF-ROUND CONCESSIONS row that breaks its own rule, ruling 443)
// had no cure the engine could apply when the row should not be in the section at all: "(struck: ...)" has no line form, so it came back
// NOT APPLIED, and the judge's gate answer then rewrote the row into a duplicate grant (33731 G2).
//  1. Library (sbApply2024, 10 nodes): for an E-OOR item, CHANGE TO: STRUCK -- <why> (also "(struck: ...)", REMOVED, DELETED) strikes the
//     flagged row. A row that ends COUNTED is not struck (its count would go stale): the item comes back NOT APPLIED and names that.
//  2. Judge Enforcer Build (+ Alt, R2 Alt; not library): the link-round E-OOR reason names the strike form.
// Usage (from wall2024/): node pkgOOS/build_OOS.cjs [base strip, default pkgLIB/strip_A2R_KS3Q_FRP] [out strip, default pkgLIB/strip_A2R_KS3Q_FRP_OOS] [fetchback, default s63]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_A2R_KS3Q_FRP';const OUT=process.argv[3]||'pkgLIB/strip_A2R_KS3Q_FRP_OOS';const FB=process.argv[4]||'/mnt/project-files/wall2024/fetchback_live_s63.json';
const A="if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads',to,lines:[o]});continue;}";
const B="if(x.rule==='E-OOR'&&/^\\(?\\s*(?:STRUCK|STRIKE|REMOVED?|DELETED?)\\b/i.test(to)){const __c=map.has(o)?map.get(o).to:o; /* pkgOOS */\n   if(/\\bCOUNTED\\s*\\.?\\s*$/i.test(nrm(__c))){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the row ends COUNTED, so striking it would leave the count stale: write the whole CONCEDED LINKS line with its count, or the row without COUNTED (pkgOOS)',to,lines:[o]});continue;}\n   const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),oos:true});continue;}\n  "+A;
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,out:OUT,fetchback:FB,patched:[],copied:[],nodes:[]};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(BASE+'/patched/'+f,'utf8');const k=s.split(A).length-1;
 if(k>1)throw new Error(f+': anchor x'+k);const t=k?s.replace(A,()=>B):s;fs.writeFileSync(OUT+'/patched/'+f,t);(k?plan.patched:plan.copied).push({file:f,base_sha:sha(s),sha:sha(t)});}
const W=(()=>{const d=JSON.parse(fs.readFileSync(FB,'utf8'));return d.data||d;})();const NODES=W.nodes||W.workflow.nodes;
const NA=`'an OUT-OF-ROUND CONCESSIONS line names ['+rd+'], a link round; the section lists ground granted "OUTSIDE the two link rounds"'`;
const NB=`'an OUT-OF-ROUND CONCESSIONS line names ['+rd+'], a link round; the section lists ground granted "OUTSIDE the two link rounds". If the ground was granted in ['+rd+'], strike the row: CHANGE TO: STRUCK -- <one clause why>'`;
fs.mkdirSync('pkgOOS/out',{recursive:true});const upd=[];
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){const node=NODES.find(z=>z.name===n);if(!node)throw new Error('missing '+n);const s=node.parameters.jsCode;
 const k=s.split(NA).length-1;if(k!==1)throw new Error(n+': anchor x'+k);const t=s.replace(NA,()=>NB);const f='pkgOOS/out/'+n.replace(/ /g,'_')+'.js';fs.writeFileSync(f,t);upd.push({node:n,file:f});plan.nodes.push({node:n,base_sha:sha(s),sha:sha(t),file:f});}
fs.writeFileSync('pkgOOS/out/nodes_OOS.json',JSON.stringify({code_updates:upd},null,1));
fs.writeFileSync('pkgOOS/plan_OOS'+(OUT.endsWith('strip_A2R_KS3Q_FRP_OOS')?'':'_'+OUT.split('/').pop())+'.json',JSON.stringify(plan,null,1));
console.log('library patched',plan.patched.length,'copied',plan.copied.length,'nodes',plan.nodes.length);
