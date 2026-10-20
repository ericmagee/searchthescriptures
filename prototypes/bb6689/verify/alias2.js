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
const r=runs.find(x=>x.tok.includes('27088'));
for(const v of ['base','new']){
 const src=fs.readFileSync('Panel_Build.'+v+'.js','utf8').replace('const namedIn=','globalThis.__g={refs};const namedIn=');
 globalThis.__g=null;const o=out(src,r);if(!globalThis.__g){console.log('no hook',o.slice(0,200));continue;}
 const {refs}=globalThis.__g;
 const T=['1 Chron 28:6','1 Chron. 28:6','2 Chron 36:23','Hag 2:23','Hag. 2:23','Haggai 2:23','1 Chronicles 28:6','1 Chr 28:6','2 Samuel 7:14; 1 Chron 28:6; Psalms 28:6','Hagar 2:3'];
 console.log('==',v);for(const t of T)console.log(' ',JSON.stringify(t),'->',JSON.stringify(refs(t).map(x=>[x.book||'(bare ctx='+(x.ctx||'')+')',x.cvs.join(',')])));
}
