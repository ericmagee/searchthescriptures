// ASK 322 item 9 gloss-fidelity line rev 2 (W3 draft 5ba4630d; W4 6726 placement): appended to GUARDHOLD in Init with Guards, so only the Oracle seat (R.gt present) receives it (Ruling 383). Built on the s209 fetchback. Only Init with Guards changes.
const fs=require('fs'),crypto=require('crypto');const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));
const n=W.nodes.find(x=>x.name==='Init with Guards');const c0=n.parameters.jsCode;if(c0.includes('[L2] FIDELITY'))throw new Error('already');
const O='and name a person as the verse names them (Isaiah 8:3 names \\"the prophetess\\").";';if(c0.split(O).length!==2)throw new Error('anchor');
const LINE='[L2] FIDELITY. An [L2] meaning is the lexicon gloss as served, in its own words, or a shortened run of them marked with "...". Add no word the gloss does not carry (rightly, truly, merely, only, really, or any judgment of your own). What a word "shows" in your case is [L4] and must be labeled [L4]. Where the gloss carries a sense against you (for nomizo, "suppose"), state it and answer it; do not drop it.';
const NW=O.slice(0,-2)+'\\n\\n'+LINE.replace(/"/g,'\\"')+'";';
const c1=c0.replace(O,()=>NW);n.parameters.jsCode=c1;fs.writeFileSync(fout,JSON.stringify(W));
const GH=new Function(c1.slice(c1.search(/const GUARDHOLD\s*=/),c1.indexOf('\n',c1.search(/const GUARDHOLD\s*=/)))+';return GUARDHOLD;')();
console.log('Init with Guards',c0.length,'->',c1.length,crypto.createHash('sha256').update(c1).digest('hex').slice(0,12));console.log('GUARDHOLD ends with:',JSON.stringify(GH.slice(-460)));console.log('line exact:',GH.endsWith('\n\n'+LINE));
