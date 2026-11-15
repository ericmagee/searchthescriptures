// W2 replay of 6718 (a) on luna's 37281 premise 5 line: run s209 Gate Build kunxLines() on the actual line and on W3-worded ASSUMES forms.
// CR3 = defender round 3 (debate_results.engine_r3); premise 5 block copied verbatim from the row; blocks 1-4 are heading stubs (range check only).
const fs=require('fs');const W=JSON.parse(fs.readFileSync(__dirname+'/../../../writes_s209/fetchback_live_s209.json','utf8'));const w=W.nodes?W:(W.workflow||W.data);
const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');const src=rb(MAP['Gate Build'],LIB);
const $=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[]});
let kunxLines;try{new Function('$','$input','items','$json','$node','$execution','$workflow','require','globalThis.__K=kunxLines;\n'+src)($,null,[],{},{},{},{},require);}catch(e){console.log('src stopped:',String(e).slice(0,120));}kunxLines=globalThis.__K;
const B5=fs.readFileSync(__dirname+'/b5_37281.txt','utf8');
const stub=n=>'**LINK '+n+': SUPPORTED.**\n\n- **[L1]** Luke 1:31: "thou shalt conceive in thy womb"\n- **[L3]** Luke 1:27: "espoused to a man whose name was Joseph"\n\n---\n\n';
const R={CR3:stub(1)+stub(2)+stub(3)+stub(4)+B5,DR3:''};
const head='DEFENSE STANDING: x\n';
const C={
 actual_40012:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED (assumed Davidic descent through Mary, with no quoted row establishing it).',
 W3_form_no_L1:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. ASSUMES: Mary is of the house of David, a fact no row in the rounds gives.',
 W3_form_with_L1:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. ASSUMES: Mary is of the house of David, a fact no row in the rounds gives; the block\'s [L1] Luke 1:42 "blessed [is] the fruit of thy womb" does not state it.',
 W3_form_with_first_L1:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. ASSUMES: Mary is of the house of David, a fact no row in the rounds gives; the block\'s [L1] Luke 1:35 "that holy thing which shall be born of thee" does not state it.',
 W3_form_L1_no_token:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. ASSUMES: Mary is of the house of David, a fact no row in the rounds gives; Luke 1:35 "that holy thing which shall be born of thee" does not state it.',
 W3_form_act:'CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. ASSUMES: the begetting of the flesh in Mary\'s womb, which no row in the rounds gives.',
};
for(const [k,t] of Object.entries(C)){const r=kunxLines(head+t,R);console.log('\n##',k,'-> items',r.items.length);r.items.forEach(x=>console.log('  rule',x.rule,'a=',x.a||'(plain)','asm=',JSON.stringify(x.asm||''),'| why:',x.why.slice(0,200)));}
