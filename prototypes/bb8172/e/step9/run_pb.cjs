const fs=require('fs');const which=process.argv[2]||'new';
const src=fs.readFileSync(__dirname+'/'+which+'/Panel_Build.js','utf8');
const rd=f=>fs.readFileSync(__dirname+'/fixtures/'+f,'utf8');
const pad=s=>s+'\n'+'Filler round text. '.repeat(120);
const d={topic:'Did Christ have a biological father?',cr1:pad('The grammar assigns the birth to the mother alone. That is a deliberate signal, not an accident. The question presupposes that the conception will not come from a man.'),cr2:pad(''),gr1:pad('Joseph knew Mary his wife within the espousal'),gr2:rd('r29609_gr2l.txt'),cr3:rd('r29609_cr3l.txt'),dr3:pad('LINK 1: SUPPORTED'),run_token:'TEST'};
const node={first:()=>({json:d}),all:()=>[{json:d}],last:()=>({json:d}),item:{json:d},itemMatching:()=>({json:d})};
const M={'Final Output':d,'Init with Guards':{d_served:[],c_served:[],d_named:[],c_named:[]},'Quote Report':{items:[],report:'',lines:[]},'Init Seats':{single_judge:'deepseek',run_token:'TEST',panel:['gemini','glm','grok'],seats:['gemini','glm','grok']},'Check Save':{debate_id:'00000000-0000-0000-0000-000000000000'},'Resolve Seats':{deepseek:{api:'deepseek-flash',max:8000},judges:[{seat:'gemini',fam:'gemini',api_model:'gemini-3.1-pro-preview',max_tokens:8000},{seat:'glm',fam:'openrouter',api_model:'z-ai/glm-5.3',max_tokens:8000},{seat:'grok',fam:'grok',api_model:'grok-4.7',max_tokens:8000}]}};
const mk=v=>({first:()=>({json:v}),all:()=>(v===undefined?[]:[{json:v}]),last:()=>({json:v}),item:{json:v},itemMatching:()=>({json:v})});
const $=n=>n==='Regrade Load'?{isExecuted:false,first:()=>({json:null})}:n==='Fetch Models'?{all:()=>[{json:{seat:'deepseek',api_model:'deepseek-flash',max_tokens:8000}}]}:mk(M[n]);const $input={first:()=>({json:d}),all:()=>[{json:d}],item:{json:d}};const $json=d;
let out;try{out=new Function('$','$input','$json','return (async function(){'+src+'\n})()')($,$input,$json);}catch(e){console.log('THROW',e.message);process.exit(2);}
Promise.resolve(out).then(o=>{const j=JSON.stringify(o);fs.writeFileSync(__dirname+'/pb_out_'+which+'.json',j);console.log('ok',which,j.length);}).catch(e=>{console.log('REJECT',e.message,(e.stack||'').split('\n').slice(1,3).join(' | '));process.exit(3);});
