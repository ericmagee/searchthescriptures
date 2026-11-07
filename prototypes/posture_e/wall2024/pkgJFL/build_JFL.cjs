// pkgJFL node edits (W3 spec Wall 2632 part 3; Eric approved 17:21 CST 2026-11-06). Run from wall2024/: node pkgJFL/build_JFL.cjs
// Bases: Panel Build, Reserve Build, Alternate Build from pkgBAR/patched (3086eb8, after pkgIMP); Init Seats from pkgJFL/base (live 57c7fffd
// export; n18 to n21 and pkgBAR do not touch it). The PART2 last line "Repeated offenses will result in disqualification." is in pkgBAR (W1).
//  1. Panel Build: each judge's user turn starts with its own model's ledger block (model_config_jfl.jfl_block, read from Fetch Models by seat).
//     Reserve Build and Alternate Build copy the removed slot's user turn: they strip that slot's block and put in their own seat's block.
//  2. Init Seats: a seat whose model is at ALTERNATE (6 runs of one fault kind; model_config_jfl.jfl_move, read from Accept Models) goes to the
//     end of the panel order: it takes no panel place and is not the reserve while three unmoved seats remain; it stays in the alternate pool.
//     Output jfl_moved (the moved seats) for the run report.
//  The HTTP nodes Accept Models and Fetch Models read model_config_jfl instead of model_config (see http_JFL.json). The SQL (jfl.sql) goes first.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgJFL/patched';fs.mkdirSync(OUT,{recursive:true});const plan={base:'live 1b49671d (pkgBAR in) + pkgFCB 7b8640b for Panel Build and Alternate Build',nodes:[]};
const rep=(s,a,b,f)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(f+': anchor '+n+': '+a.slice(0,70));return s.replace(a,()=>b);};
const save=(f,base,s0,s,edits)=>{new Function('$','$input','$json','$execution',s);fs.writeFileSync(OUT+'/'+f,s);plan.nodes.push({file:f,base,base_sha:sha(s0),final_sha:sha(s),edits});console.log(f.padEnd(28),sha(s0),'->',sha(s),'edits',edits);};
// the helper Panel, Reserve and Alternate Build share
const H="/* pkgJFL (W3 2632 part 3; Eric 17:21 CST): the judge fault ledger block of a seat's own model (model_config_jfl.jfl_block), first in its user turn; a copied user turn loses the block of the seat it came from */\n"
 +"const __JFL_RE=/\\[\\[JUDGE FAULT LEDGER\\]\\][\\s\\S]*?\\[\\[END JUDGE FAULT LEDGER\\]\\]\\n\\n/g;\n"
 +"const __JFL=k=>{try{const r=$('Fetch Models').all().map(i=>i.json).find(x=>x&&x.seat===k);return (r&&typeof r.jfl_block==='string')?r.jfl_block:'';}catch(e){return '';}};\n"
 +"const __JFLX=(u,k)=>__JFL(k)+String(u).replace(__JFL_RE,'');\n";
// ---- 1. the block ----
for(const n of ['Panel Build','Reserve Build','Alternate Build']){const f=n.replace(/ /g,'_')+'.js';const B=(n==='Reserve Build')?'pkgBAR/patched':'pkgFCB/patched'; /* rebased (W3 2667): Panel Build and Alternate Build on the pkgFCB finals; Reserve Build on pkgBAR/patched (= live 1b49671d) */const s0=fs.readFileSync(B+'/'+f,'utf8');let s=s0;let e=0;
 if(n==='Panel Build'){s=rep(s,"const judges=RS.judges.map(j0=>{",H+"const judges=RS.judges.map(j0=>{",f);
  s=rep(s,"const user='DEBATE TRANSCRIPT\\n\\n'+T;","const user=__JFL(j.seat)+'DEBATE TRANSCRIPT\\n\\n'+T;",f);e+=2;}
 if(n==='Reserve Build'){s=rep(s,"const JIDX0={deepseek:0",H+"user=__JFLX(user,RS.reserve.seat);\nconst JIDX0={deepseek:0",f);e+=1;}
 if(n==='Alternate Build'){s=rep(s,"const PP=$input.first().json;const P=$('Panel Build').first().json;",H+"const PP=$input.first().json;const P=$('Panel Build').first().json;",f);
  s=rep(s," used.push(a.api_model);"," used.push(a.api_model);user=__JFLX(user,a.seat);",f);e+=2;}
 save(f,B,s0,s,e);}
// ---- 2. Init Seats ----
{const f='Init_Seats.js';const B='pkgJFL/base';const s0=fs.readFileSync(B+'/'+f,'utf8');let s=s0;
 s=rep(s,"const pfree=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));",
  "/* pkgJFL (W3 2632 part 3; Eric 17:21 CST): a seat whose model has 6 runs of one fault kind in the judge fault ledger (model_config_jfl.jfl_move) moves from the panel to the alternates: it goes to the end of the panel order, so it takes no panel place and is not the reserve while three unmoved seats remain */\n"
  +"const JFL_MOVED=(()=>{try{return new Set($('Accept Models').all().map(i=>i.json).filter(x=>x&&x.seat&&x.jfl_move===true).map(x=>x.seat));}catch(e){return new Set();}})();\n"
  +"const pfree0=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const pfree=pfree0.filter(s=>!JFL_MOVED.has(s)).concat(pfree0.filter(s=>JFL_MOVED.has(s)));",f);
 s=rep(s,"const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null;","const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0&&!JFL_MOVED.has(pfree[3]))?pfree[3]:null;",f);
 s=rep(s,"agreement_out:AGREE_OUT,","agreement_out:AGREE_OUT,jfl_moved:[...JFL_MOVED],",f);
 save(f,B,s0,s,3);}
fs.writeFileSync('pkgJFL/plan_JFL.json',JSON.stringify(plan,null,1));
