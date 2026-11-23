const fs=require('fs');
const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
const keyOf=t=>{let m=t.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/)||t.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);return m?m[1]:'~'+t.slice(0,40)};
const L2C=new Set(['C1 Extract','C1B Extract','C2 Build','C2 Extract','C2 Lexicon Plan','C2B Extract','C3 Build','C3 Extract','C3 Lexicon Plan','C3B Extract','C3G Extract','C4 Build','C4 Lexicon Plan','Citation Scan','D2 Build','D2 Extract','D2 Lexicon Plan','D2B Extract','D3 Build','D3 Extract','D3 Lexicon Plan','D3B Extract','D4 Build','D4 Extract','D4 Lexicon Plan','D4B Extract','L2 Count Plan','L2 Gloss Plan','L2 Lexicon Plan','Quote Report'].map(x=>'E:'+x));
const out=JSON.parse(fs.readFileSync('keys.json')).filter(o=>o.save>=300&&!/^(S|m|out|add|note|line|i|j|k|r|t|x|s|a|b|c|d|e|n|p|v|w|res|txt|text|T|L|M|R)$/.test(o.k));
// cluster by jaccard
const J=(a,b)=>{const A=new Set(a),B=new Set(b);let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i)};
const groups=[];
for(const o of out){let g=groups.find(g=>J(g.nodes,o.nodes)>=0.75);if(!g){g={nodes:o.nodes.slice(),keys:[]};groups.push(g)}g.keys.push(o.k)}
// compute stats per group
const res=[];
for(const g of groups){const ks=new Set(g.keys);const per={};
 for(const n of nodes){const ls=n.c.split('\n').map(l=>l.trim()).filter(t=>t.length>=60&&ks.has(keyOf(t)));if(ls.length)per[n.id]=ls.join('\n')}
 const ids=Object.keys(per);if(ids.length<2)continue;const lens=ids.map(i=>per[i].length);const tot=lens.reduce((a,b)=>a+b,0);const mx=Math.max(...lens);
 const vers=new Set(Object.values(per)).size;const l2c=ids.every(i=>L2C.has(i));
 res.push({l2c,ids,n:ids.length,vers,per:Math.round(tot/ids.length),mx,tot,save:tot-mx-150*ids.length,keys:g.keys})}
res.sort((a,b)=>b.save-a.save);fs.writeFileSync('groups2.json',JSON.stringify(res,null,1));
for(const r of res.slice(0,40))console.log((r.l2c?'L2C ':'    ')+r.save,'| tot',r.tot,'| n',r.n,'| vers',r.vers,'| max',r.mx,'|',r.keys.slice(0,8).map(k=>k.slice(0,20)).join(' '),'||',r.ids.map(x=>x.replace('E:','')).join(', ').slice(0,160));
console.log('nonL2C save',res.filter(r=>!r.l2c&&r.save>0).reduce((a,r)=>a+r.save,0),'L2C save',res.filter(r=>r.l2c&&r.save>0).reduce((a,r)=>a+r.save,0));
