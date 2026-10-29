const fs=require('fs');const raw=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793250441297.txt','utf8');
let t=raw;try{const o=JSON.parse(raw);if(o.result)t=o.result;}catch(e){}
const a=t.indexOf('[{"x"');const b=t.lastIndexOf('}]')+2;const J=JSON.parse(t.slice(a,b))[0].x;fs.writeFileSync('kb.json',JSON.stringify(J));
for(const j of J){let txt=j.raw;try{const o=JSON.parse(txt);txt=(o.reasoning||'')+'\n'+txt;}catch(e){} txt=txt.replace(/\\n/g,'\n');
 const reps=[...j.raw.matchAll(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- ([^\]]*RULE: K-B;[^\]]*)\]/g)].map(m=>m[1]);
 console.log('=== '+j.tok+' '+j.seat+' tag='+j.tag+' outcome='+j.outcome+' kb='+reps.length);
 for(const r of reps){const line=(r.match(/LINE: ([^;]*);/)||[])[1]||'';const res=(r.match(/RESULT: ([^;]*);/)||[])[1];const why=(r.match(/WHY: ([^;]*)/)||[])[1];
  const lines=txt.split('\n');const k=lines.findIndex(l=>line&&l.includes(line.slice(0,40)));
  const own=k>=0?lines[k]:'(line not found)';const nxt=k>=0?(lines[k+1]||''):'';
  console.log(' ITEM '+(r.match(/ITEM: ([^;]*)/)||[])[1]+' | '+res+' | '+why);
  console.log('   LINE: '+own.slice(0,220));console.log('   NEXT: '+nxt.slice(0,260));
  console.log('   own-line tags='+(own.match(/\[L[1-4]\]/g)||[]).length+' next-line tags='+(nxt.match(/\[L[1-4]\]/g)||[]).length);}}
