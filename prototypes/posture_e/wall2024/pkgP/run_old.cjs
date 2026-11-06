const fs=require('fs');
const s=fs.readFileSync('../merged_TLRN/Panel_Payloads.js','utf8');
const i=s.indexOf('function kcmtLines2024');const j=s.indexOf('\n// WALL-2024 Commitment 11',i);
const f=new Function(s.slice(i,j)+'\nreturn kcmtLines2024;')();
const rows=JSON.parse(fs.readFileSync('fixture_kcmt_judgments.json','utf8'));
function dec(text){let T=text;const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}return T;}
for(const r of rows){const T=dec(r.verdict_raw);
 const L=T.split('\n').map(l=>l.trim()).filter(l=>l&&!/^\[AUDIT\b/.test(l)&&/\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(l)&&!/\bCommitment\s*\d+\b/i.test(l));
 const z=f(r.verdict_raw);
 console.log('=== '+r.debate_id.slice(0,8)+' '+r.judge_seat+' n='+L.length+' fn='+(z.items[0]?z.items[0].line.split(' ')[0]:0));
 L.forEach((l,k)=>console.log(' '+k+': '+l.slice(0,260)));}
