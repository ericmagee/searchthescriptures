// ASK 294 pkgKRB: cureRecompute's pkgKSR block (LIB 1326) also turns KEYSTONE Dk STANDS to BROKEN when the defender's own rounds say Dk rests on a link that broke (confirmed close contradiction, or a DEFENDER LINK BROKEN collision line). The three no-cure rewrite gates (LIB 1608; own lines of Cure Check and Panel Cure Check) also fire on that trigger. Stacks on ASK 296 (a296/target.json).
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('base rebuild length differs for '+k);
if(T.includes('krbRests2024'))throw new Error('already');
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
const K=fs.readFileSync(__dirname+'/krb.js','utf8').replace(/\n/g,'').trimEnd();
const A="rp.push([__K.raw,'KEYSTONE: '+__k[1]+' -- BROKEN -- LINK '+__k[1].slice(1)+' BROKEN BY A CONFIRMED CLOSING CONTRADICTION','KEYSTONE '+__k[1]]);}";
ed(1326,A,A+"else if(__k){const __r=krbOn2024(__k[1],col,U);if(__r){trig.push('KEYSTONE '+__k[1]+' (STANDS to BROKEN; rests on '+__r.on+')');rp.push([__K.raw,'KEYSTONE: '+__k[1]+' -- BROKEN -- RESTS ON '+__r.on+', WHICH BROKE ('+__r.how+'); the defender\\'s own words: '+__r.q+' (pkgKRB, ASK 294)','KEYSTONE '+__k[1]]);}} /* pkgKRB, ASK 294 */",1);
if(!LIB[1326].trimEnd().endsWith('/* pkgKSR */'))throw new Error('1326 tail');LIB[1326]+=K;out.push('LIB 1326 +'+K.length+' (krb functions)');
const G0="rc.trig.some(t=>/^CLOSE-CONTRADICTION /.test(t))",G1="rc.trig.some(t=>/^CLOSE-CONTRADICTION |^KEYSTONE D\\d+ \\(STANDS to BROKEN; rests on /.test(t))";
ed(1608,G0,G1,1);
for(const [nd,j] of [['Cure Check',181],['Panel Cure Check',184]]){const e=MAP[nd].p[j];if(!Array.isArray(e)||typeof e[0]!=='string'||e[0].split(G0).length!==2)throw new Error('own '+nd);const n0=e[0].length;e[0]=e[0].split(G0).join(G1);out.push('own '+nd+' '+j+' '+n0+'->'+e[0].length);}
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;fs.writeFileSync(fout,JSON.stringify(W));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'users',users.length,users.join(', '));
