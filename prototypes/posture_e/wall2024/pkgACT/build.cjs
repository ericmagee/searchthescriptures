// pkgACT (ASKs 273, 275, 276; 274 and 277 to follow) on pkgNRW rev 3 (team list Wall 6283; coordinator ASK numbers 13:13 CST 11-14).
// 273: LIB 1891 round parser also cuts "\n\n[COUNT LIST NOTE" (ASK 269 note stays out of enforcer round text).
// 275: LIB 3159 E-SYN side = the side word nearest before the give-ground word ("listed the defender's grants" is the defender's); a possessive side word ("the challenger's links") counts only when the give-ground word follows it directly.
// 276: the close-round fresh() check (10 nodes, one identical line) does not count Isaiah 28:10 / 28:13 in a sentence with no MEANS and no [L1]-[L4] tag (method citation, DG-61; W3 6279).
// usage: node build.cjs <base json (pkgNRW rev 3 target or s198 readback)> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha c7e7505f6d74d860,'))throw new Error('not the pkgNRW rev 3 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
// 273
const A3="const c7=t.indexOf('\\n\\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;";
ed(1891,A3,A3+"const c9=t.indexOf('\\n\\n[COUNT LIST NOTE',x.e);if(c9>=0&&c9<end)end=c9; /* pkgACT ASK 273 */",1);
// 275
const A5="const sd=/^d/i.test(m[1])?'D':'C';";
ed(3159,A5,"const __pv=s.slice(m.index,m.index+m[0].length-m[2].length);const __sw=[...__pv.matchAll(/\\b(defender|challenger)\\b([\\'’]s\\b)?/gi)].filter(z=>!z[2]||!__pv.slice(z.index+z[0].length).trim());const sd=/^d/i.test(__sw.length?__sw[__sw.length-1][1]:m[1])?'D':'C'; /* pkgACT ASK 275: the nearest side word owns the give-ground word; a possessive side word counts only right before it */",1);
// 276 (node code)
const A6="const fresh=(earlier,c4)=>{";
const B6=A6+"c4=String(c4||'').split('\\n').map(L=>L.split(/(?<=[.!?])\\s+/).map(z=>/MEANS|\\[L[1-4]\\]/.test(z)?z:z.replace(/\\bIsa(?:iah|\\.)?\\s+28\\s*:\\s*1[03]\\b/g,'(method verse)')).join(' ')).join('\\n'); /* pkgACT ASK 276: Isaiah 28:10/13 cited as method (no MEANS, no layer tag) is not a new press (DG-61) */";
const nodes=[];for(const n of W.nodes){if(n.name==='Shared Library')continue;const c=n.parameters&&n.parameters.jsCode;if(!c||!c.includes(A6))continue;if(c.split(A6).length!==2)throw new Error('fresh count '+n.name);n.parameters.jsCode=c.replace(A6,B6);nodes.push(n.name+' '+c.length+'->'+n.parameters.jsCode.length);}
if(nodes.length!==10)throw new Error('fresh nodes '+nodes.length);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log(out.join('\n'));console.log(nodes.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'sha ->',sha(LJ),'users',users.length,users.join(', '));
