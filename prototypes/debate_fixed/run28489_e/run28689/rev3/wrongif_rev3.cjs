// Revised P2D wrong-if pre-run (ruling BB-8041): in a run, count the non-matching quotes standing in a LINK block of a link round
// (Citation Scan load_bearing true, Quote Compare status not MATCHES) that are absent from the judges' citation block (Quote Report items).
// Known-bad: row 7b466555 under the live nodes (c1bdcd5a). Known-good: the same row with the BB-5773 leave-out not applied to load-bearing items
// (the fix's intended behaviour, simulated by one line). NULL case: an item with load_bearing undefined counts as load-bearing false.
const fs=require('fs');const F='../p8/final/';const P='../p9e/';const row=JSON.parse(fs.readFileSync(P+'row_7b466555.json'));const V=JSON.parse(fs.readFileSync(P+'verses.json'));
const run=(src,nodes)=>{const $=n=>({first:()=>({json:nodes[n]}),all:()=>(Array.isArray(nodes[n])?nodes[n]:[nodes[n]]).map(j=>({json:j})),isExecuted:n in nodes});return new Function('$',src)($)[0].json;};
const fo={cr1:row.claude_r1,gr1:row.engine_r1,cr2:row.claude_r2,gr2:row.engine_r2,cr3:row.engine_r3,dr3:row.challenger_r3};
const CS=run(fs.readFileSync(F+'Citation_Scan.js','utf8'),{'Final Output':fo});const QC=run(fs.readFileSync(F+'Quote_Compare.js','utf8'),{'Citation Scan':CS,'Cited Verses':V});
const qrLive=fs.readFileSync(F+'Quote_Report.js','utf8');
const qrGood=qrLive.replace("const items=all.filter(i=>i.status==='MATCHES'||","const items=all.filter(i=>i.status==='MATCHES'||i.load_bearing===true||");
if(qrGood===qrLive)throw new Error('anchor not found');
const count=(src,label)=>{const QR=run(src,{'Quote Compare':QC,'Find Words':[]});const inBlock=new Set(QR.items.map(i=>i.side+'|'+i.round+'|'+i.ref));
 const miss=QC.items.filter(i=>i.load_bearing===true&&i.status!=='MATCHES'&&!inBlock.has(i.side+'|'+i.round+'|'+i.ref));
 console.log(label.padEnd(44),'load-bearing non-matching absent from block:',miss.length,miss.map(i=>i.side+' '+i.round+' '+i.ref).join('; '));};
count(qrLive,'known-bad: live Quote Report, row 7b466555');count(qrGood,'known-good: leave-out not on load-bearing');
const nul=QC.items.filter(i=>i.load_bearing===undefined).length;console.log('items with load_bearing undefined (NULL case):',nul);
