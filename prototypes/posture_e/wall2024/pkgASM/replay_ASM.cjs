// pkgASM replay over pkgUNXA/data/rows.json (47 runs, 142 verdicts incl. 33222 grok's alternate verdict): kunxLines with K-UNX-A (pkgUNXA)
// against kunxLines with K-UNX-A + E-ASM (pkgASM). Lists every item that changes. Run from wall2024/: node pkgASM/replay_ASM.cjs
const fs=require('fs');const {patch}=require('../pkgUNXA/patch.cjs');const {patchASM}=require('./patch_asm.cjs');
const AM=fs.readFileSync('pkgUNXA/base/Alternate_Merge.js','utf8');const s0=AM.indexOf('const __CSPOUT=(()=>{\n')+22;const seg=AM.slice(s0,AM.indexOf("const AM=$('Alternate Merge Seat')"));
const mk=env=>new Function('$','$input',env+';return {kunxLines,ciRounds,unxaAct:typeof unxaAct==="function"?unxaAct:null};')(()=>{throw 0;},null);
const KA=mk(patch(seg)),KB=mk(patchASM(patch(seg),false).code);
const rows=JSON.parse(fs.readFileSync('pkgUNXA/data/rows.json','utf8'));{const g=JSON.parse(fs.readFileSync('pkgUNXA/data/grok_33222.json','utf8'));rows.find(r=>r.run.includes('33222')).j.push({seat:'grok(alt)',v:g.v});}
const unw=v=>{const s=String(v||'').trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')return J.reasoning;}catch(e){}}return String(v||'');};
const out=[];let nv=0,same=0,asmOnly=0,both=0,lost=0;const strip=x=>{const y={...x};delete y.asm;delete y.why;delete y.line;return JSON.stringify(y);};
for(const r of rows){if(!r.e3||!r.c3)continue;const PT='=== [CR3] ===\n'+r.e3+'\n\n=== [DR3] ===\n'+r.c3+'\n';
 for(const j of r.j){nv++;const T=unw(j.v).replace(/\n\n\[AUDIT v[\s\S]*$/,'');const A=KA.kunxLines(T,PT).items,B=KB.kunxLines(T,PT).items;
  for(const x of A){const y=B.find(z=>z.link===x.link);if(!y){lost++;out.push('LOST  '+r.run.slice(5,10)+' '+j.seat+' '+x.link);continue;}if(strip(x)!==strip(y)&&!(x.a==='ASSUMES'&&y.a==='ASSUMES')){lost++;out.push('DIFF  '+r.run.slice(5,10)+' '+j.seat+' '+x.link);}
   if(y.asm){both++;out.push('BOTH  '+r.run.slice(5,10)+' '+j.seat.padEnd(9)+' '+y.link.padEnd(22)+' act "'+y.asm+'" | '+y.why.slice(0,170));}else same++;}
  for(const y of B.filter(z=>!A.some(x=>x.link===z.link))){if(y.a==='ASM'){asmOnly++;out.push('ASM   '+r.run.slice(5,10)+' '+j.seat.padEnd(9)+' '+y.link.padEnd(22)+' act "'+y.asm+'" | count: '+(y.line.split('Your count: ')[1]||'').slice(0,240));}else{lost++;out.push('NEW?  '+r.run.slice(5,10)+' '+j.seat+' '+y.link+' '+y.a);}}}}
const head=nv+' verdicts. K-UNX-A items kept: '+(same+both)+' ('+both+' now also name the act). E-ASM alone adds '+asmOnly+'. Lost or changed otherwise: '+lost+'.';
fs.writeFileSync('pkgASM/replay_ASM.txt',head+'\n'+out.join('\n')+'\n');console.log(head);console.log(out.join('\n'));
