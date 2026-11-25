// ASK 654 build b3 (W4): plan rev 11 (4a17e308). b3 = b2 with the PLY module replaced by b3/ply_lines.js and the PRESS LAYERS MAP entry loading REFP before PRESS LIST and PLY.
// [L3] mark (team design, rev 11): an [L3] line quotes a verse, alone or in a range, that is neither the pressed verse nor a verse quoted at [L1]; ranges and book names by REFP; note item X "[L3] a verse of another passage quoted with its reference".
// Only Shared Library changes. node b654b3.cjs ../b2/tg/target_engine_654b2.json tg/target_engine_654b3.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));const D=__dirname+'/';
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);
const E0=P.M['PRESS LAYERS'];if(!E0||JSON.stringify(E0.p)!=='[[3852,3857],[3883,3904]]'||P.L.length!==3905)throw new Error('b2 base not as expected');
const old=fs.readFileSync(D+'../b2/ply_lines.js','utf8').replace(/\n$/,'');if(P.L.slice(3883).join('\n')!==old)throw new Error('b2 PLY lines differ from b2/ply_lines.js');
const add=fs.readFileSync(D+'ply_lines.js','utf8').replace(/\n$/,'').split('\n');P.L.splice(3883,P.L.length-3883,...add);
P.M['PRESS LAYERS']={n:0,p:P.M.REFP.p.concat(P.M['PRESS LIST'].p,[[3883,3883+add.length-1]])};
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const m=reb(v.p).length;if(m!==v.n){touched.push(k);v.n=m;}}
if(JSON.stringify(touched)!=='["PRESS LAYERS"]')throw new Error('MAP entries changed: '+touched);
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('PRESS LAYERS n',P.M['PRESS LAYERS'].n,'LIB',P.L.length,'touched',touched);
