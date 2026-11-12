const fs=require('fs');const S='/tmp/claude-0/-home-claude/ce829ea6-86e3-51b0-af44-4033b35f6682/scratchpad/r35554/';
const rd=f=>{try{return fs.readFileSync(S+f+'.txt','utf8');}catch(e){return 'x';}};
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s158_SJO.json'));
const code=j.nodes.find(n=>n.name==='Build Save Body').parameters.jsCode;
const FO={topic:'Topic',synthesis:'| Link | Grade | Note |\n| D1 | HELD | x |',cr1:rd('CR1'),gr1:rd('DR1'),cr2:rd('CR2'),gr2:rd('DR2'),cr3:rd('CR3'),dr3:rd('DR3'),cr4:rd('CR4'),dr4:rd('DR4'),gl:'guards',sd:'2026-11-12'};
const M={'Init Seats':{run_token:'T',panel_expected:['chatgpt','luna','sol'],defender:{engine:'anthropic',profile:'p'},challenger:{engine:'anthropic',profile:'p'},queue_id:null,single_judge:'chatgpt'},'Resolve Seats':{defender:{model:'m1'},challenger:{model:'m2'},deepseek:{api_model:'ds'}},'Final Output':FO,'Fence Check':{},'Init with Guards':{d_served:1,c_served:1,fref:'f',posline:'p'}};
const misses=new Set();
const run=(d)=>{const $=n=>{if(M[n])return {isExecuted:true,first:()=>({json:M[n]}),all:()=>[{json:M[n]}],item:{json:M[n]}};misses.add(n);return {isExecuted:false,first:()=>{throw new Error('not executed: '+n);},all:()=>{throw new Error('not executed: '+n);}};};
 const $input={first:()=>({json:d}),all:()=>[{json:d}],item:{json:d}};return new Function('$','$input',code)($,$input);};
const old={...FO,audit_prompt:'ODV1-A2',independent_verdict_raw:'HELD\nDEFENSE STANDING: PROP-DEPENDENT\n[AUDIT v36: SINGLE JUDGE UNREADABLE (SJR) -- x. REVIEW THIS ROW.]',verdict_tag:'HELD',defense_standing:'PROP-DEPENDENT',conceded_links:0,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:0,data_class:'study',out_of_round_concessions:1,out_of_round_detail:'x',challenger_chain_mark:'FOOTED',defender_chain_mark:'FOOTED',judge_model:'openai/gpt-6.1-terra',diagnostic:'diag',enforcer_log:[],debate_rule_report:[]};
const neu=new Function('$',j.nodes.find(n=>n.name==='SJ Off').parameters.jsCode)(n=>({first:()=>({json:M[n]})}))[0].json;
let A,B;try{A=run(old);}catch(e){console.log('OLD THROWS',e.message.slice(0,300));}
try{B=run(neu);}catch(e){console.log('NEW THROWS',e.message.slice(0,300));}
console.log('nodes read and not mocked:',[...misses].join(', '));
module.exports={A,B};if(false&&A&&B){const a=A[0].json,b=B[0].json;const sa=a.saveBody,sb=b.saveBody;const keys=new Set([...Object.keys(sa),...Object.keys(sb)]);
 for(const k of keys)if(JSON.stringify(sa[k])!==JSON.stringify(sb[k]))console.log('saveBody.'+k,':',JSON.stringify(sa[k]).slice(0,160),'=>',JSON.stringify(sb[k]).slice(0,160));
 console.log('sj_values old',JSON.stringify(a.sj_values),'new',JSON.stringify(b.sj_values));
 console.log('saveBody keys',Object.keys(sb).length,'items',A.length,B.length);
 console.log('top-level keys only in old:',Object.keys(a).filter(k=>!(k in b)).join(','),'| only in new:',Object.keys(b).filter(k=>!(k in a)).join(','));}
