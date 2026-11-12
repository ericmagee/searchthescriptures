const fs=require('fs');const c=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/parent_s156_CRB.json')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const i=c.indexOf('const cecBlock=');const j=c.indexOf(';\nconst PROMPT=');const B=new Function(c.slice(i,j)+';return cecBlock;')();
const T1='# CLOSE\n**ANSWER: A**\n- [L4] Joseph’s line is not the route here at all.\n';
const T2='# CLOSE\nI quote the challenger: "So the flesh comes by the mother and not by Joseph."\n\n**ANSWER: B**\n- [L4] So the flesh comes by the mother and not by Joseph.\n';
const T3='# CLOSE\n**ANSWER: C**\n- [L3] Row three.\nD2: the second link body text stands here.\n- [L4] So the point stands from row three today.\n';
const T4='## D1\nAlpha beta gamma delta epsilon.\n\n\n## D2\nZeta eta theta iota kappa.';
const T5='# CLOSE\n> **LINK 2** quoted heading\n- [L4] So the quoted point is kept whole now.\n';
const P=[
['curly apostrophe in close, straight in quote',B(T1,"Joseph's line is not the route here at all."),b=>b.includes('ANSWER: A')],
['sentence quoted earlier in close: picks first hit',B(T2,'So the flesh comes by the mother and not by Joseph.'),b=>b.includes('ANSWER: B')],
['Dn: body line splits block',B(T3,'So the point stands from row three today.'),b=>b.includes('[L3]')],
['blank lines and next ## heading',B(T4,'Alpha beta gamma delta epsilon.'),b=>b.startsWith('## D1')&&!b.includes('Zeta')],
['blockquote LINK heading',B(T5,'So the quoted point is kept whole now.'),b=>b.includes('LINK 2')],
['regex chars in quote',B('# H\nWhat (of) it [x] $5 + 2? Done here now.','What (of) it [x] $5 + 2? Done'),b=>b.startsWith('# H')],
];for(const [n,b,f] of P)console.log(f(b)?'AS EXPECTED':'LIMIT ',n,'=>',JSON.stringify(b.slice(0,90)));
