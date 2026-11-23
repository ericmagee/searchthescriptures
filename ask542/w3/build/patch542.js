// ASK 542 build (W3, builder by coordinator assignment 11:06 CST 11-23) to plan rev 0 (ask542/w1/plan542.md, 4bb44786; W2 PASS Wall 10763).
// Usage: node patch542.js <workflow.json> <target out.json>   (run on the engine and on the child alike)
// Changes Shared Library array index 479 (the plan's 1-based "line 480") only: the ASK 520 exemption call also reads the side's
// round 2 to 4 tags, and the comment gains the ASK 542 note. Recomputes the MAP length n of every entry covering index 479,
// and the header library sha. Nothing else. Anchors are exact strings, so it applies on live daf5da98 or after the ASK 536 write.
const fs=require('fs');const crypto=require('crypto');const [,,SRC,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(SRC,'utf8'));
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c=b+8,e=T.lastIndexOf('\n/*END*/');
const L=JSON.parse(T.slice(a,b)),M=JSON.parse(T.slice(c,e));const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const I=479;
const OLD_CALL=".some(p=>unxAcFail(text,p.ref,rk)))continue;";
const NEW_CALL=".some(p=>unxAcFail(text,p.ref,rk)||unxAcFail(text,p.ref,rk.slice(0,2)+'[2-4]')))continue;";
const OLD_CMT="so Commitment 5 counts it; no K-UNX item */";
const NEW_CMT="so Commitment 5 counts it; no K-UNX item. ASK 542: or any of the side's round 2 to 4 tags */";
const once=(s,x,w)=>{if(s.split(x).length!==2)throw new Error(w+' anchor not found exactly once');};
once(L[I],OLD_CALL,'call');once(L[I],OLD_CMT,'comment');
if(JSON.stringify(L).split('unxAcFail(text,p.ref,rk)').length!==2)throw new Error('the call is not unique in the Library');
const o=md5(L[I]);L[I]=L[I].replace(OLD_CALL,NEW_CALL).replace(OLD_CMT,NEW_CMT);
const T2=T.slice(0,a)+JSON.stringify(L)+T.slice(b,c);
const src=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const cov=(p,i)=>p.some(x=>typeof x==='number'?x===i:typeof x[0]==='number'&&i>=x[0]&&i<=x[1]);const ch=[];
for(const k of Object.keys(M)){if(cov(M[k].p,I)){const n=src(M[k].p).length;ch.push(k+' '+M[k].n+'->'+n);M[k].n=n;}}
const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();
const sha=SHA(JSON.stringify(L)).slice(0,16);const H0=T2.match(/library sha ([0-9a-f]{16})/);if(!H0)throw new Error('no header sha');
N.parameters.jsCode=T2.replace(/library sha [0-9a-f]{16}/,'library sha '+sha)+JSON.stringify(M)+T.slice(e);fs.writeFileSync(OUT,JSON.stringify(W));
console.log('header sha '+H0[1]+' -> '+sha);console.log('MAP entries re-measured ('+ch.length+'): '+ch.join(' | '));
console.log('index 479 '+o+' -> '+md5(L[I])+' | Library node '+md5(T)+' -> '+md5(N.parameters.jsCode));
