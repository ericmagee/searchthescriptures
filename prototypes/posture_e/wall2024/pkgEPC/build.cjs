// pkgEPC (ASKs 267, 268, 269; Eric 11:08 CST 11-14 on Wall 6235 items 1, 8, 9; team sort W1 6237, W2 6238/6242, W3 6239/6240, W4 6243).
// ASK 267 pkgECB: E-COL footing rule (enforcer RULES LIB 3198, judge send-back LIB 2958, code note LIB 3061). No DG-8 text; E-KEY untouched.
// ASK 268 pkgPWS: PRESSED-WITH entry heads: a ";" inside a layer field ([Ln] ... up to the next "|" or line end) is not an entry start. LIB 4 + Panel Build, Build Independent Verdict, D4 Build (PRS START) + Build Save Body (ST).
// ASK 269 pkgCLN: one system line after [DR1] in the judge transcript (Panel Build, Build Independent Verdict) when [DR1] holds an UNSUPPORTED-L4 PREMISES list.
// ASK 270 pkgVBN: Citation Scan [L2] tags bind a bare "verse N" / "v.N" only when every full reference in the tag's row and block is in one chapter (W3 6246 limits a-d).
// (ASK 268 replay: t268b.cjs; ASK 267: t267.cjs; ASK 270: t270.cjs)
// usage: node build.cjs <live s196 json> <target json>
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const N=nm=>{const a=W.nodes.filter(n=>n.name===nm);if(a.length!==1)throw new Error('node '+nm);return a[0];};
const rep=(s,A,B,cnt,tag)=>{const k=s.split(A).length-1;if(k!==cnt)throw new Error('anchor '+tag+' found '+k+' want '+cnt);return s.split(A).join(B);};
const out=[];
// ---------- Shared Library
const Ls=N('Shared Library');const T=Ls.parameters.jsCode;
if(!T.includes('// library sha 08b8409e079687c6,'))throw new Error('not the s196 library');
const iL=T.indexOf('\n/*LIB*/'),iM=T.lastIndexOf('\n/*MAP*/'),iE=T.lastIndexOf('\n/*END*/');
const LIB=JSON.parse(T.slice(iL+8,iM)),MAP=JSON.parse(T.slice(iM+8,iE));
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const k in MAP)if(rb(LIB,MAP[k]).length!==MAP[k].n)throw new Error('live rebuild length differs for '+k);
// ASK 268 head pattern (JS string source as it stands inside single quotes)
const PA="'(^|[;\\\\n]|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])";
const PB="'(^|(?<!(?:--|\\\\|)\\\\s*\\\\[L[1-4]\\\\][^\\\\n|]*);|\\\\n|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])";
const ed=(i,A,B)=>{const l=LIB[i];LIB[i]=rep(l,A,B,1,'LIB '+i);out.push('LIB '+i+' '+l.length+'->'+LIB[i].length);};
ed(4,PA,PB);
// ASK 267 enforcer rule
const R0="AGREE when the quoted words show the answer cannot agree with the meaning; DISAGREE when they do carry a meaning the link can agree with, or the line rests on an absence or on a demand for a stating verse.";
const R1="THE FOOTING RULE (pkgECB, ASK 267; either side alike): a LINK BROKEN line whose ground is that the link\\'s step has no footing, or that its footing is borrowed from its own side\\'s contested links, is not a break by meaning, and the meaning test above does not decide it: that the answer\\'s words can agree with the meaning pressed does not answer a missing footing. On such a line a fit that rests on the very step the line says has no footing, or on the answering side\\'s own contested links, is not a fit. AGREE when the answering side\\'s rounds give that step no footing but its own contested links; DISAGREE when you quote the answering side\\'s own words, in the round that gives them, footing the step on rows that are not its own contested links. Footing is the side\\'s own rows and chain, not one verse that states the step (DG-61): a line that only says no verse states the step rests on an absence. "+R0;
ed(3198,R0,R1);
// ASK 267 judge send-back
const S0="a rival reading of a contested word, footed by the answer\\'s own layers, is not a break.";
const S1=S0+" A break whose ground is missing or borrowed footing is not a break by meaning: a fit that rests on the step the break says has no footing, or on the answering side\\'s own contested links, or on a step you yourself counted UNEXHIBITED, is not a fit, and the break does not give way to it (pkgECB, ASK 267; either side alike).";
ed(2958,S0,S1);
// ASK 267 code note on the enforcer item
const C0="+(__efg?'\\nCODE CHECK (pkgEFG): '+__efg+'.':'')";
const C1=C0+"+(()=>{if(__rp10F(g.line))return '';const h=String(g.line).split(/\\bGROUND\\s*:/i)[0];const m=h.match(/\\bwithout\\s+(?:any\\s+|its\\s+|the\\s+)?footing\\b|\\bfooting\\b[^.;]{0,80}?\\b(?:borrow\\w*|missing|unshown|not\\s+(?:shown|exhibited|given))\\b|\\bborrow\\w*\\s+(?:its\\s+|their\\s+|the\\s+)?(?:footing\\s+from\\s+)?(?:its\\s+own\\s+|their\\s+own\\s+|the\\s+)?contested\\s+links?\\b/i);return m?'\\nCODE CHECK (pkgECB, ASK 267): THE LINE breaks on footing, not on a meaning (\"'+m[0]+'\"). Rule it under THE FOOTING RULE, not by whether the answer\\'s words can agree with the meaning pressed.':'';})()";
ed(3061,C0,C1);
const users=[];for(const k in MAP){const n0=MAP[k].n,n1=rb(LIB,MAP[k]).length;if(n1!==n0){MAP[k].n=n1;users.push(k);}}
const LJ=JSON.stringify(LIB);
const head=T.slice(0,iL).replace(/\/\/ library sha [0-9a-f]{16}, (\d+) lines/,(m,n)=>{if(+n!==LIB.length)throw new Error('line count');return '// library sha '+sha(LJ)+', '+n+' lines';});
const T1=head+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(MAP)+T.slice(iE);Ls.parameters.jsCode=T1;
out.push('Shared Library '+T.length+'->'+T1.length+' sha '+sha(JSON.stringify(JSON.parse(T.slice(iL+8,iM))))+'->'+sha(LJ)+' users '+users.length);
// ---------- PRS copies (ASK 268)
const PRA="'(^|[;\\\\n]|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])\\\\s*[*_]*\\\\s*('+REF+')";
const PRB="'(^|(?<!(?:--|\\\\|)\\\\s*\\\\[L[1-4]\\\\][^\\\\n|]*);|\\\\n|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])\\\\s*[*_]*\\\\s*('+REF+')";
for(const nm of ['Panel Build','Build Independent Verdict','D4 Build']){const n=N(nm);const a=n.parameters.jsCode.length;n.parameters.jsCode=rep(n.parameters.jsCode,PRA,PRB,1,nm);out.push(nm+' '+a+'->'+n.parameters.jsCode.length);}
{const n=N('Build Save Body');const a=n.parameters.jsCode;const A="'(^|[;\\\\n]|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])\\\\s*[*_]*\\\\s*('+REF0+')";const B="'(^|(?<!(?:--|\\\\|)\\\\s*\\\\[L[1-4]\\\\][^\\\\n|]*);|\\\\n|^\\\\s*[-*•]|\\\\n\\\\s*[-*•])\\\\s*[*_]*\\\\s*('+REF0+')";n.parameters.jsCode=rep(a,A,B,1,'BSB');out.push('Build Save Body '+a.length+'->'+n.parameters.jsCode.length);}
// ---------- count-list note (ASK 269)
const CLN="const __CLN=(r1,r2)=>{try{const H=/UNSUPPORTED-?\\s*\\[?L4\\]?\\s*PREMISES/gi;const mx=t=>{t=String(t||'');let i=-1;for(const m of t.matchAll(H))i=m.index;if(i<0)return 0;let x=0;for(const m of t.slice(i).matchAll(/^[ \\t>#*_-]*(\\d{1,2})[.)]\\s/gm))x=Math.max(x,+m[1]);return x;};const a=mx(r1),b=mx(r2);if(!a)return '';return '\\n\\n[COUNT LIST NOTE -- computed by the system, not by a model (pkgCLN, ASK 269): the UNSUPPORTED-L4 PREMISES list in [DR1] (numbered 1 to '+a+') is not the count list. L, c, every count of CONCEDED or UNEXHIBITED premises and every \"Premise <p>\" read only the list that closes [DR2]'+(b?' (numbered 1 to '+b+')':'')+'.]';}catch(e){return '';}};";
{const n=N('Panel Build');let c=n.parameters.jsCode;const a=c.length;
 c=rep(c,"['[DR1] CHALLENGER R1',SAN(F.gr1)]","['[DR1] CHALLENGER R1',F.gr1?SAN(F.gr1)+__CLN(F.gr1,F.gr2):SAN(F.gr1)]",1,'PB parts');
 c=rep(c,"const parts=[",CLN+"\nconst parts=[",1,'PB def');n.parameters.jsCode=c;out.push('Panel Build (CLN) '+a+'->'+c.length);}
{const n=N('Build Independent Verdict');let c=n.parameters.jsCode;const a=c.length;
 c=rep(c,"[DR1] CHALLENGER R1 ==='+NL+SAN(d.gr1)+NL","[DR1] CHALLENGER R1 ==='+NL+SAN(d.gr1)+(d.gr1?__CLN(d.gr1,d.gr2):'')+NL",1,'BIV parts');
 const i=c.lastIndexOf('\n',c.indexOf("[DR1] CHALLENGER R1 ==="));c=c.slice(0,i)+'\n'+CLN+c.slice(i);n.parameters.jsCode=c;out.push('Build Independent Verdict (CLN) '+a+'->'+c.length);}
// ---------- bare verse binding (ASK 270, W3 6246)
{const n=N('Citation Scan');const a=n.parameters.jsCode;
 const A="const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];";
 const B="const __bv=(()=>{try{const NB=[...seg.matchAll(/\\b(?:verses?\\s+|vv?\\.\\s*)(\\d{1,3})\\b(?!\\s*:)/gi)].map(m=>+m[1]);if(!NB.length)return [];const ch=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)).map(k=>String(k).replace(/:\\d+(?:[-–]\\d+)?$/,'')))];if(ch.length!==1)return [];return NB.map(v=>ch[0]+':'+v);}catch(e){return [];}})(); /* pkgVBN, ASK 270 (W3 6246): a bare verse N or v.N in the [L2] row binds to the one chapter of the block's [L1] rows and the row's own full references; more than one chapter, no binding; the lexicon map still decides */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)).concat(__bv))];";
 n.parameters.jsCode=rep(a,A,B,1,'CS');out.push('Citation Scan '+a.length+'->'+n.parameters.jsCode.length);}
fs.writeFileSync(fout,JSON.stringify(raw));console.log(out.join('\n'));
