// pkgDCT measure build: live s119 + dead-function trim. Usage: node pkgDCT/build_DCT.cjs <fetchback> <pack folder> <trim folder> <out>
const fs=require('fs'),crypto=require('crypto');const [FB,P,T,OUT]=process.argv.slice(2);
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);
const out=JSON.parse(JSON.stringify(d));const ob={};out.nodes.forEach(n=>ob[n.name]=n);const nm=f=>f.replace(/\.js$/,'').replace(/_/g,' ');
const lib=fs.readFileSync(P+'/patched/Shared_Library.js','utf8');ob['Shared Library'].parameters.jsCode=lib;
const e4=fs.readdirSync(P+'/e4_rebase');const packed=new Set();
for(const f of fs.readdirSync(P+'/patched')){if(f==='Shared_Library.js')continue;packed.add(nm(f));ob[nm(f)].parameters.jsCode=fs.readFileSync((e4.includes(f)?P+'/e4_rebase/':P+'/patched/')+f,'utf8');}
for(const f of e4)if(!packed.has(nm(f)))ob[nm(f)].parameters.jsCode=fs.readFileSync(P+'/e4_rebase/'+f,'utf8');
const LT=lib,L=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/'))),MAP=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')));
const eff=n=>{const M=MAP[n];return M&&ob[n].parameters.jsCode.includes('pkgLIB stub')?M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n'):ob[n].parameters.jsCode;};
let plain=0;const bad=[];
for(const f of fs.readdirSync(T)){const n=nm(f);if(!ob[n])continue;const t=fs.readFileSync(T+'/'+f,'utf8');if(!packed.has(n)&&!MAP[n]&&n!=='Early Alternate Build'){if(ob[n].parameters.jsCode!==t){ob[n].parameters.jsCode=t;plain++;}}
 if(n!=='Early Alternate Build'&&eff(n)!==t)bad.push(n);}
const code=w=>w.nodes.reduce((a,n)=>a+((n.parameters&&n.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,n)=>{const p=Object.assign({},n.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
console.log((bad.length?'FAIL':'OK  ')+' every node runs its trimmed source ('+bad.length+' differ'+(bad.length?': '+bad.slice(0,5).join(', '):'')+'); packed '+packed.size+', plain nodes trimmed '+plain);
console.log('nodes '+out.nodes.length+' connections equal '+(JSON.stringify(out.connections)===JSON.stringify(d.connections)));
console.log('Code '+code(d)+' -> '+code(out)+' = '+(code(out)-code(d))+'; prompt '+(prm(out)-prm(d))+'; Shared Library '+by['Shared Library'].parameters.jsCode.length+' -> '+lib.length);
const s=JSON.stringify(out);fs.writeFileSync(OUT,s);console.log('sha256 '+crypto.createHash('sha256').update(s).digest('hex').slice(0,16)+' '+OUT);
