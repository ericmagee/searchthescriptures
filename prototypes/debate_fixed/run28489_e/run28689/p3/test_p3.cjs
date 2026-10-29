// P3 harness (BB-7994 step 6): F1a-F1c (item 1, Init with Guards) and F4a-F4e plus the max_tokens trace (item 4, Build Save Body).
const fs=require('fs'),path=require('path');const D=__dirname;const rd=f=>fs.readFileSync(path.join(D,f),'utf8');const out=[];const say=s=>out.push(s);
// ---- item 1
const live=rd('live_Init_with_Guards.js'),neu=rd('new_Init_with_Guards.js'),S=rd('item1_sentence.txt');
const ESC=S.replace(/\\/g,'\\\\').replace(/"/g,'\\"');const ANCH='(for DG-8: Luke 1:34, Matthew 1:18, Matthew 1:25, Sight 1578 item 10).';
say('F1a inserted span once: '+(neu.split(' '+ESC).length-1)+' | right after anchor: '+neu.includes(ANCH+' '+ESC+' In the link round')+' | new minus span equals live: '+(neu.replace(' '+ESC,'')===live));
const gh=src=>{const a=src.indexOf('const GUARDHOLD=');const b=src.indexOf('";',a)+2;return new Function(src.slice(a,b)+';return GUARDHOLD;')();};
const gv=gh(neu),gl=gh(live);
say('F1b GUARDHOLD value carries the sentence: '+(gv.split(S).length-1)+' | value equals live value plus " "+sentence at the anchor: '+(gv===gl.replace(ANCH,ANCH+' '+S))+' | backslash in the sentence span: '+gv.slice(gv.indexOf(S),gv.indexOf(S)+S.length).includes('\\'));
const mut=live.replace(ANCH+' In the link round',ANCH+' '+S+' In the link round');let parses=true;try{new Function('$','$execution','$input',mut);}catch(e){parses=false;}
say('F1c unescaped mutant parses: '+parses);
// ---- item 4
function runBSB(code,{sn,bs,vn}){const nodes={'Init Seats':{run_token:'T',panel_expected:['a','b','c'],challenger:{engine:'x',model:'m',profile:'p'},defender:{engine:'y',model:'m',profile:'p'},queue_id:null},
 'Fence Check':{fence:{}},'Init with Guards':{posline:'P'},'Quote Report':{unavailable:true,items:[]},'Resolve Seats':{defender:{model:'m'},challenger:{model:'m'}},'Synthesis Normalizer':sn,'Build Synthesis':bs,'Verdict Normalizer':vn};
 const $=n=>{if(!(n in nodes)||nodes[n]===undefined)throw new Error('node not run: '+n);return {first:()=>({json:nodes[n]}),isExecuted:true};};
 const d={topic:'T',cr1:'a',gr1:'b',cr2:'c',gr2:'d',cr3:'LINK 1: SUPPORTED',dr3:'LINK 1: SUPPORTED',gl:1,sd:'2026-10-28',synthesis:'SYN',independent_verdict_raw:'[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- D1 vs C1 DEFENDER LINK BROKEN x. REVIEW THIS ROW.]',data_class:'contested',out_of_round_concessions:null,out_of_round_detail:null,defender_chain_mark:null,challenger_chain_mark:null};
 const $input={first:()=>({json:d})};const $execution={mode:'production',customData:{set(){}}};
 const r=new Function('$','$input','$execution',code)($,$input,$execution);return r[0].json.saveBody.review_notes;}
const L=rd('live_Build_Save_Body.js'),N=rd('new_Build_Save_Body.js');
const sn={choices:[{message:{content:'SYN'},finish_reason:'length'}],usage:{prompt_tokens:1000,completion_tokens:2000,completion_tokens_details:{reasoning_tokens:1500}}};
const bs={requestBody:{model:'deepseek',max_tokens:20000,messages:[]}};const vn={choices:[{finish_reason:'stop'}],usage:{prompt_tokens:7,completion_tokens:8,completion_tokens_details:{reasoning_tokens:9}}};
const A='[SYNTHESIS USAGE: prompt=1000 completion=2000 reasoning=1500 finish=length max_tokens=20000]';
let rl,rn;try{rl=runBSB(L,{sn,bs,vn});rn=runBSB(N,{sn,bs,vn});}catch(e){say('HARNESS ERROR '+e.message);}
say('TRACE max_tokens read through $(\'Build Synthesis\').first().json.requestBody.max_tokens: '+(rn||'').includes('max_tokens=20000'));
say('F4a line once: '+((rn||'').split(A).length-1)+' | last item: '+(rn||'').endsWith(A));
say('F4d other items unchanged: '+((rn||'')===(rl?rl+' '+A:A))+' | live review_notes: '+JSON.stringify(rl));
const sn2={...sn,usage:{prompt_tokens:1000,completion_tokens:2000}};const r4b=runBSB(N,{sn:sn2,bs,vn});
say('F4b no details: '+JSON.stringify(r4b.slice(r4b.indexOf('[SYNTHESIS'))));
const r4c=runBSB(N,{sn:undefined,bs:undefined,vn});say('F4c nodes unreadable: '+JSON.stringify(r4c.slice(r4c.indexOf('[SYNTHESIS'))));
const M=N.replace("$('Synthesis Normalizer').first().json)||null;const u=","$('Verdict Normalizer').first().json)||null;const u=");const r4e=runBSB(M,{sn,bs,vn});
say('F4e mutant (Verdict Normalizer) gives the F4a line: '+r4e.includes(A)+' -> '+JSON.stringify(r4e.slice(r4e.indexOf('[SYNTHESIS'))));
console.log(out.join('\n'));
