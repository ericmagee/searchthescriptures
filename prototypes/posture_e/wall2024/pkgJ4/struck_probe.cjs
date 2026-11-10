// W3 4427 (1): does luna's final verdict at Alternate Merge drop the struck out-of-round rows? Usage: CHAIN_EX CHAIN_WF START node pkgJ4/struck_probe.cjs SET
const chain=require('../w2_grades/ead/chain_w2.cjs');
(async()=>{const SET=process.argv[2];const r=await chain(SET,process.env.START||'Panel Payloads');if(r.err){console.log('ERROR '+r.err);return;}
 const pick=n=>{const o=r.over[n];return o&&o[0]&&o[0][0]&&o[0][0].json;};
 for(const n of ['Gate Record','Alternate Merge']){const j=pick(n);if(!j||!j.bodies){console.log(n+': none');continue;}
  for(const s of j.bodies){const p=JSON.parse(s).payload;if(p.judge_seat!=='luna')continue;const v=String(p.verdict_raw||'');const L=v.split(/\n|\\n/);
   const oor=L.filter(l=>/OUT[- ]OF[- ]ROUND|E-OOR/i.test(l));const app=L.filter(l=>/SEND-BACK APPLIED|GATE APPLIED|APPLIED --|\bS1[2-9]\b|\bS2[0-4]\b/.test(l)&&/AUDIT/.test(l));
   console.log(SET+' '+n+' luna chars '+v.length+' | lines naming out-of-round/E-OOR '+oor.length+' | applied lines '+app.length);
   app.forEach(l=>console.log('   APPLIED: '+l.slice(0,1500)));}}
})();
