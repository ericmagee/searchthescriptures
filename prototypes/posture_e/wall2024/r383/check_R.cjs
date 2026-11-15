const fs=require('fs');const ld=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return W.nodes||W.data.nodes;};
const N6=ld('../w207/prewrite_s206_full.json'),N7=ld('../w207/fetchback_live_s207.json'),NR=ld('target_R.json');
const lib=ns=>{const T=ns.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const L6=lib(N6),L7=lib(N7),LR=lib(NR);
// 1. nodes: which differ R vs s207 and R vs s206
const by=ns=>Object.fromEntries(ns.map(n=>[n.name,JSON.stringify(n.parameters)]));const B6=by(N6),B7=by(N7),BR=by(NR);
console.log('nodes',NR.length,N7.length);console.log('R vs s207 differ:',Object.keys(BR).filter(k=>BR[k]!==B7[k]).join(', '));
console.log('R vs s206 differ:',Object.keys(BR).filter(k=>BR[k]!==B6[k]).join(', '));
// connections same
const W7=JSON.parse(fs.readFileSync('../w207/fetchback_live_s207.json')),WR=JSON.parse(fs.readFileSync('target_R.json'));console.log('connections equal',JSON.stringify(W7.connections||W7.data.connections)===JSON.stringify(WR.connections||WR.data.connections));
// 2. lib lines R vs s206
const d=[];for(let i=0;i<LR.length;i++)if(LR[i]!==L6[i])d.push(i);console.log('LIB R vs s206 differ:',d.join(','));
const bnsHook="{const __bs=typeof bnsRefuse2024==='function'?bnsRefuse2024(to):null;if(__bs){items.push({sid:x.sid,kind:'NOT APPLIED',why:__bs,to,lines:[o],bns:true});continue;}} /* pkgBNS, ASK 295 */";
console.log('1448 = s206 with BNS hook only:',LR[1448]===L6[1448].replace('{const __d38=',bnsHook+'{const __d38='));
console.log('1530 = s206 + BNS part only:',LR[1530].startsWith(L6[1530])&&LR[1530].slice(L6[1530].length).startsWith(' /* pkgBNS, ASK 295')&&!LR[1530].includes('fbd'));
console.log('1530 BNS part equals s207 BNS part:',L7[1530].endsWith(LR[1530].slice(L6[1530].length)));
// ACR R vs s206
console.log('ACR R == s206:',BR['Assume Check Record']===B6['Assume Check Record']);
// 3. leftover refs across all nodes
const all=NR.map(n=>[n.name,JSON.stringify(n.parameters)]);
for(const p of ['fbdHit2024','fbdRefuse2024','fbaHit2024','kdaPush2024','kdgPush2024','pkgKDA','pkgKDG','pkgFBD','pkgFBA','x.doc','fbd:']){const h=all.filter(([k,v])=>v.includes(p)).map(([k])=>k);console.log(p.padEnd(14),h.length,h.slice(0,6).join(', '));}
