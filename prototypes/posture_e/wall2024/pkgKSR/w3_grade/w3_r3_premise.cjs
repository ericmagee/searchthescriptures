// W3 rev 3, V5 premise: a judge-written DEFENDER LINK BROKEN line on the confirmed link, present BEFORE Panel Cure Check. Does cureRecompute mark it?
const {run,rd,U,cl}=require('./w3_KSR_ECB.cjs');const tag=process.argv[2]||'LIVE';
const ORDER=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime})).sort((a,b)=>a.t-b.t).map(o=>o.n);const up=ORDER.slice(0,ORDER.indexOf('Panel Cure Check'));
const P=[['D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): UNDERDETERMINED','D6 vs C5 (John 3:6; 1 John 5:1; Romans 1:3): DEFENDER LINK BROKEN'],['D6 vs C6 (Luke 2:4; Numbers 1:18): UNDERDETERMINED','D6 vs C6 (Luke 2:4; Numbers 1:18): DEFENDER LINK BROKEN']];
const hook={before:{'Panel Cure Check':async(over,out)=>{let h=0;for(const n of up){const cur=out(n);if(!cur)continue;let s=JSON.stringify(cur),c=0;for(const [a,b] of P){if(s.includes(a)){c+=s.split(a).length-1;s=s.split(a).join(b);}}if(c){h+=c;over[n]=JSON.parse(s);}}console.log('strings planted upstream: '+h);}}};
(async()=>{const r=await run(tag,hook);const b=r.over['Panel Cure Check'][0][0].json.bodies;const s=U(JSON.stringify(b[2]));
 console.log(tag+' Panel Cure Check output, sol:');[...new Set(s.match(/(?:^|\n|")D6 vs C[56] \([^\n]{0,260}/g)||[])].forEach(x=>console.log('   '+x.replace(/^[\n"]/,'').slice(0,230)));
 console.log('   KEYSTONE: '+(s.match(/KEYSTONE: D6 -- [^\n]{0,70}/g)||[]).slice(0,3).join(' || '));
 const sb=r.over['Send Back Build'][0].find(x=>x.json.seat==='sol').json;console.log('   send-back items sol: '+(sb.items||[]).map(i=>i.sid+' '+i.rule+' '+i.item).join('; ')+' | not sent: '+(sb.sb_not_sent||[]).filter(n=>n.seat==='sol'||!n.seat).map(n=>n.rule+' '+n.item).join('; '));
 const w=r.rows.find(x=>x.judge_seat==='sol');const t=U(w.verdict_raw);console.log('   written row sol: '+(t.match(/(?:^|\n)KEYSTONE:[^\n]{0,70}/)||['none'])[0].trim()+' | tag '+w.verdict_tag+' | drv_uncured '+w.drv_uncured);
 console.log('   all rows: '+r.rows.map(x=>x.judge_seat+' '+x.verdict_tag+' u'+x.drv_uncured+' '+((U(x.verdict_raw).match(/(?:^|\n)KEYSTONE: D6 -- \w+/)||['none'])[0].trim())).join(' | '));
 const g=((r.over['Gate Record']||r.stored('Gate Record'))[0][0].json.gate.report||[]).flatMap(x=>x.items.map(i=>x.seat+' '+i.kind+' '+i.src+': '+String(i.why).slice(0,130)));console.log('   gate items: '+(g.join('\n      ')||'none'));
 (t.match(/(?:^|\n)D6 vs C[56] \([^\n]{0,120}/g)||[]).forEach(x=>console.log('   row line: '+x.trim().slice(0,120)));
})().catch(e=>console.log('ERROR '+e.stack));
