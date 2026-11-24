// ASK 593 tests (W4): offline; nothing is fetched or written. node t593.cjs
const fs=require('fs');const lp=require('/mnt/project-files/ask588/w4/build/libpatch.js');const D=__dirname;const J=f=>JSON.parse(fs.readFileSync(D+'/'+f,'utf8'));
let pass=0,fail=0;const T=(id,ok,w,x)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+w+(ok||!x?'':' :: '+x));};
const B=J('base_eng.json'),E=J('target_engine_593.json'),BC=J('base_child.json'),C=J('target_child_593.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const diff=(a,b)=>a.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify((b.nodes.find(y=>y.name===n.name)||{}).parameters)).map(n=>n.name).sort();
const EXP=['Accept Build','Build Diagnostic Prompt','Build Independent Verdict','Build Synthesis','C1 Build','C2 Build','C3 Build','C4 Build','D1 Build','D2 Build','D3 Build','D4 Build','Failure Salvage','Format Markdown','Init Seats','Resolve Seats','Shared Library'].sort();
T('T1.1',JSON.stringify(diff(B,E))===JSON.stringify(EXP)&&B.nodes.length===E.nodes.length&&JSON.stringify(B.connections)===JSON.stringify(E.connections),'engine: '+EXP.length+' nodes change, no node added or removed, wiring unchanged');
T('T1.2',JSON.stringify(diff(BC,C))===JSON.stringify(['Shared Library'])&&JSON.stringify(BC.connections)===JSON.stringify(C.connections),'child: only the Shared Library changes');
T('T1.3',!E.nodes.concat(C.nodes).some(n=>/haiku/i.test(JSON.stringify(n.parameters))),'no engine or child node holds "haiku" (Shared Library included)');
// every changed character is a removal of a haiku text
{let ok=true,why='';for(const n of EXP.filter(x=>x!=='Shared Library')){const a=code(B,n),b=code(E,n);const rm=a.length-b.length;const hk=(a.match(/haiku/gi)||[]).length;if(!(rm>0&&hk>0)){ok=false;why+=n+' ';}}
 T('T1.4',ok,'each changed node only gets shorter, and each held "haiku" before',why);}
// syntax
{let bad=0,n=0;for(const W of [E,C]){const {M}=lp.cut(W);for(const k of Object.keys(M)){if(!M[k]||!M[k].p)continue;n++;try{new Function('return (async function(){'+lp.src(W,k)+'\n})')}catch(e){bad++;}}for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(typeof s!=='string'||x.name==='Shared Library')continue;n++;try{new Function('return (async function(){'+s+'\n})')}catch(e){bad++;}}}T('T2.1',bad===0,n+' code parts parse, '+bad+' errors');}
// T3 the drawing: Init Seats before and after, for every ordered pair of debaters the engine accepts after the write
const run=(W,body,moved)=>{const cd={};const $=n=>({all:()=>(n==='Accept Models'?(moved||[]).map(s=>({json:{seat:s,jfl_move:true}})):[]),isExecuted:true,first:()=>({json:{}})});
 const ORD=['chatgpt','sol','sol62','haiku','gemini','spark','qwen4max','argon','sonnet'];const acc={seats:ORD.map(s=>({seat:s,placed:true}))};
 const $input={first:()=>({json:{acc,src:{body}}}),all:()=>[{json:{acc,src:{body}}}]};const $execution={id:'1',customData:{set:(k,v)=>{cd[k]=v;}}};
 try{const o=new Function('$','$input','$execution','return (()=>{'+code(W,'Init Seats')+'\n})();')($,$input,$execution);return o[0].json;}catch(e){return {err:String(e.message).slice(0,300)};}};
const ENGK=W=>{const s=code(W,'Init Seats');const m=s.match(/const ENG=\{([\s\S]*?)\};/);return [...m[1].matchAll(/(\w+):\{fam/g)].map(x=>x[1]);};
const K0=ENGK(B),K1=ENGK(E);T('T3.1',K0.includes('haiku')&&!K1.includes('haiku')&&K1.length===K0.length-1,'debater keys: '+K0.length+' before, '+K1.length+' after; only haiku leaves');
const pick=j=>j.err?('ERR '+j.err):JSON.stringify({p:j.panel_order,r:j.panel_reserve,a:j.alt_order,s:j.single_judge});
const strip=j=>{if(j.err)return 'ERR';const f=a=>(a||[]).filter(x=>x!=='haiku');return JSON.stringify({p:j.panel_order,a:f(j.alt_order),s:j.single_judge});};
let same=0,changed=[],errs=[],hk=0,n=0;
for(const d of K1)for(const c of K1){if(d===c)continue;for(const mv of [[],['sol'],['gemini']]){n++;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};const a=run(B,body,mv),b=run(E,body,mv);
 if(b.err||a.err){const rt=x=>String(x||'').replace(/run_token=\S+/,'');if(!!a.err!==!!b.err||rt(a.err)!==rt(b.err))errs.push(d+'/'+c+' '+(a.err||'ok')+' | '+(b.err||'ok'));continue;}
 if(JSON.stringify([b.panel_order,b.panel_reserve,b.alt_order,b.single_judge]).includes('haiku'))hk++;
 if(strip(a)===strip(b))same++;else changed.push(d+'/'+c+(mv.length?' moved '+mv:'')+': '+pick(a)+' -> '+pick(b));}}
T('T3.2',hk===0,'no drawing seats haiku anywhere ('+n+' cases: '+K1.length+' debaters, every ordered pair, with no fault-ledger move and with sol or gemini moved)');
T('T3.3',errs.length===0,'every case that ran before runs after, with the same refusal where it refused',errs.slice(0,3).join(' || '));
console.log('INFO the panel, the alternates without haiku and the single judge are unchanged in '+same+' of '+(same+changed.length)+' cases; the reserve may change where haiku stood next');
changed.slice(0,8).forEach(x=>console.log('INFO changed: '+x));
{const hs=changed.filter(x=>!/"p":\[[^\]]*"haiku"/.test(x.split(' -> ')[0])&&!/"a":\[[^\]]*"haiku"/.test(x.split(' -> ')[0]));T('T3.4',hs.length===0,'where haiku sat neither on the panel nor among the alternates, the panel, alternates and single judge are unchanged; '+changed.length+' cases changed, each one where haiku sat',hs.slice(0,3).join(' || '));}
{const r=run(E,{topic:'t',defender:{engine:'haiku',profile:'oracle'},challenger:{engine:'sol62',profile:'plain'}});T('T3.5',r.err&&/engine "haiku" is not one of/.test(r.err),'a launch naming haiku as a debater is refused at Init Seats: '+(r.err||'').slice(0,160));}
// reserves that changed
{const rs=[];for(const d of K1)for(const c of K1){if(d===c)continue;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};const a=run(B,body),b=run(E,body);if(!a.err&&!b.err&&a.panel_reserve!==b.panel_reserve)rs.push(d+'/'+c+' '+a.panel_reserve+'->'+b.panel_reserve);}
 console.log('INFO reserve changes (no fault-ledger move): '+rs.length+(rs.length?' e.g. '+rs.slice(0,4).join('; '):''));
 T('T3.6',true,'(information) reserve changes listed above');}
{const thin={noRes:[],noAlt:[],failed:[]};for(const d of K1)for(const c of K1){if(d===c)continue;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};const a=run(B,body),b=run(E,body);if(a.err)continue;if(b.err){thin.failed.push(d+'/'+c+': '+b.err.slice(0,120));continue;}if(a.panel_reserve&&!b.panel_reserve)thin.noRes.push(d+'/'+c);if((a.alt_order||[]).length&&!(b.alt_order||[]).length)thin.noAlt.push(d+'/'+c);}
 console.log('INFO pairs that lose their reserve: '+thin.noRes.length+' ('+thin.noRes.join(', ')+')');console.log('INFO pairs left with no alternate: '+thin.noAlt.length+' ('+thin.noAlt.join(', ')+')');console.log('INFO pairs that ran before and are now refused: '+thin.failed.length+' '+thin.failed.slice(0,3).join(' || '));
 T('T3.7',thin.failed.length===0,'no debater pair that ran before is refused after the removal');}
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+' pass)'));
{const VS=['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet','sol62'];const bad0=new Set(),bad1=new Set();
 for(const d of K1)for(const c of K1){if(d===c)continue;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};const a=run(B,body),b=run(E,body);if(a.panel_reserve&&VS.indexOf(a.panel_reserve)<0)bad0.add(d+'/'+c+' '+a.panel_reserve);if(b.panel_reserve&&VS.indexOf(b.panel_reserve)<0)bad1.add(d+'/'+c+' '+b.panel_reserve);}
 console.log('INFO reserves the substitution recorder would refuse (not on its seat list): before '+bad0.size+(bad0.size?' ('+[...bad0].slice(0,6).join(', ')+')':'')+'; after '+bad1.size+(bad1.size?' ('+[...bad1].slice(0,6).join(', ')+')':''));}
