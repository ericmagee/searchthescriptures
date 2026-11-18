// Annotates each UNCHANGED hit in r6e_out.txt with the reason it is not changed.
const fs=require('fs');const W=[
[/LIB line (1648|2200)\b/,'heading search only; the reader on the next line is CHANGED'],
[/LIB line 2202\b/,'return statement of the reader on line 2201, which is CHANGED'],
[/part (115|121)\b/,'heading search only; the reader two parts later is CHANGED'],
[/part 125\b/,'flag text that prints chain_count; the count comes from part 117, which is CHANGED'],
[/node (Init with Guards|D1 Build|C2 Build)\b/,'prompt text sent to a model, not a reader'],
[/node (C2B|D3B|C3B) Extract\b/,'ASK 423 __CC423 bound reader; its heading search only, its link reader already uses the ASK 423 head'],
[/node Assume Check Build\b/,'vp4List reads the UNSUPPORTED-L4 PREMISES list, not the DECLARED CHAIN; out of scope of rev 3']];
const out=fs.readFileSync(process.argv[2],'utf8').split('\n').map(l=>{if(!l.startsWith('UNCHANGED'))return l;const w=W.find(([r])=>r.test(l));return l.split(' | ').slice(0,3).join(' | ')+' | WHY NOT: '+(w?w[1]:'UNCLASSIFIED');});
fs.writeFileSync(process.argv[3],out.join('\n'));const u=out.filter(l=>/UNCLASSIFIED/.test(l)).length;console.log('UNCLASSIFIED',u);
