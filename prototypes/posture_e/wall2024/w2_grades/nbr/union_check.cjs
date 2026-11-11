// W2: does a union pattern (NBR pattern, else the old one) keep every old match and still add the bracketed ones? Not a build; a check for the builder.
const fs=require('fs');
const OLD=/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g;
const NEW=/\[(?:EXTRACTOR|AUDIT) v\d+(?:[^\]\[\n]|\[[^\]\[\n]*\])*REVIEW THIS ROW(?:[^\]\[\n]|\[[^\]\[\n]*\])*\]/g;
const UNI=new RegExp(NEW.source+'|'+OLD.source,'g');
function load(f){const t=JSON.parse(fs.readFileSync(f,'utf8')).result;const a=t.indexOf('>\n',t.indexOf('<untrusted-data-'))+2,b=t.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(t.slice(a,b));return rows[0][Object.keys(rows[0])[0]];}
const T=[...load(process.argv[2]).map(j=>j.verdict_raw),...load(process.argv[3]).map(r=>r.ivr)].map(x=>String(x||''));
let o=0,n=0,u=0,lostU=0,diffNU=0;for(const t of T){const a=t.match(OLD)||[],b=t.match(NEW)||[],c=t.match(UNI)||[];o+=a.length;n+=b.length;u+=c.length;const cs=new Set(c);for(const x of a)if(!cs.has(x))lostU++;if(JSON.stringify(b)!==JSON.stringify(c))diffNU++;}
console.log('texts',T.length,'old',o,'new',n,'union',u,'old matches missing from union',lostU,'texts where union differs from new',diffNU);
const plant='[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "LUKE 3:31 \\"WHICH WAS [THE ". REVIEW THIS ROW.]';
console.log('N8 unclosed bracket: old',(plant.match(OLD)||[]).length,'new',(plant.match(NEW)||[]).length,'union',(plant.match(UNI)||[]).length);
const t0=Date.now();const bad='[AUDIT v1: '+'[x'.repeat(5000)+' no end';bad.match(UNI);console.log('backtracking probe (10,000 chars, no match):',Date.now()-t0,'ms');
