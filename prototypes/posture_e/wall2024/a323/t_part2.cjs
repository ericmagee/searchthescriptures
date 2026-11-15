// ASK 323 part 2 test: parse Alternate Merge; run its pkgGCA block on every stored judgment of the last 62 debates (judg62.json), wrapped as a body; count marked seats; check 1190 and that an unmarked body is returned byte-identical.
const fs=require('fs');const c=JSON.parse(fs.readFileSync(process.argv[2])).nodes.find(n=>n.name==='Alternate Merge').parameters.jsCode;
let e=null;try{new Function('$',c);}catch(x){e=x.message;}console.log((e?'FAIL':'PASS')+' parse Alternate Merge'+(e?': '+e:''));
const a=c.indexOf('try{const __gca=');const b=c.indexOf('/* pkgGCA, ASK 323 (W1 4b) */');const blk=c.slice(a,b);
const rows=JSON.parse(fs.readFileSync(__dirname+'/judg62.json'));const bodies=rows.map(r=>JSON.stringify({payload:{judge_seat:r.seat,verdict_raw:r.raw}}));
const __AMOUT=[{json:{bodies:bodies.slice()}}];new Function('__AMOUT',blk)(__AMOUT);const nb=__AMOUT[0].json.bodies;
let marked=0,same=0;nb.forEach((s,i)=>{if(s===bodies[i])same++;else{marked++;const v=JSON.parse(s).payload.verdict_raw;console.log('  ',rows[i].id,rows[i].seat,v.slice(v.lastIndexOf('\n[AUDIT v54')+1).slice(0,400));}});
console.log('judgments',rows.length,'marked',marked,'unchanged byte-identical',same);
