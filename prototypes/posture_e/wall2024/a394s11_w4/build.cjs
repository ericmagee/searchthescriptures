// ASK 394 site 11 build (plan W4 8583; W1 and W2 after 8583: the purpose of 8230 item 4 governs; LINK STATE not added).
// bnsRefuse2024 reads the CHANGE TO line with __RL.readLine (after an optional FORCED prefix, upper-cased) instead of its own regex. Offline.
// Usage: node a394s11/build.cjs IN OUT
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;const log=[];
const rep=(i,a,b)=>{const n=L[i].split(a).length-1;if(n!==1)throw new Error('line '+i+': found '+n+' times: '+a.slice(0,80));L[i]=L[i].replace(a,()=>b);log.push('L'+i);};
const li=L.findIndex(x=>String(x).includes('function bnsRefuse2024(to)'));if(li<0)throw new Error('bnsRefuse2024 not found');
rep(li,"const m=s.match(/^\\s*(?:[-•]\\s*|\\d+[.)]\\s*)?(?:FORCED(?:\\s*\\([^)]*\\))?\\s*:\\s*)?D(\\d+)\\s+vs\\.?\\s+C\\d+\\b(?:\\s*\\([^)\\n]*\\))?[^:\\n(]*:\\s*STANDS\\b/i);if(!m)return null;",
 "const __r11=__RL.readLine(s.replace(/^\\s*(?:[-•]\\s*|\\d+[.)]\\s*)?(?:FORCED(?:\\s*\\([^)]*\\))?\\s*:\\s*)?/i,'').toUpperCase());const m=(__r11&&__r11.form==='COLLISION'&&String(__r11.f.grade||'').toUpperCase()==='STANDS')?String(__r11.f.pair||'').match(/^D(\\d+)\\s+VS\\s+C\\d+$/i):null;if(!m)return null; /* ASK 394 site 11 (Wall 8583): the reader reads the line; an optional FORCED prefix is kept; LINK STATE is not read here */");
// 5. MAP lengths, header, library
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));console.log('lines changed',[...new Set(log)].join(' '),'| MAP lengths changed',ch.length,'| lib sha',lsha);
