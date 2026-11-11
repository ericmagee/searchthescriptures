const {r,out}=require('./x.cjs');
const am=out('Alternate Merge')[0];
const body=(i,src)=>{const p=JSON.parse((src||am).bodies[i]).payload;const t=p.verdict_raw.replace(/\\n/g,'\n').replace(/\\"/g,'"');return {p,t};};
module.exports={body,am,out};
if(require.main===module){const i=+process.argv[2];const re=new RegExp(process.argv[3],'i');const W=+process.argv[4]||300;const {p,t}=body(i,process.argv[5]?out(process.argv[5])[0]:null);
console.log(p.judge_seat,p.verdict_tag,p.defense_standing,p.challenge_standing,p.conceded_links,p.challenger_conceded_links,'drv_uncured',p.drv_uncured);
t.split('\n').forEach((l,n)=>{if(re.test(l))console.log(n+': '+l.slice(0,W));});}
