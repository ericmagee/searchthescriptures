// F1 pkgNSG on piece R: hook nsgRefuse2024 into sbApply2024 (LIB 1448) after the pkgBNS hook; code appended to LIB 1530 (same node set).
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));const N=W.nodes||W.data.nodes;
const Ls=N.filter(n=>n.name==='Shared Library');const T=Ls[0].parameters.jsCode;const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base '+k);
if(T.includes('pkgNSG'))throw new Error('already');const out=[];
const has=(m,i)=>m.p.some(e=>typeof e==='number'?e===i:(typeof e[0]!=='string'&&e[0]<=i&&i<=e[1]));for(const k in MAP)if(has(MAP[k],1448)!==has(MAP[k],1530))throw new Error('node set '+k);
const A="/* pkgBNS, ASK 295 */{const __d38=";if(LIB[1448].split(A).length!==2)throw new Error('1448 anchor');
LIB[1448]=LIB[1448].replace(A,()=>"/* pkgBNS, ASK 295 */{const __ns=typeof nsgRefuse2024==='function'?nsgRefuse2024(to,map.has(o)?map.get(o).to:o):null;if(__ns){items.push({sid:x.sid,kind:'NOT APPLIED',why:__ns,to,lines:[o],nsg:true});continue;}} /* pkgNSG */{const __d38=");out.push('LIB 1448 -> '+LIB[1448].length);
const B=fs.readFileSync(__dirname+'/nsg.js','utf8').replace(/\n/g,'').trimEnd();if(!LIB[1530].includes('function bnsFacts2024'))throw new Error('1530 needs pkgBNS');LIB[1530]+=B;out.push('LIB 1530 +'+B.length);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'users',users.length);
