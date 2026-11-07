// The stacked build (node pkgKFF/build_KFF.cjs --on pkgKWR/patched,pkgUNXA2/patched): the K-FF item and its cure on 33249, and parity with the
// stack's own nodes on 33218. Run from wall2024/: node pkgKFF/test_KFF_on_KWR.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');let ok=0,bad=0;const t=(n,c)=>{if(c){ok++;console.log('OK  ',n);}else{bad++;console.log('FAIL',n);}};
const P=n=>fs.readFileSync('pkgKFF/patched_on_KWR/'+n.replace(/ /g,'_')+'.js','utf8'),B=n=>fs.readFileSync('pkgKFF/base_on_KWR/'+n.replace(/ /g,'_')+'.js','utf8');
const pp=harness('33249')(P('Panel Payloads'),'Reserve Needed?');t('S1 33249: chatgpt gets one K-FF item D5 vs C1',pp[0].json.summary[1].drv.filter(x=>x.rule==='K-FF'&&x.link==='D5 vs C1').length===1);
const N2=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/33249_Panel_Cure_Normalize_2.json','utf8'));const c=JSON.parse(JSON.stringify((N2[0].data||N2[0]).main[0]));
c[0].json.reply.text='RESPONSE: K-FF D5 vs C1 | rewritten below.\nFORCED: D5 vs C1 -- MEANS [CR3]: "Joseph\'s knowing of Mary is stated as not occurring until after the birth" -- ANSWER [DR3]: "The \\"till\\" bounds the not-knowing to the span from the taking to the birth." -- FAILS: "bounds the not-knowing to the span from the taking to the birth"';
const o=JSON.stringify(harness('33249',{'Panel Payloads':pp,'Panel Cure Normalize 2':c})(P('Panel Cure Check'),'Panel Cure Normalize 3'));t('S2 33249: the rewritten FAILS cures K-FF',/RULE: K-FF; RESULT: CURED/.test(o));
for(const n of ['Panel Payloads'])t('S3 33218 '+n+': equals the stack base',JSON.stringify(harness('33218')(B(n),'Reserve Needed?'))===JSON.stringify(harness('33218')(P(n),'Reserve Needed?')));
t('S4 33218 Panel Cure Check: equals the stack base',JSON.stringify(harness('33218')(B('Panel Cure Check'),'Panel Cure Normalize 3'))===JSON.stringify(harness('33218')(P('Panel Cure Check'),'Panel Cure Normalize 3')));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
