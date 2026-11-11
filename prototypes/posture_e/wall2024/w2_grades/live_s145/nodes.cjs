const fs=require('fs');const W=f=>{const D=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));return (D.data||D).workflow||(D.data||D);};
const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const live=W('fetchback_live_s145.json'),par=W('parent_s144_JOINT_DFR_PCQ.json'),dfr=W('parent_s143_DFR.json'),s144=W('fetchback_live_s144.json');
const m=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const L=m(live),P=m(par),D=m(dfr),S=m(s144);
console.log('nodes live',live.nodes.length,'parent',par.nodes.length);
let dif=[];for(const k in P){if(!L[k]){dif.push('missing '+k);continue;}if(JSON.stringify(L[k].parameters)!==JSON.stringify(P[k].parameters))dif.push('params differ '+k);}
for(const k in L)if(!P[k])dif.push('extra '+k);console.log('live vs parent param diffs:',dif.length,dif.slice(0,5));
console.log('connections equal',JSON.stringify(live.connections)===JSON.stringify(par.connections));
const lib=n=>n['Shared Library'].parameters.jsCode;console.log('Shared Library live==DFR',lib(L)===lib(D),h(lib(L)),h(lib(D)));
let ch=[];for(const k in L)if(S[k]&&JSON.stringify(L[k].parameters)!==JSON.stringify(S[k].parameters))ch.push(k);console.log('nodes changed s144->s145:',ch.length,ch.join(', '));
console.log('code delta s144->s145',ch.reduce((a,k)=>a+(L[k].parameters.jsCode||'').length-(S[k].parameters.jsCode||'').length,0));
