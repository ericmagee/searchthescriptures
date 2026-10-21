// A3 test of the item 8 block with mocked node outputs (no flow run, no model call).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const src=fs.readFileSync('item8_block.js','utf8');
const cb=fs.readFileSync('../s6/composed/Cure_Build.js','utf8');const cureBody=new Function(cb.slice(cb.indexOf('function cureBody'),cb.indexOf('// One reply envelope'))+';return cureBody;')();
const SYS='You are a judge. ```inner fence``` and ````four````', USR='TRANSCRIPT ἐγεννήθη —\nCLAUSE: BROKEN-1 -- n=6 w=0 k=1\nline';
const oa={model:'m',messages:[{role:'system',content:SYS},{role:'user',content:USR}]};
const ge={systemInstruction:{parts:[{text:SYS}]},contents:[{role:'user',parts:[{text:USR}]}]};
const single={model:'d',messages:[{role:'system',content:'single sys'},{role:'user',content:'single user'}]};
const out={'Build Independent Verdict':[{verdictBody:single,judge_model:'deepseek-flash'}],
 'Panel Build':[{judges:[{seat:'deepseek',api_model:'deepseek-flash',body:oa},{seat:'gemini',api_model:'gemini-3.1',body:ge},{seat:'grok',api_model:'grok-4',body:oa}]}],
 'Alternate Build':[{alt:{seat:'glm',pool_seat:'glm',api_model:'z-ai/glm-5.3',removed_seat:'deepseek',body:oa}}],
 'Cure Build':[{cure:{who:'single',seat:'deepseek-flash',model:'deepseek-flash',body:cureBody('deepseek',single,'ANSWER\nCLAUSE: BROKEN-1 -- n=6 w=0 k=1','ASK')}}],
 'Panel Cure Build 1':[{cure:{who:'panel',seat:'deepseek',model:'deepseek-flash',body:cureBody('deepseek',oa,'A1','ASK1')}}],
 'Panel Cure Build 2':[{cure:{who:'panel',seat:'gemini',model:'gemini-3.1',body:cureBody('gemini',ge,'A2','ASK2')}}],
 'Panel Cure Build 3':[{cure:{who:'panel',seat:'grok',skip:'no violation in this seat',items:[]}}]};
const $=n=>{if(!(n in out))throw new Error('Node '+n+' has not been executed');return {first:()=>({json:out[n][0]}),all:()=>out[n].map(j=>({json:j}))};};
const nm=e=>({deepseek:'DeepSeek',gemini:'Gemini',grok:'Grok',glm:'GLM'}[e]||e);const SJN='DeepSeek';let t='HEAD\n';
eval(src);
let ok=true;const chk=(c,m)=>{ok&=!!c;console.log((c?'PASS ':'FAIL ')+m);};
const texts=[...t.matchAll(/### Text (\d+), md5 ([0-9a-f]{32})\n\nSent to: ([^\n]*)/g)];
chk(texts.length===2,'two distinct texts (single; panel+alternate, openai and gemini envelopes of the same words): '+texts.length);
chk(texts.some(x=>x[2]===md5(SYS+USR))&&texts.some(x=>x[2]===md5('single sys'+'single user')),'md5 in headings equal Node crypto md5 of the joined texts');
chk(/panel judge 1 DeepSeek.*panel judge 2 Gemini.*panel judge 3 Grok.*alternate judge GLM/.test(texts.find(x=>x[2]===md5(SYS+USR))[3]),'every seat named under its text');
const fences=[...t.matchAll(/(`{3,})text\n([\s\S]*?)\n\1(?!`)/g)].map(m=>m[2]);
chk(fences.includes(SYS)&&fences.includes(USR),'system and user texts printed verbatim inside fences longer than any run inside');
chk(/### Cure call, single judge DeepSeek[\s\S]*?Followed the [0-9a-f]{32} text above/.test(t),'single cure names the text it followed');
chk(/### Cure call, Gemini[\s\S]*?Followed the [0-9a-f]{32} text above \(Text 2\)/.test(t),'gemini cure (model role) matched on its prefix');
chk(fences.includes('ANSWER\nCLAUSE: BROKEN-1 -- n=6 w=0 k=1')&&fences.includes('ASK2'),'answers and cure requests verbatim');
chk(!/Cure call, Grok/.test(t),'a skipped cure is not printed');
chk(t.startsWith('HEAD\n\n---\n\n## What the judges were sent\n'),'appended after what was there, nothing above moved');
// Plain Rule Lines on the result
const prl=fs.readFileSync('../s6/composed/Plain_Rule_Lines.js','utf8');const md='TOP\nCLAUSE: BROKEN-1 -- n=6 w=0 k=1\n'+t;
const r=new Function('$input',prl)({first:()=>({json:{md}})})[0].json;
chk(r.md.split('\n## What the judges were sent\n')[1]===md.split('\n## What the judges were sent\n')[1],'Plain Rule Lines leaves the section byte-equal');
chk(/^Rule applied: BROKEN/m.test(r.md.split('\n## What the judges were sent\n')[0]),'Plain Rule Lines still rewrites the text above');
// not executed: regrade/replay path
const out0=out;for(const k of Object.keys(out0))delete out0[k];t='HEAD\n';eval(src);chk(/Not available: the texts sent to the judges are not in this run/.test(t),'no judge nodes in the run: says so, no throw');
console.log(ok?'ITEM 8 BLOCK TESTS PASS':'ITEM 8 BLOCK TESTS FAIL');
