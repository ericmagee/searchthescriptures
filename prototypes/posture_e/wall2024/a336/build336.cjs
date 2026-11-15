// ASK 336 build: [L2] paragraph binds to its [L1] run (W2 7013 D1-D5). Every copy of tags(): 21 standalone nodes, Citation Scan, Shared Library.
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'../rdf/fetchback_s222_333_335.json',OUT=process.argv[3]||'target_336.json';
const d=JSON.parse(fs.readFileSync(IN));const FN=fs.readFileSync(__dirname+'/run336.js','utf8').trim();
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const A1='function tags(rounds){',B1=FN+' function tags(rounds){';
const A2='own.concat(__press?refsIn(__line):refsIn(blk))',B2='own.concat(__press?refsIn(__line):refsIn(blk)).concat(__run336(t,i,__press))';
const touched=[];
for(const n of d.nodes){if(n.name==='Shared Library')continue;const c=n.parameters.jsCode;if(!c||!c.includes(A1))continue;
 let s=once(c,A1,B1,n.name+' A1');const k=s.split(A2).length-1;
 // Citation Scan carries A2 three times (vs, __bv, __cvb helpers); only the vs line takes the run
 if(n.name==='Citation Scan'){s=once(s,'const vs=[...new Set('+A2,'const vs=[...new Set('+B2,n.name+' A2');}else{if(k!==1)throw new Error(n.name+' A2 count '+k);s=s.replace(A2,B2);}
 n.parameters.jsCode=s;touched.push(n.name);}
const U=T.unpack(d);const L=U.L,M=U.M;const li=L.findIndex(l=>l.includes(A1));if(li<0||L.filter(l=>l.includes(A1)).length!==1)throw new Error('lib tags line');
L[li]=once(L[li],A1,B1,'lib A1');const lj=L.findIndex(l=>l.includes('const vs=[...new Set('+A2));if(lj<0)throw new Error('lib vs');L[lj]=once(L[lj],A2,B2,'lib A2');
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;touched.push('Shared Library');
for(const k of Object.keys(M)){const s=T.rb(L,M[k]);try{acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){throw new Error('parse '+k+': '+e.message);}}
for(const n of d.nodes)if(touched.includes(n.name)&&n.name!=='Shared Library'){try{acorn.parse(n.parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){throw new Error('parse '+n.name+': '+e.message);}}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('nodes touched',touched.length,'| lib lines',li,lj,'| MAP lengths changed',ch.length,ch.join(', '),'| lib sha',lsha);
