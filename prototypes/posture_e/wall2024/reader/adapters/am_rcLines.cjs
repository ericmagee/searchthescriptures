// Alternate Merge / Gate nodes: rcLines (shared library). Reads collision grades case-insensitively (upper-cases the line);
// only DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED; first CLAUSE/KEYSTONE/RESULT/STANDING/CONCEDED only.
const {L,pairOf,lines,nOf}=require('./_util.cjs');
module.exports={name:'Alternate Merge: rcLines',form:'COLLISION|CLAUSE|KEYSTONE|RESULT|STANDING|CONCEDED',scope:'text',read(raw){
 const ls=lines(raw);const T=ls.join('\n');const P=L.rcLines(T);const out=[];let at=0;
 for(const c of P.col){const n=nOf(ls,c.raw,at);at=n+1;const [d,k]=c.link.split(' vs ');out.push({n,fields:{form:'COLLISION',pair:pairOf(d,k),grade:c.grade}});}
 const one=(o,form,f)=>{if(o)out.push({n:nOf(ls,o.raw),fields:Object.assign({form},f||{})});};
 one(P.clause,'CLAUSE');one(P.key,'KEYSTONE');one(P.result,'RESULT');
 for(const s of Object.keys(P.st))one(P.st[s],'STANDING',{side:s});for(const s of Object.keys(P.cn))one(P.cn[s],'CONCEDED',{side:/^CHALLENGER/.test(s)?'CHALLENGER':'DEFENDER'});
 return out.sort((a,b)=>a.n-b.n);}};
