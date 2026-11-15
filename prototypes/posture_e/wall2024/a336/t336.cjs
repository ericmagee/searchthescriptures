// ASK 336 replay: 67 stored debates + 37510. Tags from Citation Scan's L2C (PRE s222, POST target_336), each run through its own L2 Count Plan.
const fs=require('fs');const LD=require('./loadcs.cjs');
const PREF='../rdf/fetchback_s222_333_335.json',POSTF='target_336.json';
const W=f=>JSON.parse(fs.readFileSync(f));const code=w=>w.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;
const S={pre:{L:LD(PREF),c:code(W(PREF))},post:{L:LD(POSTF),c:code(W(POSTF))}};
const D=W('../a329/debates.json').concat(W('r37510.json'));const OD=W('data336.json');const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
const RA=r=>[['DEFENDER','CR1',r.claude_r1],['CHALLENGER','DR1',r.engine_r1],['DEFENDER','CR2',r.claude_r2],['CHALLENGER','DR2',r.engine_r2],['DEFENDER','CR3',r.engine_r3],['CHALLENGER','DR3',r.challenger_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4});
function run(V,r){const ra=RA(r);const tg=V.L.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));
 const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 const M={'Citation Scan':[{l2_tags:tg,l2_claims:V.L.countClaims?V.L.countClaims(ra):[]}],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv,'Final Output':[F_(r)]};
 const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:JSON.parse(JSON.stringify(j))})),first:()=>({json:JSON.parse(JSON.stringify(m[0]))})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 return new Function('$','$input',V.c)($,{all:()=>[],first:()=>({json:{}})})[0].json;}
const tr={};let cToN=0,nToC=0,other=0,same=0,wid=0;const lines=[];
for(const r of D){const a=run(S.pre,r),b=run(S.post,r);const A=a.tags||[],B=b.tags||[];if(A.length!==B.length)throw new Error('len');
 for(let i=0;i<A.length;i++){const x=A[i],y=B[i];const vw=JSON.stringify(x.verses)!==JSON.stringify(y.verses);if(vw)wid++;
  if(x.status===y.status&&JSON.stringify(x.words)===JSON.stringify(y.words)){same++;if(vw)lines.push(r.run_token+' '+y.round+' WIDENED, status unchanged '+y.status+' | '+x.verses.join(', ')+' -> '+y.verses.join(', ')+' | '+(y.words||[]).map(w=>w.w+(w.ok?'=':'!')).join(' '));continue;}
  const k=x.status+' -> '+y.status;tr[k]=(tr[k]||0)+1;if(x.status==='COUNTED'&&y.status!=='COUNTED')cToN++;else if(y.status==='COUNTED')nToC++;else other++;
  lines.push(r.run_token+' '+y.round+' '+k+' | '+x.verses.join(', ')+' -> '+y.verses.join(', ')+' | PRE '+(x.words||[]).map(w=>w.w+(w.ok?'=':'!')).join(' ')+' | POST '+(y.words||[]).map(w=>w.w+(w.ok?'=':'!')+(w.in?'@'+w.in:'')).join(' '));}
 // tags outside the widened set must be byte-identical
}
console.log('debates',D.length,'| tags unchanged',same,'| tags widened',wid,'| transitions',JSON.stringify(tr),'| COUNTED->other',cToN,'| ->COUNTED',nToC,'| other',other);
lines.forEach(l=>console.log(l));
