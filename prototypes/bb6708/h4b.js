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
const OLD="Verses carried by the closing premise lists only; a witness pressed elsewhere in the rounds is still the judge's to count.";
const NEW="The line beginning \"cited in\" under each side lists every verse the opposing side cited in the rounds before that link round that the link round does not name; which of those verses were quoted against a link or a listed premise is the judge's to decide.";
let ok=0,bad=0;
for(const r of runs)for(const n of ['Build_Independent_Verdict','Panel_Build','D3_Build','C3_Build']){const a=out(code[n+'base'],r),b=out(code[n+'new'],r);if(a.startsWith('ERR'))continue;
 const A=JSON.parse(a),B=JSON.parse(b);
 // strip added lines from new, swap sentence in old, compare whole output
 const strip=s=>s.split('\n').filter(l=>!/^cited in \[|^EVERY VERSE THE (CHALLENGER|DEFENDER) CITED BEFORE|^round (1|2|3, the link round above): /.test(l)).join('\n').replace(/\n\n\n/g,'\n\n');
 const a2=JSON.stringify(A).split(JSON.stringify(OLD).slice(1,-1)).join(JSON.stringify(NEW).slice(1,-1));
 const b2=JSON.stringify(JSON.parse(JSON.stringify(B),(k,v)=>typeof v==='string'?strip(v):v));
 const a3=JSON.stringify(JSON.parse(a2),(k,v)=>typeof v==='string'?strip(v):v);
 if(a3===b2)ok++;else{bad++;if(bad<3){let i=0;while(a3[i]===b2[i])i++;console.log('DIFF',r.tok,n,'|',a3.slice(i-80,i+80),'||',b2.slice(i-80,i+80));}}}
console.log('identical after removing added lines and swapping scope sentence:',ok,'differ:',bad);
const r=runs.find(x=>x.tok.includes('27088'));const b=out(code['C3_Buildnew'],r);
for(const l of JSON.parse(b).body?[]:[]);
const s=b.split('\\n').filter(l=>/^round/.test(l));for(const l of s){const m=l.replace(/^[^:]*: /,'');console.log(l.split(':')[0],m==='none'?0:m.split(', ').length);}
