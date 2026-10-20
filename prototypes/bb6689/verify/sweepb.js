const fs=require('fs');const runs=JSON.parse(fs.readFileSync('../f1v/runs.json'));
const NODES=['D3_Build','C3_Build','Build_Independent_Verdict','Panel_Build'];
const code={};for(const n of NODES)for(const v of ['old','new'])code[n+v]=fs.readFileSync(n+'.'+(v==='old'?'base':'new')+'.js','utf8');
function out(src,F){
 const nodes={'Init Seats':{run_token:'T',topic:'TOPIC',rulebook:'live',single_judge:'deepseek',dpos:'the affirmative'},
 'Resolve Seats':{judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:8000},{seat:'gemini',fam:'gemini',api_model:'g',max_tokens:8000},{seat:'grok',fam:'grok',api_model:'x',max_tokens:8000}],deepseek:{api_model:'m',max_tokens:8000},defender:{fam:'deepseek',model:'m',tok:100},challenger:{fam:'deepseek',model:'m',tok:100}},
 'Init with Guards':{d_served:[],c_served:[],csys:'CSYS',dsys:'DSYS',topic:'TOPIC'},
 'Final Output':Object.assign({topic:'TOPIC'},F),'Check Save':{debate_id:'X'},'Quote Report':{unavailable:true},
 'C2 Extract':{raw:F.gr2},'D3 Extract':{raw:F.cr3},'C1 Extract':{raw:F.gr1},'D1 Extract':{raw:F.cr1},'D2 Extract':{raw:F.cr2},'C3 Extract':{raw:F.dr3},'Fetch Models':{}};
 const $=n=>({all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m',max_tokens:8000}}]:[{json:nodes[n]||{}}],first:()=>({json:nodes[n]||{}}),get isExecuted(){return false;}});
 try{return JSON.stringify(new Function('$',src)($));}catch(e){return 'ERR '+e.message;}
}
let same=0,diff=0,err=0;
for(const r of runs)for(const n of NODES){const a=out(code[n+'old'],r),b=out(code[n+'new'],r);
 if(a.startsWith('ERR')||b.startsWith('ERR')){err++;console.log('ERR',r.tok,n,a.slice(0,100),b.slice(0,100));continue;}
 if(a===b){same++;continue;}diff++;
 const A=a.split('\\n'),B=b.split('\\n');const sa=new Set(A),sb=new Set(B);
 for(const l of A)if(!sb.has(l))console.log('-',r.tok,n,l.slice(0,230));
 for(const l of B)if(!sa.has(l))console.log('+',r.tok,n,l.slice(0,230));}
console.log('pairs same',same,'differ',diff,'err',err);
