const fs=require('fs');
exports.load=f=>{const T=JSON.parse(fs.readFileSync(f,'utf8'));return T.nodes||T.workflow?.nodes||T;};
exports.split=s=>({head:s.slice(0,s.indexOf('/*LIB*/')),LIB:JSON.parse(s.slice(s.indexOf('/*LIB*/')+7,s.indexOf('\n/*MAP*/'))),MAP:JSON.parse(s.slice(s.indexOf('\n/*MAP*/')+8,s.indexOf('\n/*END*/')))});
exports.src=(N,node)=>{const S=exports.split(N.find(n=>n.name==='Shared Library').parameters.jsCode);const rb=P=>P.map(x=>typeof x==='number'?S.LIB[x]:(typeof x[0]==='string'?x[0]:S.LIB.slice(x[0],x[1]+1).join('\n'))).join('\n');return {S,full:rb(S.MAP[node].p),rb};};
// load the definitions part of a library node's source, return named functions
exports.module=(N,node,names,stubs={})=>{const {full}=exports.src(N,node);const lines=full.split('\n');let acc='',best=-1;const need=names.map(n=>new RegExp('(function\\s+'+n+'\\b|(const|let|var)\\s+'+n+'\\s*=)'));
 for(let k=0;k<lines.length;k++){acc+=(k?'\n':'')+lines[k];if(!need.every(r=>r.test(acc)))continue;try{new Function("$",acc+"\n;return 1;");best=k;break;}catch(e){}}
 if(best<0)throw new Error('no parseable prefix defines '+names.join(','));
 const src=lines.slice(0,best+1).join('\n')+(stubs.extra||'');const $=stubs.$||(nm=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}}));
 return new Function('$','$input','$json','$node',src+'\n;return {'+names.join(',')+'};')($,{all:()=>[],first:()=>({json:{}})},{},{});};
