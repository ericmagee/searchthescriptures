const fs=require('fs');const c=JSON.parse(fs.readFileSync('parent_s156_CRB.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
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
['empty text',cecBlock('', 'So the flesh comes by the mother'),b=>b===''],
];let ok=0;for(const [n,b,f] of P){const p=f(b);if(p)ok++;console.log(p?'OK ':'BAD',n,JSON.stringify(b.slice(0,70)));}console.log(ok+'/'+P.length);
