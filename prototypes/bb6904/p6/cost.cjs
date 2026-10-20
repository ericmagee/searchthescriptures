// BB-6904 step 6 (f), Worker_A3: extra calls, input size and seconds of the cure path on 27259 and replays 233-238. Read-only.
// Usage: node cost.cjs <p4 dir> <p5 rows.json>. Figures marked MEASURED come from stored rows or execution metadata (status, start, stop);
// those marked ESTIMATE are derived and say from what. A cure call's input is the judge's own request plus its answer plus the ask.
const fs=require('fs');const [P4,ROWS]=process.argv.slice(2);
const L=new Function(fs.readFileSync(P4+'/drv_block_0b3cbac.js','utf8')+'\n'+fs.readFileSync(__dirname+'/out/cure_lib.js','utf8')+'\nreturn {drvCheck,cureAsk};')();
const rows=JSON.parse(fs.readFileSync(ROWS,'utf8'));
// MEASURED (SQL on debate_results, 2026-10-20): the six round texts per debate; the 27259 single judge's answer.
const ROUNDS={'27259':59552,'replays 233-235':75810,'replays 236-238':64112};const SJ27259=4455;
// MEASURED (tmpl.cjs on the live prompt code): fixed prompt text around the rounds.
const FIX_PANEL=23137,FIX_SINGLE=21132;
// MEASURED (execution metadata): run times. DERIVED from them: per judge call = a dry regrade's whole time / 3 (three panel judge calls in series, executionOrder v1, other nodes included).
const EX={27252:{s:'2026-10-20T19:45:11.774Z',e:'2026-10-20T20:00:00.255Z'},27257:{s:'2026-10-20T20:04:27.321Z',e:'2026-10-20T20:20:20.605Z'},27259:{s:'2026-10-20T20:21:57.473Z',e:'2026-10-20T21:03:31.308Z'}};
const dur=x=>(new Date(EX[x].e)-new Date(EX[x].s))/1000;const perCall=[dur(27252)/3,dur(27257)/3];const pc=(perCall[0]+perCall[1])/2;
const textOf=raw=>{const k=raw.indexOf('\n\n[AUDIT v');const b=k>=0?raw.slice(0,k):raw;try{const j=JSON.parse(b);return String(j.reasoning!=null?j.reasoning:(j.reason||b));}catch(e){return b;}};
// Challenger conceded and standing per row (SQL on debate_judgments and debate_replay_judgments, 2026-10-20); rows.json carries only the defender's (6966 note 2).
const CH={'27259 deepseek':[2,'PROP-DEPENDENT'],'27259 gemini':[5,'COLLAPSED'],'27259 grok':[3,'PROP-DEPENDENT'],'replay 233 deepseek':[1,'PROP-DEPENDENT'],'replay 234 gemini':[1,'PROP-DEPENDENT'],'replay 235 grok':[5,'COLLAPSED'],'replay 236 deepseek':[1,'PROP-DEPENDENT'],'replay 237 gemini':[0,'SELF-SUPPORTED'],'replay 238 grok':[3,'COLLAPSED']};
const runOf=s=>s==='27259'?'27259':(+s.split(' ')[1]<=235?'replays 233-235':'replays 236-238');
const out={};
for(const r of rows){const run=runOf(r.src);const it=L.drvCheck(textOf(r.raw),r.conc,CH[r.src+' '+r.seat][0],r.ds,CH[r.src+' '+r.seat][1],false).items;
 const br={DEFENDER:it.filter(x=>x.rule==='K-B'&&x.side==='DEFENDER').map(x=>x.link),CHALLENGER:[]};const ask=it.length?L.cureAsk(it,br).length:0;
 (out[run]=out[run]||{calls:0,chars:0,seats:[]});if(it.length){out[run].calls++;out[run].chars+=FIX_PANEL+ROUNDS[run]+r.raw.length+ask;out[run].seats.push(r.seat+' '+it.length+' items, ask '+ask);}}
// The 27259 single judge (5 violation lines, 6938): one call; its ask taken as the mean panel ask of that run.
// MEASURED (debate_results.input_tokens): 27259 372,936; c12a1af1 413,494; d5b31026 355,218, the whole original runs.
const meanAsk=2400;out['27259'].calls++;out['27259'].chars+=FIX_SINGLE+ROUNDS['27259']+SJ27259+meanAsk;out['27259'].seats.push('single judge 5 items, ask about '+meanAsk+' (ESTIMATE)');
console.log('DERIVED per judge call (each dry regrade\'s whole time divided by 3, other nodes included; 6966 note 1): 27252 '+perCall[0].toFixed(0)+' s, 27257 '+perCall[1].toFixed(0)+' s; mean '+pc.toFixed(0)+' s. Run 27259 took '+(dur(27259)/60).toFixed(1)+' min.');
for(const [run,o] of Object.entries(out)){const base=run==='27259'?dur(27259):(run==='replays 233-235'?dur(27252):dur(27257));
 console.log(run+': '+o.calls+' extra calls (COUNTED: the portion 3 and 4 code on the stored judgments) | input about '+Math.round(o.chars/1000)+'k chars, about '+Math.round(o.chars/4000)+'k tokens at 4 chars a token (ESTIMATE) | time about '+(o.calls*pc/60).toFixed(0)+' min at one judge call each, '+Math.round(100*o.calls*pc/base)+'% of the run (ESTIMATE); at most '+(o.calls*900/60).toFixed(0)+' min at the 900 s timeout');
 o.seats.forEach(s=>console.log('   '+s));}
