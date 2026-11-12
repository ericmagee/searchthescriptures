// pkgRHN: the round-heading normalizer (__RFX in the 17 round Extract nodes) rewrites only a heading line,
// never a body sentence. A line is refused as a heading when the word before "Round" is a possessive,
// article or preposition ("my round 1", "in round 2"), or, for a line with no heading markup (#, **, __),
// when it is over 160 characters, has over 40 characters before "Round", or holds a sentence break inside it.
// usage: node build_RHN.cjs <in.json> <out.json>
const fs=require('fs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const A="if(!h||(!/^[ \\t]*(?:#|\\*\\*|__)/.test(L[i])&&L[i].length>160))continue;";
const B="if(!h||/\\b(?:my|our|your|his|its|their|the|this|that|in|of|from|to|at|by|before|after|since)\\s+Round\\s+$/i.test(h[2])||(!/^[ \\t]*(?:#|\\*\\*|__)/.test(L[i])&&(L[i].length>160||h[2].length>40||/[.!?][\"')\\]]*\\s+\\S/.test(L[i].trim()))))continue;/*pkgRHN*/";
const sz={};let tot=0;
for(const n of w.nodes){const s=(n.parameters&&n.parameters.jsCode)||'';const k=s.split(A).length-1;if(!k)continue;if(k!==1)throw new Error(n.name+' anchor '+k);
 n.parameters.jsCode=s.replace(A,B);sz[n.name]=n.parameters.jsCode.length-s.length;tot+=sz[n.name];}
if(Object.keys(sz).length!==17)throw new Error('nodes '+Object.keys(sz).length);
fs.writeFileSync(OUT,JSON.stringify(w));console.log(JSON.stringify({nodes:Object.keys(sz).length,each:[...new Set(Object.values(sz))],total:tot}));
