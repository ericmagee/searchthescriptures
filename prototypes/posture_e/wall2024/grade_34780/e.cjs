const {r,out}=require('./x.cjs');
const gr=out('Gate Record')[0];
console.log(Object.keys(gr.sb_items[0]));
const seat=process.argv[2];const W=+process.argv[3]||500;
for(const it of gr.sb_items.filter(x=>x.seat===seat)){const o={};for(const k of Object.keys(it)){const v=it[k];o[k]=typeof v==='string'?v.slice(0,W):v;}console.log(JSON.stringify(o).slice(0,W*4));console.log('--');}
