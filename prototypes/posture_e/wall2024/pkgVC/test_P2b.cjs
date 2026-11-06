// Part 2b test on the stored run 32949 chatgpt row (the live failure): the cureCorrected path now writes the header.
const fs=require('fs');const c=fs.readFileSync('pkgVC/patched/Panel_Cure_Check.js','utf8');
const pick=(name,ends)=>{const i=c.indexOf(name);let j=c.length;for(const e of ends){const k=c.indexOf(e,i+name.length);if(k>0&&k<j)j=k;}return c.slice(i,j);};
eval(pick('function rcObjEnd(',['\nfunction ','\nconst ','\nlet ']));eval(pick('function cureSupHead(',['\n']));
const F=JSON.parse(fs.readFileSync('pkgVC/fixture_32949_chatgpt.json','utf8'));let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};
const base=F.before_corr;const out=cureSupHead(base,'BROKEN','HELD');
const a=out.indexOf('{'),b=rcObjEnd(out,a);const o=JSON.parse(out.slice(a,b));
T(o.reasoning.startsWith('SUPERSEDED BY CURE: verdict BROKEN to HELD; see the cure lines below\nBROKEN. [L1] The record presents'),'H1-live 32949 chatgpt: reasoning opens with the header, then the judge\'s own "BROKEN." text');
const a0=base.indexOf('{'),b0=rcObjEnd(base,a0);const o0=JSON.parse(base.slice(a0,b0));
T(JSON.stringify({...o,reasoning:o.reasoning.replace(/^SUPERSEDED BY CURE: [^\n]*\n/,'')})===JSON.stringify(o0)&&out.slice(b)===base.slice(b0)&&out.slice(0,a)===base.slice(0,a0),'G-live: nothing else changes (object fields and the text after the object)');
T(cureSupHead(out,'BROKEN','HELD')===out,'idempotent: a second call adds nothing');
T(cureSupHead(base,'HELD','HELD')===base&&cureSupHead(base,null,'HELD')===base,'no header when the verdict did not change');
console.log(bad?'FAILURES '+bad:'ALL OK');
