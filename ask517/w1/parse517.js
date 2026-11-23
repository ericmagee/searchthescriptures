// Assemble every MAP entry of the Shared Library (live and 517 target) and check it compiles; list entries whose code changed.
const fs=require('fs');
function lib(f){const d=JSON.parse(fs.readFileSync(f,'utf8'));const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const a=t.indexOf('\n/*LIB*/')+8,b=t.lastIndexOf('\n/*MAP*/'),c=b+8,e=t.lastIndexOf('\n/*END*/');const L=JSON.parse(t.slice(a,b)),M=JSON.parse(t.slice(c,e));
 const code=k=>M[k].p.map(x=>typeof x==='number'?L[x]:(typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n'))).join('\n');return {M,code};}
for(const [lv,tg] of [['/mnt/project-files/ask517/w4/live516b_moMxiV4Irg1uRBZN.json','target_engine_517.json'],['/mnt/project-files/ask517/w4/live516b_MqQHRl7mQQ0z8QdT.json','target_child_517.json']]){
 const A=lib(lv),B=lib(tg);let bad=0,ch=[];
 for(const k of Object.keys(B.M)){const s=B.code(k);try{new Function('$','$input','return (async()=>{\n'+s+'\n})();');}catch(e){bad++;console.log('PARSE FAIL',k,e.message);}
  if(s!==A.code(k))ch.push(k);}
 console.log(tg,'entries',Object.keys(B.M).length,'parse fails',bad,'changed',ch.length);console.log('  '+ch.join(' | '));}
