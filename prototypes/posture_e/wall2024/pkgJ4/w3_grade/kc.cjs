const {run,store,base}=require('../../pkgGK1/w3_grade/k.cjs');const S=JSON.stringify;const C=process.env.W3_W||'A2';
const N='Panel Judge 3 openrouter';const c0=base[N][0][0].json.choices[0].message.content;const i=c0.indexOf('CHALLENGER CONCEDED LINKS: 0 -- ');const e=c0.indexOf('\\n',i);
const ed=line=>({[N]:o=>{const m=o[0][0].json.choices[0].message;m.content=m.content.slice(0,i)+line+m.content.slice(e);}});
const H='CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: ';
const P={k5:"each quotation in the challenger's rows names a house and none of the verses states the begetting in its own words.",
 k6:"the rows of quotation the challenger gathers are set aside because none of the verses states the begetting in its own words.",
 k7:"none of the verses states the begetting in its own words, whatever quotation is offered.",
 k8:"the challenger's rows are set aside because none of the verses states the begetting in its own words.",
 n1:"that quotation of Matthew 1:16 does not assert the added begetting, and none of the verses states the link in its own words.",
 n3:"its [DR2] quotation does not assert the begetting.",
 n4:"the [CR3] quotation does not state the added exclusion.",
 n5:"That quotation does not assert the added exclusion; none of the challenger's verses states the begetting in its own words, so the rows are set aside.",
 n6:"Matthew 1:16 does not assert the added begetting.",
 n2:"The challenger's rows are set aside: that quotation does not assert the added link in its own words.",
 n7:"the rows are set aside because that quotation does not assert the begetting the challenger added.",
 n8:"its quotation of Luke 3:23 does not assert the added step that Joseph begat, so the chain is set aside."};
const f=g=>{const s=g.summary.find(x=>x.seat==='sol');return (s.drv||[]).filter(x=>x.rule==='K-C'||x.rule==='K-S2').map(x=>x.rule).join(',')||'-';};
(async()=>{{const a=(await run('LIVE','Panel Payloads','Reserve Needed?',store()))[0],b=(await run(C,'Panel Payloads','Reserve Needed?',store()))[0];console.log('stored | LIVE',f(a),'|',C,f(b),'| luna and terra equal',S([a.summary[0],a.summary[1],a.bodies[0],a.bodies[1]])===S([b.summary[0],b.summary[1],b.bodies[0],b.bodies[1]]),'| seats',a.summary.map(x=>x.seat).join(','));}
 for(const [id,t] of Object.entries(P)){const st=store(ed(H+t));const a=(await run('LIVE','Panel Payloads','Reserve Needed?',st))[0],b=(await run(C,'Panel Payloads','Reserve Needed?',st))[0];console.log(id,'| LIVE',f(a),'|',C,f(b),f(a)===f(b)?'':'  <-- DIFFERS');}})();
