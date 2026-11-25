// ASK 629 build (W4). node b629.cjs base_eng.json out_target.json
// A: Init Seats panel_reserve = first seat after the panel that is neither time-removed nor JFL-moved.
// B: Panel Check envelope(): a choices reply whose message.content is not a string throws a "returned no text" line
//    with finish_reason and token counts, placed where the old generic throw is (W1 N1), after every parse branch.
const fs=require('fs');
const [,,BASE,OUT]=process.argv;
const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const node=n=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const rep=(n,a,b)=>{const x=node(n);const c=x.parameters.jsCode;const k=c.split(a).length-1;if(k!==1)throw new Error(n+': expected 1 match, got '+k+' for '+a.slice(0,80));x.parameters.jsCode=c.replace(a,()=>b);};

// A
rep('Init Seats',
"const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0&&!JFL_MOVED.has(pfree[3]))?pfree[3]:null;",
"const panel_reserve=pfree.slice(3).find(s=>JUDGE_TIME_REMOVED.indexOf(s)<0&&!JFL_MOVED.has(s))||null; /* ASK 629: the reserve is the first seat after the panel that is neither time-removed nor JFL-moved */");

// B
rep('Panel Check',
" throw new Error('FAIL-CLOSED: seat \"'+seat+'\" returned an envelope this parser does not recognise. Top-level keys: ['+Object.keys(j||{}).join(',')+']. NO ROW IS WRITTEN.'+RT);}",
" {const c0=j&&Array.isArray(j.choices)?j.choices[0]:null;if(c0&&c0.message&&typeof c0.message.content!=='string'){const u=j.usage||{};const v=x=>(x===undefined||x===null)?'not given':Number(x).toLocaleString('en-US');throw new Error('FAIL-CLOSED: seat \"'+seat+'\" returned no text: finish_reason '+(c0.finish_reason==null?'not given':c0.finish_reason)+'; output tokens '+v(u.completion_tokens)+' (reasoning '+v(u.completion_tokens_details&&u.completion_tokens_details.reasoning_tokens)+'); prompt tokens '+v(u.prompt_tokens)+'. NO ROW IS WRITTEN.'+RT);}} /* ASK 629 */\n throw new Error('FAIL-CLOSED: seat \"'+seat+'\" returned an envelope this parser does not recognise. Top-level keys: ['+Object.keys(j||{}).join(',')+']. NO ROW IS WRITTEN.'+RT);}");

fs.writeFileSync(OUT,JSON.stringify(W));
console.log('wrote',OUT);
