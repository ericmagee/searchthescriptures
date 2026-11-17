// ASK 363 tests. Usage: node t363.cjs <target> <base> <j1150_1214.json>. REAL = stored judgments; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require(process.env.LIBCJS||'../a336/inputs/tools/lib.cjs');let n=0,f=0;const ok=(t,c,d)=>{n++;if(!c)f++;console.log((c?'ok   ':'FAIL ')+t+(d!==undefined&&d!==''?' :: '+d:''));};
const tw=JSON.parse(fs.readFileSync(process.argv[2])),bw=JSON.parse(fs.readFileSync(process.argv[3]));const tu=unpack(tw),bu=unpack(bw);
const OLD="My RESULT and KEYSTONE lines name, by label, the collision lines that decide them, and carry at least one [L1].";
const NEW="My RESULT and KEYSTONE lines name, by label, the collision lines that decide them; quote [L1] each verse those lines are graded on, read together with the [L3] rows their GROUNDs rely on; and give the deciding step as an [L4] that names the [L1] and the [L3] it joins. No verse decides alone: single verse doctrine is prohibited (Isaiah 28:10).";
// structure
const dl=tu.L.map((l,i)=>l!==bu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed: 1922, 1933, 2966, 3274; line count equal',tu.L.length===bu.L.length&&dl.join()==='1922,1933,2966,3274',dl.join());
ok('library header and tail equal',tu.hdr===bu.hdr&&tu.tail===bu.tail);
const BN={};for(const x of bw.nodes)BN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(BN[x.name])).map(x=>x.name).sort();
const WN=['Accept Build','Accept Check','Accept DS Return Build','Accept Final','Accept Return Build','Enforcer Build','Panel Build','Reserve Build','Shared Library'];
ok('nodes changed: Shared Library and the 8 Commitment 13 nodes',dn.join()===WN.join(),dn.join(', '));
for(const nm of WN.filter(x=>x!=='Shared Library')){const a=BN[nm],b=tw.nodes.find(x=>x.name===nm);const ka=JSON.parse(JSON.stringify(a)),kb=JSON.parse(JSON.stringify(b));delete ka.parameters.jsCode;delete kb.parameters.jsCode;const same=JSON.stringify(ka)===JSON.stringify(kb)&&a.parameters.jsCode.replace(OLD,NEW)===b.parameters.jsCode;ok(nm+': only the sentence changed (all other fields and code equal)',same);}
ok('connections, node order and settings equal',JSON.stringify(tw.connections)===JSON.stringify(bw.connections)&&tw.nodes.map(x=>x.name).join()===bw.nodes.map(x=>x.name).join()&&JSON.stringify(tw.settings)===JSON.stringify(bw.settings));
const all=JSON.stringify(tw.nodes),allb=JSON.stringify(bw.nodes); /* nodes only: activeVersion is the server's copy of the published version and is not written */const cnt=(s,x)=>s.split(x).length-1;
ok('L3: in nodes, old sentence 10 copies in base, 0 in target; new sentence 10 in target',cnt(allb,OLD)===10&&cnt(all,OLD)===0&&cnt(all,NEW)===10,cnt(allb,OLD)+' / '+cnt(all,OLD)+' / '+cnt(all,NEW));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',!bad.length,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(bu.L,bu.M[k])).sort();console.log('   changed MAP entries ('+ch.length+'): '+ch.join(', '));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry',!syn.length,syn.join('; '));
for(const nm of WN.filter(x=>x!=='Shared Library')){try{new Function('$','$input','return (async()=>{\n'+tw.nodes.find(x=>x.name===nm).parameters.jsCode+'\n})();');ok('syntax '+nm,true);}catch(e){ok('syntax '+nm,false,e.message);}}
// L4: PART2 lengths and heading count
const P2=w=>{const c=w.nodes.find(x=>x.name==='Accept Build').parameters.jsCode;const m=c.match(/const PART2=("(?:[^"\\]|\\.)*");/);const s=JSON.parse(m[1]);return {len:s.length,heads:[...s.matchAll(/^### (Commitment \d+\. [^\n]+)$/gm)].length};};
const pb=P2(bw),pt=P2(tw);console.log('   PART2 length: base '+pb.len+', target '+pt.len+' (+'+(pt.len-pb.len)+'); headings '+pb.heads+' and '+pt.heads+'. No PART2 length limit is read in any node (searched PART2.length, PROMPT.length).');
ok('L4: heading count unchanged',pb.heads===pt.heads,pb.heads);
// function
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});const T=load(rb(tu.L,tu.M['Gate Record']),$),B=load(rb(bu.L,bu.M['Gate Record']),$);
ok('loader gives lyr2024 in target Gate Record, none in base',typeof T.lyr2024==='function'&&typeof B.lyr2024!=='function');
const body=(seat,raw)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw}});const recs=s=>String(JSON.parse(s).payload.verdict_raw).split('\n').filter(l=>l.startsWith('[AUDIT v59:'));
const run=(seat,raw)=>{const o=T.lyr2024([body(seat,raw)]);return o?recs(o[0]):[];};
const J=JSON.parse(fs.readFileSync(process.argv[4]));
for(const id of [1212,1213,1214]){const j=J.find(x=>x.id===id);const r=run(j.seat,j.raw);console.log('   REAL '+id+' '+j.seat+': '+r.length+' record line(s)');r.forEach(x=>console.log('      '+x.slice(0,400)));ok('REAL '+id+': every verdict RESULT and KEYSTONE line is recorded (none carries [L3] and [L4])',r.length>=2);}
const G1='D5 vs C5 (Hebrews 7:14): DEFENDER LINK BROKEN -- x -- GROUND: [L1] Hebrews 7:14 "it is evident that our Lord sprang out of Juda" | [L3] Numbers 1:2 "by the house of their fathers"';
const PASSL='RESULT: CHALLENGER WINS -- D5 vs C5 decides it: [L1] Hebrews 7:14 "our Lord sprang out of Juda" read with [L3] Numbers 1:2 "by the house of their fathers"; [L4] the tribe is reckoned by the fathers\' house, so the [L1] and [L3] together give the line.';
const P=[
 ['PLANT pass: [L1], [L3] in the named GROUND, [L4] on the line: no record',G1+'\n'+PASSL,0],
 ['PLANT (b),(c): [L1] only (single verse) is recorded',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5 decides it: [L1] Hebrews 7:14 "our Lord sprang out of Juda".',1,/\(b\).*\(c\) no \[L4\]/],
 ['PLANT E1/L2: [L4] without an [L3] on the line is recorded',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5 decides it: [L1] Hebrews 7:14 "our Lord sprang out of Juda"; [L4] so it is.',1,/\(c\) its \[L4\] stands on a line without both/],
 ['PLANT (b): an [L3] that repeats the [L1] reference does not count',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x" [L3] Hebrews 7:14 "y"; [L4] z.',1,/\(b\)/],
 ['PLANT (d): an [L3] standing in no GROUND of the named line is recorded',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x" read with [L3] Ezra 2:59 "y"; [L4] z.',1,/\(d\) \[L3\] Ezra 2:59 stands in no GROUND of D5 VS C5/],
 ['PLANT (d): a KEYSTONE naming no collision line is recorded',G1+'\nKEYSTONE: D5 -- BROKEN -- [L1] Hebrews 7:14 "x" with [L3] Numbers 1:2 "y"; [L4] z.',1,/KEYSTONE D5: .*\(d\) names no collision line/],
 ['PLANT: the GROUNDs of the named lines carry no [L3]: recorded as the record\'s own gap','D5 vs C5 (Hebrews 7:14): DEFENDER LINK BROKEN -- x -- GROUND: [L1] Hebrews 7:14 "y"\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x".',1,/the GROUNDs of D5 VS C5 name no \[L3\]/],
 ['PLANT: a KEYSTONE WITHDRAWN line is passed over','KEYSTONE: D5 -- WITHDRAWN -- none.',0],
 ['PLANT: an engine-derived RESULT is passed over','RESULT: DEFENDER WINS -- derived by the engine from the collision grades.',0],
 ['PLANT: AUDIT lines (RESULT: CURED inside) are passed over','[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: x; RESULT: CURED; WHY: y]\n[AUDIT v38: E-GATE -- RESULT: CHALLENGER WINS]',0],
 ['PLANT: (L1)/(L3)/(L4) round-bracket tags read the same as square',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: (L1) Hebrews 7:14 "x" read with (L3) Numbers 1:2 "y"; (L4) z.',0],
 ['PLANT: a duplicated verdict line is recorded once',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x".\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x".',1],
];
for(const [t,raw,k,re] of P){const r=run('x',raw);ok(t,r.length===k&&(!re||re.test(r[0]||'')),r.length+(r[0]?' :: '+r[0].slice(0,220):''));}
{const o=T.lyr2024([body('x',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x".\n[AUDIT v59: earlier]')]);ok('PLANT: a body already holding AUDIT v59 is left as it is (no double record)',o===null);}
{const o=T.lyr2024([JSON.stringify({payload:{verdict_raw:'RESULT: CHALLENGER WINS -- [L1] Hebrews 7:14 "x".'}})]);ok('PLANT: a body with no judge_seat is left as it is',o===null);}
{const o=T.lyr2024([body('x',PASSL+'\n'+G1)]);ok('PLANT: nothing to record returns null (the record node keeps its bodies)',o===null);}
{const a=body('x',G1+'\nRESULT: CHALLENGER WINS -- D5 vs C5: [L1] Hebrews 7:14 "x".');const o=T.lyr2024([a]);const pa=JSON.parse(a).payload,po=JSON.parse(o[0]).payload;ok('record only: drv_uncured, verdict_tag and every other payload field unchanged; verdict_raw only grows',Object.keys(po).every(k=>k==='verdict_raw'||JSON.stringify(po[k])===JSON.stringify(pa[k]))&&po.verdict_raw.startsWith(pa.verdict_raw));}
// W1 E2: K-RUD items on REAL 1212-1214 equal before and after
{const TL=load(rb(tu.L,tu.M['Gate Build']),$),BL=load(rb(bu.L,bu.M['Gate Build']),$);for(const id of [1212,1213,1214]){const j=J.find(x=>x.id===id);const a=JSON.stringify(BL.rudPair2024(j.raw)),b=JSON.stringify(TL.rudPair2024(j.raw));ok('W1 E2: rudPair2024 items equal on REAL '+id,a===b,(JSON.parse(a)||[]).length+' items');}}
// gcp2024 unchanged and still first in the record path
ok('gcp2024 source equal in base and target Gate Record',String(T.gcp2024)===String(B.gcp2024));
// replay (W2 L5): by seat and by run
const by={},br={};let lines=0,bodies=0;for(const j of J){const r=run(j.seat,j.raw);bodies++;lines+=r.length;const s=j.seat;by[s]=by[s]||{judgments:0,recorded:0,lines:0};by[s].judgments++;if(r.length)by[s].recorded++;by[s].lines+=r.length;const k=j.run||'(no run token)';br[k]=br[k]||{judgments:0,lines:0,lack:{a:0,b:0,c:0,d:0}};br[k].judgments++;br[k].lines+=r.length;for(const x of r){for(const q of ['a','b','c','d'])if(x.includes('('+q+')'))br[k].lack[q]++;}}
console.log('   REPLAY judgments 1150-1214: '+bodies+' judgments, '+lines+' record lines');console.log('   by seat: '+JSON.stringify(by));for(const k of Object.keys(br))console.log('   run '+k+': '+JSON.stringify(br[k]));
console.log((f?f+' FAIL of ':'')+n+' checks'+(f?'':', ALL OK'));
