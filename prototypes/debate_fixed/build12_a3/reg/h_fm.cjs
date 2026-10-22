// F1b harness (Worker_A3): Format Markdown run from its own source over 27665's stored row and judgments (row27665.json), with
// $ stubbed: Get Row, Get Judgments, Get Verse, Get Guards; nodes that did not run throw (the node reads them under try).
// Usage: node h_fm.cjs <node file> <fv: stored|panel>
const fs=require('fs');const [node,mode]=process.argv.slice(2);const s=fs.readFileSync(node,'utf8');
const D=JSON.parse(fs.readFileSync('row27665.json','utf8'));const row={...D.row};if(mode==='panel')row.framework_verdict=row.panel_verdict;
const it=x=>({json:x});
const nodes={'Get Row':[it(row)],'Get Judgments':D.judgments.map(it),'Get Verse':[it({text:'Precept must be upon precept'})],'Get Guards':[it({})],'Init Seats':[it({t0:null})]};
const $=n=>{if(!(n in nodes))return {first(){throw new Error('not run: '+n)},all(){throw new Error('not run: '+n)},get isExecuted(){return false;}};return {first:()=>nodes[n][0],all:()=>nodes[n],isExecuted:true};};
const out=new Function('$','$input','$execution',s)($,{first:()=>({json:{}}),all:()=>[]},{customData:{set(){}}});
const md=(Array.isArray(out)?out[0].json:out.json||out);const text=md.markdown||md.text||md.md||JSON.stringify(md);
fs.writeFileSync('fm_out_'+mode+'_'+node.split('/')[0]+'.md',typeof text==='string'?text:JSON.stringify(text));
const T=typeof text==='string'?text:'';
console.log(node,mode,'| keys',Object.keys(md).slice(0,6).join(','));
T.split('\n').filter(l=>/Verdict of the debate|SECOND OPINION|Single judge: DeepSeek \(|## Single judge/.test(l)).forEach(l=>console.log('  ',l.slice(0,180)));
