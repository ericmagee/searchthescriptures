const fs=require('fs');const ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d;};
const L=ld(process.env.W3_L||'/mnt/project-files/wall2024/fetchback_live_s113.json'),C=ld(process.env.W3_C||'/mnt/project-files/wall2024/parent_s113_OON.json');
const by=d=>{const o={};d.nodes.forEach(n=>o[n.name]=n);return o;};const a=by(L),b=by(C);
console.log('nodes',L.nodes.length,C.nodes.length,'conn equal',JSON.stringify(L.connections)===JSON.stringify(C.connections));
let ch=[];for(const n in a){if(!b[n]){ch.push('MISSING '+n);continue;}if(JSON.stringify(a[n])!==JSON.stringify(b[n]))ch.push(n);}for(const n in b)if(!a[n])ch.push('NEW '+n);console.log('changed',ch.join('|'));
const x=a['Shared Library'].parameters.jsCode,y=b['Shared Library'].parameters.jsCode;console.log('size diff',y.length-x.length, 'other params equal',JSON.stringify({...a['Shared Library'],parameters:0})===JSON.stringify({...b['Shared Library'],parameters:0}));
const lib=s=>JSON.parse(s.slice(s.indexOf('\n/*LIB*/')+8,s.indexOf('\n/*MAP*/')));const la=lib(x),lb=lib(y);console.log('lib lines',la.length,lb.length);
let df=[];for(let i=0;i<Math.max(la.length,lb.length);i++)if(la[i]!==lb[i])df.push(i);console.log('diff lines',df.join(','));
for(const i of df){const p=la[i],q=lb[i];let k=0;while(p[k]===q[k])k++;console.log('L',i,'at',k,'\nLIVE:',p.slice(Math.max(0,k-260),k+120),'\nCAND:',q.slice(Math.max(0,k-260),k+170));}
console.log('rest equal',x.slice(0,x.indexOf('\n/*LIB*/'))===y.slice(0,y.indexOf('\n/*LIB*/')),x.slice(x.indexOf('\n/*MAP*/'))===y.slice(y.indexOf('\n/*MAP*/')));
{const h1=x.slice(0,x.indexOf('\n/*LIB*/')),h2=y.slice(0,y.indexOf('\n/*LIB*/'));let k=0;while(k<h1.length&&h1[k]===h2[k])k++;console.log('head len',h1.length,h2.length,'first diff',k,JSON.stringify(h1.slice(k-60,k+60)),JSON.stringify(h2.slice(k-60,k+60)));
const m1=x.slice(x.indexOf('\n/*MAP*/')),m2=y.slice(y.indexOf('\n/*MAP*/'));k=0;while(k<m1.length&&m1[k]===m2[k])k++;console.log('map len',m1.length,m2.length,'first diff',k,JSON.stringify(m1.slice(k-60,k+60)),JSON.stringify(m2.slice(k-60,k+60)));}
