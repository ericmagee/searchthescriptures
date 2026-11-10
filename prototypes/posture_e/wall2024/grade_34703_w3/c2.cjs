const {RD,out}=require('./x.cjs');
const b=out('Alternate Build')[0].json.alt.body;const t=b.messages.map(m=>typeof m.content==='string'?m.content:JSON.stringify(m.content)).join('\n\n');
let i=-1,c=0;while((i=t.indexOf('STRAINED',i+1))>=0&&c<6){c++;console.log('@',i,t.slice(Math.max(0,i-700),i+500).replace(/\n/g,' ⏎ '));console.log('------')}
