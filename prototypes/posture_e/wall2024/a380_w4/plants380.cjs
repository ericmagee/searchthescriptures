// ASK 380 plants and stored cases: print the Alternate judges section, live s259 vs target.
const fs=require('fs');const code=w=>JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const mk=c=>new Function('$','$input','require','$execution','$workflow',c);
const run=(f,d)=>{const M={'Get Row':[d.r],'Get Judgments':(d.J||[]),'Get Verse':[{text:''}]};const $=nm=>{if(nm in M)return {isExecuted:true,first:()=>({json:M[nm][0]}),all:()=>M[nm].map(json=>({json}))};return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};};
 return f($,{all:()=>[{json:d.r}],first:()=>({json:d.r})},require,{id:'0',customData:{set(){},get(){}}},{id:'x'})[0].json.md;};
const OLD=mk(code('../rdf/fetchback_s259.json')),NEW=mk(code('t380_on259.json'));const pop=JSON.parse(fs.readFileSync('../a378/pop.json'));
const get=t=>JSON.parse(JSON.stringify(pop.find(d=>d.r.run_token.startsWith(t))));
const sec=md=>{const s=md.split('## Alternate judges')[1];return s?s.split('\n## ')[0].trim().split('\n').map(l=>'    '+l.slice(0,330)).join('\n'):'    (no section)';};
const hdr=md=>md.split('\n').filter(l=>/seat stayed empty/.test(l)).map(l=>'    '+l.slice(0,330)).join('\n');
const show=(name,d)=>{d.J=(d.J||[]).map(j=>({...j,verdict_raw:j.verdict_raw||''}));d.r.drv_removed=d.r.drv_removed||null;const a=run(OLD,d),b=run(NEW,d);console.log('=== '+name+'\n  LIVE s259 header empty-seat lines:\n'+hdr(a)+'\n  TARGET header empty-seat lines:\n'+hdr(b)+'\n  LIVE s259 Alternate judges:\n'+sec(a)+'\n  TARGET Alternate judges:\n'+sec(b));};
show('STORED: "ALTERNATE: none" with the clause (ODV1-34852)',get('ODV1-34852'));
show('STORED: SEATED line whose WHY is only the clause (ODV1-38226)',get('ODV1-38226'));
show('STORED: header plant W3 C1 (ODV1-35296)',get('ODV1-35296'));
// PLANT source b: the removed seat has no judgment row; its tried lines (with the clause) sit on another row.
{const d=get('ODV1-38450');const k=d.J.findIndex(j=>/ALTERNATE TRIED/.test(j.verdict_raw||''));const seat=d.J[k].judge_seat;const lines=(d.J[k].verdict_raw.match(/\[AUDIT v21: ALTERNATE TRIED -- [^\n]*/g)||[]).join('\n');
 d.J.splice(k,1);d.J[0].verdict_raw=(d.J[0].verdict_raw||'')+'\n'+lines;console.log('(plant: removed judgment row of seat '+seat+'; moved its '+lines.split('\n').length+' tried lines to row of '+d.J[0].judge_seat+')');show('PLANT source b: no judge line for the seat, so the clause gives the reason',d);}
// PLANT: a "none" line with the clause and a judge row that IS counted -> source b
