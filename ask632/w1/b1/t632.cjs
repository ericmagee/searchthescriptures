// ASK 632 test (W1). Usage: node t632.cjs base_eng.json target_engine.json fx/or_entries.json
const fs=require('fs');const crypto=require('crypto');const [,,BE,TE,FX]=process.argv;
const B=JSON.parse(fs.readFileSync(BE,'utf8')),T=JSON.parse(fs.readFileSync(TE,'utf8')),F=JSON.parse(fs.readFileSync(FX,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS '+m);}else{fail++;console.log('FAIL '+m);}};
const h=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const N=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const bn=N(B),tn=N(T);
const strip=n=>{const o={...n};delete o.position;delete o.id;return o;};
// C4 structure
ok(B.nodes.length===T.nodes.length&&Object.keys(bn).every(k=>k in tn),'same '+T.nodes.length+' node names');
const ch=Object.keys(bn).filter(k=>h(strip(bn[k]))!==h(strip(tn[k])));ok(ch.length===1&&ch[0]==='Panel Tokens','only Panel Tokens changed: '+ch.join(', '));
ok(h(B.connections)===h(T.connections),'connections equal');
const oc=bn['Panel Tokens'].parameters.jsCode,nc=tn['Panel Tokens'].parameters.jsCode;
const OLD="e.i=__N(u.prompt_tokens)-e.cr-e.w5;";
ok(oc.split(OLD).length===2,'base holds the old statement once');
const ol=oc.split('\n'),nl=nc.split('\n');const dl=ol.map((l,i)=>l!==nl[i]?i:-1).filter(i=>i>=0);
ok(ol.length===nl.length&&dl.length===1,'one line changed (line '+(dl[0]+1)+')');
const NEW=(fs.readFileSync(require('path').join(__dirname,'b632.cjs'),'utf8').match(/^const NEW=("(?:[^"\\]|\\.)*");$/m)||[])[1];if(!NEW)throw new Error('NEW not found in b632.cjs');const NEWS=JSON.parse(NEW);
ok(nl[dl[0]]===ol[dl[0]].replace(OLD,NEWS),'C5: the line differs only by the tagged statement (exact, NEW read from b632.cjs)');
// extract __N and __CU
const fn=code=>{const a=code.indexOf('const __CU=');const b=code.indexOf('return e;};',a)+'return e;};'.length;return new Function(code.slice(code.indexOf('const __N='),code.indexOf('\n',code.indexOf('const __N=')))+'\n'+code.slice(a,b)+'\nreturn __CU;')();};
const oldCU=fn(oc),newCU=fn(nc);
const env=x=>({model:x.m,usage:{prompt_tokens:Number(x.i||0)+Number(x.cr||0)+Number(x.w5||0),completion_tokens:Number(x.o||0),prompt_tokens_details:{cached_tokens:Number(x.cr||0),cache_write_tokens:Number(x.w5||0)},...(x.f==='openrouter'?{cost:Number(x.b||0)}:{})}});
const keys=['n','k','m','f','cr','w5','i','o','b'];const pick=e=>Object.fromEntries(keys.filter(k=>e[k]!==undefined).map(k=>[k,e[k]]));
let reb=0,neg=[],other=0,otherSame=0,sumOld={},sumNew={},w57=0;
for(const {x} of F){const j=env(x);const o=oldCU(x.n,x.k,j),n=newCU(x.n,x.k,j);
 const st=pick(x);if(h(pick(o))===h(st))reb++;
 const m=x.m||'?';sumOld[m]=(sumOld[m]||0)+Number(x.i||0);sumNew[m]=(sumNew[m]||0)+n.i;
 if(Number(x.i)<0){neg.push({x,n});w57+=Number(x.w5||0);}else{other++;if(h(n)===h(o)&&n.ov===undefined)otherSame++;}}
ok(reb===F.length,'the base __CU rebuilds every stored entry from its usage ('+reb+' of '+F.length+')');
// C1
ok(neg.length===57,'57 stored entries with i < 0');
ok(neg.every(({x,n})=>n.i>=0&&n.i===Number(x.i)+Number(x.w5)&&n.ov===1&&n.cr===Number(x.cr)&&n.w5===Number(x.w5)&&n.o===Number(x.o)&&n.b===Number(x.b)),'C1: each of the 57 gets i = prompt - cr (>= 0), ov 1, every other field unchanged');
const qr=neg.find(({x})=>x.n==='QR Ask'&&Number(x.i)===-75869);ok(qr&&qr.n.i===664,'C1: QR Ask -75,869 becomes 664');
// C2
ok(otherSame===other&&other===F.length-57,'C2: the other '+other+' entries byte-equal, no ov key ('+otherSame+')');
// C3 synthetic
const S=(p,cr,w)=>({model:'t',usage:{prompt_tokens:p,completion_tokens:1,prompt_tokens_details:{cached_tokens:cr,cache_write_tokens:w},cost:0}});
const cs=[['no cache',S(100,0,0),100,0],['read only',S(100,40,0),60,0],['disjoint write, remainder >= 0',S(100,40,30),30,0],['write = read, remainder >= 0',S(200,50,50),150,1],['write = read, remainder < 0',S(77197,76533,76533),664,1],['remainder < 0, write != read',S(100,60,50),40,1],['remainder < 0 with prompt < read (clamp)',S(10,60,50),0,1]];
for(const [t,j,ei,eov] of cs){const n=newCU('t',0,j),o=oldCU('t',0,j);ok(n.i===ei&&(n.ov||0)===eov&&(eov?true:h(n)===h(o)),'C3 '+t+': i '+n.i+(eov?' ov 1':' unchanged'));}
// C6 Plain Rule Lines per-model sum
const ms=Object.keys(sumOld);const flash='google/gemini-3.8-flash';
ok(ms.filter(m=>m!==flash).every(m=>sumOld[m]===sumNew[m]),'C6: per-model i sum unchanged for '+(ms.length-1)+' other models');
ok(sumNew[flash]===sumOld[flash]+w57,'C6: gemini-3.8-flash i sum '+sumOld[flash]+' -> '+sumNew[flash]+' (= old + sum of w5 over the 57, '+w57+')');
console.log('RESULT: '+(fail?'FAIL ('+fail+' fail, '+pass+' pass)':'ALL PASS ('+pass+')'));process.exit(fail?1:0);
