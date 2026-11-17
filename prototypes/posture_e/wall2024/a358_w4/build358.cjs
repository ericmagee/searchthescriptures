// ASK 358 (operator 09:54 CST 11-17: "place grok last... something is wrong with grok"): grok moves to the end of the alternate order.
// Usage: node build358.cjs <base.json> <out.json>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));
const OLD="['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark','qwen']",NEW="['chatgpt','sol','luna','hydrogen','gemini','argon','haiku','spark','qwen','grok']";
const OLDA="const __ALT=['hydrogen','gemini','grok','argon','haiku','spark'];",NEWA="const __ALT=['hydrogen','gemini','argon','haiku','spark','grok']; /* ASK 358: grok last (operator 11-17) */";
const rep=(nm,a,b)=>{const n=w.nodes.find(x=>x.name===nm);const c=n.parameters.jsCode;const k=c.split(a).length-1;if(k!==1)throw new Error(nm+': anchor count '+k);n.parameters.jsCode=c.replace(a,()=>b);};
rep('Init Seats','const ORDER0='+OLD+';','const ORDER0='+NEW+';');
rep('Init Seats',OLDA,NEWA);
rep('Accept Build','const ORDER='+OLD+';','const ORDER='+NEW+';');
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('ok');
