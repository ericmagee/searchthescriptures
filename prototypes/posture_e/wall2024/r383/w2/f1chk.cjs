const fs=require('fs'),crypto=require('crypto');const [,,fF,fR]=process.argv;
const ld=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return W.nodes||W.data.nodes;};
const F=ld(fF),R=ld(fR);
// nodes differing
const dn=F.filter(n=>{const r=R.find(x=>x.name===n.name);return !r||JSON.stringify(r)!==JSON.stringify(n);}).map(n=>n.name);console.log('nodes differ from R:',dn, 'count',F.length,R.length);
const T=F.find(n=>n.name==='Shared Library').parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const h=T.match(/\/\/ library sha ([0-9a-f]{16}), (\d+) lines/);const s=crypto.createHash('sha256').update(JSON.stringify(LIB)).digest('hex').slice(0,16);console.log('header',h[1],h[2],'calc',s,LIB.length,'len',T.length);
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');let mm=0,u=0;for(const k in MAP){u++;if(rb(MAP[k],LIB).length!==MAP[k].n)mm++;}console.log('MAP',u,'mismatch',mm);
const TR=R.find(n=>n.name==='Shared Library').parameters.jsCode;const MR=JSON.parse(TR.slice(TR.lastIndexOf('\n/*MAP*/')+8,TR.lastIndexOf('\n/*END*/')));const ch=Object.keys(MAP).filter(k=>MAP[k].n!==MR[k].n);console.log('users changed',ch.length,ch.join(','));
const i=LIB[1448].indexOf('pkgNSG');console.log(LIB[1448].slice(i-600,i+250));
fs.writeFileSync('f1L1448.txt',LIB[1448]);
