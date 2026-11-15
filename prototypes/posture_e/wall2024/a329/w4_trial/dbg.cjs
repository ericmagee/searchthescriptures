const fs=require('fs');const {runNode,D}=require('./run329.cjs');const L2C=require('./l2c_load.cjs')('../a328/target_328.json');
const o=JSON.parse(fs.readFileSync('map116.json'));const col={CR1:'claude_r1',DR1:'engine_r1',CR2:'claude_r2',DR2:'engine_r2',CR3:'engine_r3',DR3:'challenger_r3',CR4:'defender_r4',DR4:'challenger_r4'};
for(const n of process.argv.slice(2).map(Number)){const r=o.find(x=>x.n===n);const d=D.find(x=>x.run_token.split('-')[1]===r.run);const T=d[col[r.lab]];const {J}=runNode(d);
 const c=J.tags.filter(t=>t.round===r.lab&&(t.words||[]).some(w=>w.kind==='strongs'&&w.w===r.num));let best=null,bd=1e9;for(const t of c){const pa=T.lastIndexOf('\n\n',t.at);const off=t.at-(pa<0?0:pa+2);if(Math.abs(off-r.lp)<bd){bd=Math.abs(off-r.lp);best=t;}}
 const pa=T.lastIndexOf('\n\n',best.at);console.log('ROW',n,r.num,'| verses',best.verses.join(';').slice(0,120));console.log(JSON.stringify(T.slice(Math.max(pa,best.at-500),best.at+160)));}
