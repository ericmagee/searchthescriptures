// F6 pkgVNV on F5: gateItems2024 (LIB 1753) adds a CONTRADICTION item, last, for a premise called both VOID and not VOID; code appended to LIB 1754.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes||W.data.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
if(T.includes('pkgVNV'))throw new Error('already');const has=(m,i)=>m.p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&e[0]<=i&&i<=e[1]));for(const k in MAP)if(has(MAP[k],1753)!==has(MAP[k],1754))throw new Error('node set '+k);
const A=" /* pkgVP1: after pkgD38, so earlier gate ids keep their numbers */";if(LIB[1753].split(A).length!==2||!LIB[1754].startsWith(" items.forEach((x,i)=>x.gid='G'+(i+1));"))throw new Error('anchor');
LIB[1753]=LIB[1753].replace(A,()=>A+" for(const x of gateVnv2024(T1))items.push({kind:'CONTRADICTION',src:'E-GATE V',key:x.key,why:x.why,lines:x.lines,live:GATE_STATUS['CONTRADICTION']==='LIVE'}); /* pkgVNV: last, so earlier gate ids keep their numbers */");
LIB[1754]=LIB[1754]+'\n'+fs.readFileSync(__dirname+'/vnv.js','utf8').replace(/\n/g,'').trim();
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log('Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));
