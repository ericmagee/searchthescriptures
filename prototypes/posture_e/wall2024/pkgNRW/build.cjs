// pkgNRW (ASK 272; operator "yes" 13:01 CST 11-14 on Wall 6270; team: W1 6264/6270, W2 6268, W3 6262/6265, W4 6271).
// E-PREM only, both sides alike, no DG-8 text, no model as the source.
// (1) LIB 3120: the E-PREM item carries, when the answering block is headed "LINK n: NARROWED TO:", a system line with the kept claim and the block's own drop/withdraw/disown sentences.
// (2) LIB 3202: RULE E-PREM gets the NARROWED clause: test the kept claim; COUNTED form "(UNEXHIBITED: the kept claim takes as given <fact>, which its rows do not give and its [L4] does not reach)" (W3 6265 wording).
// (3) count readers: replayed, no change needed (t3.cjs, t4.cjs, t5).
// usage: node build.cjs <live s197 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const Ls=W.nodes.filter(n=>n.name==='Shared Library');if(Ls.length!==1)throw new Error('library count');const T=Ls[0].parameters.jsCode;
if(!T.includes('// library sha ac509148efc92395,'))throw new Error('not the s197 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
const out=[];const ed=(i,A,B,cnt)=>{const l=LIB[i];const k=l.split(A).length-1;if(k!==cnt)throw new Error('anchor at '+i+' found '+k);LIB[i]=l.split(A).join(B);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
// (3) readers
const BF="/footing\\s+borrowed\\s+from\\s+contested\\s+Links?\\s+\\d/i";
const BN="/footing\\s+borrowed\\s+from\\s+contested\\s+Links?\\s+\\d|kept\\s+claim\\s+takes\\s+as\\s+given\\b/i";
/* (3) dropped after replay: every reader already treats the form as wanted (no K-UNX item; rctCheck accepts; unxLack reads [L4] as missing, so pkgEPS does not hold and pkgEPK does not mark) */
// (1) item line
const A1="+'\\nTHE ANSWERING SIDE\\'S LINK-ROUND BLOCK FOR IT'+(a&&a.by==='number'?' (found by its LINK number; the side tagged no block for this premise)':'')+': '+(a?cut(a.t,1800):'(no block answering this premise was found by its number or tag)')";
const B1=A1+"+(()=>{try{const t=a?String(a.t):'';const h=t.match(/^[ \\t>#*_-]*LINK\\s+\\d+\\s*:\\s*[*_]*\\s*NARROWED\\s+TO\\s*:?\\s*[*_]*\\s*([^\\n]+)/im);if(!h)return '';const DR=/\\b(?:dropped|drops?|withdraw\\w*|disown\\w*|(?:does|do)\\s+not\\s+rest\\s+on|not\\s+resting\\s+on|gives?\\s+up|given\\s+up)\\b/i;const SS=s=>String(s).split(/(?<=[.!?][\"”'’)]?)\\s+(?=[\"“*_(]*[A-Z])/).map(x=>x.trim()).filter(Boolean);const kept=SS(h[1]).filter(x=>!DR.test(x)).join(' ');const dr=[];for(const x of SS(t.replace(/\\n+/g,' ')))if(DR.test(x)&&!dr.includes(x)&&dr.length<4)dr.push(x);return '\\nNARROWED (computed by the system, not by a model; pkgNRW, ASK 272): THE KEPT CLAIM: \"'+cut(kept,600)+'\" | WHAT THE BLOCK DROPS OR DISOWNS: '+(dr.length?dr.map(x=>'\"'+cut(x,400)+'\"').join(' '):'(no such sentence found)')+'. Rule it under the NARROWED clause of RULE E-PREM: test the kept claim, not the disowning sentence.';}catch(e){return '';}})()";
ed(3120,A1,B1,1);
// (2) rule
const A2="It is UNEXHIBITED only when the kept words still assert the very claim the side dropped; say so by quoting both the dropped claim and the kept words that still assert it.";
const B2="It is UNEXHIBITED when the kept words still assert the very claim the side dropped; say so by quoting both the dropped claim and the kept words that still assert it. It is also UNEXHIBITED when the kept claim still takes the dropped limb as given (pkgNRW, ASK 272; either side alike): when the item gives a NARROWED line, test the kept claim, not the sentence that disowns the limb. If the kept claim holds only by taking the dropped limb as given, and the block\\'s [L4] does not conclude the kept claim from its rows, your RIGHT is COUNTED; write (UNEXHIBITED: the kept claim takes as given <the dropped limb>, which its rows do not give and its [L4] does not reach), quoting the kept claim. If the block\\'s [L4] reaches the kept claim from its rows without the dropped limb, your RIGHT is SPARED. A disowning sentence such as \"the link does not rest on it\" is not footing. This is not a demand for a stating verse (DG-61): it applies only to a kept claim that needs the limb its own side dropped.";
ed(3202,A2,B2,1);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls[0].parameters.jsCode=T1;
fs.writeFileSync(fout,JSON.stringify(raw));
console.log(out.join('\n'));console.log('Shared Library',T.length,'->',T1.length,'sha',sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM)))),'->',sha(LJ),'users',users.length);
