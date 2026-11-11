const fs=require('fs');const D='/mnt/project-files/wall2024/';
const B=JSON.parse(fs.readFileSync(D+'fetchback_live_s120.json')),C=JSON.parse(fs.readFileSync(D+'parent_s120_ACX.json'));
const bn={},cn={};B.nodes.forEach(n=>bn[n.name]=n);C.nodes.forEach(n=>cn[n.name]=n);
console.log('nodes',B.nodes.length,C.nodes.length, 'names equal',JSON.stringify(Object.keys(bn).sort())===JSON.stringify(Object.keys(cn).sort()));
const ss=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(x=>[x,v[x]])):v);
for(const k of Object.keys(bn)){if(!cn[k]){console.log('missing in cand',k);continue}if(ss(bn[k].parameters)!==ss(cn[k].parameters))console.log('DIFF',k,(cn[k].parameters.jsCode||'').length-(bn[k].parameters.jsCode||'').length)}
console.log('connections equal',ss(B.connections)===ss(C.connections));
const a=cn['Panel Build'].parameters.jsCode,b=cn['Build Independent Verdict'].parameters.jsCode;
const ba=bn['Panel Build'].parameters.jsCode;
let i=0;while(ba[i]===a[i])i++;console.log('first diff at',i);console.log(a.slice(i-200,i+700));
const j=b.indexOf('__ACX');console.log('---BIV');console.log(b.slice(j-100,j+600));
const re=/__ACX[\s\S]{0,900}/;console.log('ident helper', a.match(re)[0]===b.match(re)[0]);
