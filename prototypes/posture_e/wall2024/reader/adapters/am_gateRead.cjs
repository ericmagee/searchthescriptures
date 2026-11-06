// gateRead2024: GATE replies (first reply per id wins). Text scope. The driver passes the reply already unescaped once, as gateRead2024 does itself;
// its second unescape changes only a doubly escaped reply.
const {L}=require('./_util.cjs');
module.exports={name:'gateRead2024',form:'REPLY',scope:'text',read(raw){const T2=String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');const ls=T2.split('\n').map(l=>l.replace(/[*_`]+/g,'').trim());const A=L.gateRead2024(raw);
 return Object.keys(A).map(id=>({n:ls.indexOf(A[id].line),fields:{form:'REPLY',kind:'GATE',id,answer:A[id].ans,to:A[id].ans==='KEEP'?null:A[id].to,sentence:A[id].why}}));}};
