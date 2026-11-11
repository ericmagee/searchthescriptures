// pkgCDX (W1): cut the unused code in Close Enforcer Record (W2 Wall 4625, W1 Wall 4661), on top of pkgCLG.
// Removes five whole declarations (cecOracle: never referenced; cecLinks, cecDeclared, cecDlinks, cecCblocks: reached only through "B.links||cecLinks(F)").
// "B.links||cecLinks(F)" becomes "B.links||{}": a Build item with no links then fails the declared-link check (NOT CONFIRMED (form), visible) instead of a rebuilt list.
// Usage (from wall2024/): node pkgCDX/build_CDX.cjs <parent_s120_CLG.json> <out.json>
const fs=require('fs'),crypto=require('crypto');const acorn=require('/opt/node-tools/node_modules/acorn');const [PB,OUT]=process.argv.slice(2);
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const d=g(PB);const out=JSON.parse(JSON.stringify(d));
const n=out.nodes.find(x=>x.name==='Close Enforcer Record');let c=n.parameters.jsCode;const W='async function W(){';
const NAMES=['cecOracle','cecLinks','cecDeclared','cecDlinks','cecCblocks'];const ast=acorn.parse(W+c+'\n}',{ecmaVersion:2025});const del=[];
const walk=(x,f)=>{if(!x||typeof x.type!=='string')return;f(x);for(const k in x){const v=x[k];if(Array.isArray(v))v.forEach(y=>walk(y,f));else if(v&&typeof v.type==='string')walk(v,f);}};
walk(ast,x=>{if(x.type==='VariableDeclaration'&&x.declarations.length===1&&NAMES.includes(x.declarations[0].id.name))del.push([x.start-W.length,x.end-W.length,x.declarations[0].id.name]);});
if(del.length!==5)throw new Error('expected 5 declarations, found '+del.length);
del.sort((a,b)=>b[0]-a[0]);for(const [a,b] of del){let e=b;while(c[e]==='\n'||c[e]===' ')e++;c=c.slice(0,a)+c.slice(e);}
const A="B.links||cecLinks(F)";if(c.split(A).length!==2)throw new Error('anchor');c=c.replace(A,"B.links||{}");
for(const k of NAMES)if(new RegExp('\\b'+k+'\\b').test(c))throw new Error('name left: '+k);acorn.parse(W+c+'\n}',{ecmaVersion:2025});
const old=n.parameters.jsCode.length;n.parameters.jsCode=c;
const code=w=>w.nodes.reduce((a,x)=>a+((x.parameters&&x.parameters.jsCode)||'').length,0);
const prm=w=>w.nodes.reduce((a,x)=>{const p=Object.assign({},x.parameters||{});delete p.jsCode;return a+JSON.stringify(p).length;},0);
console.log('cut',del.map(x=>x[2]+' '+(x[1]-x[0])).join(', '));console.log('Close Enforcer Record '+old+' -> '+c.length+'; Code '+code(d)+' -> '+code(out)+' = '+(code(out)-code(d))+'; non-code parameters '+(prm(out)-prm(d)));
const s=JSON.stringify(out);fs.writeFileSync(OUT,s);fs.writeFileSync(__dirname+'/Close_Enforcer_Record.js',c);console.log('sha256 '+crypto.createHash('sha256').update(s).digest('hex').slice(0,16)+' '+OUT+' / parses');
