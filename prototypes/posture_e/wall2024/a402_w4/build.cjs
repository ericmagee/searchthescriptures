// ASK 402 build (plan W3 8617; W1 8620 C1 idempotent): ert386 writes one record-only AUDIT v62 tag, just before the v61 tag,
// when the last plain KEYSTONE line grades Dn BROKEN and names a collision label the seat's own cure retracted (ret386). Offline; applies by text.
// Usage: node a402/build.cjs IN OUT
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const one=(i,a,b)=>{const n=String(L[i]).split(a).length-1;if(n!==1)throw new Error('line '+i+': found '+n+' times: '+a.slice(0,70));L[i]=L[i].replace(a,()=>b);};
const li=L.findIndex(x=>String(x).includes('function ert386(raw,seat,F)'));if(li<0)throw new Error('ert386 not found');
const A1="const tag='[AUDIT v61: ENGINE RESULT -- SEAT: '+seat+'; WORD: ";
const B1="const __v62=(()=>{/* ASK 402 (Wall 8617, TRIAL, record only): the last plain KEYSTONE line of the judge's text (tags are not read; a line opening with '[' or '(' is not read) that grades Dn BROKEN and names a collision label the seat's own cure retracted (ret386) gets one AUDIT v62 tag, written just before the v61 tag. It moves no word, count, standing or seat, enters no drv_uncured and is sent to no one. A v62 tag for the seat already in the text means none is written again (W1 8620 C1). Plan rev 1 (W3 8623). */const ks=String(JT).split('\\n').map(l=>l.replace(/^[\\s*\\-•>#]+/,'').replace(/[*_]+/g,'')).filter(l=>/^KEYSTONE\\s*:/i.test(l));const k=ks.length?ks[ks.length-1]:'';const m=k.match(/^KEYSTONE\\s*:\\s*D(\\d+)\\s*--\\s*BROKEN\\b/i);if(!m||!ret.length)return '';const RK=new Set(ret.map(K));const hit=[];for(const x of k.matchAll(/\\bD\\d+\\s+vs\\.?\\s+C\\d+\\b/gi)){const y=x[0].replace(/\\s+vs\\.?\\s+/i,' vs ');if(RK.has(K(y))&&!hit.some(z=>K(z)===K(y)))hit.push(y);}for(const x of k.replace(/\\bD\\d+\\s+vs\\.?\\s+C\\d+\\b/gi,' ').matchAll(/\\bC(\\d+)\\b/g)){const y='D'+m[1]+' vs C'+x[1];if(RK.has(K(y))&&!hit.some(z=>K(z)===K(y)))hit.push(y);} /* C2 (W2 8622): a bare Cm on the line pairs with the keystone's own Dn */if(!hit.length)return '';const t='[AUDIT v62: KEYSTONE CITES A RETRACTED LINE (ASK 402, TRIAL, record only) -- SEAT: '+seat+'; KEYSTONE: D'+m[1]+' BROKEN; RETRACTED: '+hit.join(', ')+'; it moves no word, count or seat; END]';return s.includes('[AUDIT v62: KEYSTONE CITES A RETRACTED LINE (ASK 402, TRIAL, record only) -- SEAT: '+seat+';')?'':t;})();"+A1;
one(li,A1,B1);
const A2="return s+(sup.length?'\\n'+sup.join('\\n'):'')+'\\n'+tag;}";
const B2="return s+(sup.length?'\\n'+sup.join('\\n'):'')+(__v62?'\\n'+__v62:'')+'\\n'+tag;}";
one(li,A2,B2);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));console.log('line',li,'| MAP lengths changed',ch.length,'| lib sha',lsha);
