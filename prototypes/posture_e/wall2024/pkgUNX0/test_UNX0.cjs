// pkgUNX0 tests (kunxLines copied byte for byte with everything it uses). Fixture: the 33289 grok CR3 block 6 (exhibits L1, L2, L3), pkgUNXL.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');
const DIR=process.argv[2]||'pkgUNX0/patched';const BDIR=DIR==='pkgUNX0/patched'?'pkgUNX0/base':DIR+'_base';
let ok=0,bad=0;const t=(n,c,x)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n,x||'');}};
const lib=code=>new Function('$',closure(code,['kunxLines']).text+';return kunxLines;')(()=>{throw 0;});
const FX=JSON.parse(fs.readFileSync('pkgUNXL/fixture_33289_grok.json','utf8'));const R={CR3:FX.CR3,DR3:'',CR1:'',DR1:'',CR2:'',DR2:''};
const key=x=>x.rule+'|'+(x.side||'')+'|'+String(x.link).toUpperCase(); /* gateNewK2024's key */
const T1='DEFENSE STANDING: PROP-DEPENDENT -- L=6 c=1\nCONCEDED LINKS: 1 -- premise 6 UNEXHIBITED; premises 1-5 spared.\nPremise 6: UNEXHIBITED (its answer to the press fails to show fit)\nCHALLENGE STANDING: PROP-DEPENDENT -- L=6 c=0\nCHALLENGER CONCEDED LINKS: 0';
const T0=T1.replace('CONCEDED LINKS: 1 -- premise 6 UNEXHIBITED; premises 1-5 spared.','CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT DEFENDER 0).').replace('c=1','c=0');
for(const node of ['Gate Record','Gate Build','Panel Payloads','Panel Cure Check']){const f=node.replace(/ /g,'_')+'.js';const kb=lib(fs.readFileSync(BDIR+'/'+f,'utf8')),kp=lib(fs.readFileSync(DIR+'/'+f,'utf8'));
 const b0=kb(T0,R).items,b1=kb(T1,R).items,p0=kp(T0,R).items,p1=kp(T1,R).items;
 t(node+' A base: the stray line under count 0 raises K-UNX premise 6 (the 33311 gemini shape)',b0.some(x=>x.link==='DEFENDER premise 6'),JSON.stringify(b0));
 t(node+' B base: the gate re-read drops the count-1 item as not new',b1.some(x=>x.link==='DEFENDER premise 6')&&b1.filter(x=>!new Set(b0.map(key)).has(key(x))).length===0);
 t(node+' C patched: count 0 raises nothing',p0.length===0,JSON.stringify(p0));
 t(node+' D patched: count 1 raises K-UNX premise 6, and the gate re-read reports it as new',p1.some(x=>x.link==='DEFENDER premise 6')&&p1.filter(x=>!new Set(p0.map(key)).has(key(x))).some(x=>x.link==='DEFENDER premise 6'));
 t(node+' E patched: the stored 33289 grok count (count 1) is read as before',JSON.stringify(kp(FX.count,R))===JSON.stringify(kb(FX.count,R)));}
console.log(ok+' OK, '+bad+' FAIL ('+DIR+')');process.exit(bad?1:0);
