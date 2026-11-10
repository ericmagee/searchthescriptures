// W3 4427 (1): for each luna E-OOR send-back item, is its flagged row still in luna's verdict (outside AUDIT lines) at Gate Record and Alternate Merge?
const chain=require('../w2_grades/ead/chain_w2.cjs');
(async()=>{const r=await chain(process.argv[2],process.env.START||'Panel Payloads');const pick=n=>{const o=r.over[n];return o&&o[0]&&o[0][0]&&o[0][0].json;};
 const sbo=r.over['Send Back Build'][0].map(x=>x.json).find(j=>j.seat==='luna');const items=(sbo.items||[]).filter(i=>i.rule==='E-OOR');
 const lu=j=>JSON.parse(j.bodies.find(s=>JSON.parse(s).payload.judge_seat==='luna')).payload.verdict_raw;
 const norm=s=>s.replace(/\\"/g,'"');
 for(const n of ['Gate Record','Alternate Merge']){const v=norm(lu(pick(n)));const body=v.split(/\n|\\n/).filter(l=>!/\[AUDIT/.test(l));const res=[];let inn=0;
  for(const it of items){const hit=body.some(l=>l.includes(it.line));if(hit)inn++;res.push(it.sid+(hit?':IN':':OUT'));}
  console.log(process.argv[2]+' '+n+': E-OOR items '+items.length+', row still in luna verdict '+inn+' | '+res.join(' '));}
})();
