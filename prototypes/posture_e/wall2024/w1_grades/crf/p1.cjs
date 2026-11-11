// W1 plants for pkgCRF: planted reply forms through Panel Cure Normalize 1 (35067 luna) and Cure Normalize (35067 terra),
// old code fed the old Build output, new code fed the new Build output (the chain as it would run).
const fs=require('fs');const LIB=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const A=LIB('/tmp/claude-0/_u_fetchback_live_s135.json'),B=LIB('/tmp/claude-0/_u_parent_s135_CRFb.json');
const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=ex.data.resultData.runData;
const cl=x=>JSON.parse(JSON.stringify(x));
const PAIRS=[['Panel Cure Build 1','Panel Cure Call 1 openrouter','Panel Cure Normalize 1'],['Cure Build','Cure Call openrouter','Cure Normalize']];
(async()=>{for(const [bn,cn,nn] of PAIRS){
 if(!rd[cn]){console.log('no',cn);continue;}
 const bo=await run(A.code(bn),bn,rd),bnw=await run(B.code(bn),bn,rd);
 const stored=rd[cn][0].data.main[0][0].json;const txt=String(stored.choices[0].message.content);let J;try{J=JSON.parse(txt.replace(/^```(?:json)?\s*|\s*```$/g,''))}catch(e){J=null}
 const arr=J&&J.cure_lines||[];
 const P={
  STORED:txt,
  TOP_ARRAY:JSON.stringify(arr),
  KEY_CASE:JSON.stringify({Cure_Lines:arr}),
  TRAILING_COMMA:JSON.stringify({cure_lines:arr}).replace(/\]\}$/,',]}'),
  LOWER_KIND:JSON.stringify({cure_lines:arr.map(x=>({...x,kind:String(x.kind).toLowerCase()}))}),
  HALF:JSON.stringify({cure_lines:arr.slice(0,Math.ceil(arr.length/2))}),
  EMPTY:'',
  TABLE:'| kind | item | text |\n|---|---|---|\n'+arr.map(x=>'| '+x.kind+' | '+x.item+' | '+String(x.text).replace(/\|/g,'/')+' |').join('\n'),
  NESTED_STRING:JSON.stringify({cure_lines:JSON.stringify(arr)}),
 };
 for(const [k,t] of Object.entries(P)){const rep=cl(stored);rep.choices[0].message.content=t;const inp=[{json:rep}];
  const o=await run(A.code(nn),nn,rd,{[bn]:[bo.map(j=>({json:j}))]},inp),n=await run(B.code(nn),nn,rd,{[bn]:[bnw.map(j=>({json:j}))]},inp);
  if(o.err||n.err){console.log(nn,k,'ERR',o.err||'-',n.err||'-');continue;}
  const S=x=>JSON.stringify(x);const fum=s=>{const m=s.match(/"asked":\[([^\]]*)\]/);return m?(m[1]?m[1].split('","').length:0):'?'};
  const fb=x=>{const s=S(x);const i=s.indexOf('"fum');return i<0?'none':s.slice(i,i+60)};
  const noteIn=(x)=>{const s=S(x);return (s.match(/ANSWER FORMAT: return one JSON object/g)||[]).length};
  const rfIn=x=>(S(x).match(/"response_format"/g)||[]).length;
  console.log(nn,'|',k.padEnd(14),'| old==new except response_format',S(JSON.parse(S(o),(a,v)=>a==='response_format'?undefined:v))===S(JSON.parse(S(n),(a,v)=>a==='response_format'?undefined:v)),'| asked old/new',fum(S(o)),fum(S(n)),'| notes old/new',noteIn(o),noteIn(n),'| response_format old/new',rfIn(o),rfIn(n));
 }}})();
