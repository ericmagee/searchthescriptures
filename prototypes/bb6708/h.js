const fs=require('fs');const runs=JSON.parse(fs.readFileSync('../f1v/runs.json'));
const NODES=['D3_Build','C3_Build','Build_Independent_Verdict','Panel_Build'];
const code={};for(const n of NODES){code[n+'base']=fs.readFileSync('../f1b/'+n+'.new.js','utf8');code[n+'new']=fs.readFileSync(n+'.new.js','utf8');}
function out(src,F){
 const nodes={'Init Seats':{run_token:'T',topic:'TOPIC',rulebook:'live',single_judge:'deepseek',dpos:'the affirmative'},
 'Resolve Seats':{judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:8000},{seat:'gemini',fam:'gemini',api_model:'g',max_tokens:8000},{seat:'grok',fam:'grok',api_model:'x',max_tokens:8000}],deepseek:{api_model:'m',max_tokens:8000},defender:{fam:'deepseek',model:'m',tok:100},challenger:{fam:'deepseek',model:'m',tok:100}},
 'Init with Guards':{d_served:[],c_served:[],csys:'CSYS',dsys:'DSYS',topic:'TOPIC'},
 'Final Output':Object.assign({topic:'TOPIC'},F),'Check Save':{debate_id:'X'},'Quote Report':{unavailable:true},
 'C2 Extract':{raw:F.gr2},'D3 Extract':{raw:F.cr3},'C1 Extract':{raw:F.gr1},'D1 Extract':{raw:F.cr1},'D2 Extract':{raw:F.cr2},'C3 Extract':{raw:F.dr3},'Fetch Models':{}};
 const $=n=>({all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m',max_tokens:8000}}]:[{json:nodes[n]||{}}],first:()=>({json:nodes[n]||{}}),get isExecuted(){return false;}});
 try{return JSON.stringify(new Function('$',src)($));}catch(e){return 'ERR '+e.message;}
}
let same=0,diff=0,err=0,maxAdd={},bad=[];const rep={};
for(const r of runs)for(const n of NODES){const a=out(code[n+'base'],r),b=out(code[n+'new'],r);
 if(a.startsWith('ERR')||b.startsWith('ERR')){err++;console.log('ERR',r.tok,n,a.slice(0,100),b.slice(0,100));continue;}
 if(a===b){same++;continue;}diff++;
 const A=a.split('\\n'),B=b.split('\\n');const sa=new Set(A),sb=new Set(B);
 const rem=A.filter(l=>!sb.has(l)),add=B.filter(l=>!sa.has(l));
 const addLen=b.length-a.length;maxAdd[n]=Math.max(maxAdd[n]||0,addLen);
 for(const l of rem)bad.push(['-',r.tok,n,l.slice(0,200)]);
 (rep[r.tok]=rep[r.tok]||{})[n]={addLen,add};}
fs.writeFileSync('h_out.json',JSON.stringify(rep));
console.log('pairs same',same,'differ',diff,'err',err,'runs',runs.length);
console.log('max chars added per node',JSON.stringify(maxAdd));
const rk={};for(const x of bad){const k=x[2]+' | '+x[3].replace(/\(\d+ of \d+\)|: .*/,'');rk[k]=(rk[k]||0)+1;}
console.log('REMOVED-line kinds:',JSON.stringify(rk,null,1));
