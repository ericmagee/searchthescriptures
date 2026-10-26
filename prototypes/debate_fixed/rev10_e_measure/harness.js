const fs=require('fs');
const NEW=fs.readFileSync(process.argv[2],'utf8').split('\n').slice(0,324).join('\n');
const fnew=fs.readFileSync('f_new.txt','utf8'), fold=fs.readFileSync('f_old.txt','utf8');
if(NEW.split(fnew).length!==2) throw 'f_new not once';
const OLD=NEW.replace(fnew,fold);
const reps=JSON.parse(fs.readFileSync('replies.json','utf8'));
const T=fs.readFileSync('/home/user/searchthescriptures/prototypes/debate_fixed/build13_e/run28427/transcript28427.md','utf8');
function lib(src){return new Function(src+'\nreturn {cureVerdicts,cureSet};')();}
const L={old:lib(OLD),new:lib(NEW)};
const item={rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise 2',conc:0,L:6,st:'SELF-SUPPORTED',line:'premise 2 (LINK 2): 2 verse(s) carried; 0 named; NOT NAMED: Luke 1:31, Luke 2:21'};
const cases=[
 ['grok 28427, statement quote found',reps[2],{DR2:T}],
 ['grok 28427, statement quote not found',reps[2],{DR2:'x'}],
 ['edge: COUNT 0 + quoting statement',reps[2].replace('DEFENDER 1','DEFENDER 0').replace('CORRECTED STANDING: DEFENDER PROP-DEPENDENT\n',''),{DR2:T}],
 ['edge: no COUNT, quoting statement',reps[2].split('\n').filter(l=>!/^CORRECTED/.test(l)).join('\n'),{DR2:T}],
];
for(const [n,r,R] of cases){for(const k of ['old','new']){const v=L[k].cureVerdicts([item],{ok:true,text:r},{DEFENDER:[],CHALLENGER:[]},R);
 console.log(k.padEnd(3),'|',n,'|',v[0].status,'|',v[0].why,'| set:',JSON.stringify(L[k].cureSet({ok:true,text:r},v)));}}
