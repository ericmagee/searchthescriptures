const fs=require('fs');const c=JSON.parse(fs.readFileSync(''+(process.env.P||'parent_s156_CRB2.json')+'')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=c.indexOf('const cecBlock=');const j=c.indexOf(';\nconst PROMPT=');const cecBlock=new Function(c.slice(i,j)+';return cecBlock;')();
const T=['# CLOSE','Intro line.','','**ANSWER: Romans 1:3 -- D2 --** "verse"','- [L3] Luke 1:35: "born of thee."','- [L4] The child is born of Mary. So the flesh comes by the mother, and Joseph is not the route.','','**ANSWER: Hebrews 2:14 -- D2 --** "next"','- [L4] Other block text here.','','## D3: heading','D3 body sentence that keeps the third link whole.','### LINK 4','LINK 4 body: I keep this link as declared here.'].join('\n');
const P=[
['ANSWER block, sentence last row',cecBlock(T,'So the flesh comes by the mother, and Joseph is not the route.'),b=>b.startsWith('**ANSWER: Romans 1:3')&&b.includes('[L3] Luke 1:35')&&!b.includes('Hebrews 2:14')],
['markdown in quote',cecBlock(T,'So the *flesh* comes by the mother'),b=>b.startsWith('**ANSWER: Romans 1:3')],
['## heading block',cecBlock(T,'D3 body sentence that keeps the third link whole.'),b=>b.startsWith('## D3')&&!b.includes('LINK 4')],
['### LINK block to end',cecBlock(T,'I keep this link as declared here.'),b=>b.startsWith('LINK 4 body')||b.startsWith('### LINK 4')],
['first block',cecBlock(T,'Intro line. something'),b=>b===''||b.startsWith('# CLOSE')],
['not found',cecBlock(T,'This sentence is nowhere in the close at all.'),b=>b===''],
['too short',cecBlock(T,'So the'),b=>b===''],
['long block clipped',cecBlock('# H\n'+'word '.repeat(800)+'\nThe closing sentence stands here at last.\n'+'tail '.repeat(200),'The closing sentence stands here at last.'),b=>b.length<=1500+42+300+5&&b.includes('The closing sentence stands')],
['F1 bold row labels stay in block',cecBlock('**ANSWER: Romans 1:3 -- D2 --** "v"\n**[L3] Luke 1:35:** "born of thee."\n**[L4]** The child is born of Mary. So the flesh comes by the mother, and Joseph is not the route.','So the flesh comes by the mother, and Joseph is not the route.'),b=>b.startsWith('**ANSWER: Romans 1:3')&&b.includes('[L3] Luke 1:35')],
['F1 bold lead-in is not a heading',cecBlock('ANSWER: Luke 2:48 -- D3\n- [L3] "thy father and I"\n**The point.** Mary names him. So the father is named in the house.','So the father is named in the house.'),b=>b.startsWith('ANSWER: Luke 2:48')&&b.includes('thy father and I')],
['F1 whole-line bold heading still a heading',cecBlock('x line\n**D2 -- THE HOUSE**\n- [L3] row\nSo the house is the father\'s house here.','So the house is the father\'s house here.'),b=>b.startsWith('**D2 -- THE HOUSE**')&&!b.includes('x line')],
['F2 two alike closings, second gets its own block',cecBlock('ANSWER: Romans 1:3\n- [L3] row A\nSo the flesh comes by the mother through row A.\nANSWER: Hebrews 2:14\n- [L3] row B\nSo the flesh comes by the mother through row B.','So the flesh comes by the mother through row B.'),b=>b.startsWith('ANSWER: Hebrews 2:14')&&b.includes('row B')&&!b.includes('row A')],
['F2 quote not whole in close gives no block',cecBlock('ANSWER: Romans 1:3\nSo the flesh comes by the mother through row A.','So the flesh comes by the mother through row C.'),b=>b===''],
['curly apostrophe in close, straight in quote',cecBlock('ANSWER: Luke 2:4\n- [L3] row\nSo it is the father’s house and lineage.','So it is the father\'s house and lineage.'),b=>b.startsWith('ANSWER: Luke 2:4')],
['quoted earlier, own sentence preferred',cecBlock('ANSWER: Acts 2:30\nThe challenger says "So the seed is of the loins of David."\nANSWER: Romans 1:3\n- [L3] row\nSo the seed is of the loins of David.','So the seed is of the loins of David.'),b=>b.startsWith('ANSWER: Romans 1:3')],
['bold lead-in on an earlier line still opens a block',cecBlock('ANSWER: Luke 2:48\n- [L3] row X\n**D4 KEPT.** The house is named.\n- [L3] row Y\nSo the house is the named house here.','So the house is the named house here.'),b=>b.startsWith('**D4 KEPT.**')&&!b.includes('row X')],
['next bold lead-in ends the block',cecBlock('ANSWER: Luke 2:48\n- [L3] row X\nSo the father is named in the house.\n**Final word.** Other text.','So the father is named in the house.'),b=>b.startsWith('ANSWER: Luke 2:48')&&!b.includes('Final word')],
['empty text',cecBlock('', 'So the flesh comes by the mother'),b=>b===''],
];let ok=0;for(const [n,b,f] of P){const p=f(b);if(p)ok++;console.log(p?'OK ':'BAD',n,JSON.stringify(b.slice(0,70)));}console.log(ok+'/'+P.length);
