const fs=require('fs');const F=JSON.parse(fs.readFileSync('../rounds27035.json'));
const nodes={
 'Init Seats':{run_token:'T',topic:'TOPIC',rulebook:'live',single_judge:'deepseek',dpos:'the affirmative'},
 'Resolve Seats':{judges:[{seat:'deepseek',fam:'deepseek',api_model:'m',max_tokens:8000},{seat:'gemini',fam:'gemini',api_model:'g',max_tokens:8000},{seat:'grok',fam:'grok',api_model:'x',max_tokens:8000}],deepseek:{api_model:'m',max_tokens:8000},defender:{fam:'deepseek',model:'m',tok:100},challenger:{fam:'deepseek',model:'m',tok:100}},
 'Init with Guards':{d_served:[],c_served:[],csys:'CSYS',dsys:'DSYS',topic:'TOPIC'},
 'Final Output':Object.assign({topic:'TOPIC'},F),'Check Save':{debate_id:'X'},
 'Quote Report':{unavailable:true},'C2 Extract':{raw:F.gr2},'D3 Extract':{raw:F.cr3},'Fetch Models':{}};
const $=n=>({all:()=>n==='Fetch Models'?[{json:{seat:'deepseek',api_model:'m',max_tokens:8000}}]:[{json:nodes[n]||{}}],first:()=>({json:nodes[n]||{}}),get isExecuted(){return false;}});
const run=f=>new Function('$',fs.readFileSync(f,'utf8'))($);
const pb=run('Panel_Build.new.js')[0].json.judges[0].body.messages[0].content;
console.log('PANEL sys has ledger:',pb.includes('PRESSED-WITNESS LEDGER -- computed'),'Numbers 1:2 present:',pb.includes('NOT NAMED: Numbers 1:2'));
const pb0=run('../live/Panel_Build.js')[0].json.judges[0].body.messages[0].content;
console.log('PANEL old len',pb0.length,'new len',pb.length,'old is prefix-equal except ledger:',pb.replace(/\n\n?PRESSED-WITNESS LEDGER[\s\S]*?the judge decides that\.\n?/,'\n').length);
const d3=run('D3_Build.new.js')[0].json.call.body.messages[1].content;console.log('D3 has block:',d3.includes('VERSES EACH PREMISE ABOVE CARRIES'),'Numbers 1:2:',d3.includes('Numbers 1:2'));
const c3=run('C3_Build.new.js')[0].json.call.body.messages[1].content;console.log('C3 has block:',c3.includes('VERSES EACH PREMISE ABOVE CARRIES'),'Luke 1:34:',c3.includes('premise 4: Luke 1:35, Luke 1:34'));
// empty-list behaviour: no list -> no block
nodes['C2 Extract']={raw:'no list here'};console.log('D3 no-list block absent:',!run('D3_Build.new.js')[0].json.call.body.messages[1].content.includes('VERSES EACH'));
nodes['Fetch Models']={};
try{const b=run('Build_Independent_Verdict.new.js');const s=JSON.stringify(b);console.log('BIV has ledger:',s.includes('PRESSED-WITNESS LEDGER -- computed'),s.includes('NOT NAMED: Numbers 1:2'));
const b0=JSON.stringify(run('../live/Build_Independent_Verdict.js'));console.log('BIV len old/new',b0.length,s.length);}catch(e){console.log('BIV err',e.message.slice(0,200));}
