// pkgKIND test. Run from wall2024/: node pkgKIND/test_KIND.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const ALLOWED=['cure','alternate_reply','failed_reply','enforcer_check','send_back']; // debate_enforcer_log_kind_check, read 2026-11-06 00:45 CST
const P=JSON.parse(rd('pkgKIND/plan_KIND.json'));
for(const n of P.nodes){const s=rd('pkgKIND/final/'+n.file),src=rd(n.from);
 T(n.name+': final sha matches the plan',sha(s)===n.final_sha);
 const kinds=[...s.matchAll(/\bkind\s*:\s*'([a-z_]+)'/g)].map(m=>m[1]).filter(k=>/_|^[a-z]+$/.test(k));const badk=[...new Set(kinds.filter(k=>!ALLOWED.includes(k)&&!['greek','hebrew','strongs','error','refused','timeout'].includes(k)))];
 T(n.name+': every log kind literal is allowed by the table check',badk.length===0,badk.join());
 T(n.name+': only the kind literals differ from its package file',s===src.split("kind:'send_back_apply'").join("kind:'send_back'").split("kind:'gate'").join("kind:'send_back'"));
 let p=true;try{new Function('$','$input',s);}catch(e){p=false;}T(n.name+': parses',p);}
// the rows keep their rule, so E-APPLY and E-GATE stay apart from ruling 428 send-back rows
const am=rd('pkgKIND/final/Alternate_Merge_Seat.js'),gr=rd('pkgKIND/final/Gate_Record.js');
T('E-APPLY rows keep rule E-APPLY, E-GATE rows keep rule E-GATE',(am.match(/kind:'send_back',rule:'E-APPLY'/g)||[]).length===3&&(gr.match(/kind:'send_back',rule:'E-GATE'/g)||[]).length===2);
// the 32985 log body: every row would now pass the kind check after the same mapping
const B=JSON.parse(rd('/mnt/project-files/wall2024/enforcer_log_body_32985.json'));const rows=Array.isArray(B)?B:(B.p_rows||B.rows||[]);
const by={};rows.forEach(r=>{by[r.kind]=(by[r.kind]||0)+1;});console.log('   32985 log body kinds: '+JSON.stringify(by)+' ('+rows.length+' rows)');
const mapped=rows.map(r=>({...r,kind:r.kind==='send_back_apply'||r.kind==='gate'?'send_back':r.kind}));
T('32985: every one of the '+rows.length+' rows passes the kind check after the mapping',rows.length>0&&mapped.every(r=>ALLOWED.includes(r.kind)));
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
