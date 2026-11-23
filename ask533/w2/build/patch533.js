// ASK 533 build (W2, at the coordinator's assignment) to plan rev 1 (ask533/w1/plan533.md 5127e00a, commit 7778bae9; W2 PASS Wall 10763).
// Usage: node patch533.js <live workflow.json> <target out.json> <engine|child>
// Shared Library (both workflows): array indexes 483 (kl2gLines placed before kl2Lines on its line), 489 (__CURE396: K-GLS cure sentence),
//   514 (ENF_STATUS 'K-GLS':'TRIAL'), 517 (enfSilent), 849 (cureLabel), 1052 (cure keys), 1212 (K-GLS cure branch after K-L2's),
//   2177 (the kl2gLines call after kl2Lines'), 3314 (FLAGGED ITEMS line); MAP n of every entry covering a changed index; header sha.
// L2 Count Plan (engine only): e340 exports ren. Nothing else.
const fs=require('fs');const crypto=require('crypto');const [,,SRC,OUT,WF]=process.argv;if(!/^(engine|child)$/.test(WF||''))throw new Error('third argument: engine or child');
const W=JSON.parse(fs.readFileSync(SRC,'utf8'));const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);const rd=f=>fs.readFileSync(__dirname+'/'+f,'utf8').replace(/\n+$/,'');
const FN=rd('kgls_fn.js'),CB=rd('cure_branch.js'),REN=rd('e340_ren.js');for(const [k,v] of [['kgls_fn.js',FN],['cure_branch.js',CB],['e340_ren.js',REN]])if(/\n/.test(v))throw new Error(k+' must be one line');
const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/')+8,b=T.lastIndexOf('\n/*MAP*/'),c=b+8,e=T.lastIndexOf('\n/*END*/');const L=JSON.parse(T.slice(a,b)),M=JSON.parse(T.slice(c,e));
const one=(i,from,to)=>{if(L[i].split(from).length!==2)throw new Error('index '+i+': anchor not found once: '+from.slice(0,60));L[i]=L[i].replace(from,()=>to);};
if(!L[483].startsWith('function kl2Lines(text,L2D){'))throw new Error('index 483 is not kl2Lines');if(L.some(l=>l.includes('K-GLS')||l.includes('kl2gLines')))throw new Error('K-GLS already present');
L[483]=FN+' '+L[483];
one(489,'or that drops the [L2]. ";','or that drops the [L2]. K-GLS (an [L2] gloss of your own, in a COLLISION POINTS line, that is not a KJV rendering of its Strong\'s number; the item lists the 1611 KJV\'s renderings of that number): cure it with RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or one RESTATED line whose [L2] glosses use only those renderings, or that drops the gloss. This item voids nothing and sets no count. ";');
one(514,"'K-RUD':'TRIAL'};","'K-RUD':'TRIAL','K-GLS':'TRIAL'};");
one(517,"&&x.rule!=='K-RUD');","&&x.rule!=='K-RUD'&&x.rule!=='K-GLS');");
one(849,"||x.rule==='K-RUD')?x.rule+' '+x.link","||x.rule==='K-RUD'||x.rule==='K-GLS')?x.rule+' '+x.link");
one(1052,"||x.rule==='K-L2'||","||x.rule==='K-L2'||x.rule==='K-GLS'||");
if(!/return res\('CURED','restated: every \[L2\] of the line stands in a verse it cites, or none is left',\[rs\[0\]\.line\]\);\}$/.test(L[1212]))throw new Error('index 1212 is not the end of the K-L2 cure branch');L[1212]=L[1212]+CB;
one(2177,"X9.marks.forEach(x=>marks.push(x));}","X9.marks.forEach(x=>marks.push(x));} {const X10=kl2gLines(text);X10.items.forEach(x=>items.push(x));X10.marks.forEach(x=>marks.push(x));}");
one(3314,"||x.rule==='K-RUD')?String(x.line||'').trim()","||x.rule==='K-RUD'||x.rule==='K-GLS')?String(x.line||'').trim()");
const CH=[483,489,514,517,849,1052,1212,2177,3314];
const T2=T.slice(0,a)+JSON.stringify(L)+T.slice(b,c);
const src=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const cov=(p,i)=>p.some(x=>typeof x==='number'?x===i:typeof x[0]==='number'&&i>=x[0]&&i<=x[1]);const ch=[];
for(const k of Object.keys(M)){if(CH.some(i=>cov(M[k].p,i))){const n=src(M[k].p).length;ch.push(k+' '+M[k].n+'->'+n);M[k].n=n;}}
const LS=fs.readFileSync('/mnt/project-files/ask519/w4/libcheck/libcheck.js','utf8');const SHA=new Function(LS.slice(0,LS.indexOf('const __LIBSHA422'))+'\nreturn __SHA422;')();
const sha=SHA(JSON.stringify(L)).slice(0,16);const H0=T2.match(/library sha ([0-9a-f]{16})/);if(!H0)throw new Error('no header sha');
N.parameters.jsCode=T2.replace(/library sha [0-9a-f]{16}/,'library sha '+sha)+JSON.stringify(M)+T.slice(e);
console.log(WF+': header sha '+H0[1]+' -> '+sha);console.log('MAP entries re-measured ('+ch.length+'): '+ch.join(' | '));
console.log('changed indexes: '+CH.map(i=>i+' '+md5(L[i])).join(', ')+' | Library node '+md5(N.parameters.jsCode));
if(WF==='engine'){const P=W.nodes.find(n=>n.name==='L2 Count Plan');const C=P.parameters.jsCode;const A=" }catch(e){out.ok=false;out.eng=[];out.why=";if(C.split(A).length!==2)throw new Error('L2 Count Plan anchor');
 P.parameters.jsCode=C.replace(A,()=>'\n'+REN+'\n'+A);console.log('L2 Count Plan '+md5(C)+' -> '+md5(P.parameters.jsCode)+' (+'+(P.parameters.jsCode.length-C.length)+' chars)');}
fs.writeFileSync(OUT,JSON.stringify(W));
