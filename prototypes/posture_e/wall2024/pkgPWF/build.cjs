// pkgPWF (ASK 258): the Galatians 4:4 cure fix (sol, run 36842). Shared Library only, three edits in the ABS block:
//  E1 (LIB "function cure(it,a,ctx)" line): pwf() is defined in front of cure() on the same line (no line is added, so MAP indices hold).
//  E2 (the cure's "quotes a counted [L1] positive fit" test): for E-ANS, a COUNTED fit must survive pwf()'s masking of [L1] verses the ANSWER neither names nor quotes.
//  E3 (ABS.check's why, the send-back reason the judge reads): E-ANS only, the rule is stated before it is enforced.
// MAP n of each user recomputed, header sha recomputed. usage: node build.cjs <live s191 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow '+W.id);
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha 58d306b24b65f648,'))throw new Error('not the s191 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');if(iL<0||iM<iL||iE<iM)throw new Error('not stub form 3');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const SRC=fs.readFileSync(__dirname+'/pwf_src.js','utf8').trim();
const EDITS=[
 [" function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');", " "+SRC+" function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');"],
 ["if(f==='COUNTED')return R(true,'CHANGE TO quotes a counted [L1] positive fit (pkgABS)');",
  "if(f==='COUNTED'){const g=it.rule==='E-ANS'?pwf(to,a):null;if(g===null||fit(g,ctx)==='COUNTED')return R(true,'CHANGE TO quotes a counted [L1] positive fit (pkgABS)');return R(false,'the counted [L1] in the CHANGE TO is a verse its ANSWER neither names nor quotes; the [L1] must be the answer\\'s own verse (pkgPWF)');}"],
 ["' rests on an absence or non-denial (\"'+a+'\") and quotes no counted [L1] positive fit'+",
  "' rests on an absence or non-denial (\"'+a+'\") and quotes no counted [L1] positive fit'+(id.rule==='E-ANS'?' (the [L1] must be a verse the ANSWER itself names or quotes)':'')+"]];
const done=[];for(const [a,b] of EDITS){const hit=LIB.map((l,i)=>[i,l]).filter(([i,l])=>l.includes(a));if(hit.length!==1||hit[0][1].split(a).length!==2)throw new Error('anchor x'+hit.length+': '+a.slice(0,60));
 const i=hit[0][0],b0=LIB[i];LIB[i]=b0.replace(a,()=>b);done.push('LIB '+i+' '+b0.length+'->'+LIB[i].length+' ('+(LIB[i].length-b0.length)+')');}
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k+' '+n0+'->'+n1);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
const s=JSON.stringify(raw);fs.writeFileSync(fout,s);
console.log('edits:',done.join(' | '));
console.log('nodes whose rebuilt length changed ('+users.length+'): '+users.join('; '));
console.log('Shared Library jsCode',T.length,'->',T1.length,'('+(T1.length-T.length)+') | library sha',(T.match(/library sha (\w+)/)||[])[1],'->',sha(LJ),'| jsCode sha',sha(T),'->',sha(T1));
console.log('target sha256',sha(s));
