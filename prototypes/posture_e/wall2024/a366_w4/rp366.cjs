// ASK 366 replay: the 364 (defender) and 365 (challenger) round sets, rounds 2-4, rows from rows_harvest.json. Usage: node rp366.cjs <old module> <new module>
const fs=require('fs');const mk=f=>new Function(fs.readFileSync(__dirname+'/'+f,'utf8')+'\nreturn LAY;')();
const A=mk(process.argv[2]),B=mk(process.argv[3]);const RW=JSON.parse(fs.readFileSync(__dirname+'/rows_harvest.json'));
const key=it=>it.kind+'|'+(it.kind==='WORDS'?it.line:it.head).replace(/\s+/g,' ').slice(0,200)+'|'+it.why;
let n=0,ch=0;const out=[];
for(const [f,ks] of [['def_rounds.json',['r2','r3','r4']],['ch_rounds.json',['c2','c3','c4']]])for(const x of JSON.parse(fs.readFileSync(__dirname+'/'+f)))for(const k of ks){const t=x[k]||'';if(!t.trim())continue;n++;
 const a=A.check(t,RW).items.map(key),b=B.check(t,RW).items.map(key);const lost=a.filter(z=>!b.includes(z)),gained=b.filter(z=>!a.includes(z));
 if(lost.length||gained.length){ch++;out.push('== '+x.run_token+' '+k+' lost '+lost.length+' gained '+gained.length);lost.forEach(z=>out.push('  LOST  '+z));gained.forEach(z=>out.push('  GAINED '+z));}}
console.log('rounds',n,'changed',ch);console.log(out.join('\n'));
