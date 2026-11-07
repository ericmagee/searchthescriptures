// pkgUNXS replay: K-UNX items (plain and K-UNX-A, with pkgASM) from the pkgASM Alternate Merge libraries, old reader vs the new unxSegs, on the 142 verdicts.
// Run from wall2024/: node pkgUNXS/replay_UNXS.cjs
const fs=require('fs');const LIB=fs.readFileSync(__dirname+'/unxs_lib.js','utf8');const E=require('../pkgUNXA/env.cjs');
const OLD=/function unxSegs\(sec\)\{[^\n]*\n[^\n]*\n/;
function load(file,neu){const AM=fs.readFileSync(file,'utf8');const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;let env=AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
 if(neu){if(!OLD.test(env))throw new Error('unxSegs anchor');env=env.replace(OLD,()=>LIB+'\n');}return new Function('$','$input',env+';return {kunxLines,unxSegs};')(()=>{throw 0;},null);}
const F='pkgASM/patched/Alternate_Merge.js';const A=load(F,false),B=load(F,true);
const rows=E.rows();const g=JSON.parse(fs.readFileSync('pkgUNXA/data/grok_33222.json','utf8'));rows.find(r=>r.run.includes('33222')).j.push({seat:'grok(alt)',v:g.v});
const key=x=>x.link+' '+(x.a||'plain')+(x.asm?'+asm':'');const out=[];let na=0,nb=0,v=0;
for(const r of rows){const PT=E.PT(r);for(const j of r.j){v++;const T=E.clean(j.v);const a=A.kunxLines(T,PT).items,b=B.kunxLines(T,PT).items;na+=a.length;nb+=b.length;
 const ka=new Set(a.map(key)),kb=new Set(b.map(key));for(const k of ka)if(!kb.has(k))out.push('LOST   '+r.run.slice(5,10)+' '+j.seat+' '+k);
 for(const x of b)if(!ka.has(key(x)))out.push('ADDED  '+r.run.slice(5,10)+' '+j.seat+' '+key(x)+' ['+x.kinds.join(',')+'] '+(x.l1ref||'')+' :: '+x.line.split('Your count: ')[1].slice(0,260));}}
const txt='verdicts '+v+'; items old reader '+na+', new reader '+nb+'\n'+out.join('\n')+'\n';fs.writeFileSync(__dirname+'/replay_UNXS.txt',txt);console.log(txt);
