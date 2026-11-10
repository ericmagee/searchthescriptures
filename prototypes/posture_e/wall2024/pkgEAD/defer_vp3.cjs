// W1 study: every stored DeepSeek E-ANS / E-HOLD send-back item whose reason reads a deferral or pointer; does the live pkgVP3 code find a real answer behind it?
const fs=require('fs');const H=require('../pkgVP3/harness.cjs');
const SRC=process.env.SBR||'pkgLIB/strip_S112L/patched/Send_Back_Record.js';
const s=fs.readFileSync(SRC,'utf8');const cut=s.indexOf('const __VP3=');
const L=new Function('$','$input',s.slice(0,cut)+'\n;return {vp3Trial2024,vp3Code2024};');
const DEF=/(under|at|in|see) link [0-9]|pointer|defers|redirect|points elsewhere|answered (at|under|in)|answer it fully/i;
const runs=(process.argv[2]||'33299,33311,33461,33490,33627,33682,34016,34108').split(',');
const T={items:0,real:0,bare:0,notChecked:0};
const EXTRA={'33299':[['gemini','Genesis 4:1'],['gemini','Job 14:1'],['gemini','Romans 1:3'],['chatgpt','Job 14:1'],['sol','Job 14:1']],'33311':[['chatgpt','1 John 5:1'],['chatgpt','1 John 4:7'],['gemini','1 John 5:1'],['gemini','Matthew 11:11'],['gemini','Luke 1:13'],['gemini','Job 14:1'],['sol','1 John 4:7'],['grok','Luke 1:13']]};
for(const run of runs){const $0=H.mk$(run);const $=n=>{const r=$0(n);if(n==='Judge Enforcer Record'&&!r.isExecuted)return {isExecuted:false,first:()=>({json:{}}),all:()=>[],item:{json:{}}};return r;};let F;try{F=L($,{first:()=>({json:{}}),all:()=>[]});}catch(e){console.log(run,'lib load fail',e.message);continue;}
 let R=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}}catch(e){}if(R)break;}
 if(!R){console.log(run,'no rounds');continue;}
 let items=[];for(const nn of ['Send Back Build','Alt Send Back Build']){try{for(const it of $(nn).all()){const j=it.json;for(const x of (j.items||[]))items.push({...x,seat:j.seat||('alt '+((j.alt_seats||[])[0]||''))});}}catch(e){}}
 if(EXTRA[run])EXTRA[run].forEach(([seat,v],i)=>items.push({seat,sid:'db'+i,rule:'E-ANS',item:'ANSWER CHECK '+v+' [CR3]',reason:'(right: MISSES): pointer (from the enforcer log row)'}));
 for(const it of items){if(!['E-ANS','E-HOLD'].includes(it.rule))continue;const rs=String(it.reason||'');if(!/\(right:\s*(MISSES|BROKEN)\)/.test(rs))continue;const ds=(rs.match(/\(right:[^)]*\)\s*:?\s*([\s\S]*?)(\(judge wrote|$)/)||[])[1]||'';if(!DEF.test(ds))continue;
  T.items++;const v=F.vp3Trial2024(it,null,R,null);const n=v?v.note:'null';const k=/does not agree/.test(n)?'REAL ANSWER':/NOT CHECKED/.test(n)?'NOT CHECKED':'BARE (code agrees)';T[k==='REAL ANSWER'?'real':k==='NOT CHECKED'?'notChecked':'bare']++;
  console.log(run,it.seat,it.sid,it.rule,String(it.item).slice(0,45),'=>',k,'\n   DS:',ds.slice(0,170),'\n   VP3:',n.replace(/^TRIAL pkgVP3: /,'').slice(0,200));}}
console.log('\nTOTAL',JSON.stringify(T));
