// ASK 420(b) (W1): plant pair sets from a good one. Usage: node plants.cjs <pairs.json> <out_dir>
const fs=require('fs');const [P,O]=process.argv.slice(2);const p=JSON.parse(fs.readFileSync(P,'utf8'));fs.mkdirSync(O,{recursive:true});
const w=(n,x)=>fs.writeFileSync(O+'/'+n+'.json',JSON.stringify(x));
w('new_changed',p.map((x,i)=>i===0?{...x,new:x.new+' '}:x));            // one extra space in pair 1's new text -> md5 MISMATCH
w('old_absent',p.map((x,i)=>i===1?{...x,old:x.old+'#absent#'}:x));     // pair 2 occurs 0 times
w('old_short',p.map((x,i)=>i===0?{...x,old:' '}:x));                   // pair 1 old = one space: occurs many times
w('pair_dropped',p.slice(0,-1));                                        // last pair missing -> md5 MISMATCH
