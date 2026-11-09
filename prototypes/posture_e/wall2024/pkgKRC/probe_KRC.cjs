// pkgKRC probe (W1, 11-09). Run from wall2024/: node pkgKRC/probe_KRC.cjs
// Takes saved runs whose cure reply carried both "RESPONSE: K-RUL <item> |" lines and the ruling cards, then edits the saved reply in every node that holds it:
//  A: RESPONSE K-RUL lines removed, cards kept (luna 34016 shape)  -> base UNCURED "no written response", patched CURED
//  B: RESPONSE K-RUL lines removed and the cards' RULING heads broken -> UNCURED both (no card, no cure)
//  C: unchanged -> same both
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const CASES=[['33506','Cure Check','Cure Needed?'],['33627','Cure Check','Cure Needed?'],['33644','Cure Check','Cure Needed?'],['33846','Panel Cure Check','Panel Cure Needed?']];
const code=(s,nm)=>fs.readFileSync('pkgLIB/'+s+'/patched/'+nm.replace(/ /g,'_')+'.js','utf8');
const dropResp=t=>t.replace(/(^|\\n|\n)[*_ ]*RESPONSE:\s*K-RUL[^\n\\]*/g,'$1');
const breakCard=t=>dropResp(t).replace(/RULING\s*(--|—|–|:)/g,'RULED $1');
const over=(RUN,f)=>{const o={};for(const fn of fs.readdirSync(D).filter(x=>x.startsWith(RUN+'_')&&!/_index\.json$/.test(x))){const raw=fs.readFileSync(D+fn,'utf8');if(!/RESPONSE:\s*K-RUL/.test(raw))continue;
 const d=JSON.parse(raw);const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;const it=(m&&m[0])||[];
 const ed=JSON.parse(JSON.stringify(it),(k,v)=>typeof v==='string'?f(v):v);o[fn.slice(RUN.length+1,-5).replace(/_/g,' ')]=ed;}return o;};
const krul=o=>{const r=[];const w=x=>{if(Array.isArray(x))x.forEach(w);else if(x&&typeof x==='object'){if(x.rule==='K-RUL'&&x.status&&x.link)r.push(x.link+' '+x.status+' ('+String(x.why||'').replace(/^TRIAL rule[^:]*: /,'').slice(0,50)+')');for(const k in x)w(x[k]);}};w(o);return [...new Set(r)].sort();};
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{c?ok++:bad++;log((c?'OK ':'FAIL ')+m);};
for(const [RUN,nm,inp] of CASES){for(const [tag,f] of [['A',dropResp],['B',breakCard],['C',null]]){const H=harness(RUN,f?over(RUN,f):undefined);
 const a=krul(H(code('strip_WLG',nm),inp)),b=krul(H(code('strip_KRC',nm),inp));log(RUN+' '+nm+' '+tag+'\n   base:    '+a.join(' | ')+'\n   patched: '+b.join(' | '));
 if(tag==='A')T(a.length&&a.every(x=>/UNCURED \(no written response/.test(x))&&b.length===a.length&&b.every(x=>/ CURED \(a valid ruling card/.test(x)),RUN+' A: card without RESPONSE line -> base no written response, patched CURED');
 if(tag==='B')T(b.length&&b.every(x=>/UNCURED/.test(x)),RUN+' B: no card, no RESPONSE line -> still UNCURED');
 if(tag==='C')T(JSON.stringify(a)===JSON.stringify(b),RUN+' C: unchanged reply -> same result');}}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgKRC/probe_KRC.txt',out.join('\n')+'\n');
