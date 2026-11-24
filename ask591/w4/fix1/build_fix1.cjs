// ASK 591 fix 1 (W4): the single-judge chain is off (ruling 402); the review line stops naming a single judge. Touches Build Save Body only.
// usage: node build_fix1.cjs <engine in> <engine out>
const fs=require('fs');const [i,o]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(i,'utf8'));
const OLD="; alternates '+L(I.alt_order)+'; single judge '+(I.single_judge||'none')+']'";const NEW="; alternates '+L(I.alt_order)+']'";
const n=W.nodes.find(x=>x.name==='Build Save Body');const s=n.parameters.jsCode;const k=s.split(OLD).length-1;if(k!==1)throw new Error('anchor occurs '+k+' times');
n.parameters.jsCode=s.replace(OLD,()=>NEW);fs.writeFileSync(o,JSON.stringify(W));console.log('Build Save Body changed; single judge left the review line');
