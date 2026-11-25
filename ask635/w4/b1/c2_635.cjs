// ASK 635 C2 (W4): replay live Resolve Seats (engine 066525aa) on the 42517 inputs, with model_config hydrogen as stored (65,536) and as written (131,072).
// Then apply Panel Build's own judge max_tokens rule (read from its code) to the hydrogen judge. Nothing is fetched or written.
const fs=require('fs');const [,,ENG,FX]=process.argv;const E=JSON.parse(fs.readFileSync(ENG,'utf8'));const F=JSON.parse(fs.readFileSync(FX,'utf8'));
const code=E.nodes.find(n=>n.name==='Resolve Seats').parameters.jsCode;
const run=(models)=>{const fx={...F,'Fetch Models':models};const $=n=>{if(!(n in fx))return {isExecuted:false,first(){throw new Error('unexecuted '+n);},all:()=>[]};return {isExecuted:true,first:()=>({json:fx[n][0]}),all:()=>fx[n].map(j=>({json:j}))};};
 return new Function('$','$input','$execution',code)($,{first:()=>({json:fx['Init Seats'][0]}),all:()=>fx['Init Seats'].map(j=>({json:j}))},{mode:'trigger',customData:{set(){}}})[0].json;};
const setH=v=>F['Fetch Models'].map(r=>{const s=JSON.stringify(r);return JSON.parse(s.replace(/("seat":"hydrogen"[^}]*?"max_tokens":)\d+|("max_tokens":)\d+([^}]*?"seat":"hydrogen")/,(m,a,b,c)=>a?a+v:b+v+c));});
const pb=E.nodes.find(n=>n.name==='Panel Build').parameters.jsCode;
const rule=/max_tokens:Math\.max\(Number\(j0\.max_tokens\)\|\|0,8000\)/.test(pb)&&/\/\^google\\\/\/\.test\(j\.api_model\)\)body=\{model:j\.api_model,max_tokens:j\.max_tokens/.test(pb);
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m);};
for(const v of [65536,131072]){const RS=run(setH(v));const h=(RS.judges||[]).find(j=>j.seat==='hydrogen');const st=RS.judges.filter(j=>j.seat!=='hydrogen').map(j=>j.seat+':'+j.max_tokens).join(' ');
 ok(h&&h.max_tokens===v,'hydrogen row '+v+': Resolve Seats judge max_tokens '+(h&&h.max_tokens)+' ('+(h&&h.api_model)+'); other judges '+st);
 ok(rule&&Math.max(h.max_tokens,8000)===v,'Panel Build rule (max(v,8000); google/ body max_tokens = j.max_tokens) gives '+Math.max(h.max_tokens,8000));}
const a=run(setH(65536)),b=run(setH(131072));const diffs=[];const walk=(x,y,p)=>{if(JSON.stringify(x)===JSON.stringify(y))return;if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p+'.'+k);}else diffs.push(p+': '+JSON.stringify(x)+' -> '+JSON.stringify(y));};walk(a,b,'RS');
console.log(diffs.join('\n'));ok(diffs.length>0&&diffs.every(d=>/max_tokens: 65536 -> 131072$/.test(d)),'Resolve Seats output differs only at hydrogen max_tokens ('+diffs.length+' path(s))');
console.log(fail?'RESULT: '+fail+' FAIL':'RESULT: ALL PASS ('+pass+')');
