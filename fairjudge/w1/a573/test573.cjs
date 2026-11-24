// ASK 573 test (W1): byte-for-byte and behaviour checks of target_engine_573.json and target_child_573.json against the live bases.
const fs=require('fs'),vm=require('vm');let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const RL=fs.readFileSync('rl_text.js','utf8');
const LOADER_HEAD="const __RL=(T=>{";
const libOf=w=>{const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {c,L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))}};
const build=(L,p)=>p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const J=JSON.parse(fs.readFileSync('/mnt/project-files/run41822/judgments.json','utf8'));const texts=J.map(x=>String(x.verdict_raw||''));
const evalLoader=(src,libCode)=>{const i=src.indexOf(LOADER_HEAD);const e=src.indexOf("($('Shared Library').params.jsCode);",i)+"($('Shared Library').params.jsCode);".length;const st=src.slice(i,e);const ctx=vm.createContext({$:()=>({params:{jsCode:libCode}})});return vm.runInContext(st+'\n;__RL',ctx)};
const sig=R=>JSON.stringify(texts.map(t=>{const o={};for(const k of ['readLines','judgeText','normLine','unescapeOnce']){try{o[k]=R[k](t)}catch(e){o[k]='ERR '+e.message}}return o}));
const base=vm.runInContext(RL+'\n;__RL',vm.createContext({}));const baseSig=sig(base);
for(const [bf,tf,tag] of [['base_engine_d8292f62.json','target_engine_573.json','engine'],['base_child_de9efc4e.json','target_child_573.json','child']]){
 const B=JSON.parse(fs.readFileSync(bf)),T=JSON.parse(fs.readFileSync(tf));const lb=libOf(B),lt=libOf(T);
 ok(lt.L.slice(0,lb.L.length).every((x,i)=>x===lb.L[i]),tag+': every existing LIB line unchanged (lines 0 to '+(lb.L.length-1)+'); new lines appended only');
 ok(Object.keys(lb.M).every(k=>JSON.stringify(lb.M[k])===JSON.stringify(lt.M[k])),tag+': every existing MAP entry unchanged');
 const r=build(lt.L,lt.M.__RL.p);ok(r===RL&&r.length===lt.M.__RL.n,tag+': rebuilt __RL equals today\'s text byte for byte ('+r.length+')');
 const ob={};for(const n of B.nodes)ob[n.name]=n;const changed=T.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(ob[n.name])).map(n=>n.name);
 console.log('   '+tag+' nodes changed: '+changed.join(', '));ok(B.nodes.length===T.nodes.length&&JSON.stringify(B.connections)===JSON.stringify(T.connections),tag+': node count and connections equal');
 for(const n of T.nodes){if(n.name==='Shared Library'||!changed.includes(n.name))continue;const s=n.parameters.jsCode;const i=s.indexOf(LOADER_HEAD);const e=s.indexOf("($('Shared Library').params.jsCode);",i)+36;
  ok(s.slice(0,i)+RL+s.slice(e)===ob[n.name].parameters.jsCode,tag+' '+n.name+': putting today\'s text back gives today\'s node byte for byte');
  const R=evalLoader(s,lt.c);ok(sig(R)===baseSig,tag+' '+n.name+': loaded __RL gives the same readLines, judgeText, normLine, unescapeOnce on all '+texts.length+' stored 41822 verdicts');
  try{new Function('$','$input','items','return (async()=>{'+s+'\n})')}catch(x){ok(false,n.name+' parse '+x.message)}}
 // negative controls
 const M2=JSON.parse(JSON.stringify(lt.M));delete M2.__RL;const c2=lt.c.slice(0,lt.c.lastIndexOf('\n/*MAP*/')+8)+JSON.stringify(M2)+lt.c.slice(lt.c.lastIndexOf('\n/*END*/'));
 const any=T.nodes.find(n=>n.parameters&&n.parameters.jsCode&&n.parameters.jsCode.includes(LOADER_HEAD));
 let th='';try{evalLoader(any.parameters.jsCode,c2)}catch(x){th=x.message}ok(/holds no __RL entry/.test(th),tag+' control: MAP entry removed, the loader throws ('+th+')');
 const L3=lt.L.slice();L3[lt.M.__RL.p[0][0]+5]=L3[lt.M.__RL.p[0][0]+5].slice(1);const c3=lt.c.slice(0,lt.c.indexOf('\n/*LIB*/')+8)+JSON.stringify(L3)+lt.c.slice(lt.c.lastIndexOf('\n/*MAP*/'));
 th='';try{evalLoader(any.parameters.jsCode,c3)}catch(x){th=x.message}ok(/expected/.test(th),tag+' control: one character dropped from a __RL line, the loader throws ('+th+')');
}
console.log(fail?'FAILURES: '+fail:'ALL PASS');
// Library Check (ASK 422a) on the engine target; the child pair check is libpair.cjs
for(const tf of ['target_engine_573.json']){const T=JSON.parse(fs.readFileSync(tf));const lc=T.nodes.find(n=>/^Library Check/.test(n.name));const lib=T.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 let r='ran';try{new Function('$','$input',lc.parameters.jsCode)(()=>({params:{jsCode:lib}}),{all:()=>['ok']})}catch(e){r=e.message}ok(r==='ran',tf+': Library Check passes on the target ('+r+')');}
console.log(fail?'FAILURES: '+fail:'ALL PASS (with Library Check)');
