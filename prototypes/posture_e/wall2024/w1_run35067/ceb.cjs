// W1 run 35067: Close Enforcer Build, s128 vs s130 code on the run's input; stored output vs s130 replay; the request differs only by the reclaim candidates.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;const n='Close Enforcer Build';
(async()=>{const a=await run(L('/tmp/claude-0/fetchback_live_s128.json').code(n),n,rd),b=await run(L('/tmp/claude-0/live_now.json').code(n),n,rd);const st=rd[n][0].data.main[0].map(x=>x.json);
const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');console.log('s130 replay equals stored',S(b)===S(st),'| errors',a.err||'',b.err||'');
const txt=o=>JSON.stringify(o);const ta=txt(a),tb=txt(b);const rm=s=>s.replace(/\\nX[34] -- DEFENDER -- LINK \d+ -- [^\\]*(\\n|$)/g,'');
const cand=s=>(s.match(/\\nX\d+ -- [A-Z]+ -- LINK \d+ -- EARLIER \[[A-Z0-9]+\] [^\\]{0,90}/g)||[]);console.log('s128 candidates:',cand(ta).length,'| s130 candidates:',cand(tb).length);cand(tb).forEach(c=>console.log('  ',c.slice(2)));
let i=0;while(ta[i]===tb[i])i++;console.log('first difference at',i,'s128:',ta.slice(i-40,i+60),'\n s130:',tb.slice(i-40,i+200));
console.log('other keys equal:',JSON.stringify(Object.keys(a[0]))===JSON.stringify(Object.keys(b[0])));})();
(async()=>{const a=await run(L('/tmp/claude-0/fetchback_live_s128.json').code(n),n,rd),b=await run(L('/tmp/claude-0/live_now.json').code(n),n,rd);
const pa=a[0].body.messages.map(x=>x.content).join('\n'),pb=b[0].body.messages.map(x=>x.content).join('\n');const kept=pb.split('\n').filter(l=>!/^X[34] -- DEFENDER -- LINK/.test(l)).join('\n');
console.log('request with the two reclaim lines removed equals s128 request:',kept===pa,'| other fields equal:',JSON.stringify({...a[0],body:0})===JSON.stringify({...b[0],body:0}));})();
(async()=>{const a=await run(L('/tmp/claude-0/fetchback_live_s128.json').code(n),n,rd),b=await run(L('/tmp/claude-0/live_now.json').code(n),n,rd);
for(const k of new Set([...Object.keys(a[0]),...Object.keys(b[0])]))if(k!=='body'&&JSON.stringify(a[0][k])!==JSON.stringify(b[0][k]))console.log('field differs:',k,JSON.stringify(a[0][k]).slice(0,150),'|',JSON.stringify(b[0][k]).slice(0,300));})();
