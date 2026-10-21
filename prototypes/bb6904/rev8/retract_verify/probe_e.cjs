const fs=require('fs'),path=require('path');
const load=f=>{const L=fs.readFileSync(f,'utf8').split('\n');const i=L.findIndex(l=>/\$\(['"]/.test(l)&&!/^\s*\/\//.test(l));
 return new Function(L.slice(0,i<0?L.length:i).join('\n')+'\n;return {cureVerdicts,cureAsk,cureLines,cureCorrected:typeof cureCorrected==="function"?cureCorrected:null};')();};
const L='D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- (L1) "made of a woman" left unanswered in (CR3).';
const items=[{rule:'K-B',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G1',side:'DEFENDER',link:'D1 vs C7',line:L},{rule:'K-G4',side:'DEFENDER',link:'D1 vs C7',line:L}];
const br={DEFENDER:['D1 vs C7'],CHALLENGER:[]},R0={DR1:'x',DR2:'x',CR3:'y'};const rep=t=>({ok:true,text:t});
const good2='RESTATED: D1 vs C7 (Galatians 4:4): DEFENDER LINK BROKEN -- [L1] "made of a woman" with [L2] G1096 ginomai';
const cases={
 P1_retract_plus_one_result:['RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD-1',v=>v.every(x=>x.status==='CURED')&&v[0].statement.includes('CORRECTED RESULT: HELD-1'),c=>c&&c.word==='HELD'],
 P2_retract_no_result:['RETRACTED: D1 vs C7',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P3_two_same_results:['RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD-1\nCORRECTED RESULT: HELD-1',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P4_bad_tag:['RETRACTED: D1 vs C7\nCORRECTED RESULT: HELD',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P5_result_without_retraction:['CORRECTED RESULT: HELD-1',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P6_old_withdrawn:['WITHDRAWN: D1 vs C7\nCORRECTED RESULT: HELD-1',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P7_bold_keyword:['**RETRACTED: D1 vs C7**\n**CORRECTED RESULT: PARTIAL-3**',v=>v.every(x=>x.status==='CURED'),c=>c&&c.word==='PARTIAL'],
 P8_retract_other_link_with_result:['RETRACTED: D2 vs C6\nCORRECTED RESULT: HELD-1',v=>v.every(x=>x.status==='UNCURED'),c=>c===null],
 P9_restated_plus_retract_no_result:[good2+'\nRETRACTED: D1 vs C7',v=>v[0].status,c=>c===null],
 P10_restated_alone_kb:[good2,v=>v[0].status,c=>c===null],
};
const out={};
for(const f of fs.readdirSync('new').filter(x=>x.endsWith('.js')).sort()){const F=load('new/'+f);
 for(const [k,[t,vc,cc]] of Object.entries(cases)){const v=F.cureVerdicts(items,rep(t),br,R0);const c=F.cureCorrected?F.cureCorrected(rep(t),v):'n/a';const r=vc(v);const ok=(typeof r==='string'?r:(r?'ok':'FAIL'))+'/'+(F.cureCorrected?(cc(c)?'ok':'FAIL'):'n/a');(out[k]=out[k]||{})[ok]=(out[k][ok]||0)+1;}
 const ask=F.cureAsk(items,br);(out.ask=out.ask||{})[(ask.split('CORRECTED RESULT: <BROKEN-1').length-1)+'form,'+(ask.split('A retraction counts only beside one CORRECTED RESULT line').length-1)+'rule,'+(/WITHDRAWN/.test(ask)?'W':'noW')]=((out.ask||{})[(ask.split('CORRECTED RESULT: <BROKEN-1').length-1)+'form,'+(ask.split('A retraction counts only beside one CORRECTED RESULT line').length-1)+'rule,'+(/WITHDRAWN/.test(ask)?'W':'noW')]||0)+1;}
console.log(JSON.stringify(out,null,0).replace(/\},/g,'},\n'));
