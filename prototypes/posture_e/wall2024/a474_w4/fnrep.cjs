// ASK 474 function replay: psGrades text B (base Send Back Record) against text A (target, = Gate Build's) on every stored judgment line that names CONCEDED LINKS,
// and the CHANGE TO text of every sb_row in the given executions. Each text is loaded from its own node source with its own helpers (ri3Head2024, __RL).
// usage: node a474_w4/fnrep.cjs BASE_ENGINE.json TARGET_ENGINE.json judgments.json [execution.json ...]
const fs=require('fs');const T=require('../tools/lib.cjs');
const [BE,TE,JF,...EX]=process.argv.slice(2);
const ld=(f,k)=>{const U=T.unpack(JSON.parse(fs.readFileSync(f)));return T.load(T.rb(U.L,U.M[k]),()=>({isExecuted:false,all:()=>[],first:()=>({json:{}}),params:{}})).psGrades;};
const OLD=ld(BE,'Send Back Record'),NEW=ld(TE,'Send Back Record'),GATE=ld(BE,'Gate Build');
const lines=[];for(const j of JSON.parse(fs.readFileSync(JF)))for(const l of String(j.verdict_raw||'').split('\n'))if(/CONCEDED LINKS/i.test(l))lines.push({src:'judgment '+j.id+' '+j.judge_seat,l});
for(const f of EX){const E=JSON.parse(fs.readFileSync(f));const RD=E.data.resultData.runData;for(const nm of Object.keys(RD))if(/Send Back Record$/.test(nm))for(const r of RD[nm])for(const it of ((r.data||{}).main||[[]])[0]||[])for(const row of ((it.json||{}).sb_rows||[])){for(const k of ['to','change_to','cure_reason','line'])if(typeof row[k]==='string'&&/CONCEDED LINKS/i.test(row[k]))lines.push({src:'exec '+E.id+' '+nm+' sb_row.'+k,l:row[k].replace(/^SEND-BACK CHANGE TO:\s*/,'')});}}
let n=0,parsedOld=0,parsedNew=0,ch=[],gateEq=0;const seen=new Set();
for(const x of lines){if(seen.has(x.l))continue;seen.add(x.l);n++;let o,w,g;try{o=JSON.stringify(OLD(x.l));}catch(e){o='ERR '+e.message;}try{w=JSON.stringify(NEW(x.l));}catch(e){w='ERR '+e.message;}try{g=JSON.stringify(GATE(x.l));}catch(e){g='ERR '+e.message;}
 if(o!=='null')parsedOld++;if(w!=='null')parsedNew++;if(w===g)gateEq++;if(o!==w)ch.push({src:x.src,old:o,new:w,line:x.l.slice(0,260)});}
console.log('distinct lines',n,'| parsed by old text',parsedOld,'| parsed by new text',parsedNew,'| new equals the gate text on',gateEq,'of',n,'| readings changed',ch.length);
for(const c of ch)console.log(JSON.stringify(c));
