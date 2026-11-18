// ASK 401 build (plan W2 8602): pkgGKV strips 1611 margin notes from the quote before the sentence split. One token, one site. Offline.
// Usage: node a401/build.cjs IN OUT
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;const log=[];
const A="const pc=m[5].split(/\\.\\.\\.|…|(?<=[.?!])\\s+/)";
const B="const pc=m[5].replace(/\\[[^\\]]*:[^\\]]*\\]/g,' ').split(/\\.\\.\\.|…|(?<=[.?!])\\s+/)";
const hits=L.map((x,i)=>[i,String(x).split(A).length-1]).filter(z=>z[1]);if(hits.length!==1||hits[0][1]!==1)throw new Error('sites: '+JSON.stringify(hits));
const li=hits[0][0];if(!String(L[li]).includes('/*pkgGKV*/'))throw new Error('site is not pkgGKV');L[li]=L[li].replace(A,()=>B);log.push('L'+li);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));console.log('lines changed',[...new Set(log)].join(' '),'| MAP lengths changed',ch.length,'| lib sha',lsha);
