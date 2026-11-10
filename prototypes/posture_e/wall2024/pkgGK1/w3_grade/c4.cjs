const {run,store,base}=require('./k.cjs');const {kc}=require('./c.cjs');
const N='Panel Judge 3 openrouter';const c0=base[N][0][0].json.choices[0].message.content;const i=c0.indexOf('CHALLENGER CONCEDED LINKS: 0 -- ');const e1=c0.indexOf('\\n',i),e2=c0.indexOf('\n',i);const e=Math.min(...[e1,e2].filter(x=>x>0));
console.log('found',i,'line:',c0.slice(i,e).slice(0,120),'... len',e-i,'json?',c0.trim()[0]);
const ed=line=>({[N]:o=>{const m=o[0][0].json.choices[0].message;m.content=m.content.slice(0,i)+line+m.content.slice(e);}});
const P={k5:'CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: each quotation in the challenger\'s rows names a house and none of the verses states the begetting in its own words.',
 k6:'CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: the rows of quotation the challenger gathers are set aside because none of the verses states the begetting in its own words.',
 k7:'CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: none of the verses states the begetting in its own words, whatever quotation is offered.',
 k8:'CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: the challenger\'s rows are set aside because none of the verses states the begetting in its own words.'};
(async()=>{for(const [id,line] of Object.entries(P)){const st=store(ed(line));const a=(await run('LIVE','Panel Payloads','Reserve Needed?',st))[0],b=(await run('A','Panel Payloads','Reserve Needed?',st))[0];const f=g=>{const s=g.summary.find(x=>x.seat==='sol');return 'K-C ['+(s.drv||[]).filter(x=>x.rule==='K-C').map(x=>x.link).join(',')+'] drv '+(s.drv||[]).length;};console.log(id,'| LIVE',f(a),'| A',f(b));}})();
