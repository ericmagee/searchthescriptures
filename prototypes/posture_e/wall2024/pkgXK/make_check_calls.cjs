// pkgXK stage B: the per-model check calls for W4 (one OpenRouter chat call per model, built by the stage B cureBody itself), and the reader that grades each reply.
// Make the bodies: node pkgXK/make_check_calls.cjs            -> pkgXK/check_calls/<model>.json
// Grade a reply:   node pkgXK/make_check_calls.cjs grade <raw OpenRouter response .json> [...]
// PASS (rev 2, after W4 3658: labels are now tested with the cure reader's own HAS, not an exact prefix) = HTTP body has choices[0].message.content; it parses as cure_lines; it holds a RESPONSE for both asked items, a STATEMENT for item 1, and the five K-RUL card lines right after item 2's RESPONSE;
// and the stage B reader turns it into lines that the stage A reader reads the same way as the plain-line answer. A model that fails stays off the JSON list (line reader only).
const fs=require('fs');const B='pkgLIB/strip_XKB/patched/Cure_Build.js';const s=fs.readFileSync(B,'utf8');
const grab=n=>{const i=s.indexOf('function '+n+'(');const j=s.indexOf('\nfunction ',i+10);return s.slice(i,j>0?j:undefined);};
const L=new Function(['cureBody','xkJsonModels','xkJsonNote','xkRF','xkJson2024','cureText'].map(grab).join('\n')+';return {cureBody,xkJsonModels,cureText};')();
const ASK=['CURE REQUEST (check call). Two items were flagged in your verdict above. Answer each.',
 '1. K-W DEFENDER CR2 D2 #2 -- the withdrawal you counted.','2. K-RUL D1 vs C2 -- your ruling on the link.',
 'For each item write: RESPONSE: <the item, as labelled above> | <your answer>. For item 1 also write: STATEMENT: <the item, as labelled above> | <why the line stands as you graded it>.',
 'For the K-RUL item write its RESPONSE line and under it the five-line card, one field to a line: RULING, CLAIM, NAMED BY, RULE, APPLIED.'].join('\n');
const VERDICT='{"verdict_tag":"HELD","reasoning":"D2 #2 is withdrawn in CR2. D1 vs C2 stands: the defender quotes Luke 1:35 in DR1."}';
const SYS='You are a judge of a written debate. Answer the cure request about your own verdict.';
if(process.argv[2]!=='grade'){fs.mkdirSync('pkgXK/check_calls',{recursive:true});
 for(const m of L.xkJsonModels()){const b=L.cureBody('openrouter',{model:m,messages:[{role:'system',content:SYS},{role:'user',content:'The debate: (check call, no debate text).'}],temperature:0,max_tokens:1500,response_format:{type:'json_object'}},VERDICT,ASK);
  fs.writeFileSync('pkgXK/check_calls/'+m.replace(/\//g,'__')+'.json',JSON.stringify(b,null,1)+'\n');console.log('wrote',m);}
} else for(const f of process.argv.slice(3)){let j,why=[];try{j=JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){console.log('FAIL',f,'not JSON');continue;}
 if(Array.isArray(j)&&j[0]&&j[0].json)j=j[0].json;const raw=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;const t=L.cureText(j);
 if(typeof raw!=='string')why.push('no message content'+(j&&j.error?' ('+JSON.stringify(j.error).slice(0,200)+')':''));else if(t.text===raw)why.push('reply is not cure_lines JSON (stage B reader left it as text)');
 else{const ls=t.text.split('\n');
  /* label match = the cure reader's own test (cureVerdicts: U, NZ, HAS copied verbatim): the label (text before the first |) holds the item key, ending at a non-letter, non-digit */
  const U=s=>String(s).toUpperCase();const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\s+/g,' ').trim();const HAS=(L,k)=>{const a=NZ(L),b=NZ(k);if(!b)return false;let i=a.indexOf(b);while(i>=0){if(!/[0-9A-Z]/.test(a.charAt(i+b.length)))return true;i=a.indexOf(b,i+1);}return false;};
  const lab=(l,kind)=>{const m=l.match(new RegExp('^'+kind+':\\s*([^|]*)\\|\\s*\\S'));return m?m[1]:null;};
  const ri=k=>ls.findIndex(l=>{const b=lab(l,'RESPONSE');return b!=null&&HAS(b,k);});
  if(ri('K-W DEFENDER CR2 D2 #2')<0)why.push('no RESPONSE for item 1');if(!ls.some(l=>{const b=lab(l,'STATEMENT');return b!=null&&HAS(b,'K-W DEFENDER CR2 D2 #2');}))why.push('no STATEMENT for item 1');
  const k=ri('K-RUL D1 vs C2');if(k<0)why.push('no RESPONSE for item 2');else{const c=ls.slice(k+1,k+6).map(l=>(l.match(/^[A-Z ]+(?=:)/)||[''])[0]);if(c.join(',')!=='RULING,CLAIM,NAMED BY,RULE,APPLIED')why.push('card lines after item 2: '+c.join(','));}}
 console.log((why.length?'FAIL ':'PASS ')+(j&&j.model||f)+(why.length?' -- '+why.join('; '):'')+'\n'+(t.text||'').split('\n').map(l=>'   | '+l).join('\n'));}
