// 2c probe harness (Worker_A3): Format Markdown run with one K-G8 report line on the single judge's text; prints the K-G8 table row.
const fs=require('fs');const [node]=process.argv.slice(2);const s=fs.readFileSync(node,'utf8');const D=JSON.parse(fs.readFileSync('row27665.json','utf8'));const row={...D.row,framework_verdict:D.row.panel_verdict};
row.independent_verdict_raw=String(row.independent_verdict_raw||'')+'\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- ITEM: DEFENDER COUNTED PREMISES; RULE: K-G8; RESULT: UNCURED; WHY: probe; JUDGE STATEMENT: none written]';
const it=x=>({json:x});const nodes={'Get Row':[it(row)],'Get Judgments':D.judgments.map(it),'Get Verse':[it({text:'x'})],'Get Guards':[it({})],'Init Seats':[it({t0:null})]};
const $=n=>{if(!(n in nodes))return {first(){throw new Error('not run: '+n)},all(){throw new Error('not run: '+n)},get isExecuted(){return false;}};return {first:()=>nodes[n][0],all:()=>nodes[n],isExecuted:true};};
const out=new Function('$','$input','$execution',s)($,{first:()=>({json:{}}),all:()=>[]},{customData:{set(){}}});const m=(Array.isArray(out)?out[0].json:out.json||out);
const T=String(m.markdown||m.text||m.md||'');T.split('\n').filter(l=>/COUNTED PREMISES/.test(l)).forEach(l=>console.log(l.slice(0,200)));
