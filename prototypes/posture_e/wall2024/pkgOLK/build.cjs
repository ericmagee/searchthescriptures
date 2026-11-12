// pkgOLK (W1; DeepSeek issue (d), W1 Wall 5214, W4 Wall 5216; run 34852 item B15): when an answer points to a link block ("answered under
// link 3") and no paragraph of that block names the pressed verse, the whole block was served from its opening and cut at 900 characters,
// so the cut fell inside the answer the pointer meant. Change (library line 3036, the pkgA1N other-lines builder): in that case the
// block's paragraphs and bullet lines that share a key word with the answer come first, in their own order, then the rest in order.
// Nothing is added or dropped; only the order changes. Rev 2 (W3 Wall 5226): the unit is a line with the bullet list under it (one blank line allowed), so a bullet never moves without the line that introduces it; a unit holding a PRESSED WITH or "-- MEANS:" line is never moved forward; stems of common words are not key words; blank lines between units are kept. Prompt 0. Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
function olkOrder(sec,ans){const SW=new Set('this that these those which where there their about answe under above below again other being given every stand throu links round verse press place shown named first later'.split(' '));
 const ks=[...new Set((String(ans||'').toLowerCase().match(/[a-z]{5,}/g)||[]).map(w=>w.slice(0,5)).filter(w=>!SW.has(w)))];if(!ks.length)return sec;
 const G=[];let cur=null,gap=0;const isB=l=>/^\s*[-*•]\s/.test(l);for(const l of String(sec).split('\n')){if(!l.trim()){gap++;continue;}if(isB(l)&&cur&&gap<=1){cur.push(l);gap=0;continue;}if(isB(l)&&cur){cur.push(l);gap=0;continue;}cur=[l];G.push(cur);gap=0;}
 const pl=u=>/PRESSED WITH|--\s*MEANS\s*:/i.test(u);const hit=g=>{const u=g.join('\n');if(pl(u))return false;const ws=new Set((u.toLowerCase().match(/[a-z]{5,}/g)||[]).map(w=>w.slice(0,5)));return ks.some(k=>ws.has(k));};
 const H=G.filter(hit);if(!H.length||H.length===G.length||G[0]===H[0]&&H.every((g,i)=>G[i]===g))return sec;return H.concat(G.filter(g=>!hit(g))).map(g=>g.join('\n')).join('\n\n');}
const li=3036,o="out.push('['+k0+', LINK '+pt[1]+'] '+(ps.length?ps.join('\\n'):sec).trim());";
const n="out.push('['+k0+', LINK '+pt[1]+'] '+(ps.length?ps.join('\\n'):olkOrder(sec,typeof __ga==='string'?__ga:g.answer)).trim());";
if(Lb[li].split(o).length!==2)throw new Error('anchor');Lb[li]=Lb[li].replace(o,()=>n);
Lb[li]=olkOrder.toString().replace(/\n\s*/g,'')+' /* pkgOLK: a pointed block with no paragraph naming the verse is served with the paragraphs that share a key word with the answer first */'+Lb[li];
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
