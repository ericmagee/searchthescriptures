// ASK 437 trial: run Init Seats (live vs edited) for every debater pair; all asked seats accept; JFL moved = chatgpt, sol, grok, luna (as live rows).
const fs=require('fs');const W=f=>{const w=JSON.parse(fs.readFileSync(f));return w.data&&w.data.nodes?w.data:w;};
const [BASE]=process.argv.slice(2);const w=W(BASE);const code0=w.nodes.find(n=>n.name==='Init Seats').parameters.jsCode;
const edits=[[/const ENG=\{[^\n]*\};/, s=>s.replace("gemini:{fam:'openrouter',mc:'gemini'},","").replace("qwen:{fam:'openrouter',mc:'qwen'},","")],
 [/const ORDER0=\[[^\]]*\]/,()=>"const ORDER0=['chatgpt','sol','sol62','haiku','hydrogen','spark','qwen4max','argon','sonnet']"],
 [/const __ALT=\[[^\]]*\]/,()=>"const __ALT=['haiku','hydrogen','spark','qwen4max','argon','sonnet']"],
 [/const ALT_MODELS=\{[^\n]*?\}\};/,()=>"const ALT_MODELS={};"]];
let code1=code0;for(const [re,f] of edits){const m=code1.match(re);if(!m)throw new Error('no match '+re);code1=code1.replace(re,()=>f(m[0]));}
fs.writeFileSync('init_new.js',code1);
const JFL=new Set(['chatgpt','sol','grok','luna']);
const run=(code,d,c)=>{const ORD=(code.match(/const ORDER0=(\[[^\]]*\])/)[1]);const seats=eval(ORD).filter(s=>s!==d&&s!==c&&s!=='qwen').map(s=>({seat:s,placed:true,status:'ok'}));
 const $input={first:()=>({json:{acc:{seats},src:{body:{topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}}}}})};
 const $=n=>({all:()=>[...JFL].map(s=>({json:{seat:s,jfl_move:true}}))});const $execution={id:1,customData:{set(){}}};
 try{return new Function('$input','$','$execution',code)($input,$,$execution)[0].json;}catch(e){return {err:e.message.slice(0,110)};}};
const engs=['claude','chatgpt','gemini','grok','mimo','haiku','opus','glm','qwen4max','qwen','spark'];
const REM=['ember','glm_legal','hy4','hy4_flash','gemini','qwen','ernie','kimi','alt_minimax3','alt_minimax31','qwen_flash','glm_flash'];
let n=0,bad=0,refused=0,thin=[];
for(const d of engs)for(const c of engs){if(d===c)continue;const o=run(code0,d,c),x=run(code1,d,c);n++;
 if(x.err){refused++;if(!/gemini|qwen"/.test(x.err)&&!(['gemini','qwen'].includes(d)||['gemini','qwen'].includes(c)))console.log('NEW REFUSED',d,c,x.err);continue;}
 const all=[...x.panel_order,x.panel_reserve,x.single_judge,...x.alt_order].filter(Boolean);const hit=all.filter(s=>REM.includes(s));if(hit.length){bad++;console.log('REMOVED SEAT SEATED',d,c,hit);}
 if(!o.err&&JSON.stringify(o.panel_order)!==JSON.stringify(x.panel_order))console.log('PANEL CHANGED',d,c,o.panel_order,'->',x.panel_order);
 if(!o.err&&o.single_judge!==x.single_judge)console.log('SJ CHANGED',d,c,o.single_judge,'->',x.single_judge);
 if(x.alt_order.length<3||!x.panel_reserve)thin.push(d+'/'+c+': reserve '+x.panel_reserve+', alternates '+x.alt_order.join(','));}
console.log('pairs',n,'refused (gemini or qwen debater)',refused,'removed seat seated',bad);
console.log('thin:',thin.length);thin.forEach(t=>console.log('  ',t));
const ex=run(code1,'claude','grok');console.log('example claude/grok: panel',ex.panel_order,'reserve',ex.panel_reserve,'sj',ex.single_judge,'alt',ex.alt_order);
const ex0=run(code0,'claude','grok');console.log('live    claude/grok: panel',ex0.panel_order,'reserve',ex0.panel_reserve,'sj',ex0.single_judge,'alt',ex0.alt_order);
{const rows=[];for(const d of engs)for(const c of engs){if(d===c||d==='chatgpt'||c==='chatgpt')continue;const x=run(code1,d,c);if(x.err)continue;rows.push([d+'/'+c,x.panel_order.join(','),x.panel_reserve,x.single_judge,x.alt_order.length]);}
const mn=Math.min(...rows.map(r=>r[4]));console.log('non-OpenAI-debater pairs',rows.length,'min alternates',mn,'panels',[...new Set(rows.map(r=>r[1]))],'reserves',[...new Set(rows.map(r=>r[2]))],'single judges',[...new Set(rows.map(r=>r[3]))]);rows.filter(r=>r[4]===mn).forEach(r=>console.log('  min',r.join(' | ')));}
