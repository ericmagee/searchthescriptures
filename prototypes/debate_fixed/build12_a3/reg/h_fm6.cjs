// K-G6 label probe harness (Worker_A3, drift BB-7414), made from h_fm.cjs: one K-G6 report line added to the single judge's text.
// F1b harness (Worker_A3): Format Markdown run from its own source over 27665's stored row and judgments (row27665.json), with
// $ stubbed: Get Row, Get Judgments, Get Verse, Get Guards; nodes that did not run throw (the node reads them under try).
// Usage: node h_fm.cjs <node file> <fv: stored|panel>
const fs=require('fs');const [node,mode]=process.argv.slice(2);const s=fs.readFileSync(node,'utf8');
const D=JSON.parse(fs.readFileSync('row27665.json','utf8'));const row={...D.row};if(mode==='panel')row.framework_verdict=row.panel_verdict;
row.independent_verdict_raw=String(row.independent_verdict_raw||'')+'\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- ITEM: DEFENDER premise 1; RULE: K-G6; RESULT: UNCURED; WHY: probe; JUDGE STATEMENT: none written]';
const it=x=>({json:x});
const nodes={'Get Row':[it(row)],'Get Judgments':D.judgments.map(it),'Get Verse':[it({text:'Precept must be upon precept'})],'Get Guards':[it({})],'Init Seats':[it({t0:null})]};
const $=n=>{if(!(n in nodes))return {first(){throw new Error('not run: '+n)},all(){throw new Error('not run: '+n)},get isExecuted(){return false;}};return {first:()=>nodes[n][0],all:()=>nodes[n],isExecuted:true};};
const out=new Function('$','$input','$execution',s)($,{first:()=>({json:{}}),all:()=>[]},{customData:{set(){}}});
const md=(Array.isArray(out)?out[0].json:out.json||out);const text=md.markdown||md.text||md.md||JSON.stringify(md);
fs.writeFileSync('fm_out_'+mode+'_'+node.split('/')[0]+'.md',typeof text==='string'?text:JSON.stringify(text));
const T=typeof text==='string'?text:'';
console.log(node,mode,'| keys',Object.keys(md).slice(0,6).join(','));
T.split('\n').filter(l=>/DEFENDER premise 1/.test(l)).forEach(l=>console.log('  ',l.slice(0,180)));
