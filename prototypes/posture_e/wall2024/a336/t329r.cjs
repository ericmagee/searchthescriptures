// 329 trial rebased on 336: l2_trial totals over 67 stored debates + 37510, PRE (s223, before 336) vs POST (live s225).
const fs=require('fs');const LD=require('./loadcs.cjs');
const PREF=process.argv[2]||'../rdf/fetchback_s223_334.json',POSTF=process.argv[3]||'../rdf/fetchback_s225_337.json';
const W=f=>JSON.parse(fs.readFileSync(f));const code=w=>w.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;
const S={pre:{L:LD(PREF),c:code(W(PREF))},post:{L:LD(POSTF),c:code(W(POSTF))}};
const D=W('../a329/debates.json').concat(W('r37510.json'));const OD=W('data336.json');const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
const RA=r=>[['DEFENDER','CR1',r.claude_r1],['CHALLENGER','DR1',r.engine_r1],['DEFENDER','CR2',r.claude_r2],['CHALLENGER','DR2',r.engine_r2],['DEFENDER','CR3',r.engine_r3],['CHALLENGER','DR3',r.challenger_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4});
function run(V,r){const ra=RA(r);const tg=V.L.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));
 const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 const M={'Citation Scan':[{l2_tags:tg,l2_claims:V.L.countClaims?V.L.countClaims(ra):[]}],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv,'Final Output':[F_(r)]};
 const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:JSON.parse(JSON.stringify(j))})),first:()=>({json:JSON.parse(JSON.stringify(m[0]))})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 return new Function('$','$input',V.c)($,{all:()=>[],first:()=>({json:{}})})[0].json.l2_trial;}
const T={pre:{},post:{}};const diffs=[];
for(const r of D){const a=run(S.pre,r),b=run(S.post,r);for(const [k,v] of Object.entries(a.n||{}))T.pre[k]=(T.pre[k]||0)+v;for(const [k,v] of Object.entries(b.n||{}))T.post[k]=(T.post[k]||0)+v;
 const ka=new Set((a.items||[]).map(x=>x.round+' '+x.num+' '+x.trial)),kb=new Set((b.items||[]).map(x=>x.round+' '+x.num+' '+x.trial));
 for(const x of (b.items||[]))if(!ka.has(x.round+' '+x.num+' '+x.trial))diffs.push('NEW  '+r.run_token+' '+x.round+' '+x.num+' '+x.trial+' -- '+String(x.why).slice(0,140));
 for(const x of (a.items||[]))if(!kb.has(x.round+' '+x.num+' '+x.trial))diffs.push('GONE '+r.run_token+' '+x.round+' '+x.num+' '+x.trial+' -- '+String(x.why).slice(0,140));}
console.log('debates',D.length);console.log('PRE  (s223)',JSON.stringify(T.pre));console.log('POST (s225)',JSON.stringify(T.post));diffs.forEach(d=>console.log(d));
