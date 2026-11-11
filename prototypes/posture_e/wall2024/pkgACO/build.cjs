// pkgACO (W1): Anticheat order. Ruling 427 places the anti-cheat check "after both closes and before the judges are seated".
// Live (s133 to s135) runs Anticheat after Save to DB, so the readers already in Build Independent Verdict (__ACX, the single
// judge's transcript) and Build Save Body (AUDIT ANTI-CHEAT rows) never fire on a live run (W1 Wall 4882, W4 Wall 4881).
// Change: connections only, no code, no new node. The Anticheat chain moves to sit between Close Enforcer Record and
// Regrade After Quotes?; the regrade branch is taken after it.
//   Close Enforcer Record -> Anticheat Build            (was -> Regrade After Quotes?)
//   Anticheat Only? [false] -> Regrade After Quotes?    (was -> Panel Build)
//   Regrade After Quotes? [true] -> Panel Build         (was -> Anticheat Build)
//   Check Save [ok]  -> Panel Build                     (was -> Anticheat Build)
//   Regrade After Quotes? [false] -> Build Independent Verdict (unchanged)
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const C=W.connections;
const set=(src,out,from,to)=>{const a=C[src]&&C[src].main&&C[src].main[out];if(!a||a.length!==1||a[0].node!==from)throw new Error('anchor: '+src+'['+out+'] is not exactly -> '+from+' (found '+JSON.stringify(a)+')');a[0].node=to;};
set('Close Enforcer Record',0,'Regrade After Quotes?','Anticheat Build');
set('Anticheat Only?',1,'Panel Build','Regrade After Quotes?');
set('Regrade After Quotes?',0,'Anticheat Build','Panel Build');
set('Check Save',0,'Anticheat Build','Panel Build');
const r=C['Regrade After Quotes?'].main[1];if(!(r.length===1&&r[0].node==='Build Independent Verdict'))throw new Error('regrade false branch moved');
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
