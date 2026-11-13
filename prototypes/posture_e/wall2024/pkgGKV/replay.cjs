// pkgGKV replay. Takes the refusal code from the TARGET library text (between "{const __gkv=" and "(pkgGKV)':null;}catch(e){return null;}})(to);"),
// runs it on every stored send-back change (rules E-HOLD, E-COL, E-GATE, E-UNG, E-KEY) whose CHANGE TO carries a GROUND, with the KJV rows as
// 'Cited Verses'. The parent has no such refusal, so every refusal is an old/new difference. node replay.cjs <target json> [pop json] [kjv json]
const fs=require('fs');const [,,T,POP,KJV]=process.argv;
const lib=JSON.parse(fs.readFileSync(T,'utf8'));const code=(lib.nodes||lib.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;
const LIB=JSON.parse(code.slice(code.indexOf('\n/*LIB*/')+8,code.lastIndexOf('\n/*MAP*/'))).join('\n');
const a=LIB.indexOf('{const __gkv=(t=>{'),b=LIB.indexOf("})(to);",a);if(a<0||b<0||LIB.indexOf('{const __gkv=(t=>{',a+1)>=0)throw new Error('refusal code must be found once');
const body=LIB.slice(a+'{const __gkv='.length,b+2);const rows=JSON.parse(fs.readFileSync(KJV||'/mnt/project-files/wall2024/pkgAJN/kjv_rows.json','utf8'));
const refuse=new Function('$','return '+body)(n=>{if(n!=='Cited Verses')throw new Error(n);return {all:()=>rows.map(json=>({json}))};});
const P=JSON.parse(fs.readFileSync(POP||'/mnt/project-files/wall2024/pkgGKV/pop_ground.json','utf8'));
const to=r=>{const s=String(r.rl||'');const i=s.indexOf('CHANGE TO:');return i<0?null:s.slice(i+10).split(' || ')[0].trim();};
let n=0,nul=0,read=0;const d=[];
for(const r of P){const t=to(r);if(t==null){nul++;continue;}n++;if(/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**\s*(?:FORCED\b|D\d+\s+vs\.?\s+C\d+\b)/i.test(t.replace(/\\+"/g,'"')))read++;const w=refuse(t);if(w)d.push({id:r.id,run:r.run,seat:r.seat,rule:r.rule,item:r.item,stored:r.st,why:w});}
console.log('send-back changes with a GROUND',P.length,'| CHANGE TO read',n,'| no CHANGE TO',nul,'| collision or FORCED lines',read,'| refused (old/new differences)',d.length);d.forEach(x=>console.log('  ',JSON.stringify(x)));
