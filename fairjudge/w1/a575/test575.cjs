// ASK 575 test (W1): byte-for-byte and behaviour checks of target_engine_575.json and target_child_575.json against the live bases.
const fs=require('fs'),vm=require('vm');let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const T0=JSON.parse(fs.readFileSync('posture_texts.json'));const HEAD='const POSTURE=(T=>{',TAIL="($('Shared Library').params.jsCode);";
const KEY={'Accept Build':'POSTURE Accept Build','Accept Check':'POSTURE Accept Check','Accept Return Build':'POSTURE Accept Return Build','Accept DS Return Build':'POSTURE Accept Return Build','Accept Final':'POSTURE Accept Final'};
const libOf=w=>{const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return {c,L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))}};
const build=(L,p)=>p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const ser=o=>JSON.stringify(o,(k,v)=>typeof v==='function'?'FN:'+v.toString():v);
const stmt=s=>{const i=s.indexOf(HEAD);return s.slice(i,s.indexOf(TAIL,i)+TAIL.length)};
const evalLoader=(s,lib)=>vm.runInContext(stmt(s)+'\n;POSTURE',vm.createContext({$:()=>({params:{jsCode:lib}})}));
const B=JSON.parse(fs.readFileSync('../a573/base_engine_d8292f62.json')),T=JSON.parse(fs.readFileSync('target_engine_575.json'));const lb=libOf(B),lt=libOf(T);
ok(JSON.stringify(lb.L)===JSON.stringify(lt.L),'engine: LIB unchanged (sha header unchanged)');
ok(Object.keys(lb.M).every(k=>JSON.stringify(lb.M[k])===JSON.stringify(lt.M[k])),'engine: every existing MAP entry unchanged');
const ob={};for(const n of B.nodes)ob[n.name]=n;const changed=T.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(ob[n.name])).map(n=>n.name);console.log('   engine nodes changed: '+changed.join(', '));
ok(changed.sort().join()===['Shared Library',...Object.keys(KEY)].sort().join(),'engine: only the five Accept nodes and the Shared Library change');
ok(B.nodes.length===T.nodes.length&&JSON.stringify(B.connections)===JSON.stringify(T.connections),'engine: node count and connections equal');
for(const [node,k] of Object.entries(KEY)){const t=T0['E:'+node];const r=build(lt.L,lt.M[k].p);ok(r===t&&r.length===lt.M[k].n,node+': rebuilt '+k+' equals today\'s POSTURE byte for byte ('+r.length+')');
 const s=T.nodes.find(n=>n.name===node).parameters.jsCode;const st=stmt(s);ok(s.replace(st,()=>t)===ob[node].parameters.jsCode,node+': putting today\'s text back gives today\'s node byte for byte');
 const base=vm.runInContext(t+'\n;POSTURE',vm.createContext({}));const got=evalLoader(s,lt.c);ok(ser(got)===ser(base),node+': loaded POSTURE equals today\'s (every field, functions by source; '+ser(base).length+' chars)');
 try{new Function('$','$input','items','return (async()=>{'+s+'\n})')}catch(x){ok(false,node+' parse '+x.message)}}
// controls
const any=T.nodes.find(n=>n.name==='Accept Final').parameters.jsCode;const M2=JSON.parse(JSON.stringify(lt.M));delete M2['POSTURE Accept Final'];
let th='';try{evalLoader(any,lt.c.slice(0,lt.c.lastIndexOf('\n/*MAP*/')+8)+JSON.stringify(M2)+lt.c.slice(lt.c.lastIndexOf('\n/*END*/')))}catch(x){th=x.message}ok(/holds no POSTURE Accept Final entry/.test(th),'control: entry removed, the loader throws ('+th+')');
const M3=JSON.parse(JSON.stringify(lt.M));const lit=M3['POSTURE Accept Final'].p.find(e=>Array.isArray(e)&&typeof e[0]==='string');lit[0]=lit[0].slice(1);
th='';try{evalLoader(any,lt.c.slice(0,lt.c.lastIndexOf('\n/*MAP*/')+8)+JSON.stringify(M3)+lt.c.slice(lt.c.lastIndexOf('\n/*END*/')))}catch(x){th=x.message}ok(/expected/.test(th),'control: one character dropped from a literal, the loader throws ('+th+')');
// child
const CB=JSON.parse(fs.readFileSync('../a573/base_child_de9efc4e.json')),CT=JSON.parse(fs.readFileSync('target_child_575.json'));const cb=libOf(CB),ct=libOf(CT);
const cob={};for(const n of CB.nodes)cob[n.name]=n;const cch=CT.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(cob[n.name])).map(n=>n.name);
ok(cch.join()==='Shared Library'&&JSON.stringify(cb.L)===JSON.stringify(ct.L)&&Object.keys(cb.M).every(k=>JSON.stringify(cb.M[k])===JSON.stringify(ct.M[k])),'child: only the Shared Library MAP gains the four entries; LIB and existing entries unchanged');
ok(Object.values(KEY).every(k=>JSON.stringify(ct.M[k])===JSON.stringify(lt.M[k])),'child: the four entries equal the engine\'s');
// Library Check on the engine target
{const lc=T.nodes.find(n=>n.name==='Library Check');let r='ran';try{new Function('$','$input',lc.parameters.jsCode)(()=>({params:{jsCode:lt.c}}),{all:()=>['ok']})}catch(e){r=e.message}ok(r==='ran','engine: Library Check passes ('+r+')');}
console.log(fail?'FAILURES: '+fail:'ALL PASS');
