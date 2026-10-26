// F20c and F20d harness (Worker_E, rev 9 DoD 20). Usage: node f20cd.cjs <node dir>
// F20c: the F4 block of Panel Payloads and Alternate Payloads (from "let SJ=null" through function sameModelMarks), read from the node, run with
//  stubbed nodes: (1) live run, Build Save Body as the dir's own node builds it; (2) regrade, Regrade Row unstamped; (3) regrade, stamped.
// F20d: Build Save Body on stubs; prints saveBody's four, sj_values, the review_notes, and the md5 of saveBody without the four.
const fs=require('fs');const crypto=require('crypto');const [,,dir]=process.argv;const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const IVR='{"verdict_tag":"BROKEN"}\n\n[AUDIT v19: CHALLENGER CONCEDED ITEMIZATION COUNTS 1 BUT JUDGE STATED 0. STATED VALUE STORED. REVIEW THIS ROW.]';
const d={topic:'T',gl:54,cr1:'a',gr1:'b',cr2:'c',gr2:'UNSUPPORTED-L4 PREMISES\n1. x',cr3:'CHALLENGER\'S UNSUPPORTED-L4 PREMISES\n1. y',dr3:'z',data_class:'contested',
 out_of_round_concessions:0,out_of_round_detail:null,challenger_chain_mark:'FOOTED',defender_chain_mark:'STRAINED',challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0,
 defense_standing:'PROP-DEPENDENT',conceded_links:1,synthesis:'s',independent_verdict_raw:IVR,sd:'2026-10-26',judge_model:'deepseek-flash'};
const NOT=n=>{throw new Error('not executed '+n);};
const bsbNodes=n=>{switch(n){case 'Init Seats':return {first:()=>({json:{run_token:'T1',panel_expected:['gemini','glm','grok'],challenger:{engine:'claude',profile:'plain'},defender:{engine:'mimo',profile:'oracle'},queue_id:null}})};
 case 'Quote Report':return {first:()=>({json:{unavailable:true}})};case 'Resolve Seats':return {first:()=>({json:{defender:{model:'m'},challenger:{model:'c'}}})};
 case 'Init with Guards':return {first:()=>({json:{d_served:[],c_served:[]}})};case 'Fence Check':return {first:()=>({json:{fence:{}}})};
 default:return {isExecuted:false,first:()=>({json:{}})};}};
const B=new Function('$','$input',fs.readFileSync(dir+'/Build_Save_Body.js','utf8'))(bsbNodes,{first:()=>({json:d})})[0].json;
const four=['defense_standing','conceded_links','challenge_standing','challenger_conceded_links'];const rest=Object.assign({},B.saveBody);four.forEach(k=>delete rest[k]);delete rest.review_notes; // review_notes is printed whole on its own line
console.log('F20d saveBody four:',JSON.stringify(four.map(k=>B.saveBody[k])),'| sj_values:',JSON.stringify(B.sj_values||null));
console.log('F20d review_notes:',B.saveBody.review_notes);console.log('F20d saveBody without the four and review_notes, md5',md5(JSON.stringify(rest)));
for(const node of ['Panel_Payloads.js','Alternate_Payloads.js']){const s=fs.readFileSync(dir+'/'+node,'utf8');const a=s.indexOf('let SJ=null');const e=s.indexOf('\n',s.indexOf('function sameModelMarks'));
 const blk=s.slice(a,s.indexOf('\n',s.indexOf("return ['[AUDIT v1: SAME-MODEL DIVERGENCE",e))+1);
 const run=(RGL,RR,WT)=>{const $=n=>n==='Regrade Row'?{all:()=>[{json:RR}]}:n==='Build Save Body'?{isExecuted:true,first:()=>({json:B})}:NOT(n);
  const f=new Function('$','RGL',blk+'\nreturn sameModelMarks;')($,RGL);
  return f({judge_seat:'deepseek',judge_api_model:'deepseek-flash',defense_standing:'SELF-SUPPORTED',challenge_standing:'SELF-SUPPORTED',conceded_links:0,challenger_conceded_links:0},WT||'CONCEDED LINKS: 0 -- none');};
 const row={id:'x',judge_model:'deepseek-flash',independent_verdict_raw:IVR,defense_standing:'PROP-DEPENDENT',conceded_links:1,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
 console.log('F20c',node,'(1) live:',JSON.stringify(run(null,null)));
 console.log('F20c',node,'(2) regrade unstamped:',JSON.stringify(run({f:{}},Object.assign({},row,{panel_verdict:null}))));
 console.log('F20c',node,'(3) regrade stamped:',JSON.stringify(run({f:{}},Object.assign({},row,{panel_verdict:'HELD'}))));
 console.log('F20c',node,'(3b) regrade stamped, the seat marks a premise VOID:',JSON.stringify(run({f:{}},Object.assign({},row,{panel_verdict:'HELD',independent_verdict_raw:'CONCEDED LINKS: 1 -- LINK 3 CONCEDED (stated)\n'+IVR}),'CONCEDED LINKS: 0 -- LINK 2 VOID (no verbatim quote)')));}
