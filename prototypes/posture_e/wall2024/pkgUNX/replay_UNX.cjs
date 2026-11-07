// pkgUNX replay on runs 33040 to 33197 (replay_rows.json from debate_results and debate_judgments): every panel verdict and the single verdict.
// Run from wall2024/: node pkgUNX/replay_UNX.cjs
const fs=require('fs');const AM=fs.readFileSync('pkgUNX/base/Alternate_Merge.js','utf8');const env=AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\n'+fs.readFileSync('pkgUNX/unx_lib.js','utf8'); // the node's own libraries (as test_SLA), then the new rule
const K=new Function('$','$input',env+';return {kunxLines,ciCountSection,lbBlockText,lbFoot,ciRounds,unxSegs};')(()=>{throw 0;},null);
const rows=JSON.parse(fs.readFileSync('pkgUNX/replay_rows.json','utf8'));const unw=v=>{const s=String(v||'').trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')return J.reasoning;}catch(e){}}return String(v||'');};
const out=[];let verdicts=0,unexSegs=0;
for(const r of rows){if(!r.e3||!r.c3)continue;const PT='=== [CR3] ===\n'+r.e3+'\n\n=== [DR3] ===\n'+r.c3+'\n';
 const J=(r.j||[]).map(j=>({seat:j.seat,v:j.v})).concat(r.single?[{seat:'single',v:r.single}]:[]);
 for(const j of J){verdicts++;const T=unw(j.v).replace(/\n\n\[AUDIT v[\s\S]*$/,'');for(const sd of ['DEFENDER','CHALLENGER']){const sec=K.ciCountSection(T,sd);if(sec)unexSegs+=K.unxSegs(sec).filter(s=>/\bUNEXHIBITED\b/.test(s.seg)).length;}
  const X=K.kunxLines(T,PT);for(const x of X.items)out.push(r.run.slice(5,10)+' '+j.seat+' '+x.link+' ['+x.kinds.join(',')+'] :: '+x.line.split('Your count: ')[1].slice(0,220));}}
console.log('verdicts read: '+verdicts+'; UNEXHIBITED premise segments: '+unexSegs+'; K-UNX items: '+out.length);console.log(out.join('\n'));fs.writeFileSync('pkgUNX/replay_UNX.txt','verdicts '+verdicts+'; segments '+unexSegs+'; items '+out.length+'\n'+out.join('\n')+'\n');
