// ASK 638 (W4): load named functions from a Shared Library MAP entry, offline (form of ask634 libload.cjs). The entry runs until its first $() call, which throws a sentinel; a closure put at its head returns the functions.
module.exports=(E,entry,names)=>{const T=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))[entry];
 const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('entry length '+entry);
 const cap={};const STOP={stop:1};const $=()=>{throw STOP;};
 const f=new Function('$','$input','__cap','__cap.f=()=>({'+names.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'});\n'+S);
 try{const r=f($,{first:()=>{throw STOP;},all:()=>{throw STOP;}},cap);if(r&&r.then)return r.then(()=>cap.f(),e=>{if(e!==STOP)throw e;return cap.f();});}catch(e){if(e!==STOP)throw e;}
 return cap.f();};
