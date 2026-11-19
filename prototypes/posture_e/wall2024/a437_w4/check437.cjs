// ASK 437 build checks. C2: Init Seats live vs target for all 110 debater pairs. C3: Init Seats and Accept Build, live vs target, on stored runs.
// C4: a dry qualify_alternate request for MiniMax is refused. Usage: node check437.cjs LIVE TARGET EXEC1.json,EXEC2.json,...
const fs=require('fs');const W=f=>{const w=JSON.parse(fs.readFileSync(f));return w.data&&w.data.nodes?w.data:w;};
const [LV,TG,EXS]=process.argv.slice(2);const L=W(LV),T=W(TG);const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const REM=['ember','glm_legal','hy4','hy4_flash','qwen','ernie','kimi','alt_minimax3','alt_minimax31','qwen_flash','glm_flash','deepseek','deepseek_debate'];
const JFL=new Set(['chatgpt','sol','grok','luna']);
const runInit=(c,body,seats,jfl)=>{const $input={first:()=>({json:{acc:{seats},src:{body}}})};const $=n=>({all:()=>[...jfl].map(s=>({json:{seat:s,jfl_move:true}}))});
 try{return new Function('$input','$','$execution',c)($input,$,{id:1,customData:{set(){}}})[0].json;}catch(e){return {err:e.message.replace(/ run_token=\S+/,'')};}};
const ordOf=c=>eval(c.match(/const ORDER0=(\[[^\]]*\])/)[1]);
// C2
const engs=['claude','chatgpt','gemini','grok','mimo','haiku','opus','glm','qwen4max','qwen','spark','deepseek'];let n=0,ref=0,seat=0,pch=0,sjch=0,rows=[];
for(const d of engs)for(const c of engs){if(d===c)continue;n++;const B={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};
 const o=runInit(code(L,'Init Seats'),B,ordOf(code(L,'Init Seats')).filter(s=>s!==d&&s!==c&&s!=='qwen').map(s=>({seat:s,placed:true})),JFL);
 const x=runInit(code(T,'Init Seats'),B,ordOf(code(T,'Init Seats')).filter(s=>s!==d&&s!==c).map(s=>({seat:s,placed:true})),JFL);
 if(x.err){ref++;continue;}const all=[...x.panel_order,x.panel_reserve,x.single_judge,...x.alt_order].filter(Boolean);if(all.some(s=>REM.includes(s))){seat++;console.log('SEATED',d,c,all);}
 if(!o.err&&!['chatgpt'].includes(d)&&!['chatgpt'].includes(c)){if(JSON.stringify(o.panel_order)!==JSON.stringify(x.panel_order))pch++;if(o.single_judge!==x.single_judge)sjch++;rows.push(x);}}
console.log('C2 pairs',n,'| refused',ref,'| removed seat seated',seat,'| non-OpenAI pairs',rows.length,'panel changed',pch,'single judge changed',sjch,'| min alternates',Math.min(...rows.map(r=>r.alt_order.length)),'| reserves',[...new Set(rows.map(r=>r.panel_reserve))].join(','));
// C4
const q=runInit(code(T,'Init Seats'),{topic:'t',defender:{engine:'claude',profile:'oracle'},challenger:{engine:'grok',profile:'plain'},regrade_run_token:'ODV1-1-abcdefgh',regrade_dry:true,qualify_alternate:'minimax/minimax-m3'},[],JFL);
console.log('C4 dry qualify_alternate minimax/minimax-m3:',q.err||'NOT REFUSED');
// C3
for(const f of EXS.split(',')){const ex=JSON.parse(fs.readFileSync(f));const rd=ex.data.resultData.runData;const out=n=>{const r=rd[n];return r?((r[r.length-1].data||{}).main||[[]])[0]:null;};
 const ini=out('Init Seats')[0].json;const srcN=rd['Init Seats'][0].source[0].previousNode;const inp0=out(srcN)[0].json;const SWAP=process.env.SWAP||null;const inp=SWAP?JSON.parse(JSON.stringify(inp0).replace(/"engine":"gemini"/g,'"engine":"'+SWAP+'"')):inp0;
 const mk=w=>n=>{const it=out(n)||[];return {isExecuted:!!out(n),all:()=>it.map(x=>({json:x.json})),first:()=>({json:(it[0]||{}).json}),params:(w.nodes.find(x=>x.name===n)||{}).parameters};};
 const run=(w,n,input)=>{const $input={first:()=>({json:input}),all:()=>input};try{return new Function('$input','$','$execution',code(w,n))($input,mk(w),{id:'r',customData:{set(){}}});}catch(e){return {err:e.message.slice(0,160)};}};
 const a=run(L,'Init Seats',inp),b=run(T,'Init Seats',inp);
 const A=a.err?a:a[0].json,B=b.err?b:b[0].json;
 const all=B.err?[]:[...B.panel_order,B.panel_reserve,B.single_judge,...B.alt_order].filter(Boolean);
 // Accept Build: its $input is Accept Models items
 const am=(out('Accept Models')||[]).map(x=>({json:x.json}));const ab=n=>{const w=n;const $input={all:()=>am,first:()=>am[0]};try{return new Function('$input','$','$execution',code(w,'Accept Build'))($input,mk(w),{id:'r',customData:{set(){}}});}catch(e){return {err:e.message.slice(0,160)};}};
 const pa=ab(L),pb=ab(T);const seatsA=pa.err?pa.err:pa.map(x=>x.json.acc&&x.json.acc.seat),seatsB=pb.err?pb.err:pb.map(x=>x.json.acc&&x.json.acc.seat);
 console.log('C3',f.match(/\d+/)[0],'| stored panel',ini.panel_order.join(','),'reserve',ini.panel_reserve,'sj',ini.single_judge,'| swap',SWAP||'none','| live replay equal to stored',!A.err&&JSON.stringify([A.panel_order,A.panel_reserve,A.single_judge,A.alt_order])===JSON.stringify([ini.panel_order,ini.panel_reserve,ini.single_judge,ini.alt_order]),
  '| target',B.err||('panel '+B.panel_order.join(',')+' reserve '+B.panel_reserve+' sj '+B.single_judge+' alt '+B.alt_order.join(',')),'| panel equal live',!B.err&&!A.err&&JSON.stringify(B.panel_order)===JSON.stringify(A.panel_order),'sj equal live',!A.err&&B.single_judge===A.single_judge,'| live',A.err||('reserve '+A.panel_reserve+' alt '+A.alt_order.join(',')),'| removed seated',all.filter(s=>REM.includes(s)).join(',')||0,
  '| Accept seats live',Array.isArray(seatsA)?seatsA.join(','):seatsA,'| target',Array.isArray(seatsB)?seatsB.join(','):seatsB);}
