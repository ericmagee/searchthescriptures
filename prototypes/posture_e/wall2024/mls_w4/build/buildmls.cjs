// pkgMLS build rev 2 (ASK 351; W2 7446 fixes 1-3, W1 7448 list-only fix; plan Wall 7430; reviews W1 7432, W3 7433, W2 7434). Base: fresh live fetch ../live.json (versionId 94549982, s237).
const fs=require('fs');const {unpack,rb}=require('../../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync('../live.json'));if(w.versionId!=='94549982-71c7-4f69-a890-a7e52dd584a9')throw new Error('base moved: '+w.versionId);
const u=unpack(w);const L=u.L.slice();const FL=fs.readFileSync('frag_lib.js','utf8').replace(/\n$/,''),FC=fs.readFileSync('frag_cure.js','utf8').replace(/\n$/,'');
const rep=(i,o,n)=>{const c=L[i].split(o).length-1;if(c!==1)throw new Error('line '+i+' anchor count '+c);L[i]=L[i].replace(o,()=>n);};
const app=(i,end,add)=>{if(!L[i].endsWith(end))throw new Error('line '+i+' end anchor');L[i]=L[i]+add;};
rep(514,"'K-AG':'TRIAL'};","'K-AG':'TRIAL','K-ML':'TRIAL','K-SU':'TRIAL'};");
rep(517,"const enfSilent=x=>!!(x&&x.silent===true);","const enfSilent=x=>!!(x&&x.silent===true&&x.rule!=='K-ML'&&x.rule!=='K-SU'); /* pkgMLS (ASK 351): list only, silence does not count */");
app(701,"line:null};}",'\n'+FC);
rep(849,"||x.rule==='K-KJV'||x.rule==='K-AG')","||x.rule==='K-KJV'||x.rule==='K-AG'||x.rule==='K-ML'||x.rule==='K-SU')");
app(1263,"kk.line?[kk.line]:null);}","\n  {const ml=mlsCure(x,reply&&reply.ok?reply.text:'');if(ml)return res(ml.st,ml.why,ml.line?[ml.line]:null);} /* pkgMLS (ASK 351) */");
app(2174,"F9.marks.forEach(x=>marks.push(x));}","\n {const ML=mlsLines2024(text,R,kkjvRows());ML.items.forEach(x=>items.push(x));ML.marks.forEach(x=>marks.push(x));} /* pkgMLS (ASK 351) */");
rep(1311,"const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))&&!__g4u(w.link)):[];","const __mlsT=l=>(items||[]).some(y=>y&&(y.rule==='K-ML'||y.rule==='K-SU')&&U(y.pair)===U(l))&&!(items||[]).some(y=>y&&y.rule!=='K-ML'&&y.rule!=='K-SU'&&U(y.link)===U(l)); /* pkgMLS rev 2 (W1 7448): a retraction on a link that only TRIAL K-ML or K-SU items named is recorded, not applied */ const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))&&!__g4u(w.link)&&!__mlsT(w.link)):[];");
app(2278,"return {items,marks,report,not_checked:nc};}",'\n'+FL);
rep(3318,"||x.rule==='K-KJV'||x.rule==='K-AG')","||x.rule==='K-KJV'||x.rule==='K-AG'||x.rule==='K-ML'||x.rule==='K-SU')");
const M=JSON.parse(JSON.stringify(u.M));const fixed=[];for(const k in M){const len=rb(L,M[k]).length;if(len!==M[k].n){fixed.push(k+' '+M[k].n+'->'+len);M[k].n=len;}}
const T=u.T;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
if(JSON.stringify(u.L)!==T.slice(iL+8,iM)||JSON.stringify(u.M)!==T.slice(iM+8,iE))throw new Error('LIB/MAP serialization differs; stop');
w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=T.slice(0,iL+8)+JSON.stringify(L)+T.slice(iM,iM+8)+JSON.stringify(M)+T.slice(iE);
fs.writeFileSync('target_mls.json',JSON.stringify(w));
console.log('MAP n updated',fixed.length);fixed.forEach(x=>console.log('  '+x));
