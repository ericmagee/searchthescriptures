// ASK 342 build: replace __run336 with the (iii) form in every copy (21 standalone nodes, Citation Scan, Shared Library).
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const IN=process.argv[2]||'../rdf/fetchback_s226_341.json',OUT=process.argv[3]||'target_342.json';
const d=JSON.parse(fs.readFileSync(IN));const OLD=fs.readFileSync(__dirname+'/old_run336.js','utf8').trim(),NEW=fs.readFileSync(__dirname+'/run342.js','utf8').trim();
const once=(s,tag)=>{const k=s.split(OLD).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(OLD,()=>NEW);};
const touched=[];
for(const n of d.nodes){if(n.name==='Shared Library')continue;const c=n.parameters.jsCode;if(!c||!c.includes(OLD))continue;n.parameters.jsCode=once(c,n.name);touched.push(n.name);}
const U=T.unpack(d);const L=U.L,M=U.M;const lis=L.map((l,i)=>l.includes(OLD)?i:-1).filter(i=>i>=0);if(lis.length!==1)throw new Error('lib lines '+lis.length);
L[lis[0]]=once(L[lis[0]],'lib');
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
const sl=d.nodes.find(n=>n.name==='Shared Library');sl.parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;touched.push('Shared Library');
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
for(const k of Object.keys(M)){try{P(T.rb(L,M[k]));}catch(e){throw new Error('parse '+k+': '+e.message);}}
for(const n of d.nodes)if(touched.includes(n.name)&&n.name!=='Shared Library'){try{P(n.parameters.jsCode);}catch(e){throw new Error('parse '+n.name+': '+e.message);}}
// every touched standalone node must also define REFP (the new form reads REFP.parse)
for(const n of d.nodes)if(touched.includes(n.name)&&n.name!=='Shared Library'&&!/const REFP=/.test(n.parameters.jsCode))console.log('NO REFP in',n.name);
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('nodes touched',touched.length,'| lib line',lis[0],'| MAP lengths changed',ch.length,ch.join(', '),'| lib sha',lsha);
