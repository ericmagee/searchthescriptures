// Builds the Judge Enforcer Build calls for a run from /mnt/project-files/wall2024/inputs/<run>_*.json with pkgJEC and pkgJRE.
// No key: checks the two builds send identical prompts and items, and differ only by reasoning_effort. With DEEPSEEK_KEY (and optional MAX=n calls):
// sends the pkgJRE calls, reports usage (reasoning tokens), finish_reason, elapsed, and each E-* verdict against the logged verdicts in
// /mnt/project-files/wall2024/inputs/<run>_enforcer_verdicts.json ([{rule,seat,item,verdict}], saved from debate_enforcer_log). Run from wall2024/.
const fs=require('fs');const run=process.argv[2]||'33040';
const I=n=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;return JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json);};
const nodes={'Panel Cure Check':I('Panel_Cure_Check'),'Init Seats':I('Init_Seats')||[{run_token:'r'}],'Resolve Seats':I('Resolve_Seats')||[{deepseek:{api_model:'deepseek-flash'}}]};
for(const k of [1,2,3]){const v=I('Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
const go=pkg=>new Function('$','$input','$json',fs.readFileSync(pkg+'/patched/Judge_Enforcer_Build.js','utf8'))($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json);
const A=go('pkgJEC'),B=go('pkgJRE');const strip=c=>{const b={...(c.body||{})};delete b.reasoning_effort;return JSON.stringify({...c,body:b,code_rows:(c.code_rows||[]).map(({at,...r})=>r)});};
console.log(run+': calls',A.length,B.length,'| identical apart from reasoning_effort:',A.length===B.length&&A.every((c,i)=>strip(c)===strip(B[i])),'| reasoning_effort',[...new Set(B.map(c=>c.body&&c.body.reasoning_effort))]);
console.log('prompt chars',B.map(c=>c.body?c.body.messages[1].content.length:0).join(', '));
const KEY=process.env.DEEPSEEK_KEY;if(!KEY){console.log('no DEEPSEEK_KEY: build check only');process.exit(0);}
const logged=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/'+run+'_enforcer_verdicts.json','utf8'));const lk=x=>x.rule+'|'+x.seat+'|'+x.item;const L=new Map(logged.map(x=>[lk(x),x.verdict]));
(async()=>{const MAX=+process.env.MAX||B.length;const ch=[];let same=0,n=0;
 for(const [ci,c] of B.slice(0,MAX).entries()){if(!c.body)continue;const t0=Date.now();let r;try{r=await (await fetch('https://api.deepseek.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+KEY},body:JSON.stringify(c.body)})).json();}catch(e){r={error:{message:String(e)}};}
  const u=r.usage||{};const txt=String(r.choices&&r.choices[0]&&r.choices[0].message&&r.choices[0].message.content||'');
  console.log('call',ci+1,'prompt',c.body.messages[1].content.length,'| elapsed s',((Date.now()-t0)/1000).toFixed(0),'| completion',u.completion_tokens,'reasoning',u.completion_tokens_details&&u.completion_tokens_details.reasoning_tokens,'| finish',r.choices&&r.choices[0]&&r.choices[0].finish_reason,r.error?'| ERROR '+r.error.message:'');
  const V={};for(const l of txt.split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([A-Z]\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)/i);if(m)V[m[1].toUpperCase()]=m[2].toUpperCase();}
  for(const x of c.ids||[]){const v=V[x.id.toUpperCase()]||'NO VERDICT';const was=L.get(lk(x));n++;if(was===v)same++;else ch.push(x.rule+' '+x.seat+' '+x.item+': '+was+' -> '+v);}}
 console.log('items',n,'same',same,'changed',ch.length);ch.forEach(l=>console.log('  '+l));})();
