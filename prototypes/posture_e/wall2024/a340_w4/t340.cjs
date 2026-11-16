// ASK 340 replay: 67 stored debates + 37510, PRE (live s229 L2 Count Plan) vs POST (target: L2 Gloss Plan -> real REST reads -> L2 Count Plan).
const fs=require('fs'),cp=require('child_process');const LD=require('../a336/loadcs.cjs');
const PREF=process.argv[2]||'../rdf/fetchback_s229_339.json',POSTF=process.argv[3]||'target_340.json';
const W=f=>JSON.parse(fs.readFileSync(f));const code=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const wPre=W(PREF),wPost=W(POSTF);const Lc=LD(PREF);
const S={pre:code(wPre,'L2 Count Plan'),post:code(wPost,'L2 Count Plan'),plan:code(wPost,'L2 Gloss Plan')};
const D=W('../a329/debates.json').concat(W('../a336/r37510.json'));const OD=W('../a336/data336.json');const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
const RA=r=>[['DEFENDER','CR1',r.claude_r1],['CHALLENGER','DR1',r.engine_r1],['DEFENDER','CR2',r.claude_r2],['CHALLENGER','DR2',r.engine_r2],['DEFENDER','CR3',r.engine_r3],['CHALLENGER','DR3',r.challenger_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4});
const CF='cache340.json';const CA=fs.existsSync(CF)?W(CF):{};let net=0;
const K='sb_publishable_rgfWFjynRqBdzyEeBRHcig_c6pHysAi';
function http(it){if(process.env.FAIL&&new RegExp(process.env.FAIL).test(it.url))return {body:{message:'planted failure'},headers:{},statusCode:500};
 const key=it.url+'|'+it.prefer;if(!CA[key]){net++;const out=cp.execFileSync('curl',['-sS','-D','-','--max-time','60',it.url,'-H','apikey: '+K,'-H','Authorization: Bearer '+K,'-H','Prefer: '+(it.prefer||'')],{maxBuffer:1<<28}).toString();
  const sp=out.split(/\r?\n\r?\n/);let hd='',body='';for(let i=0;i<sp.length;i++){if(/^HTTP\//.test(sp[i])&&!/Connection Established/.test(sp[i])){hd=sp[i];body=sp.slice(i+1).join('\n\n');break;}}
  const st=+((hd.match(/^HTTP\/\S+\s+(\d+)/)||[])[1]);const h={};for(const l of hd.split(/\r?\n/).slice(1)){const m=l.match(/^([^:]+):\s*(.*)$/);if(m)h[m[1].toLowerCase()]=m[2];}
  let b;try{b=JSON.parse(body);}catch(e){b=body;}CA[key]={body:b,headers:{'content-range':h['content-range']},statusCode:st};}
 return JSON.parse(JSON.stringify(CA[key]));}
const mk=M=>n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:JSON.parse(JSON.stringify(j))})),first:()=>({json:JSON.parse(JSON.stringify(m[0]))})}:{isExecuted:false,all:()=>{throw new Error('unexecuted '+n);},first:()=>{throw new Error('unexecuted '+n);}};};
const ex=(c,$)=>new Function('$','$input',c)($,{all:()=>[],first:()=>({json:{}})});
function base(r){const ra=RA(r);const tg=Lc.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));
 const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 return {'Citation Scan':[{l2_tags:tg,l2_claims:Lc.countClaims?Lc.countClaims(ra):[]}],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv,'Final Output':[F_(r)]};}
function runPost(M0){const M={...M0};const P=ex(S.plan,mk(M)).map(i=>i.json);M['L2 Gloss Plan']=P;let reads=0;
 if(!P[0].none){M['L2 Gloss Read']=P.map(it=>{reads++;return http(it);});}
 return {out:ex(S.post,mk(M))[0].json,P,reads};}
module.exports={runPost,base,ex,mk,S,http,save:()=>fs.writeFileSync(CF,JSON.stringify(CA))};
if(require.main===module){
 const tr={};let same=0,ch=0,cToN=0,ident=0,noCand=0,totalReads=0;const lines=[],setA=[],flags=[];const agg={eng:new Set(),blocked:new Set(),not_kjv:new Set(),no_answer:new Set()};
 for(const r of D){const M=base(r);const a=ex(S.pre,mk(M))[0].json;const {out:b,P,reads}=runPost(M);totalReads+=reads;
  if(P[0].none){noCand++;if(JSON.stringify(a)===JSON.stringify(b))ident++;else lines.push(r.run_token+' NO CANDIDATE BUT OUTPUT DIFFERS');}
  const E=b.e340;if(E){for(const k of Object.keys(agg))(E[k]||[]).forEach(x=>agg[k].add(x));if(!E.ok&&(E.cand||[]).length)lines.push(r.run_token+' PART A NO ANSWER: '+E.why);
   for(const g of E.gloss||[])if(g.status!=='FOUND')flags.push(r.run_token+' '+g.round+' '+g.word+' ('+g.num+'): '+g.status+' "'+g.part+'"'+(g.kjv?' | KJV: '+g.kjv.join(', '):'')+(g.why?' | '+g.why:''));}
  const A=a.tags,B=b.tags;if(A.length!==B.length)throw new Error('len');
  for(let i=0;i<A.length;i++){const x=A[i],y=B[i];if(JSON.stringify(x)===JSON.stringify(y)){same++;continue;}ch++;const k=x.status+' -> '+y.status;tr[k]=(tr[k]||0)+1;if(x.status==='COUNTED'&&y.status!=='COUNTED')cToN++;
   const en=(y.words||[]).filter(w=>w.english).map(w=>w.w);setA.push(...en.map(w=>w.toLowerCase()));
   lines.push(r.run_token+' '+y.round+' '+k+' | set aside: '+en.join(', ')+' | words: '+(y.words||[]).map(w=>w.w+(w.english?'~':w.ok?'=':'!')).join(' ')+' | why: '+String(y.why).slice(0,160));}
  // everything except tags and e340 identical
  const a2={...a,tags:null},b2={...b,tags:null};delete b2.e340;if(JSON.stringify(a2)!==JSON.stringify(b2))lines.push(r.run_token+' OTHER OUTPUT DIFFERS');}
 module.exports.save();
 console.log('debates',D.length,'| no-candidate runs',noCand,'byte-identical',ident,'| REST reads (all runs)',totalReads,'new network',net,'| tags same',same,'changed',ch,JSON.stringify(tr),'| COUNTED->other',cToN);
 console.log('PART A set aside (distinct):',[...agg.eng].sort().join(', '));console.log('kept as transliteration:',[...agg.blocked].sort().join(', '));console.log('not KJV words:',[...agg.not_kjv].sort().join(', '));console.log('no answer:',[...agg.no_answer].sort().join(', '));
 console.log('set-aside words of 4 letters or fewer (wrong-if h, hand-read):',[...new Set(setA)].filter(w=>w.length<=4).sort().join(', ')||'none');
 lines.forEach(l=>console.log(l));console.log('--- PART B, not FOUND ('+flags.length+')');flags.forEach(l=>console.log(l));}
