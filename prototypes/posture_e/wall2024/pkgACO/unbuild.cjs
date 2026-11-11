// pkgACO removal: the 4 connection edits of build.cjs, reversed. Anchored the same way. Usage: node unbuild.cjs <parent> <out>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const C=W.connections;
const set=(src,out,from,to)=>{const a=C[src]&&C[src].main&&C[src].main[out];if(!a||a.length!==1||a[0].node!==from)throw new Error('anchor: '+src+'['+out+'] is not exactly -> '+from);a[0].node=to;};
set('Close Enforcer Record',0,'Anticheat Build','Regrade After Quotes?');
set('Anticheat Only?',1,'Regrade After Quotes?','Panel Build');
set('Regrade After Quotes?',0,'Panel Build','Anticheat Build');
set('Check Save',0,'Panel Build','Anticheat Build');
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
