// B harness: the new close-round nodes run as n8n runs a Code node (the file's text as a function body, with $ and $input stubbed), on the
// stored rounds of run 32255. D4 Build -> (a provider reply, synthetic) -> D4 Extract -> C4 Build -> (a provider reply with one new press,
// synthetic) -> C4 Extract. Seats as in 32255: defender anthropic/claude-sonnet-5.5 through OpenRouter, challenger xiaomi/mimo-v2.6-pro (mimo family).
const fs=require('fs');const D=__dirname+'/../';const RL=require('./replay_lib.cjs');const r=RL.run('32255');
const code=n=>fs.readFileSync(D+'new/'+n+'.js','utf8');const ST={};
const json={'Init Seats':{run_token:'ODV1-HARNESS-32255',dpos:"the record's reading",cpos:'the standard reading'},
 'Init with Guards':{topic:'Did Christ have a biological father?',dsys:'DEFENDER SYSTEM PROMPT (stub)\n\n=== DEFENSE DISCIPLINE (stub)',csys:'CHALLENGER SYSTEM PROMPT (stub)',lab:{D:'DEFENDER (Claude)',C:'CHALLENGER (MiMo)'}},
 'Resolve Seats':null,'D1 Extract':{raw:r.claude_r1},'C1 Extract':{raw:r.engine_r1},'D2 Extract':{raw:r.claude_r2},'C2 Extract':{raw:r.engine_r2},'D3 Extract':{raw:r.engine_r3},'C3 Extract':{raw:r.challenger_r3}};
const def={fam:'openrouter',model:'anthropic/claude-sonnet-5.5',tok:64000},cha={fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:64000};json['Resolve Seats']={defender:def,challenger:cha};
const $=n=>{if(n in ST)return {first:()=>({json:ST[n]})};if(json[n])return {first:()=>({json:json[n]})};throw new Error('stub: no node '+n);};
const run=(n,input)=>new Function('$','$input',code(n))($,{first:()=>({json:input})})[0].json;
const env=(text,fin)=>({choices:[{message:{content:text},finish_reason:fin||'stop'}],usage:{prompt_tokens:1000,completion_tokens:500}});
const d4=run('D4 Build');ST['D4 Build']=d4;const b=d4.call.body;const um=b.messages[b.messages.length-1];const ut=Array.isArray(um.content)?um.content.map(p=>p.text).join(''):um.content;
console.log('== D4 Build: round',d4.round,'| fam',d4.call.fam,'| model',d4.call.model,'| session_id',b.session_id,'| keys',Object.keys(b).join(','));
console.log('   reasoning or effort field anywhere in the body:',/"reasoning"|"effort"|reasoning_effort/.test(JSON.stringify(b))?'YES (BAD)':'none');
console.log('   cache markers (system parts, last message):',JSON.stringify(b.messages[0].content.map(p=>p.cache_control)),JSON.stringify((um.content[0]||{}).cache_control||null));
console.log('   user prompt length',ut.length,'| carries the C3 round:',ut.includes(r.challenger_r3.slice(0,200)));
console.log('   THE UNANSWERED LIST, as the defender sees it:\n'+d4.open_list.split('\n').map(l=>'     '+l).join('\n'));
console.log('   instruction (end of prompt):\n     '+ut.slice(ut.indexOf('CLOSE ROUND --')).slice(0,900));
const x4=run('D4 Extract',env('ANSWER: Deuteronomy 24:1 -- D1 -- "When a man hath taken a wife, and married her" (Deuteronomy 24:1) ... [synthetic harness text]'));ST['D4 Extract']=x4;
console.log('== D4 Extract:',x4.round,'| labelled head:',JSON.stringify(x4.labelled.slice(0,45)),'| truncated marker on a length stop:',/\[TRUNCATED/.test(run('D4 Extract',env('x','length')).raw));
try{run('D4 Extract',{choices:[{message:{content:null,refusal:'I cannot'},finish_reason:'stop'}]});console.log('   refusal: NOT thrown (BAD)');}catch(e){console.log('   refusal thrown:',e.message.slice(0,110));}
try{run('D4 Extract',{choices:[{message:{content:''},finish_reason:'length'}],usage:{completion_tokens:64000,completion_tokens_details:{reasoning_tokens:64000}}});}catch(e){console.log('   empty reply thrown:',e.message.slice(0,140));}
const c4=run('C4 Build');ST['C4 Build']=c4;const cb=c4.call.body;const cu=cb.messages[cb.messages.length-1].content;
console.log('== C4 Build: round',c4.round,'| fam',c4.call.fam,'| model',c4.call.model,'| session_id',cb.session_id,'| reasoning/effort:',/"reasoning"|"effort"/.test(JSON.stringify(cb))?'YES (BAD)':'none');
console.log('   carries the D4 text:',cu.includes('synthetic harness text'),'| carries the NO NEW PRESS rule:',/NO NEW PRESS: in this round you may NOT press any new witness or premise/.test(cu));
console.log('   own-verse list (head):\n'+cu.slice(cu.indexOf('THE VERSES YOU CITED'),cu.indexOf('THE VERSES YOU CITED')+700).split('\n').map(l=>'     '+l.slice(0,300)).join('\n'));
console.log('   instruction:\n     '+cu.slice(cu.indexOf('CLOSE ROUND --')).slice(0,800));
const x5=run('C4 Extract',env('I close on Romans 1:3 "made of the seed of David according to the flesh" and on Hebrews 7:14. I add Isaiah 11:1 "there shall come forth a rod out of the stem of Jesse". [synthetic harness text]'));
console.log('== C4 Extract:',x5.round,'| new_press (the flow check):',JSON.stringify(x5.new_press));
