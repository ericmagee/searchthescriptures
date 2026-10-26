const fs=require('fs');const src=f=>fs.readFileSync(f,'utf8').split('\n').slice(0,324).join('\n');
const lib=s=>new Function(s+'\nreturn {cureVerdicts};')();
const L={live:lib(src('Cure_Build.js').replace(fs.readFileSync('f_new.txt','utf8'),fs.readFileSync('f_old.txt','utf8'))),draft:lib(src('Cure_Build.js')),amended:lib(src('amended_Cure_Build.js'))};
const reps=JSON.parse(fs.readFileSync('replies.json','utf8'));const T=fs.readFileSync('/home/user/searchthescriptures/prototypes/debate_fixed/build13_e/run28427/transcript28427.md','utf8');
const item={rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 2',conc:0,L:6,st:'SELF-SUPPORTED',line:'premise 2 (LINK 2)'};
for(const [n,i] of [['deepseek',0],['gemini',1],['grok',2]])for(const k of Object.keys(L)){const v=L[k].cureVerdicts([item],{ok:true,text:reps[i]},{DEFENDER:[],CHALLENGER:[]},{DR2:T});console.log(n,k,v[0].status,v[0].why);}
