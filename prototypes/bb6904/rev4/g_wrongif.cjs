// Revision 4 wrong-if (BB-7107, 7108): on a composed flow file, FIRES if
// (1) any alternate body is still built with a literal max_tokens:32000 (Resolve Seats, Alternate Build), or the cap is not read from
//     Init Seats' ALT_MODELS for both alternates, or that figure is above the 262,144 ceiling (7108);
// (2) Alternate Payloads' envelope(), given a normal chat envelope with content null and finish_reason length, gives a reason that does
//     not name both "content null" and "length" (7107 item 4), or accepts it.
// Usage: node g_wrongif.cjs <composed.json>
const d=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const N={};d.nodes.forEach(n=>N[n.name]=n.parameters.jsCode||'');
const fired=[];
['Resolve Seats','Alternate Build'].forEach(k=>{if(/max_tokens\s*:\s*32000/.test(N[k]))fired.push(k+': literal max_tokens:32000');
 if(!/max_tokens\s*:\s*AM\[[^\]]+\]\.max_tokens/.test(N[k]))fired.push(k+': max_tokens not read from ALT_MODELS (AM[k].max_tokens)');});
const am=N['Init Seats'].match(/const ALT_MODELS=(\{.*?\}\});/);
let M=null;if(am){try{M=Function('return '+am[1])();}catch(e){fired.push('Init Seats: ALT_MODELS is not a plain literal ('+String(e.message).slice(0,80)+')');}}
if(!am)fired.push('Init Seats: ALT_MODELS not found');else if(M){
 Object.entries(M).forEach(([k,v])=>{if(!Number.isInteger(v.max_tokens))fired.push(k+': no integer max_tokens');else if(v.max_tokens>262144)fired.push(k+': max_tokens '+v.max_tokens+' above 262144');else if(v.max_tokens<=32000)fired.push(k+': max_tokens '+v.max_tokens+' not raised');});}
const src=N['Alternate Payloads'];const i=src.indexOf('function envelope(');let j=-1;
if(i>=0){let dp=0;for(let q=src.indexOf('{',i);q<src.length;q++){if(src[q]==='{')dp++;else if(src[q]==='}'){dp--;if(dp===0){j=q+1;break;}}}}
if(i<0)fired.push('Alternate Payloads: envelope() not found');else{
 const env=Function('RT',src.slice(i,j)+'\nreturn envelope;')(' run_token=T');
 try{const r=env('alt_minimax3_q1',{id:'x',choices:[{finish_reason:'length',message:{role:'assistant',content:null}}]});fired.push('envelope accepted null content: '+JSON.stringify(r));}
 catch(e){const m=String(e.message);if(!/content null/i.test(m)||!/length/.test(m))fired.push('null-content reason does not name content null and length: '+m.slice(0,160));}
 try{const r=env('s',{choices:[{finish_reason:'stop',message:{content:'ok'}}]});if(r.text!=='ok')fired.push('normal envelope broken');}catch(e){fired.push('normal envelope throws: '+e.message.slice(0,120));}}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT');
