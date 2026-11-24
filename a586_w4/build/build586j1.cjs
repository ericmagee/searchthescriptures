// ASK 586 J1 (operator 23:30 CST 11-23, "Rule live now"; plan586.md rev 5 5fc0c8d9, J1 c): the engine's RESULT word follows the keystone rule.
// BROKEN gives CHALLENGER WINS only when the seat's KEYSTONE line does not read STANDS; with the keystone STANDS it gives UNDERDETERMINED.
// One decider (rd386) used by the v25 recompute (LIB 1351), the v61 tag (ert386, LIB 1286) and the gate recompute (LIB 1492). Base: live 587 (7536d7bf / a7113b8d). Offline; nothing written.
const fs=require('fs');const {apply}=require('./libpatch.js');
const S=(line,a,b,what)=>({line,a,b,what});
const KS="function ks586(k){/* ASK 586 J1: the grade word of a KEYSTONE line ('KEYSTONE: D<n> -- STANDS ...'), or null */const t=String(k||'').replace(/[*_`]+/g,'').replace(/^[\\s\\-\\u2022>#]+/,'').trim();const m=t.match(/^KEYSTONE\\s*:\\s*D\\d+\\s*(?:--|\\u2014|\\u2013|-|:)\\s*(STANDS|BROKEN|WITHDRAWN|UNDERDETERMINED)\\b/i);return m?m[1].toUpperCase():null;}\n";
const E=[S(1286,'function rd386(i){',KS+'function rd386(i){','J1a helper: the keystone word'),
 S(1286,"let r;if(w==='BROKEN')","let r;let __k586=null;if(w==='BROKEN')",'J1b flag'),
 S(1286,"(operator 22:26 CST 11-19) */}","(operator 22:26 CST 11-19) */if(r==='CHALLENGER WINS'&&ks586(i.key)==='STANDS'){r='UNDERDETERMINED';__k586='KEYSTONE STANDS (the keystone link is not broken; ASK 586 J1, operator 23:30 CST 11-23: a RESULT against the defender needs the keystone BROKEN)';}}",'J1c BROKEN with the keystone STANDS gives UNDERDETERMINED'),
 S(1286,"if(tie&&(r==='DEFENDER WINS'||r==='CHALLENGER WINS'))return {word:'UNDERDETERMINED',tie:true,why:null};return {word:r,tie:false,why:null};}","if(tie&&(r==='DEFENDER WINS'||r==='CHALLENGER WINS'))return {word:'UNDERDETERMINED',tie:true,why:__k586};return {word:r,tie:false,why:__k586};}",'J1d the reason rides the result'),
 S(1286,"const r=rd386({verdict:v,cst,dst,cd,cc,col:__c400,retracted:ret});","const r=rd386({verdict:v,cst,dst,cd,cc,col:__c400,retracted:ret,key:P.key?P.key.raw:null});",'J1e ert386 (AUDIT v61) passes the keystone line'),
 S(1351,"retracted:__R399});","retracted:__R399,key:P.key?P.key.raw:null});",'J1f v25 recompute passes the keystone line'),
 S(1351,"if(__d386.tie&&trig.indexOf('TIE (KB-0030)')<0)trig.push('TIE (KB-0030)');","if(__d386.tie&&trig.indexOf('TIE (KB-0030)')<0)trig.push('TIE (KB-0030)');if(__d386.why&&/^KEYSTONE STANDS/.test(__d386.why)&&trig.indexOf(__d386.why)<0)trig.push(__d386.why);",'J1g v25 names the keystone rule when it moves the word'),
 S(1492,"retracted:__R399});let res=","retracted:__R399,key:P.key?P.key.raw:null});let res=",'J1h gate recompute passes the keystone line')];
// J1 (a): the rule text in the judges' RESULT instruction (plan rev 5 J1 a, verbatim), in the two judge prompt nodes of the engine
const A_OLD='BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED, and UNDERDETERMINED when it is PROP-DEPENDENT or COLLAPSED.';
const A_NEW=A_OLD+' A RESULT against the defender requires your KEYSTONE line to read BROKEN, by a collision line on the keystone link or by the link it rests on. If your keystone line reads STANDS, you may not write a RESULT against the defender: write UNDERDETERMINED unless your verdict is HELD.';
const {once}=require('./libpatch.js');
for(const [src,out] of [['live587_eng.json','target_engine_586j1.json'],['live587_child.json','target_child_586j1.json']]){const W=JSON.parse(fs.readFileSync(src,'utf8'));const T=JSON.parse(JSON.stringify(W));const r=apply(T,E);
 if(/eng/.test(src))for(const nm of ['Panel Build','Build Independent Verdict']){const n=T.nodes.find(x=>x.name===nm);n.parameters.jsCode=once(n.parameters.jsCode,A_OLD,A_NEW,nm+' J1a');}fs.writeFileSync(out,JSON.stringify(T));console.log(out,JSON.stringify({newsha:r.newsha,map_touched:(r.map_touched||[]).length}));}
