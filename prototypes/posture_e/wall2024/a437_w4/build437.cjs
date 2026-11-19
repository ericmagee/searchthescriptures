// ASK 437 (plan rev 1, a437_w4; rev 2 build: Gemini 3.8 Flash kept, operator 21:51 CST 11-18): six lines in Init Seats and Accept Build, stacked on the ASK 429 engine target.
// Usage: node build437.cjs ENG_IN ENG_OUT
const fs=require('fs');const [IN,OUT]=process.argv.slice(2);
const raw=JSON.parse(fs.readFileSync(IN));const w=raw.data&&raw.data.nodes?raw.data:raw;
const once=(n,o,v)=>{const x=w.nodes.find(y=>y.name===n);const c=x.parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(n+': "'+o.slice(0,60)+'" occurs '+k+' times');x.parameters.jsCode=c.replace(o,()=>v);};
once('Init Seats',"qwen:{fam:'openrouter',mc:'qwen'},","");
once('Init Seats',"fail('DeepSeek never debates (ruling 421): it is the enforcer.')","fail('DeepSeek never debates (operator 21:24 CST 11-18): flash models are out of debating, judging and the panel.')");
const OLDORD="['chatgpt','sol','sol62','ember','glm_legal','haiku','hy4','hy4_flash','gemini','hydrogen','spark','qwen4max','argon','sonnet','qwen']",NEWORD="['chatgpt','sol','sol62','haiku','gemini','hydrogen','spark','qwen4max','argon','sonnet']";
once('Init Seats',"const ORDER0="+OLDORD,"const ORDER0="+NEWORD);
once('Init Seats',"const __ALT=['ember','glm_legal','haiku','hy4','hy4_flash','gemini','hydrogen','spark','qwen4max','argon','sonnet']","const __ALT=['haiku','gemini','hydrogen','spark','qwen4max','argon','sonnet']");
// MiniMax: ALT_MODELS (which holds model settings) is left as it is; qualify_alternate, its only way in, is refused (reasoning guard, rev 1 build)
once('Init Seats',"if(QA!==null&&!DRY)fail('qualify_alternate runs only in a dry regrade.');","if(QA!==null)fail('qualify_alternate is refused: MiniMax is out of debating, judging and the panel (operator 21:24 CST 11-18).');");
once('Accept Build',"const ORDER="+OLDORD,"const ORDER="+NEWORD);
fs.writeFileSync(OUT,JSON.stringify(raw));console.log('BUILT',OUT);
