// F11.2-4 (Worker_E): unfenced answer unchanged; fenced answer with no BROKEN line; the K-G3 request text lists the links.
const fs=require('fs');const dir=process.argv[2];
const s0=fs.readFileSync(dir+'/Panel_Cure_Check.js','utf8').split('\n');const e=s0.findIndex(l=>l.startsWith('function cureProse'));const lib=s0.slice(0,e+2).join('\n');
const pcb=fs.readFileSync(dir+'/Panel_Cure_Build_1.js','utf8').split('\n');const wtLine=pcb.find(l=>/wt=\(o\.reasoning|wt=cureUnwrap\(answer\)/.test(l));
const run=answer=>new Function('answer',lib+`\nlet wt=null;${wtLine}\nreturn {wt,broken:cureBroken(wt),ask:cureAsk([{rule:'K-G3',side:'DEFENDER',link:null,line:null}],cureBroken(wt))};`)(answer);
const vr=fs.readFileSync('fx/gemini_verdict_raw_27795.txt','utf8');const k=vr.indexOf('\n\n[AUDIT v');const fenced=vr.slice(0,k);
const unf=fenced.replace(/^```json\s*/,'').replace(/\s*```\s*$/,'');
const nob=fenced.replace(/DEFENDER LINK BROKEN/g,'UNDERDETERMINED');
const a=run(unf),b=run(nob),c=run(fenced);
console.log(JSON.stringify({F11_2_unfenced:{wt_len:(a.wt||'').length,broken:a.broken},F11_3_fenced_noBroken:b.broken,
 F11_4_ask_line:(c.ask.match(/K-G3 DEFENDER:[^\n]*/)||[''])[0]}));
