const fs=require('fs');const runs=JSON.parse(fs.readFileSync('runs.json'));
const NODES=['D3_Build','C3_Build','Build_Independent_Verdict','Panel_Build'];
const code={};for(const n of NODES)for(const v of ['old','new'])code[n+v]=fs.readFileSync(n+'.'+v+'.js','utf8');
function out(src,F){
 const nodes={'Init Seats':{run_token:'T',topic:'TOPIC',rulebook:'live',single_judge:'deepseek',dpos:'the affirmative'},
 'Resolve Seats':{judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:8000},{seat:'gemini',fam:'gemini',api_model:'g',max_tokens:8000},{seat:'grok',fam:'grok',api_model:'x',max_tokens:8000}],deepseek:{api_model:'m',max_tokens:8000},defender:{fam:'deepseek',model:'m',tok:100},challenger:{fam:'deepseek',model:'m',tok:100}},
 'Init with Guards':{d_served:[],c_served:[],csys:'CSYS',dsys:'DSYS',topic:'TOPIC'},
 'Final Output':Object.assign({topic:'TOPIC'},F),'Check Save':{debate_id:'X'},'Quote Report':{unavailable:true},
 'C2 Extract':{raw:F.gr2},'D3 Extract':{raw:F.cr3},'C1 Extract':{raw:F.gr1},'D1 Extract':{raw:F.cr1},'D2 Extract':{raw:F.cr2},'C3 Extract':{raw:F.dr3},'Fetch Models':{}};
 const $=n=>({all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m',max_tokens:8000}}]:[{json:nodes[n]||{}}],first:()=>({json:nodes[n]||{}}),get isExecuted(){return false;}});
 try{return JSON.stringify(new Function('$',src)($));}catch(e){return 'ERR '+e.message;}
}
const lines=s=>s.split("\\n").filter(l=>/NOT NAMED: /.test(l));
if(process.argv[3]==='dump'){const r=runs.find(x=>x.tok.includes(process.argv[2]));const s=out(code['Panel_Buildnew'],r);const i=s.indexOf('PRESSED-WITNESS');console.log(s.length,i,s.slice(i,i+3000));process.exit(0);}
const only=process.argv[2];let moves=0;
for(const r of runs){if(only&&!r.tok.includes(only))continue;
 for(const n of NODES){const a=out(code[n+'old'],r),b=out(code[n+'new'],r);
  if(a.startsWith('ERR')||b.startsWith('ERR')){console.log(r.tok,n,'ERR',a.slice(0,80),b.slice(0,80));continue;}
  const A=lines(a),B=lines(b);
  if(only){console.log('==',r.tok,n);B.forEach(l=>console.log('  ',l.slice(0,220)));}
  const sa=new Set(A),sb=new Set(B);
  for(const l of A)if(!sb.has(l)){moves++;console.log('-',r.tok,n,l.slice(0,200));}
  for(const l of B)if(!sa.has(l)){console.log('+',r.tok,n,l.slice(0,200));}
 }}
console.log('runs',only?'filtered':runs.length,'removed-lines',moves);
