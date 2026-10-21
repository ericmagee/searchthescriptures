// E's probe (7254): why the K-B check counts 1 layer kind on gemini's D6 vs C6 line in 27528. Uses the module verified equal to 804b870a.
const N=require(process.argv[2]);
const base='D6 vs C6 (Isaiah 7:14): DEFENDER LINK BROKEN -- the challenger exhibited [L1] "a virgin espoused... the virgin\'s name was Mary" (Luke 1:27) with the Greek [L2] *parthenos*, and [L3] Isaiah 7:14 to prove the sign requires no man be the begetter, and the defender\'s link round left these witnesses unanswered.';
const vars={
 'as stored':base,
 'L1 quote without the apostrophe word':base.replace("the virgin\\'s name was Mary","the virgin name was Mary").replace("the virgin's name was Mary","the virgin name was Mary"),
 'L1 quote without the ellipsis':base.replace('espoused... the','espoused to a man whose name was Joseph; and the'),
 'L2 in Greek script':base.replace('*parthenos*','παρθένος'),
};
for(const [k,l] of Object.entries(vars)){const t='COLLISION POINTS:\n'+l+'\nCONCEDED LINKS: 0\n';
 const it=N.drvCheck(t,0,1,'PROP-DEPENDENT','PROP-DEPENDENT',false).items.filter(x=>x.rule==='K-B');
 console.log(k.padEnd(40),'K-B items:',it.length,it.map(x=>x.why||x.detail||x.text||JSON.stringify(x)).join(' | ').slice(0,200));}
