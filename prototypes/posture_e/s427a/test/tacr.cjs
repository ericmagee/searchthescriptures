// node tacr.cjs <exec.json>: runs Anticheat Build, feeds a fabricated reply (one true REVERSED, one false-quote REVERSED, one CONSISTENT), runs Anticheat Record
const fs=require('fs');const e=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const F=e.data.resultData.runData['Build Save Body'][0].data.main[0][0].json;
const nb=fs.readFileSync(__dirname+'/../new/Anticheat Build.js','utf8'),nr=fs.readFileSync(__dirname+'/../new/Anticheat Record.js','utf8');
const base=(n)=>({isExecuted:n!=='Regrade Load',first:()=>({json:n==='Init Seats'?{run_token:'T'}:n==='Resolve Seats'?{deepseek:{api_model:'deepseek-x',max_tokens:8000}}:n==='Final Output'?F:{}})});
const built=new Function('$',nb)(base);
const items=built.flatMap(x=>x.json.items);const d=items.find(x=>x.side==='D'&&x.verse==='Deuteronomy 22:24');const c=items.find(x=>x.side==='C');const d2=items.find(x=>x.side==='D'&&x.verse==='Deuteronomy 20:7');
console.log('ids',d&&d.id,d2&&d2.id,c&&c.id);
const reply='ANTICHEAT: '+d.id+' -- REVERSED -- CLOSE: "Joseph treats her condition as an offence against himself, which the law frames as the doing of another man." -- EARLIER: "Within the espousal, the law treats the man\'s lying with her as humbling her, an offence worth stoning."\n'
 +'ANTICHEAT: '+d2.id+' -- REVERSED -- CLOSE: "the husband may know her at will" -- EARLIER: "betrothed and taken are two steps"\n'
 +'ANTICHEAT: '+c.id+' -- CONSISTENT -- CLOSE: "x" -- EARLIER: "y"';
const $=(n)=>n==='Anticheat Build'?{all:()=>built}:base(n);
const $input={all:()=>[{json:{choices:[{message:{content:reply}}]}}]};
const out=new Function('$','$input',nr)($,$input)[0].json.acx;
console.log(JSON.stringify(out.counts));console.log(JSON.stringify(out.rows.filter(r=>r.answer==='REVERSED'),null,1));
