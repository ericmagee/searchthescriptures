const fs=require('fs');const {replay,save,net}=require('./chain.cjs');
const live=JSON.parse(fs.readFileSync('../rdf/fetchback_w407.json'));const code=(live.data||live).nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;
const pre=code.slice(0,code.indexOf('})();',code.indexOf('return {tags,tagWords,check'))+5);
const L2C=new Function('$','$input',pre+'\nreturn L2C;')(()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})}),{all:()=>[]});
const TR=new Function('L2C',fs.readFileSync(__dirname+'/trial405.js','utf8')+'\nreturn __l2t405;')(L2C);
const RA=r=>[['DEFENDER','CR1',r.claude_r1],['CHALLENGER','DR1',r.engine_r1],['DEFENDER','CR2',r.claude_r2],['CHALLENGER','DR2',r.engine_r2],['DEFENDER','CR3',r.engine_r3],['CHALLENGER','DR3',r.challenger_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
module.exports={L2C,TR,RA};
if(require.main===module){const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));const tot={runs:0,lines:0,marks:0,changed:0,reworded:0,pair_fail:0,pair_pass:0,errors:0,tagsMismatch:0};
 for(const r of D){const M=replay(live,r);const J=M['L2 Count Plan'][0].json;const ow=M['L2 Words'].map(i=>i.json).filter(x=>x&&x.book),lex=M['L2 Lexicon'].map(i=>i.json).filter(x=>x&&x.strongs_number);
  const S=M['Citation Scan'][0].json;{const A=L2C.tags(RA(r));if(A.length!==S.l2_tags.length||A.some((a,i)=>JSON.stringify(a.words)!==JSON.stringify(S.l2_tags[i].words)||a.seg!==S.l2_tags[i].seg))tot.tagsMismatch++;}
  const E=J.e340;const o=TR(RA(r),S.l2_tags,ow,lex,E?{ok:E.ok,eng:E.eng}:null);tot.runs++;if(o.error){tot.errors++;console.log(r.run_token,'ERROR',o.error);}
  for(const k of ['lines','marks','changed','reworded','pair_fail','pair_pass'])tot[k]+=o.n[k];
  if(o.n.lines||o.n.pair_fail){console.log('== '+r.run_token+' '+JSON.stringify(o.n));o.lines.forEach(l=>console.log('  LINE '+l.round+': '+l.line));(process.env.ALL?o.all:o.changes).forEach(c=>console.log('  CHANGE '+c.round+' '+c.from+' -> '+c.to+' | was: '+c.was+' | now: '+c.now));o.pairs.forEach(p=>console.log('  PAIR FAIL '+p.round+' '+p.word+' ('+p.num+') ['+p.verses+'] '+p.why));}}
 save();console.log(JSON.stringify(tot),'net',net());}
