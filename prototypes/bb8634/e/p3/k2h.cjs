// BB-8634 K2 fold falsifier (8686, 8687): LINK-only list with repeated / out-of-order labels, defender answering by position.
const fs=require('fs');
const iv0=JSON.parse(fs.readFileSync('p3/iv_30091.json'))[0].independent_verdict_raw;const iv=iv0.slice(0,iv0.indexOf('\n\n['));
const r=JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0];
const prev={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3};
const NEWL=['2','2','3','5','6','6'];let k=0;const gr2X=String(prev.gr2).replace(/^LINK [1-6]:/gm,()=>'LINK '+NEWL[k++]+':');
const run=(file,pv,text)=>{const code=fs.readFileSync(file,'utf8');const $input={first:()=>({json:{choices:[{message:{content:text},finish_reason:'stop'}]}})};const $=()=>({first:()=>({json:pv})});const o=(new Function('$input','$',code))($input,$)[0].json;return o.independent_verdict_raw;};
const pick=raw=>raw.split('\n').filter(l=>/WITHDRAWN MISSED|SPLIT LINK/.test(l)).map(l=>l.slice(0,90));
console.log('relabelled lines:',k);
for(const [lab,f] of [['before fold','p3/x_beforeK2.js'],['after fold','p3/new/Extract_Independent_Verdict.js']]){
 console.log('==',lab,'| relabelled list:',JSON.stringify(pick(run(f,{...prev,gr2:gr2X},iv))));
 console.log('==',lab,'| original 30091:',JSON.stringify(pick(run(f,prev,iv))));}
const a=run('p3/x_beforeK2.js',prev,iv),b=run('p3/new/Extract_Independent_Verdict.js',prev,iv);console.log('30091 original, whole output equal before/after fold:',a===b);
const ivB0=JSON.parse(fs.readFileSync('p3/iv_runB.json'))[0].independent_verdict_raw;const cB=ivB0.indexOf('\n\n[');const ivB=cB>0?ivB0.slice(0,cB):ivB0;
const rB=JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0];const pB={cr1:rB.claude_r1,gr1:rB.engine_r1,cr2:rB.claude_r2,gr2:rB.engine_r2,cr3:rB.engine_r3,dr3:rB.challenger_r3};
console.log('run B, whole output equal before/after fold:',run('p3/x_beforeK2.js',pB,ivB)===run('p3/new/Extract_Independent_Verdict.js',pB,ivB));
