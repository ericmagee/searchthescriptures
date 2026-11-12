// pkgRHN rev 2 (on live s156): the round-heading normalizer (__RFX, 17 round Extract nodes) rewrites only a heading line.
// Every line: refused when my/our/your/his/its/their/the/this/that/in/of/from/to/at/by/before/after/since stands before "Round" (rev 1).
// A line that does not begin with "#": also refused when a possessive ('s, s') or under/during/as/with/for/on/through stands before
// "Round". A line that neither begins with "#" nor is bold or underlined whole (and not ending . ; ! ? inside the bold): also refused
// when over 160 characters, over 40 characters before "Round", holding a sentence break, ending in . : ; ! ?, or carrying words after the
// number (and its close label) that do not start with a dash, colon, bar, bracket, comma or equals sign or run past 40 characters.
// usage: node build_RHN2.cjs <in.json> <out.json>
const fs=require('fs');const [,,IN,OUT]=process.argv;const w=JSON.parse(fs.readFileSync(IN,'utf8'));
const A="if(!h||(!/^[ \\t]*(?:#|\\*\\*|__)/.test(L[i])&&L[i].length>160))continue;";
const B="if(!h||/\\b(?:my|our|your|his|its|their|the|this|that|in|of|from|to|at|by|before|after|since)\\s+Round\\s+$/i.test(h[2])||(!/^[ \\t]*#/.test(L[i])&&(/(?:\\b(?:under|during|as|with|for|on|through)|['’]s|s['’])\\s+Round\\s+$/i.test(h[2])||(!(/^[ \\t]*(?:\\*\\*|__)[^\\n]*(?:\\*\\*|__)[ \\t]*$/.test(L[i])&&!/[.;!?][\"')\\]]*(?:\\*\\*|__)[ \\t]*$/.test(L[i]))&&(L[i].length>160||h[2].length>40||/[.!?][\"')\\]]*\\s+\\S/.test(L[i].trim())||/[.:;!?][\"')\\]]*$/.test(L[i].trim())||!/^[\\s*_]*(?:[-–—:|(=\\[,)][^\\n]{0,40})?$/.test(h[5]))))))continue;/*pkgRHN2*/";
module.exports={A,B};
if(require.main===module){const sz={};let tot=0;
for(const n of w.nodes){const s=(n.parameters&&n.parameters.jsCode)||'';const k=s.split(A).length-1;if(!k)continue;if(k!==1)throw new Error(n.name+' anchor '+k);
 n.parameters.jsCode=s.replace(A,B);sz[n.name]=n.parameters.jsCode.length-s.length;tot+=sz[n.name];}
if(Object.keys(sz).length!==17)throw new Error('nodes '+Object.keys(sz).length);
fs.writeFileSync(OUT,JSON.stringify(w));console.log(JSON.stringify({nodes:Object.keys(sz).length,each:[...new Set(Object.values(sz))],total:tot}));}
