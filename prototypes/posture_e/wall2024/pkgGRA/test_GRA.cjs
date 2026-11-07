// pkgGRA node test. Run from wall2024/: node pkgGRA/test_GRA.cjs   (reads the repo only)
const fs=require('fs');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n);}};
const runInit=(code,acc,moved=[])=>{const custom={};const exe={id:'99999',customData:{set:(k,v)=>custom[k]=v}};
 const seats=acc.map(s=>({seat:s,placed:true,status:'ACCEPTED'}));
 const body={topic:'T',defender:{engine:'mimo',profile:'oracle'},challenger:{engine:'claude',profile:'plain'}};
 const rows=['gemini','chatgpt','qwen','sol','grok'].map(s=>({seat:s,api_model:'m/'+s,jfl_move:moved.includes(s)}));
 const $=n=>{if(n==='Accept Models')return{all:()=>rows.map(r=>({json:r}))};throw new Error('no node '+n);};
 return new Function('$','$input','$json','$execution',code)($,{first:()=>({json:{acc:{seats},src:{body}}})},{},exe)[0].json;};
const B=fs.readFileSync('pkgGRA/base/Init_Seats.js','utf8'),P=fs.readFileSync('pkgGRA/patched/Init_Seats.js','utf8');
const J0=fs.readFileSync('pkgJFL/patched/Init_Seats.js','utf8'),J1=fs.readFileSync('pkgGRA/patched_on_JFL/Init_Seats.js','utf8');
const S=x=>[x.panel_order,x.panel_reserve,x.alt_order];
for(const acc of [['gemini','chatgpt','qwen','sol','grok','deepseek'],['gemini','chatgpt','sol','grok','deepseek'],['gemini','chatgpt','sol','grok']]){
 const b=runInit(B,acc),p=runInit(P,acc);const tag=acc.join(',');
 t('['+tag+'] panel and reserve unchanged ('+b.panel_order+' | '+b.panel_reserve+')',JSON.stringify(S(b).slice(0,2))===JSON.stringify(S(p).slice(0,2)));
 const gOnPanel=p.panel_order.includes('grok')||p.panel_reserve==='grok';
 t('['+tag+'] alternates: base '+JSON.stringify(b.alt_order)+' -> patched '+JSON.stringify(p.alt_order)+' (grok in the pool unless seated)',gOnPanel||p.alt_order.includes('grok'));
 t('['+tag+'] base never offers grok',!b.alt_order.includes('grok'));
 t('['+tag+'] patched = base pool plus grok only',JSON.stringify(p.alt_order.filter(s=>s!=='grok'))===JSON.stringify(b.alt_order));}
const j=runInit(J1,['gemini','chatgpt','qwen','sol','grok','deepseek'],['gemini']);
t('on pkgJFL: gemini moved, grok takes its panel place, gemini is an alternate ('+j.panel_order+' | '+j.alt_order+')',j.panel_order.includes('grok')&&j.alt_order.includes('gemini'));
const A="s!=='grok'&&";t('patched = base + the one edit',P.replace("/* pkgGRA (Eric 00:03Z 11-07): grok may serve as an alternate */s=>JFAM_I[s]==='openrouter'&&","s=>JFAM_I[s]==='openrouter'&&"+A)===B);
t('on-pkgJFL copy = pkgJFL patched + the same edit',J1.replace("/* pkgGRA (Eric 00:03Z 11-07): grok may serve as an alternate */s=>JFAM_I[s]==='openrouter'&&","s=>JFAM_I[s]==='openrouter'&&"+A)===J0);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
