const {run,store,base}=require('./k.cjs');
const N='Panel Judge 2 openrouter';const c0=base[N][0][0].json.choices[0].message.content;const i=c0.indexOf('CHALLENGER CONCEDED LINKS: 0 -- ');const e=c0.indexOf('\\n',i);
const ed=(line,strip)=>({[N]:o=>{const m=o[0][0].json.choices[0].message;let pre=m.content.slice(0,i),post=m.content.slice(e);if(strip){pre=pre.replace(/quotation/g,'citation');post=post.replace(/quotation/g,'citation');}m.content=pre+line+post;}});
const k1='CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 3 are conceded: no one verse in the challenger\'s rows states that Joseph begat the child in its own words.';
(async()=>{for(const [id,line,strip] of [['k1',k1,false],['k1 with every other "quotation" in the reply changed to "citation"',k1,true]]){const st=store(ed(line,strip));for(const w of ['LIVE','A','KCQ']){const g=(await run(w,'Panel Payloads','Reserve Needed?',st))[0];const s=g.summary.find(x=>x.seat==='sol');const k=(s.drv||[]).filter(x=>x.rule==='K-C');console.log(id,'|',w,'K-C',k.length,k.map(x=>String(x.line).slice(0,110)).join(' // '));}}
 console.log('count of "quotation" in the stored reply:',(c0.match(/quotation/g)||[]).length);})();
