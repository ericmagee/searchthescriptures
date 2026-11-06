// W3 condition on pkgACR (Wall, 15:47 UTC): count every corpus read where the old ANSWER CHECK reader takes a line the shared reader refuses.
// Run from wall2024/: node pkgACR/fallback_count.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const AM=rd('pkgACR/patched/Alternate_Merge.js');const N=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {__RL,__acRead,kagRow0};')(()=>{throw 0},null);
const SELF=/^(?:[-•]\s*)?ANSWER CHECK\s*:\s*((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)[^\n]*?\[\s*(CR|DR)\d\s*\][^\n]*?--\s*(MEETS|MISSES|FAILS)\b/;
const GATE=/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i;
const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l));const seen=new Set();const out={kag:[],self:[],gate:[]};let n=0;
for(const o of C){const t=o.jtext!=null?o.jtext:o.text;for(const raw of String(t).split('\n')){const l=raw.trim();if(!/ANSWER CHECK\s*:/i.test(l)||seen.has(l))continue;seen.add(l);n++;
 const f=N.__acRead(l);
 if(!(f&&f.answer!==undefined)&&N.kagRow0(l))out.kag.push({o,l,code:(N.__RL.readLine(l)||{}).code});
 if(!f&&/^\s*(?:[-•]\s*)?ANSWER CHECK\s*:/i.test(l)&&N.__RL.readLine(l).form==null&&SELF.test(l.replace(/[*_`]+/g,'')))out.self.push({o,l,code:N.__RL.readLine(l).code});
 if(!(f&&f.rounds.length)&&GATE.test(l.replace(/[*_`]+/g,'').trim()))out.gate.push({o,l,code:(N.__RL.readLine(l)||{}).code});}}
console.log('distinct ANSWER CHECK lines: '+n);
for(const k of ['kag','self','gate']){console.log(k+': old reader takes a line the shared reader refuses: '+out[k].length);out[k].forEach(d=>console.log('  '+d.o.run+' '+d.o.seat+' '+d.o.src+' ['+(d.code||'read, no ANSWER field')+']: '+d.l.slice(0,160)));}
