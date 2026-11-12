const rows=require('./cure_replies.json');
require('./reader.cjs').then(({CL,UW,RL})=>{
 const cnt=t=>{const o=CL(t);return {statement:o.statement.length,response:o.response.length,malformed:o.malformed.length,prose:o.prose.length};};
 for(const r of rows)console.log(r.seat.padEnd(8),JSON.stringify(cnt(r.full_reply)));
 const sol=rows.find(r=>r.seat==='sol').full_reply;
 const un=UW(sol);console.log('sol unwrapped starts:',JSON.stringify(un.slice(0,30)),'lines',un.split('\n').length);
 const o=CL(sol);console.log('first malformed:',o.malformed[0].slice(0,120));
 const L=o.malformed.find(l=>/^STATEMENT:/.test(l));console.log('readLine on sol STATEMENT:',JSON.stringify(RL.readLine(L)).slice(0,300));
 // plant: swap " -- " after the item label to " | " on STATEMENT/RESPONSE lines only
 const fixed=un.split('\n').map(l=>/^(STATEMENT|RESPONSE): /.test(l)?l.replace(/^((?:STATEMENT|RESPONSE): .*?#\d+|(?:STATEMENT|RESPONSE): K-KJV KJV QUOTE [^-]*?) -- /,'$1 | '):l).join('\n');
 console.log('sol with " | " plant:',JSON.stringify(cnt(fixed)));
 const wr=JSON.stringify({reasoning:fixed});console.log('same plant inside JSON wrapper:',JSON.stringify(cnt(wr)));
});
