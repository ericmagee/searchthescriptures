// BB-6904 revision 4 wrong-if: the alternates' token cap and the null-content reason, read from a composed flow.
// Usage: node check8.cjs <composed.json>. FIRES unless: Init Seats sets ALT_MAX_TOKENS above 32000, at or under 262144 (7108) and
// under 900 s at 84 tok/s (27383); both ALT_MODELS entries carry it; no alternate max_tokens is a literal; envelope() names null content.
const w=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const N={};w.nodes.forEach(n=>N[n.name]=n);
const code=k=>(N[k]&&N[k].parameters.jsCode)||'';const f=[];
const m=code('Init Seats').match(/const ALT_MAX_TOKENS=(\d+);/);const cap=m?Number(m[1]):null;
if(cap===null)f.push('no ALT_MAX_TOKENS');else{if(!(cap>32000))f.push('cap '+cap+' not above 32000');if(cap>262144)f.push('cap '+cap+' above 262144');if(cap/84>=900)f.push('cap '+cap+' needs '+Math.round(cap/84)+' s at 84 tok/s');}
const am=code('Init Seats').match(/const ALT_MODELS=(\{.*?\});/);
if(!am)f.push('no ALT_MODELS');else{const o=Function('ALT_MAX_TOKENS','return '+am[1])(cap);for(const k of ['alt_minimax31','alt_minimax3'])if(!o[k]||o[k].max_tokens!==cap||!(cap>0))f.push(k+' max_tokens '+(o[k]&&o[k].max_tokens)+' is not the cap');}
for(const k of ['Resolve Seats','Alternate Build'])if(/api_model:AM\[(k|qk)\]\.api_model,max_tokens:\d+/.test(code(k)))f.push(k+': literal max_tokens on the alternate');
const ap=code('Alternate Payloads');const i=ap.indexOf('function envelope(');let env=null;
if(i<0)f.push('no envelope()');else{let d=0,j=ap.indexOf('{',i);for(let p=j;p<ap.length;p++){if(ap[p]==='{')d++;else if(ap[p]==='}'){d--;if(d===0){env=ap.slice(i,p+1);break;}}}
 try{Function('RT',env+';envelope("t",{choices:[{finish_reason:"length",message:{role:"assistant",content:null}}]});')(' run_token=X');f.push('envelope() did not throw on null content');}
 catch(e){if(!/content null/.test(e.message)||!/length/.test(e.message))f.push('null-content reason: '+e.message.slice(0,120));}}
console.log(f.length?'FIRED: '+f.join(' | '):'SILENT (cap '+cap+')');
