// ASK 424 R6e (W3 8930, ASK 415): search every /*LIB*/ line, every inline MAP text and every node's code, in the engine and the child (target),
// for the R1 to R5 heads (old and new) and for "DECLARED CHAIN"; each hit is marked CHANGED (differs from the base) or UNCHANGED.
// Usage: node a424/r6e.cjs BASE_ENG BASE_CHILD TGT_ENG TGT_CHILD
const fs=require('fs'),path=require('path');const T=require(path.join(__dirname,'../tools/lib.cjs'));const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data&&d.data.nodes?d.data:d;};
const [BE,BC,TE,TC]=process.argv.slice(2);
const PAT=[['OLD R1 head',/D\?\(\[0-9\]\+\)\(\?:\\\.\|/],['OLD R2/R5 head',/\\\*\*\\s\*\(\\d\+\)\[\.\)\]\\s\+/],['OLD R3 head',/\^\\s\*\(\\d\+\)\[\.\)\]\\s\+\(\\S\.\*\)\$/],['OLD line test',/\\\*\*\\s\*\\d\+\[\.\)\]\\s\+\\S/],
 ['NEW head',/D\?\(\[0-9\]\+\)\[\*_\]\*\(\?:\[\.:\)\]\(\?!\[0-9\]\)/],['DECLARED CHAIN',/DECLARED CHAIN/]];
function units(w,who){const u=T.unpack(w);const out=[];u.L.forEach((l,i)=>out.push({where:who+' LIB line '+i,t:l}));
 for(const k of Object.keys(u.M))u.M[k].p.forEach((e,i)=>{if(Array.isArray(e)&&typeof e[0]==='string')out.push({where:who+' MAP '+k+' part '+i,t:e[0]});});
 for(const n of w.nodes){if(n.name==='Shared Library')continue;const c=n.parameters&&n.parameters.jsCode;if(typeof c==='string')out.push({where:who+' node '+n.name,t:c});
  else{const s=JSON.stringify(n.parameters||{});if(/DECLARED CHAIN/.test(s))out.push({where:who+' node '+n.name+' (parameters, not code)',t:s});}}return out;}
const B=new Map([...units(ld(BE),'engine'),...units(ld(BC),'child')].map(x=>[x.where,x.t]));
const hits=[];for(const x of [...units(ld(TE),'engine'),...units(ld(TC),'child')]){const p=PAT.filter(q=>q[1].test(x.t)).map(q=>q[0]);if(!p.length)continue;
 const ctx=(x.t.match(/.{0,70}DECLARED CHAIN.{0,50}/)||[''])[0].replace(/\s+/g,' ');hits.push([x.where,p.join(' + '),B.get(x.where)===x.t?'UNCHANGED':'CHANGED',ctx]);}
for(const h of hits)console.log(h[2].padEnd(9),'|',h[0],'|',h[1],'|',h[3].slice(0,120));
const cnt={};for(const h of hits)for(const p of h[1].split(' + '))cnt[p]=(cnt[p]||0)+1;console.log('HITS',hits.length,JSON.stringify(cnt));
