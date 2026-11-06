// gateRead2024: GATE replies (first reply per id wins). Text scope over the raw reply text.
const {L}=require('./_util.cjs');
module.exports={name:'gateRead2024',form:'REPLY',scope:'text',read(raw){const T2=String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');const ls=T2.split('\n').map(l=>l.replace(/[*_`]+/g,'').trim());const A=L.gateRead2024(raw);
 return Object.keys(A).map(id=>({n:ls.indexOf(A[id].line),fields:{form:'REPLY',kind:'GATE',id,answer:A[id].ans,to:A[id].to,sentence:A[id].why}}));}};
