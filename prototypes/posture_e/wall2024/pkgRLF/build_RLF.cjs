// pkgRLF (W2): Close Enforcer Record reads a round label written as "round N" (any case, with or without brackets, e.g. "[round 4]", "Round 2")
// as that line's own side's round N ([CR N] for DEFENDER, [DR N] for CHALLENGER), and "[CR 4]" as [CR4]. Code only; no prompt text.
// Usage (from wall2024/): node pkgRLF/build_RLF.cjs <fetchback> <out write file>
const fs=require('fs');const [,,FB,OUT]=process.argv;const d=JSON.parse(fs.readFileSync(FB,'utf8'));let w=d.data||d;w=w.workflow||w;
const n=w.nodes.find(x=>x.name==='Close Enforcer Record');let c=n.parameters.jsCode;const c0=c;
const rep=(a,b)=>{if(c.split(a).length!==2)throw new Error('anchor not found once: '+a.slice(0,80));c=c.replace(a,()=>b);};
// 1. the line pattern: each round label may be [CR4] / CR4 / [CR 4] or "round 4" / [round 4] / [Round 4]
rep(String.raw`EARLIER\s*\[?\s*([CD]R\d)\s*\]?`,String.raw`EARLIER\s*\[?\s*([CD]R\s?\d|ROUND\s*\d)\s*\]?`);
rep(String.raw`CLOSING\s*\[?\s*([CD]R\d)\s*\]?`,String.raw`CLOSING\s*\[?\s*([CD]R\s?\d|ROUND\s*\d)\s*\]?`);
// 2. the label read: "round N" becomes the line's own side's round N (pkgRLF, W4 Wall 4107: DeepSeek wrote [round 4] for [CR4] in 2 of 13 replies)
rep(String.raw`earlier_round:m[5].toUpperCase(),`,String.raw`earlier_round:cecRL(m[5],P),`);
rep(String.raw`closing_round:m[7].toUpperCase(),`,String.raw`closing_round:cecRL(m[7],P),`);
rep(String.raw`const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};`,String.raw`const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};const cecRL=(s,P)=>{s=String(s).toUpperCase().replace(/\s+/g,'');return s.startsWith('ROUND')?P+s.slice(5):s;}; /* pkgRLF: "round N" is the line's own side's round N */`);
n.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(d));
console.log('Close Enforcer Record',c0.length,'->',c.length,'(+'+(c.length-c0.length)+')');
