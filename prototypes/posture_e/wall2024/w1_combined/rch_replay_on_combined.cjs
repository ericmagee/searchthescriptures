// W1 grade pkgRCH: Close Enforcer Build, live s130 vs RCH, on every stored export where it ran; candidate lists compared.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const A=L('/tmp/claude-0/live_now.json'),B=L('/tmp/claude-0/cmx/combined.json');const n='Close Enforcer Build';
(async()=>{for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!rd[n]){console.log(e.slice(2,7),'Close Enforcer Build did not run');continue;}
 const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);if(a.err||b.err){console.log(e.slice(2,7),'ERR',a.err,b.err);continue;}
 const ca=(a[0].cands||[]).map(c=>c.id+' '+c.side[0]+' L'+c.n+' '+(c.by||'').slice(0,12)),cb=(b[0].cands||[]).map(c=>c.id+' '+c.side[0]+' L'+c.n+' '+(c.by||'').slice(0,12)+' <'+String(c.earlier_q||'').slice(0,45)+'>');
 const pa=JSON.stringify(a),pb=JSON.stringify(b);console.log(e.slice(2,7),pa===pb?'byte-equal':'DIFFER','| s130 cands',ca.length,'| RCH cands',cb.length);if(pa!==pb)cb.forEach(c=>console.log('   ',c));}})();
(async()=>{const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;const a=await run(A.code(n),n,rd),b=await run(B.code(n),n,rd);
const pa=a[0].body.messages.map(x=>x.content).join('\n'),pb=b[0].body.messages.map(x=>x.content).join('\n');const kept=pb.split('\n').filter(l=>!/^X4 -- DEFENDER -- LINK 2/.test(l)).join('\n').replace(/^X5 -- /m,'X4 -- ');
console.log('35067: RCH request minus the new link 2 line, X5 renamed X4, equals s130 request:',kept===pa);console.log('new line:',pb.split('\n').find(l=>/^X4 -- DEFENDER -- LINK 2/.test(l)).slice(0,400));})();
