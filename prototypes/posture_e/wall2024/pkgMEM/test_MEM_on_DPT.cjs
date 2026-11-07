// pkgMEM stacked on pkgDPT/patched (6 gate and merge nodes): each file is its DPT base plus the same MEM edits, and replays like the live-based build.
const fs=require('fs');let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?' :: '+x:''));c?ok++:bad++;};
const {harness,feeder}=require('../pkgGSL/harness.cjs');const FB='/mnt/project-files/wall2024/fetchback_live_s39.json';
const D='pkgMEM/patched_on_pkgDPT_patched/',B='pkgDPT/patched/';const strip=s=>s.replace(/function prdTok\(f,t\)\{[^\n]*\n/,'').replace('.map((x,__k)=>({','.map(x=>({').replace("prompt_sent:__k?prdTok('prompt_sent',ps):ps,full_reply:__k?prdTok('full_reply',full):full,","prompt_sent:ps,full_reply:full,");
for(const f of fs.readdirSync(B)){const p=fs.readFileSync(D+f,'utf8'),b=fs.readFileSync(B+f,'utf8');let s=strip(p);
 if(f==='Alternate_Merge_Seat.js')s=s.replace("return [{json:{...PP,enforcer_log,sb_apply,bodies","return [{json:{...PP,enforcer_log,sb_apply,enforcer_log_body:{p_debate_id:PP.debate_id||null,p_run_token:S.run_token,p_rows:enforcer_log},bodies");
 if(f==='Alternate_Merge.js'){s=s.replace("enforcer_log:(AM.enforcer_log||[]).concat(__rk)}}];","enforcer_log:(AM.enforcer_log||[]).concat(__rk),enforcer_log_body:{...__b,p_rows:(Array.isArray(__b.p_rows)?__b.p_rows:(AM.enforcer_log||[])).concat(__rk)}}}];").replace("enforcer_log:log,alt_apply}}];","enforcer_log:log,enforcer_log_body:{...(AM.enforcer_log_body||{}),p_rows:log},alt_apply}}];");}
 T('S '+f+': undoing the MEM edits gives the DPT base byte for byte',s===b);}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';fs.writeFileSync('pkgMEM/test_MEM_on_DPT.txt',txt);console.log(txt);process.exit(bad?1:0);
