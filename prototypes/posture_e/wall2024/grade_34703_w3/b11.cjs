const {RD,out}=require('./x.cjs');
let lines=[];for(const it of out('Anticheat Call deepseek')){const t=(it.json.choices&&it.json.choices[0].message.content)||'';lines.push(...t.split('\n').filter(l=>/^X\d+|^\s*X\d+/.test(l.trim())||/CONSISTENT|REVERSED|NO EARLIER/.test(l)))}
console.log('ac lines',lines.length,'ending quote+period',lines.filter(l=>/["”]\.\s*$/.test(l)).length);console.log(lines.filter(l=>/["”]\.\s*$/.test(l)).slice(0,3).join('\n').slice(0,600));
const ce=out('Close Enforcer Call deepseek').map(it=>it.json.choices[0].message.content);console.log(ce.join('\n---\n').slice(0,900));
