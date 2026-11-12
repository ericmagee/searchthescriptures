// W2 full-path plants on pkgP72: edit a stored judge line in the export, run the whole enforcer Build, read r372 and the DeepSeek prompt block per item
const run=require('./h.cjs');const PAR=process.argv[2]||'parent_s145_P72r6.json';
const A='Premise 2, LINK 2: UNEXHIBITED, John 3:6 is left unanswered in its pressed meaning; premise 5';
const P=[
 // [label, run, from, to, expect: map id-> true(block kept)/false(withheld)]
 ['A0 stored line',null,null,null,{'33371 Judge P2.2':true,'33371 Judge P5.2':true}],
 ['A1 "Premise 2: VOID (Commitment 6)"','33371',A,'Premise 2: VOID (Commitment 6); premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A2 "VOID: premise 2"','33371',A,'VOID: premise 2; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A3 "Premise 2 -- VOID"','33371',A,'Premise 2 -- VOID; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A4 "Premise 2 (VOID)"','33371',A,'Premise 2 (VOID); premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A5 "Premise 2\'s charge is VOID"','33371',A,"Premise 2's charge is VOID; premise 5",{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A6 "Premises 2 and 5 are VOID"','33371',A,'Premises 2 and 5 are VOID; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':false}],
 ['A7 "Premise 2 is not VOID but premise 5 is VOID"','33371',A,'Premise 2 is not VOID, but premise 5 is VOID; premise 5',{'33371 Judge P2.2':true,'33371 Judge P5.2':false}],
 ['A8 "Premise 2 was not ruled VOID"','33371',A,'Premise 2 was not ruled VOID; premise 5',{'33371 Judge P2.2':true,'33371 Judge P5.2':true}],
 ['A9 "Premise 2 is no longer held VOID"','33371',A,'Premise 2 is no longer held VOID; premise 5',{'33371 Judge P2.2':true,'33371 Judge P5.2':true}],
 ['A10 "Premise 2 is not counted and is VOID"','33371',A,'Premise 2 is not counted and is VOID; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A11 "Premise 12 is VOID" (other number)','33371',A,'Premise 12 is VOID; premise 5',{'33371 Judge P2.2':true,'33371 Judge P5.2':true}],
 ['A12 "Premise 2 stands VOIDED"','33371',A,'Premise 2 stands VOIDED; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['A13 "VOID -- premises 2, 5"','33371',A,'VOID -- premises 2, 5; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':false}],
 ['A14 "Premise 2 is VOID under Commitment 6" in lower case "void"','33371',A,'premise 2 is void under Commitment 6; premise 5',{'33371 Judge P2.2':false,'33371 Judge P5.2':true}],
 ['B1 ANSWER CHECK line itself rules premise 2 VOID','33371','between flesh and Spirit (Commitment 5).','between flesh and Spirit (Commitment 5); premise 2 is VOID.',{'33371 Judge P2.2':false,'33371 Alt P2.1':true,'33371 Judge P5.2':true}], /* grok's block is grok's own ANSWER CHECK line, which the plant does not touch (my first expectation was wrong) */
 ['C1 alternate path: grok "Premise 5 VOID" in CHALLENGER CONCEDED LINKS','35173','Premises 2, 3, 4 and 5 are spared: each [DR3] block','Premise 5 VOID. Premises 2, 3 and 4 are spared: each [DR3] block',{'35173 Alt P11.1':false,'35173 Alt P8.1':true}],
 ['C2 alternate path: grok "Premises 2 through 5 VOID"','35173','Premises 2, 3, 4 and 5 are spared: each [DR3] block','Premises 2 through 5 VOID. None spared: each [DR3] block',{'35173 Alt P11.1':false,'35173 Alt P8.1':false}],
];
(async()=>{let ok=0,bad=0,mis=0;for(const [lab,r,from,to,exp] of P){const opts=r?{only:r,plant:(raw)=>{const n=raw.split(from).length-1;if(!n)throw new Error('anchor missing '+lab);return raw.split(from).join(to);}}:{only:'33371'};
 const o=await run(PAR,opts);const res=[];for(const [key,e] of Object.entries(exp)){const [rn,nd,id]=key.split(' ');const rows=o.filter(x=>x.run===rn&&x.node.startsWith(nd)&&x.id===id);const kept=rows.some(x=>x.blk),r3=rows.some(x=>x.r372&&x.r372.length);if(kept!==r3)mis++;const good=kept===e&&r3===e;good?ok++:bad++;res.push(key+(e?' keep':' withhold')+': block '+(kept?'YES':'no')+', r372 '+(r3?'YES':'no')+(good?'':'  <<< WRONG'));}
 const allMis=o.filter(x=>x.id&&!!x.blk!==!!(x.r372&&x.r372.length)).length;console.log(lab,'| prompt/r372 mismatches in run:',allMis);res.forEach(x=>console.log('   ',x));}
console.log('TOTAL checks right',ok,'wrong',bad,'block/r372 mismatches',mis);})();
