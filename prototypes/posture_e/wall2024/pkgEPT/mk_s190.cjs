// Make the expected s190 from an s189 file: apply pkgD22 (ASK 256) to Init with Guards. Check md5 against live (e5d4500c..., W2 6105).
// usage: node mk_s190.cjs <s189 json> <out json>
const fs=require('fs'),crypto=require('crypto');
const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const n=W.nodes.filter(x=>x.name==='Init with Guards');if(n.length!==1)throw 'node';
const A='\\"his neighbour\'s wife,\\" Deuteronomy 22:24; ';const c=n[0].parameters.jsCode;if(c.split(A).length!==2)throw 'anchor';
n[0].parameters.jsCode=c.replace(A,'');const m=crypto.createHash('md5').update(n[0].parameters.jsCode).digest('hex');
console.log('Init with Guards',c.length,'->',n[0].parameters.jsCode.length,'md5',m);if(!m.startsWith('e5d4500c'))throw 'md5 differs from live s190';
fs.writeFileSync(process.argv[3],JSON.stringify(raw));
