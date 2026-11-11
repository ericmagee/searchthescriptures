const {r,out}=require('./x.cjs');
const gr=out('Gate Record')[0];
for(const s of gr.gate.report){console.log('### GATE',s.seat);for(const it of s.items)console.log(JSON.stringify(it).slice(0,900));}
console.log('GATE_ROWS');for(const g of gr.gate_rows)console.log(JSON.stringify({seat:g.seat,rule:g.rule,item:g.item,cs:g.cure_status,line:(g.flagged_line||'').slice(0,200),resp:(g.response_line||'').slice(0,400),why:(g.cure_reason||'').slice(0,400)}));
console.log(Object.keys(gr.gate));
