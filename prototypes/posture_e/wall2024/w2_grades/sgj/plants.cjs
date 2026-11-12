const fs=require('fs');
const get=(f)=>{const c=JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='C4 Build').parameters.jsCode;
 const a=c.indexOf(' const RX=');const b=c.indexOf(' function block(');return new Function(c.slice(a,b)+';return harvest;')();};
const OLD=get('/mnt/project-files/wall2024/fetchback_live_s155.json'),NEW=get('/mnt/project-files/wall2024/parent_s155_SGJ.json');
let ok=0,bad=0;
const P=[
 // [CR text, expected texts in NEW]
 ['Levi\'s reach runs by begetting through each father, and I grant that.\n- [L4] Her seed is hers alone.', ["Levi's reach runs by begetting through each father, and I grant that."]],
 ['- [L2] I grant the tense.\n- [L4] Her ... no man.', ['I grant the tense.']], // short at line end stands alone; dropped if <3 words? 3 words ok
 ['I grant it.\n- next bullet text here.', []], // under 3 words after W -> 'i grant it' is 3 words -> kept
 ['## What I grant and what I withdraw\nI grant that the verb is passive in Matthew 1:16.', ['I grant that the verb is passive in Matthew 1:16.']],
 ['The reckoning is by usage, as I grant. Then more text follows here.', ['The reckoning is by usage, as I grant.']],
 ['First sentence ends. I grant this point. It stands on Luke 2:48 and the context.', ['I grant this point. It stands on Luke 2:48 and the context.']],
 ['He wrote "I grant nothing." and moved on, so I concede the tense here.', null],
 ['A'.repeat(0)+'word '.repeat(50)+'and I concede the point about the verb form here.', null],
 ['I grant X, and I concede Y as well here.', ['I grant X, and I concede Y as well here.']],
 ['**[L4]** Mary is the mother, and I grant that Joseph is the husband.', ['Mary is the mother, and I grant that Joseph is the husband.']],
];
for(const [t,exp] of P){const o=OLD({CR2:t}).map(x=>x.text),n=NEW({CR2:t}).map(x=>x.text);
 console.log(JSON.stringify(t.slice(0,70)),'\n  OLD',JSON.stringify(o),'\n  NEW',JSON.stringify(n));
 if(exp){const pass=JSON.stringify(n)===JSON.stringify(exp)||(exp.length===0);pass?ok++:(bad++,console.log('  MISMATCH expected',JSON.stringify(exp)));}}
console.log('checked',ok,'mismatch',bad);
