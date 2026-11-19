// ASK 434 (plan a434_w3/plan_rev3.md): build the pair list from the live library text (W4 build, coordinator 04:59Z 11-19).
const fs=require('fs');const T=require('../tools/lib.cjs');let w=JSON.parse(fs.readFileSync(process.argv[2]));w=w.data&&w.data.nodes?w.data:w;const U=T.unpack(w);
const L=U.L;const P=[];const one=(o,n,map)=>{P.push(map?{map,old:o,new:n}:{old:o,new:n});};
// 1. cureSupHead: 4th argument st (CURE when absent); one head of any of the three forms; tail names the same step
const d=L.find(l=>l.startsWith('function cureSupHead(raw,o,n){'));
const oldH="const H=/SUPERSEDED BY CURE: verdict [A-Z-]+ to [A-Z-]+; see the cure lines below(?:\\\\n|\\n)/;";
if(d.indexOf(oldH)<0)throw new Error('H not found');
one("function cureSupHead(raw,o,n){","function cureSupHead(raw,o,n,st){const __st=(st==='SEND-BACK'||st==='RECOMPUTE')?st:'CURE';");
one(oldH,"const H=/SUPERSEDED BY (?:CURE|SEND-BACK|RECOMPUTE): verdict [A-Z-]+ to [A-Z-]+; see the (?:cure|send-back|recompute) lines below(?:\\\\n|\\n)/;");
one("'SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below'","'SUPERSEDED BY '+__st+': verdict '+o+' to '+n+'; see the '+__st.toLowerCase()+' lines below'");
// 2. kcmtGrade2024 skip
one("if(/^SUPERSEDED BY CURE\\s*:/i.test(h)||","if(/^SUPERSEDED BY (?:CURE|SEND-BACK|RECOMPUTE)\\s*:/i.test(h)||");
// 3. library callers
// line 2471 (Alt Apply) first: its text holds line 1596's as a substring
one("b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag);}","b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag,'SEND-BACK');}");
// line 1596 (panel send-back apply)
one("b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag);","b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag,'SEND-BACK');");
one("b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag);","b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,__t0,b.payload.verdict_tag,(r.drv||[]).length?'CURE':'RECOMPUTE');");
// 4. inline MAP callers
one("cureSupHead(__raw+'\\n\\n'+__rc.audit,base.verdict_tag,__rc.fields.verdict_tag)","cureSupHead(__raw+'\\n\\n'+__rc.audit,base.verdict_tag,__rc.fields.verdict_tag,'RECOMPUTE')",'Cure Check');
one("base.verdict_tag,RC&&RC.fields&&RC.fields.verdict_tag?RC.fields.verdict_tag:(cc?cc.word:base.verdict_tag))","base.verdict_tag,RC&&RC.fields&&RC.fields.verdict_tag?RC.fields.verdict_tag:(cc?cc.word:base.verdict_tag),'CURE')",'Cure Check');
one("b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,F0.verdict_tag,b.payload.verdict_tag);","b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,F0.verdict_tag,b.payload.verdict_tag,'RECOMPUTE');",'Panel Cure Check');
fs.writeFileSync('pairs_434.json',JSON.stringify(P,null,1));console.log('pairs',P.length);
