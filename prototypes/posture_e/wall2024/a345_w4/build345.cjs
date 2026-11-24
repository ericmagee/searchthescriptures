// ASK 345 (pkgECW rev 3) build: Wall 7221 + 7223 + 7225; design passes W2 7224, W1 7229. Offline only.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'live_read.json',OUT=process.argv[3]||'target_345.json';
const d=JSON.parse(fs.readFileSync(IN));const U=T.unpack(d);const L=U.L,M=U.M;const N0=L.length;
const ECWSRC=fs.readFileSync(__dirname+'/ecw.js','utf8').trim();
const ed=(i,o,n,tag)=>{const k=L[i].split(o).length-1;if(k!==1)throw new Error(tag+' L'+i+' count '+k);L[i]=L[i].replace(o,()=>n);};
const C5="a rival reading of a contested word is not a break when the answer quotes the row words that carry it (CARRIED BY: a verse the answering round cites, at least 6 words in a row); layers named without such words do not carry a rival reading";
// E1 DeepSeek RULES, RULE E-COL (C5 + C1)
ed(3198,"and it is not broken by a rival reading: an answer that reads a contested word another way, with its own layers quoted in its round, can agree with the meaning on its own reading (pkgECF, W3 2534; either side alike).","and "+C5+" (pkgECF, W3 2534; pkgECW; either side alike).",'E1a');
if(!L[3198].endsWith("\\n'"))throw new Error('E1b end');
L[3198]=L[3198].slice(0,-3)+" CARRIED BY (pkgECW, either side alike): when you DISAGREE with RIGHT: STANDS because the answer\\'s quoted words carry a meaning the link can agree with (a rival reading included), end that same reply line with -- CARRIED BY: <reference> \"<at least 6 words in a row of that verse, as the record holds it>\", a verse the answering round cites (any layer, the order rows included); or -- CARRIED BY: [L2] <word> (<Strong\\'s number>) at <reference>, a word that verse holds. Without it the STANDS is recorded and not sent back. A DISAGREE that rests on an absence, on THE WITNESS LEDGER, on THE FOOTING RULE, or on a line that quotes no answer words needs no CARRIED BY.\\n'";
// E2 send-back rule __ecfR (C5 + C4 display)
ed(2958,"a rival reading of a contested word, footed by the answer\\'s own layers, is not a break.",C5+".",'E2a');
ed(2958,"' An item left without either counts against your seat.';","' An item left without either counts against your seat.'+ECW.show(i.ecw);",'E2b');
// E3/E4 carry the shown row on the send-back item (flow JSON, never a DB row)
ed(2933,"reason:why(x),ecl:x.ecl||null,","reason:why(x),ecl:x.ecl||null,ecw:x.rule==='E-COL'?ECW.item(x):null,",'E3');
ed(2963,"line:i.line,reason:i.reason,ecl:i.ecl||null,","line:i.line,reason:i.reason,ecl:i.ecl||null,ecw:i.ecw||null,",'E4');
// E5/E6 cure: third KEEP checked against the row text the judge was shown
ed(2781,"ecl:it.ecl||null},a||","ecl:it.ecl||null,ecw:it.ecw||null},a||",'E5');
ed(2690,"const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);return res(b2.ok,'KEEP that '+b2.why);}","const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);if(!b2.ok&&it.ecw){const k3=ECW.keep3(a.why,it.ecw,PRS);if(k3)return res(true,'KEEP that '+k3);}return res(b2.ok,'KEEP that '+b2.why);}",'E6');
// E7/E8 true-status label (C3)
ed(3410,"' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)'","' (judge wrote '+x.grade+'; '+ECW.label(x.rule,v,x)+', ruling 428)'",'E7');
ed(3415,"' (judge wrote FORCED; RECORD-ONLY TRIAL, ruling 428)'","' (judge wrote FORCED; '+ECW.label('E-COL')+', ruling 428)'",'E8');
// E9 the gate (C1, C2), on the enforcer's full sentence
ed(3461,"rows.push(...CODE);","const __ecw=(()=>{const ids=[];B.forEach(b=>(b.ids||[]).forEach(x=>ids.push(x)));try{return ECW.apply(rows,ids,V,__rdRounds);}catch(e){return {error:String(e&&e.message||e).slice(0,160)};}})(); /* pkgECW */rows.push(...CODE);",'E9');
ed(3462,"esr:__esr}","esr:__esr,ecw:__ecw}",'E9b');
// E10 the module, one new line, read first by the 9 nodes that use it
L.push(ECWSRC);const NL=L.length-1;
const NODES=['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record','Send Back Build','Alt Send Back Build','R2 Alt Send Back Build','Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'];
for(const k of NODES){if(!M[k])throw new Error('no map '+k);M[k].p.unshift(NL);}
// every node whose rebuilt text uses a changed line must hold ECW
const users=i=>Object.keys(M).filter(k=>M[k].p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&i>=e[0]&&i<=e[1])));
for(const i of [2958,2933,2963,2781,2690,3410,3415,3461,3462])for(const k of users(i))if(!NODES.includes(k))throw new Error('L'+i+' used by '+k+' which lacks ECW');
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
// E11 the 3 Record stubs name the nodes the gate reads (the task runner sends only literally named nodes)
const stubs=[];for(const k of ['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record']){const n=d.nodes.find(x=>x.name===k);const c=n.parameters.jsCode;const m=c.match(/if\(false\)\{([^}]*)\}/);if(!m)throw new Error('stub '+k);
 n.parameters.jsCode=c.replace(m[0],()=>'if(false){'+m[1]+'$("Cited Verses");$("L2 Words");}');stubs.push(k);}
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
for(const k of Object.keys(M)){try{P(T.rb(L,M[k]));}catch(e){throw new Error('parse '+k+': '+e.message);}}
for(const k of stubs){try{P(d.nodes.find(x=>x.name===k).parameters.jsCode);}catch(e){throw new Error('parse stub '+k+': '+e.message);}}
// literal $() names: every $('X') in a rebuilt source must be named in its stub
const miss=[];for(const k of NODES){const src=T.rb(L,M[k]);const stub=d.nodes.find(x=>x.name===k).parameters.jsCode;const names=new Set([...src.matchAll(/\$\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m=>m[1]));for(const nm of names)if(!stub.includes('$("'+nm+'")')&&!stub.includes("$('"+nm+"')"))miss.push(k+' -> '+nm);}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('lib lines',N0,'->',L.length,'| new line',NL,'| MAP lengths changed',ch.length,ch.join(', '),'| lib sha',lsha,'| stubs',stubs.length,'| unnamed $() reads',miss.length?miss.join('; '):'none');
