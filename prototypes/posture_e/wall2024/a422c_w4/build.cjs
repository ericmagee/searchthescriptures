// ASK 422(c) build (plan W2 8866 rev 1, f871cd48; PASS W3 8868, W1 8870): KV_EXCL's two "(?:make|exclude)\b" groups become "(?:makes?|excludes?)\b".
// One Shared Library line (the KV_KIND line that holds KV_EXCL). MAP n recomputed; header library sha updated. Same edit for engine and child.
// Usage: node a422c/build.cjs IN OUT BASE_VERSIONID
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT,BASEV]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));if(w.data&&w.data.nodes)w=w.data;if(w.versionId!==BASEV)throw new Error('base moved: '+w.versionId);
const U=T.unpack(w);const L=U.L,M=U.M;
const ix=L.map((l,i)=>l.includes('const KV_EXCL=/')?i:-1).filter(i=>i>=0);if(ix.length!==1)throw new Error('KV_EXCL line count '+ix.length);const i=ix[0];
const OLD='(?:make|exclude)\\b',NEW='(?:makes?|excludes?)\\b';
const a=L[i].indexOf('const KV_EXCL=/'),b=L[i].indexOf('/i;',a);const lit=L[i].slice(a,b);
if(lit.split(OLD).length!==3)throw new Error('expected 2 groups in KV_EXCL, found '+(lit.split(OLD).length-1));
if(L[i].split(OLD).length!==3)throw new Error('group occurs outside KV_EXCL on the line');
const before=L[i];L[i]=L[i].slice(0,a)+lit.split(OLD).join(NEW)+L[i].slice(b);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(w));console.log('line',i+1,'| chars',before.length,'->',L[i].length,'| MAP n changed',ch.length,ch.join(','),'| lib sha',lsha);
