// ASK 367 tests. Usage: node t367.cjs [target] [base]. REAL = execution 38226; PLANT = made for the test.
const fs=require('fs');const {unpack}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const T=JSON.parse(fs.readFileSync(process.argv[2]||__dirname+'/../stk/t367_on251.json')),B=JSON.parse(fs.readFileSync(process.argv[3]||__dirname+'/../rdf/fetchback_s251.json'));
const nm=w=>{const o={};for(const x of w.nodes)o[x.name]=x;return o;};const NT=nm(T),NB=nm(B);
const ch=Object.keys(NB).filter(k=>JSON.stringify(NB[k])!==JSON.stringify(NT[k]));
ok('only Alternate Merge changes',ch.length===1&&ch[0]==='Alternate Merge',ch.join(', '));
ok('node order, connections and settings equal',JSON.stringify(T.nodes.map(x=>x.name))===JSON.stringify(B.nodes.map(x=>x.name))&&JSON.stringify(T.connections)===JSON.stringify(B.connections)&&JSON.stringify(T.settings)===JSON.stringify(B.settings));
const code=NT['Alternate Merge'].parameters.jsCode;
const L=unpack(T).L.join('\n');const fi=L.indexOf('function lyr2024');let d=0,j=L.indexOf('{',fi);for(let k=j;k<L.length;k++){if(L[k]==='{')d++;else if(L[k]==='}'){d--;if(!d){j=k;break;}}}const LIBF=L.slice(fi,j+1);
ok('lyr2024 in Alternate Merge is byte-equal with the Shared Library function',code.includes(LIBF)&&code.split('function lyr2024').length===2,LIBF.length+' chars');
ok('Shared Library unchanged',JSON.stringify(NT['Shared Library'])===JSON.stringify(NB['Shared Library']));
// REAL: run the whole node on the inputs of execution 38226
const ex=JSON.parse(fs.readFileSync(__dirname+'/am_inputs_38226.json'));
const mk=name=>({isExecuted:name in ex,first:()=>({json:ex[name]}),all:()=>[{json:ex[name]}]});
const runNode=src=>new Function('$','$input',src)(mk,{all:()=>[],first:()=>({json:{}})});
const outN=runNode(code),outB=runNode(NB['Alternate Merge'].parameters.jsCode);
const raws=o=>o[0].json.bodies.map(s=>JSON.parse(s).payload);
const RN=raws(outN),RB=raws(outB),STORED=ex.__stored_bodies.map(s=>JSON.parse(s).payload);
ok('REAL: the live node replayed gives the stored bodies (the replay is faithful)',JSON.stringify(RB)===JSON.stringify(STORED));
const v=r=>r.verdict_raw.split('\n').filter(l=>l.includes('[AUDIT v59:'));const nv=r=>r.verdict_raw.split('\n').filter(l=>!/^\[AUDIT v59: LAYERS READ TOGETHER/.test(l.trim())).join('\n');
ok('REAL: everything but the AUDIT v59 lines is unchanged, seat by seat',RN.every((r,i)=>nv(r)===nv(RB[i])&&JSON.stringify({...r,verdict_raw:0})===JSON.stringify({...RB[i],verdict_raw:0})));
const cnt=RN.map(r=>r.judge_seat+' '+v(r).length).join(', ');
ok('REAL: final-text counts terra 1, sol 2, grok 1 (W1 7720 replay: terra KEYSTONE D6 only; grok 1; sol 2)',cnt==='chatgpt 1, sol 2, grok 1',cnt);
ok('REAL: terra no longer carries the gate-time RESULT (a)(b)(c) line',!v(RN[0]).some(l=>/LINE: RESULT: \(a\)/.test(l))&&v(RB[0]).some(l=>/LINE: RESULT: \(a\)/.test(l)));
ok('REAL: terra\'s final RESULT line (Luke 1:27 [L1], Romans 1:3 [L3], [L4], D4 vs C3) draws no line',!v(RN[0]).some(l=>/LINE: RESULT/.test(l)));
ok('REAL: each v59 line sits at the end of the text (appended after the other records)',RN.every(r=>{const a=r.verdict_raw.split('\n');const i=a.findIndex(l=>l.includes('[AUDIT v59:'));return i<0||a.slice(i).every(l=>l.includes('[AUDIT v59:'));}));
// idempotent
const again=(()=>{const __AMOUT=[{json:{bodies:outN[0].json.bodies.slice()}}];const P=code.slice(code.indexOf('try{const __lyr='),code.indexOf('/* ASK 367 */',code.indexOf('o.bodies=__lyr(B)||B'))+13);eval(P);return __AMOUT[0].json.bodies;})();
ok('read twice gives the same text (idempotent)',JSON.stringify(again)===JSON.stringify(outN[0].json.bodies));
// PLANTS
const P0=code.slice(code.indexOf('try{const __lyr='),code.indexOf('/* ASK 367 */',code.indexOf('o.bodies=__lyr(B)||B'))+13);
const runP=bodies=>{const __AMOUT=[{json:{bodies}}];eval(P0);return __AMOUT[0].json.bodies.map(s=>{try{return JSON.parse(s).payload;}catch(e){return s;}});};
const body=(seat,raw)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw}});
const good='RESULT: CHALLENGER WINS -- At D4 vs C3, [L1] Luke 1:27 "Joseph, of the house of David" with [L3] Romans 1:3 "made of the seed of David"; [L4] so the answer assumes.\nD4 vs C3: DEFENDER LINK BROKEN -- GROUND: [L1] Luke 1:27 | [L3] Romans 1:3';
const stale='\n[AUDIT v59: LAYERS READ TOGETHER (K-LYR, ASK 363, TRIAL) -- SEAT: x; LINE: RESULT: (a) no [L1] with its reference; record-only, not counted in drv_uncured; it removes no seat and moves no grade]';
let r=runP([body('x',good+stale)]);ok('PLANT: a stale gate-time line over a now-complete RESULT is removed and none is written',v(r[0]).length===0,JSON.stringify(v(r[0])));
r=runP([body('x','RESULT: CHALLENGER WINS -- the answer fails.')]);ok('PLANT: a final RESULT with no layers is flagged (a)(b)(c)(d)',v(r[0]).length===1&&/\(a\).*\(b\).*\(c\).*\(d\)/.test(v(r[0])[0]));
r=runP(['not json',body('',good)]);ok('PLANT: a body that is not JSON, or has no seat, passes through unchanged',r[0]==='not json'&&v(r[1]).length===0);
const otherAudit='\n[AUDIT v54: GRADE CONSISTENCY ... REVIEW THIS ROW.]';r=runP([body('x',good+otherAudit+stale)]);ok('PLANT: other AUDIT lines are kept',r[0].verdict_raw.includes(otherAudit.trim()));
console.log((fails?'FAILED ':'PASSED ')+(n-fails)+'/'+n);process.exit(fails?1:0);
