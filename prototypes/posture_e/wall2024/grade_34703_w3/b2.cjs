const {RD,out}=require('./x.cjs');
const ac=out('Alternate Call openrouter')[0].json;const txt=ac.choices[0].message.content;
console.log('finish',ac.choices[0].finish_reason,'len',txt.length,JSON.stringify(ac.usage).slice(0,200));
let J;try{J=JSON.parse(txt)}catch(e){console.log('PARSE ERR',e.message)}
if(J){console.log(J.verdict_tag,J.defense_standing,J.challenge_standing,J.conceded_links,J.challenger_conceded_links);
 const R=J.reasoning.split('\n');R.forEach((l,i)=>{if(/D6|KEYSTONE|RESULT|CLAUSE|CHAIN MARK|RULE|CLOSE/i.test(l))console.log(i,l.slice(0,900))})}
const cb=out('Alternate Cure Build')[0].json;console.log('\nCURE BUILD keys',Object.keys(cb));
const m=JSON.stringify(cb);let i=m.indexOf('K-G7');console.log(m.slice(Math.max(0,i-1500),i+2500));
const cc=out('Alternate Cure Call openrouter')[0].json;console.log('\nCURE REPLY\n',(cc.choices?cc.choices[0].message.content:JSON.stringify(cc).slice(0,3000)));
