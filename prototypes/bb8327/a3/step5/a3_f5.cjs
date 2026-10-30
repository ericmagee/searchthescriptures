const W=process.argv[2];const fs=require('fs');
const src=fs.readFileSync(W+'/s_net.js','utf8');
const m={exports:{}};new Function('module','exports','require',src)(m,m.exports,require);
const netLines=m.exports.netLines||m.exports;
const texts=['834','836','837','839','single_29609','single_29662'];
let all=[];
for(const t of texts){const out=netLines(fs.readFileSync(W+'/texts/'+t+'.txt','utf8'));out.forEach(o=>all.push([t,o.item,o.side,o.line.slice(0,110)]));}
all.forEach(r=>console.log(r.join(' | ')));
console.log('total',all.length);
// my D3 key on each mark
const b=fs.readFileSync(process.argv[3],'utf8');const fk=b.match(/const __FK=x=>\{[\s\S]*?return null;\};/)[0];const FK=new Function(fk+';return __FK;')();
let bad=0;for(const r of all){const mark='[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- '+r[1]+' sets aside the challenger\'s chain on the ground ... REVIEW THIS ROW.]';const k=FK(mark);if(k!=='K-C|'+r[1].toUpperCase()){bad++;console.log('KEY MISS',r[1],k);}}
console.log('D3 key round-trip misses',bad);
// built falsifiers
const B=[
 ['overclaim on a collision (1909 b, must NOT net)','COLLISION POINTS:\nD1 vs C2 (Matthew 1:16): STANDS -- the challenger reads Matthew 1:16 as saying that Joseph begat Jesus, but the verse does not state that.'],
 ['quoted scope statement in a CONCEDED LINKS line (must NOT net)',"CONCEDED LINKS: 0 -- none counted; [CR3] LINK 5's 'No verse states Mary's father' is an honest scope statement, not a concession."],
 ['single pressed witness on STANDS (must NOT net)','COLLISION POINTS:\nD1: STANDS -- Hebrews 7:14 "sprang out of Juda" does not name a begetter of the child.'],
 ['chain read together (MUST net)','COLLISION POINTS:\nD6 vs C2 (Romans 1:3): UNDERDETERMINED -- the seed rows read together do not state that Joseph begat the child.']];
for(const [n,t] of B){const o=netLines('HELD. x.\n'+t);console.log(n,'->',o.length?'NETTED '+o.map(x=>x.item).join(','):'not netted');}
