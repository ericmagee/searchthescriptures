const fs=require('fs'),cr=require('crypto');
function lib(file){const w=JSON.parse(fs.readFileSync(file));const L=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const arr=JSON.parse(L.slice(L.indexOf('\n/*LIB*/')+8,L.lastIndexOf('\n/*MAP*/')).trim());const M=JSON.parse(L.slice(L.lastIndexOf('\n/*MAP*/')+8,L.lastIndexOf('\n/*END*/')).trim());return {w,L,arr,M};}
function src(arr,p){return p.map(e=>typeof e==='number'?arr[e]:typeof e[0]==='string'?e[0]:arr.slice(e[0],e[1]+1).join('\n')).join('\n');}
function grabFn(s,name){const i=s.indexOf('function '+name+'(');if(i<0)return null;const j=s.indexOf('\n return {side',i);const k=s.indexOf('\n',j+1);return s.slice(i,k<0?s.length:k);}
module.exports={lib,src,grabFn};
if(require.main===module){const {arr,M}=lib(process.argv[2]);const H={};
 for(const k of Object.keys(M)){const s=src(arr,M[k].p);if(s.length!==M[k].n)console.log('LEN MISMATCH',k,s.length,M[k].n);const f=grabFn(s,'psGrades');if(!f)continue;const h=cr.createHash('sha256').update(f).digest('hex').slice(0,12);(H[h]=H[h]||{f,ks:[]}).ks.push(k);}
 for(const [h,o] of Object.entries(H)){console.log(h,o.f.length,o.ks.join(', '));fs.writeFileSync('a381/psg_'+h+'.js',o.f);}}
