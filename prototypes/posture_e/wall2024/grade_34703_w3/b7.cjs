const {RD,out}=require('./x.cjs');
const ce=out('Close Enforcer Record')[0].json;console.log('CEC',JSON.stringify(ce.cec,(k,v)=>typeof v==='string'&&v.length>700?v.slice(0,700)+'…':v).slice(0,3500));
const body=JSON.parse(out('Replay Rows')[0].json.body);
for(const r of body.p_rows){const o={...r};delete o.verdict_raw;console.log('\n=== ROW',JSON.stringify(o,(k,v)=>typeof v==='string'&&v.length>200?v.slice(0,200)+'…':v).slice(0,1500));
 let J;try{J=JSON.parse(r.verdict_raw)}catch(e){console.log('raw parse err');continue}
 console.log('tag',J.verdict_tag,J.defense_standing,J.challenge_standing,J.conceded_links,J.challenger_conceded_links,JSON.stringify(J.counted_premises_defender));
 const L=J.reasoning.split('\n');
 for(const l of L){const t=l.trim();if(/^(RESULT|CLAUSE|KEYSTONE|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|DEFENSE STANDING|CHALLENGE STANDING)/.test(t)||(/^D\d+ vs C\d+/.test(t)))console.log('   |',t.slice(0,230))}
 for(const l of L)if(/AUDIT/.test(l)&&/v52|v25|KEYSTONE|SUPERSEDED|v38|CLOSING CONTRADICTION|REMOVED|drv_uncured|pkgGUB|pkgGCC|CURE COUNT/.test(l))console.log('   M|',l.trim().slice(0,520));
}
