// ASK 358 tests. Usage: node t358.cjs <target> <base>
const fs=require('fs');let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d?' :: '+d:''));};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),bw=JSON.parse(fs.readFileSync(process.argv[3]));const BN={};bw.nodes.forEach(x=>BN[x.name]=x);
const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(BN[x.name])).map(x=>x.name).sort();ok('only Accept Build and Init Seats changed',dn.join()==='Accept Build,Init Seats',dn.join());
ok('connections, node order and settings equal',JSON.stringify(tw.connections)===JSON.stringify(bw.connections)&&tw.nodes.map(x=>x.name).join()===bw.nodes.map(x=>x.name).join()&&JSON.stringify(tw.settings)===JSON.stringify(bw.settings));
const code=(w,nm)=>w.nodes.find(x=>x.name===nm).parameters.jsCode;
for(const nm of ['Accept Build','Init Seats']){const a=code(bw,nm),b=code(tw,nm);let p=0;while(a[p]===b[p])p++;let s=0;while(a[a.length-1-s]===b[b.length-1-s])s++;
 const strip=x=>x.replace(/'grok',?/g,'').replace(/,\]/g,']').replace(/ \/\* ASK 358[^*]*\*\//,'');ok(nm+': the only change is where grok stands',strip(a)===strip(b));
 try{new Function('$','$input','return (async()=>{\n'+b+'\n})();');ok(nm+': syntax',true);}catch(e){ok(nm+': syntax',false,e.message);}
 ok(nm+': other node fields unchanged',JSON.stringify({...tw.nodes.find(x=>x.name===nm),parameters:null})===JSON.stringify({...BN[nm],parameters:null}));}
const arr=(c,re)=>eval(c.match(re)[1]);
const O0=arr(code(tw,'Init Seats'),/const ORDER0=(\[[^\]]*\])/),ALT=arr(code(tw,'Init Seats'),/const __ALT=(\[[^\]]*\])/),AO=arr(code(tw,'Accept Build'),/const ORDER=(\[[^\]]*\])/);
ok('ORDER0 = chatgpt, sol, luna, hydrogen, gemini, argon, haiku, spark, qwen, grok',O0.join()==='chatgpt,sol,luna,hydrogen,gemini,argon,haiku,spark,qwen,grok');
ok('Accept Build ORDER equals ORDER0',AO.join()===O0.join());ok('__ALT = hydrogen, gemini, argon, haiku, spark, grok',ALT.join()==='hydrogen,gemini,argon,haiku,spark,grok');
ok('same seats as before (no seat added or dropped)',[...O0].sort().join()===[...arr(code(bw,'Init Seats'),/const ORDER0=(\[[^\]]*\])/)].sort().join()&&[...ALT].sort().join()===[...arr(code(bw,'Init Seats'),/const __ALT=(\[[^\]]*\])/)].sort().join());
// the selection rule of Init Seats (pkgALT), with no AGREE refusals and no JFL moves
const FAM={chatgpt:'openai',sol:'openai',luna:'openai',grok:'xai',gemini:'google',hydrogen:'google',argon:'google',spark:'meta'};
const pick=(O,A,d,c)=>{const dfam=[FAM[d],FAM[c]].filter(Boolean);const p0=O.filter(s=>s!==d&&s!==c&&['deepseek','qwen'].indexOf(s)<0&&!(FAM[s]&&dfam.indexOf(FAM[s])>=0));const p=p0.filter(s=>A.indexOf(s)<0).concat(p0.filter(s=>A.indexOf(s)<0).length>=3?p0.filter(s=>A.indexOf(s)>=0):[]);return {panel:p.slice(0,3).join(),alts:p.slice(3).join()};};
const r1=pick(O0,ALT,'gemini','spark');ok('spark vs gemini (run 38106): panel chatgpt, sol, luna; alternates haiku, then grok',r1.panel==='chatgpt,sol,luna'&&r1.alts==='haiku,grok',JSON.stringify(r1));
const r2=pick(O0,ALT,'glm','spark');ok('spark vs glm: alternates hydrogen, gemini, argon, haiku, grok',r2.alts==='hydrogen,gemini,argon,haiku,grok',JSON.stringify(r2));
const r0=pick(arr(code(bw,'Init Seats'),/const ORDER0=(\[[^\]]*\])/),arr(code(bw,'Init Seats'),/const __ALT=(\[[^\]]*\])/),'gemini','spark');ok('base, spark vs gemini: alternates grok, haiku (as run 38106)',r0.alts==='grok,haiku',JSON.stringify(r0));
console.log(n+' checks, '+(f?'FAILS '+f:'ALL OK'));process.exit(f?1:0);
