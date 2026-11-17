// ASK 360 tests. Usage: node t360.cjs [target] [base]. REAL = stored text; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_360.json')),lw=JSON.parse(fs.readFileSync(process.argv[3]||'../rdf/fetchback_s245.json'));const tu=unpack(tw),lu=unpack(lw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);ok('library lines changed are 1579, 1582, 1583 only; line count unchanged',tu.L.length===lu.L.length&&dl.join()==='1579,1582,1583',dl.join(','));
const LN={};for(const x of lw.nodes)LN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(LN[x.name])).map(x=>x.name);ok('only the Shared Library node changed; node order, connections, settings equal',dn.join()==='Shared Library'&&tw.nodes.map(x=>x.name).join()===lw.nodes.map(x=>x.name).join()&&JSON.stringify(tw.connections)===JSON.stringify(lw.connections)&&JSON.stringify(tw.settings)===JSON.stringify(lw.settings),dn.join(','));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k]));ok('changed MAP entries are exactly Alternate Merge Seat, R2 Alternate Merge Seat',ch.sort().join()==='Alternate Merge Seat,R2 Alternate Merge Seat',ch.join(','));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry ('+ch.length+')',syn.length===0,syn.join(' | '));
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const res={};for(const k of ch){const T=load(rb(tu.L,tu.M[k]),$),B=load(rb(lu.L,lu.M[k]),$);res[k]={T,B};}
const {T,B}=res['Alternate Merge Seat'];const live=T.__rmrLive;ok('loader gives rmrOf and __rmrLive (K-F LIVE, K-RUL not LIVE)',typeof T.rmrOf==='function'&&live('K-F')&&!live('K-RUL'),live('K-F')+','+live('K-RUL'));
const txt=(F,raw,d)=>{const r=F.rmrOf(raw,d,live);return T.__rmrTxt({...r,drv:d});};
// REAL luna 38106
const lun=JSON.parse(fs.readFileSync('luna38106.json'))[0];
const bT=txt(B,lun.raw,lun.drv),tT=txt(T,lun.raw,lun.drv);
console.log('   base  : '+bT+'\n   target: '+tT);
ok('REAL luna 38106: base reads K-F x1 and E-GATE x1, count differs',bT==='drv_uncured 1: K-F (cure) x1; E-GATE CONTRADICTION x1 (read 2, count differs)',bT);
ok('REAL luna 38106: target reads E-GATE CONTRADICTION x1 only, match true',tT==='drv_uncured 1: E-GATE CONTRADICTION x1'&&T.rmrOf(lun.raw,1,live).match===true,tT);
const v21=lun.raw.split('\n').find(l=>/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: luna; ITEM: D5 vs C5; RULE: K-F;/.test(l)),v52=lun.raw.split('\n').find(l=>/^\[AUDIT v52/.test(l));
const i21=v21.match(/ITEM: ([^;]*); RULE: ([^;]+); RESULT/),i52=v52.match(/ITEM: (.*?); RULE: ([^;]+?); /);
console.log('   A2 forms: v21 ITEM ['+i21[1]+'] RULE ['+i21[2]+']; v52 ITEM ['+i52[1]+'] RULE ['+i52[2]+']');
ok('A2/A3: v21 and v52 ITEM and RULE are byte equal in the real lines',i21[1]===i52[1]&&i21[2]===i52[2]);
// PLANTS
const L21=(item,rule,res)=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: x; ITEM: '+item+'; RULE: '+rule+'; RESULT: '+res+'; WHY: w; LINE: l; STATEMENT: s]';
const L52=(item,rule)=>'[AUDIT v52: CURE COUNT OFF (pkgGCP) -- SEAT: x; ITEM: '+item+'; RULE: '+rule+'; an applied change replaced the line and cleared it; its count comes off]';
const R=(F,lines,d)=>{const r=F.rmrOf(lines.join('\n'),d,live);return r.rules.join('; ')+' | total '+r.total;};
const P=[
 ['A1 PLANT: v52 matching a CURED v21 subtracts nothing',[L21('D5 vs C5','K-F','CURED'),L21('D1 vs C1','K-F','UNCURED'),L52('D5 vs C5','K-F')],1,'K-F (cure) x1 | total 1'],
 ['A1 PLANT: v52 matching a not-LIVE (TRIAL) v21 subtracts nothing',[L21('DEFENDER premise 5','K-RUL','UNCURED'),L21('D1 vs C1','K-F','UNCURED'),L52('DEFENDER premise 5','K-RUL')],1,'K-F (cure) x1 | total 1'],
 ['W2 PLANT: v52 ITEM in other case and spacing still matches',[L21('D5 vs C5','K-F','UNCURED'),L52('d5  vs  c5','K-F')],0,' | total 0'],
 ['PLANT: one v52 takes off one of two equal v21 lines',[L21('D5 vs C5','K-F','UNCURED'),L21('D5 vs C5','K-F','UNCURED'),L52('D5 vs C5','K-F')],1,'K-F (cure) x1 | total 1'],
 ['PLANT: v52 of another RULE subtracts nothing',[L21('D5 vs C5','K-F','UNCURED'),L52('D5 vs C5','K-G4')],1,'K-F (cure) x1 | total 1'],
 ['PLANT: v52 of another ITEM subtracts nothing',[L21('D5 vs C5','K-F','UNCURED'),L52('D4 vs C5','K-F')],1,'K-F (cure) x1 | total 1'],
 ['PLANT: v52 line written before its v21 line still matches',[L52('D5 vs C5','K-F'),L21('D5 vs C5','K-F','UNCURED')],0,' | total 0'],
];
for(const [t,ls,d,want] of P){const g=R(T,ls,d);ok(t,g===want,g);}
const nov=[L21('D5 vs C5','K-F','UNCURED'),L21('D1 vs C1','K-G4','UNCURED')];ok('PLANT: no v52 line gives the base reading',R(T,nov,2)===R(B,nov,2),R(T,nov,2));
ok('R2 Alternate Merge Seat entry gives the same luna reading',res['R2 Alternate Merge Seat'].T.__rmrTxt({...res['R2 Alternate Merge Seat'].T.rmrOf(lun.raw,1,live),drv:1})===tT);
// REPLAY over stored removals
if(fs.existsSync('removed_all.json')){const rows=JSON.parse(fs.readFileSync('removed_all.json'));let same=0;const diff=[];for(const r of rows){const a=txt(B,r.raw,r.drv),b=txt(T,r.raw,r.drv);if(a===b)same++;else diff.push(r.run+' '+r.seat+': '+a+' => '+b+(/AUDIT v52/.test(r.raw)?' [has v52]':' [NO v52]'));}
 console.log('   replay '+rows.length+' stored removals: '+same+' unchanged, '+diff.length+' changed');diff.forEach(x=>console.log('   CHANGED '+x));ok('REPLAY: every changed reading holds an AUDIT v52 line',diff.every(x=>x.endsWith('[has v52]')),diff.length+' changed');}
console.log(n-fails+' of '+n+' pass');process.exit(fails?1:0);
