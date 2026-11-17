// ASK 361 tests. Usage: node t361.cjs [target] [base]. REAL = stored text; PLANT = made for the test.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
let fails=0,n=0;const ok=(t,c,d)=>{n++;console.log((c?'ok  ':'FAIL')+' '+t+(d?' :: '+d:''));if(!c)fails++;};
const tw=JSON.parse(fs.readFileSync(process.argv[2]||'target_361.json')),lw=JSON.parse(fs.readFileSync(process.argv[3]||'../rdf/fetchback_s245.json'));const tu=unpack(tw),lu=unpack(lw);
const dl=tu.L.map((l,i)=>l!==lu.L[i]?i:-1).filter(i=>i>=0);ok('library line changed is 1754 only; line count unchanged',tu.L.length===lu.L.length&&dl.join()==='1754',dl.join(','));
const LN={};for(const x of lw.nodes)LN[x.name]=x;const dn=tw.nodes.filter(x=>JSON.stringify(x)!==JSON.stringify(LN[x.name])).map(x=>x.name);ok('only the Shared Library node changed; node order, connections, settings equal',dn.join()==='Shared Library'&&tw.nodes.map(x=>x.name).join()===lw.nodes.map(x=>x.name).join()&&JSON.stringify(tw.connections)===JSON.stringify(lw.connections)&&JSON.stringify(tw.settings)===JSON.stringify(lw.settings),dn.join(','));
const bad=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k]).length!==tu.M[k].n);ok('every MAP entry rebuilds to its n',bad.length===0,Object.keys(tu.M).length+' entries');
const ch=Object.keys(tu.M).filter(k=>rb(tu.L,tu.M[k])!==rb(lu.L,lu.M[k])).sort();const W=['Alt Gate Build','Alt Gate Record','Alt Late Gate Build','Gate Build','Gate Record','Late Gate Build','R2 Alt Gate Build','R2 Alt Gate Record','R2 Alt Late Gate Build'];ok('changed MAP entries are exactly the nine (W1 7589 item 6)',ch.join()===W.join(),ch.length+': '+ch.join(', '));
const syn=[];for(const k of ch){try{new Function('$','$input','return (async()=>{\n'+rb(tu.L,tu.M[k])+'\n})();');}catch(e){syn.push(k+': '+e.message);}}ok('syntax of every changed entry ('+ch.length+')',syn.length===0,syn.join(' | '));
const cut=(s,f)=>{const i=s.indexOf('function '+f+'(');let d=0;for(let j=s.indexOf('{',i);j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(!d)return s.slice(i,j+1);}}};
ok('rudPair2024 byte for byte (W1 7589 item 6)',cut(tu.L[1754],'rudPair2024')===cut(lu.L[1754],'rudPair2024'),String((cut(tu.L[1754],'rudPair2024')||'').length)+' chars');
const $=()=>({all:()=>[],first:()=>({json:{}}),isExecuted:false});
const T=load(rb(tu.L,tu.M['Gate Build']),$),B=load(rb(lu.L,lu.M['Gate Build']),$);ok('loader gives gateVnv2024 on both',typeof T.gateVnv2024==='function'&&typeof B.gateVnv2024==='function');
const K=(F,t)=>F.gateVnv2024(t).map(x=>x.key).sort().join(',');
// REAL sol 1213 (run 38106)
const rows=JSON.parse(fs.readFileSync('void_lines.json'));const sol=rows.find(r=>r.id===1213);
ok('REAL sol 1213: base gives no item',K(B,sol.k)==='',K(B,sol.k));
ok('REAL sol 1213: target gives one item VNV|CHALLENGER|3',K(T,sol.k)==='VNV|CHALLENGER|3',K(T,sol.k));
const it=T.gateVnv2024(sol.k)[0];console.log('   lines: '+JSON.stringify(it&&it.lines.map(x=>x.slice(0,140))));
// PLANTS
const CS='CHALLENGE STANDING: SELF-SUPPORTED -- premise 3 is VOID as charged.\n';const R3='RULING -- challenger premise 3 -- VOID\n';
const P=[
 ['PLANT: "not excluded as void" in its own premise segment',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not excluded as void.','VNV|CHALLENGER|3'],
 ['PLANT: "is not void" lower case (already read in base)',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not void.','VNV|CHALLENGER|3'],
 ['PLANT: retraction alone, "its earlier void ruling card is retracted"',R3+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 stands; ok.\nCHALLENGER CONCEDED LINKS: 0 -- premise 3 is counted, and its earlier void ruling card is retracted.','VNV|CHALLENGER|3'],
 ['PLANT: "I withdraw the VOID ruling" form',R3+'CHALLENGER CONCEDED LINKS: 0 -- premise 3: I withdraw the VOID ruling on it.','VNV|CHALLENGER|3'],
 ['B1 PLANT: "not only void" is not read as not VOID',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not only void but unanswered.',''],
 ['B1 PLANT: "not merely void" is not read as not VOID',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not merely void.',''],
 ['B1 PLANT: "is not, if it stands, void" (conditional in the gap)',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not, if it stands, void.',''],
 ['PLANT: "not ruled void" is read',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not ruled void.','VNV|CHALLENGER|3'],
 ['PLANT: "do not revive the void charges" is not read (REAL 1172 shape)',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 enters neither count, and its witnesses do not revive the void charges.',''],
 ['PLANT: "not excluded as void of support" is not read by the new pattern',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not excluded as void of support.',''],
 ['PLANT: three words between "not" and "void" is not read',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not in any way void.',''],
 ['B2 PLANT: a retraction about premise 4 in the same line is not read for premise 3',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is counted, and premise 4\'s earlier void ruling card is retracted.',''],
 ['N1 PLANT: "Premise 2 is counted; the charge is not treated as void." gives no item',CS.replace('premise 3','premise 2')+'CHALLENGER CONCEDED LINKS: 0 -- Premise 2 is counted; the charge is not treated as void.',''],
 ['B3 PLANT: "the NOT VOID ruling card is retracted" is not read as not VOID',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3: the NOT VOID ruling card is retracted.',''],
 ['B3 PLANT: same, lower case "not void ruling card is withdrawn"',CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3: the not void ruling card is withdrawn.',''],
 ['PLANT: other side is not mixed (DEFENDER not void, CHALLENGER VOID)',CS+'CONCEDED LINKS: 0 -- premise 3 is not excluded as void.',''],
 ['PLANT: plural list "Premises 2 and 3 are not treated as void"',CS+'CHALLENGER CONCEDED LINKS: 0 -- Premises 2 and 3 are not treated as void.','VNV|CHALLENGER|3'],
];
for(const [t,txt,want] of P){const g=K(T,txt);ok(t,g===want,g||'(none)');}
{const x=CS+'CHALLENGER CONCEDED LINKS: 0 -- premise 3 is not void of support.';ok('LIMIT (base, unchanged): "is not void of support" reads as not VOID in base and target alike',K(T,x)===K(B,x),K(B,x)+' / '+K(T,x));}
// REPLAY (B4, N3)
let same=0;const nw=[],gone=[];for(const r of rows){const a=new Set(B.gateVnv2024(r.k).map(x=>x.key)),bb=T.gateVnv2024(r.k);const b=new Set(bb.map(x=>x.key));if([...a].join()===[...b].join()){same++;continue;}for(const x of bb)if(!a.has(x.key))nw.push({id:r.id,seat:r.seat,key:x.key,lines:x.lines});for(const k of a)if(!b.has(k))gone.push(r.id+' '+k);}
console.log('   replay '+rows.length+' judgments holding a labelled line with "void": '+same+' unchanged; new items '+nw.length+'; items lost '+gone.length);
for(const x of nw){console.log('   NEW '+x.id+' '+x.seat+' '+x.key);x.lines.forEach(l=>console.log('      | '+l.slice(0,400)));}
gone.forEach(g=>console.log('   LOST '+g));
ok('REPLAY: no item is lost',gone.length===0,gone.length+' lost');
fs.writeFileSync('replay361.json',JSON.stringify({nw,gone},null,1));
console.log(n-fails+' of '+n+' pass');process.exit(fails?1:0);
