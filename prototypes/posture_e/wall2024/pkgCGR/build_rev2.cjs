// pkgCGR rev 2 (W3 Wall 5832 F1: the label is stripped in all three forms, [CR1], (CR1) and bare CR1, on both sides; W3's measured regex)
// node ids are derived from the node name, so the parent's sha reproduces
// pkgCGR (W1, ASK 176; plan Wall 5788): C) krulNorm strips [CR1]-[CR4], [DR1]-[DR4], [GR1]-[GR2] round labels;
// B) one retry of each Close Group batch reply that came back as an error; the three readers take the retry reply at the same index.
// usage: node pkgCGR/build.cjs <parent in> <parent out>
const fs=require('fs'),crypto=require('crypto');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const uid=k=>{const h=crypto.createHash('sha256').update('pkgCGR '+k).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-4'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const by=n=>{const x=W.nodes.filter(y=>y.name===n);if(x.length!==1)throw new Error('node '+n+' '+x.length);return x[0];};
for(const n of ['Close Group Retry Build','Close Group Retry Needed?','Close Group Retry Call deepseek'])if(W.nodes.some(y=>y.name===n))throw new Error('name in use '+n);
// C
const N=by('Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const before={};for(const e in M)before[e]=reb(e);
const o="replace(/\\[[lr]\\d\\]/g,' ')",n="replace(/\\[[lr]\\d\\]|[\\[(]?\\b[cdg]r\\d\\b[\\])]?/g,' ')";
const cnt=Lb.reduce((t,l)=>t+l.split(o).length-1,0);if(cnt!==1)throw new Error('krulNorm anchor '+cnt);
const li=Lb.findIndex(l=>l.includes(o));if(!/krulNorm/.test(Lb[li]))throw new Error('anchor line is not krulNorm');Lb[li]=Lb[li].replace(o,()=>n);
const ch=[];for(const e in M){const s=reb(e);if(s!==before[e])ch.push(e+' '+(s.length-before[e].length));M[e].n=s.length;}
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
// B
const RB="/* ASK 176 B (W1): one retry for each batch reply that came back as an error (run 36156: the 300 s idle-body limit). Same body, same order */\nconst P=$('Close Group Batch Build').all().map(x=>x.json);const R=$input.all().map(x=>x.json);const out=[];\nR.forEach((r,i)=>{if(r&&r.error&&P[i]&&P[i].body)out.push({json:{rt:i,body:P[i].body}});});\nif(false){$('Close Group Batch Build');}\nreturn out.length?out:[{json:{rt_skip:true}}];";
const BN=by('Close Group Batch Needed?'),BC=by('Close Group Batch Call deepseek');
const IFp=JSON.parse(JSON.stringify(BN.parameters));IFp.conditions.conditions[0].leftValue='={{ $json.rt_skip !== true }}';IFp.conditions.conditions[0].id=uid('if condition');
const [x0,y0]=BC.position;
const nRB={parameters:{jsCode:RB},id:uid('Close Group Retry Build'),name:'Close Group Retry Build',type:'n8n-nodes-base.code',typeVersion:2,position:[x0,y0-160]};
const nIF={parameters:IFp,id:uid('Close Group Retry Needed?'),name:'Close Group Retry Needed?',type:BN.type,typeVersion:BN.typeVersion,position:[x0+110,y0-160]};
const nRC=JSON.parse(JSON.stringify(BC));nRC.id=uid('Close Group Retry Call deepseek');nRC.name='Close Group Retry Call deepseek';nRC.position=[x0+220,y0-160];
W.nodes.push(nRB,nIF,nRC);
const C=W.connections,old=JSON.stringify(C['Close Group Batch Call deepseek']);
if(old!=='{"main":[[{"node":"Close Enforcer Resume","type":"main","index":0}]]}')throw new Error('batch call outputs changed: '+old);
const R0={node:'Close Enforcer Resume',type:'main',index:0};
C['Close Group Batch Call deepseek']={main:[[{node:'Close Group Retry Build',type:'main',index:0}]]};
C['Close Group Retry Build']={main:[[{node:'Close Group Retry Needed?',type:'main',index:0}]]};
C['Close Group Retry Needed?']={main:[[{node:'Close Group Retry Call deepseek',type:'main',index:0}],[{...R0}]]};
C['Close Group Retry Call deepseek']={main:[[{...R0}]]};
const ao="R=$('Close Group Batch Call deepseek').all().map(x=>x.json);";
const an="{R=$('Close Group Batch Call deepseek').all().map(x=>x.json);try{if($('Close Group Retry Call deepseek').isExecuted){const T=$('Close Group Retry Build').all().map(x=>x.json),Q=$('Close Group Retry Call deepseek').all().map(x=>x.json);T.forEach((t,j)=>{if(Q[j]&&!Q[j].error&&t.rt!==undefined)R[t.rt]=Q[j];});}}catch(e){}}";
const rd=[];for(const nm of ['Close Enforcer Call deepseek','Anticheat Call deepseek','Assume Check Call deepseek']){const x=by(nm);const s=x.parameters.jsCode;const k=s.split(ao).length-1;if(k!==1)throw new Error('reader anchor '+nm+' '+k);x.parameters.jsCode=s.replace(ao,()=>an);rd.push(nm+' +'+(x.parameters.jsCode.length-s.length));}
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('C: library line',li,'| stubs changed:',ch.join('; ')||'none','| Shared Library jsCode',N.parameters.jsCode.length-T.length);
console.log('B: Retry Build',JSON.stringify(nRB.parameters).length,'IF',JSON.stringify(nIF.parameters).length,'HTTP',JSON.stringify(nRC.parameters).length,'| readers',rd.join('; '));
console.log('nodes',W.nodes.length,'| sha256',crypto.createHash('sha256').update(s).digest('hex').slice(0,16));
