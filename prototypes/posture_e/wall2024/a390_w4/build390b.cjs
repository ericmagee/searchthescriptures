// ASK 390 rev 3, option B (W1 8309, W2, W3 8311): every six-word, word-run or quote-match reader drops the "[working note: " wrapper and its "]"
// before it matches. One shared function, wnOff390, is a new Shared Library line; each reader's normalizer calls it first. Library only.
// Usage: node build390b.cjs IN OUT   (IN = engine (after build390) or child workflow JSON)
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const FN="function wnOff390(s){/* pkgWNOFF (ASK 390 option B, Wall 8309/8311): a reader that matches words drops the \"[working note: \" wrapper and its \"]\", brackets balanced, and keeps the debater's words */const t=String(s==null?'':s);let i=t.indexOf('[working note: ');if(i<0)return s;let o='',p=0;while(i>=0){let d=0,j=i;for(;j<t.length;j++){if(t[j]==='[')d++;else if(t[j]===']'&&--d===0)break;}o+=t.slice(p,i)+t.slice(i+15,j);p=j+1;i=t.indexOf('[working note: ',p);}return o+t.slice(p);}";
const W='wnOff390';
const E=[ // [reader, old text, new text, lines expected]
 ['K-CON krulNorm (L656-658)',"function krulNorm(s){return String(s||'')","function krulNorm(s){return String("+W+"(s)||'')",1],
 ['K-KJV kkjvFold (L697-698)',"function kkjvFold(s){return String(s==null?'':s)","function kkjvFold(s){return String(s==null?'':"+W+"(s))",1],
 ['K-W nw (L1202)',"const nw=s=>String(s||'').toLowerCase().replace(/[\\u2018\\u2019\\u201c\\u201d\"'`*_]/g,'')","const nw=s=>String("+W+"(s)||'').toLowerCase().replace(/[\\u2018\\u2019\\u201c\\u201d\"'`*_]/g,'')",1],
 ['MEANS run nz (L1684)',"const nz=s=>String(s==null?'':s).toLowerCase()","const nz=s=>String(s==null?'':"+W+"(s)).toLowerCase()",1],
 ['claim terms NR (L1923)',"const NR=s=>' '+W(s).join(' ')+' '","const NR=s=>' '+W("+W+"(s)).join(' ')+' '",1],
 ['wp quote runs nw (L2289-2294)',"const nw=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\\s]/g,' ')","const nw=s=>String("+W+"(s)||'').toLowerCase().replace(/[^a-z0-9\\s]/g,' ')",1],
 ['B7 six NN (L2493-2498)',"const NN=s=>String(s==null?'':s).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’“”\"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 :]+/g,' ')","const NN=s=>String(s==null?'':"+W+"(s)).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’“”\"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 :]+/g,' ')",1],
 ['MEANS ledger runs nw (L2564/2569, L2608/2625)',"const nw=s=>N(s).toLowerCase()","const nw=s=>N("+W+"(s)).toLowerCase()",2],
 ['send-back cure N: has, six, run6, ownRun (L2649-2685)',"const N=s=>String(s==null?'':s).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’“”\"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ')","const N=s=>String(s==null?'':"+W+"(s)).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’“”\"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ')",1],
 ['quote includes N (L2696, L2977)',"const N=s=>String(s||'').toLowerCase().replace(/[“”\"’‘'*_`\\[\\]]/g,'')","const N=s=>String("+W+"(s)||'').toLowerCase().replace(/[“”\"’‘'*_`\\[\\]]/g,'')",2],
 ['eaw/eaiBlock NN (L2992, L3001, L3079)',null,null,3],
 ['sraSame NN (L3029)',"const NN=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ')","const NN=s=>String("+W+"(s)||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ')",1],
 ['epdWords (L3388-3391)',"function epdWords(s){return String(s||'')","function epdWords(s){return String("+W+"(s)||'')",1],
 ['ECW and LAY N (L3501, L3502)',"const N=s=>String(s==null?'':s).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’ʼ`]/g,\"'\")","const N=s=>String(s==null?'':"+W+"(s)).toLowerCase().replace(/\\\\+\"/g,'\"').replace(/[‘’ʼ`]/g,\"'\")",2],
];
// eaw/eaiBlock: two spellings of the same normalizer
const EA=[["const NN=s=>String(s||'').toLowerCase().replace(/[\\u201c\\u201d\"\\u2019\\u2018'*_`\\[\\]]/g,'')",2],["const NN=s=>String(s||'').toLowerCase().replace(/[“”\"’‘'*_`\\[\\]]/g,'')",1]];
const touched=new Set(),log=[];
const apply=(name,old,nu,want)=>{const hits=[];L.forEach((x,i)=>{const k=x.split(old).length-1;if(k)hits.push([i,k]);});
 if(hits.length!==want||hits.some(h=>h[1]!==1))throw new Error(name+': old text found '+JSON.stringify(hits)+' want '+want);
 for(const [i] of hits){L[i]=L[i].replace(old,()=>nu);touched.add(i);}log.push(name+' L'+hits.map(h=>h[0]+1).join('/'));};
for(const [name,old,nu,want] of E){if(old===null){for(const [o,w] of EA)apply(name,o,o.replace("String(s||'')","String("+W+"(s)||'')"),w);continue;}apply(name,old,nu,want);}
if(L.some(x=>/^function wnOff390\(/.test(x)))throw new Error('wnOff390 already present');
const LI=L.length;L.push(FN);
const has=(m,li)=>m.p.some(e=>typeof e==='number'?e===li:(typeof e[0]!=='string'&&li>=e[0]&&li<=e[1]));
const added=[];for(const [k,m] of Object.entries(M)){if(![...touched].some(i=>has(m,i)))continue;m.p.push(LI);added.push(k);} /* a function declaration at the end of the stub: hoisted, top level */
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
for(const k of Object.keys(M)){const src=T.rb(L,M[k]);P(src);if(/wnOff390\(/.test(src.replace(FN,''))&&!src.includes(FN))throw new Error(k+' calls wnOff390 without it');}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('readers',log.length);log.forEach(x=>console.log('  '+x));console.log('stubs given wnOff390 (library line '+(LI+1)+'):',added.length,'|',added.join(', '));console.log('MAP lengths changed',ch.length,'| lib sha',lsha);
