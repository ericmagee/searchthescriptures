// for a fetchback: does node X use W and declare W (in its effective source)?
const fs=require('fs');const [fb]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(fb,'utf8'));d=d.data||d;d=d.workflow||d;
const by={};d.nodes.forEach(n=>by[n.name]=n);const LT=by['Shared Library']&&by['Shared Library'].parameters.jsCode;let L,MAP;
if(LT){L=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/')));MAP=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')));}
const src=n=>{const c=by[n]&&by[n].parameters.jsCode;if(!c)return null;const M=MAP&&MAP[n];if(M&&c.includes('pkgLIB stub'))return M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');return c;};
const T=[['C3 Lexicon Plan','REFP'],['C3B Extract','ECL'],['C3B Build','ECL'],['Panel Build','ciRounds']];
console.log(fb.replace(/.*live_|\.json/g,''),T.map(([n,w])=>{const s=src(n);if(!s)return n+':-';const use=new RegExp('\\b'+w+'\\b').test(s);const dec=new RegExp('(function\\s+'+w+'\\b|\\b'+w+'\\s*=[^=])').test(s);return w+'@'+n.split(' ')[0]+':'+(use?(dec?'decl':'UNDECL'):'unused');}).join(' '));
