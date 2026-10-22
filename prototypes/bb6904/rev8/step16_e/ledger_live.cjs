// Worker_E step 16: recompute the ledger from the published node's own code (step12/fetched) over the rounds the judges were sent
// (Texts 1 and 2 of the run 27665 Drive report; ledger lines read from the whole section, system and user messages, parsed by the node's own cureRounds) and compare with the ledger lines in the sent prompts.
const fs=require('fs'),path=require('path');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j);};
const S='../step12/fetched/';const pwl=f=>new Function(cut(fs.readFileSync(S+f,'utf8'),'const PWL=','const LEDGER=')+'\n;return PWL;')();
const cureRounds=new Function(cut(fs.readFileSync(S+'Cure_Check.js','utf8'),'function cureRounds','// The rounds that press')+'\n;return cureRounds;')();
const md=fs.readFileSync('report27665.md','utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const texts=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>({n:m[1],to:m[2],t:m[3],all:m[0]}));
console.log('texts',texts.length,texts.map(x=>x.n+': '+x.to.slice(0,60)).join(' | '));
for(const x of texts){const R=cureRounds({messages:[{role:'user',content:x.t}]});if(!R.CR3)continue;const F={cr1:R.CR1,gr1:R.DR1,cr2:R.CR2,gr2:R.DR2,cr3:R.CR3,dr3:R.DR3};
 for(const f of ['Panel_Build.js','Build_Independent_Verdict.js']){const blk=pwl(f).judgeBlock(F).split('\n').filter(l=>l.startsWith('cited in '));
  const sentL=x.all.split('\n').filter(l=>l.startsWith('cited in '));console.log('Text',x.n,f,'recomputed lines',blk.length,'| sent lines',sentL.length,'| equal:',blk.every(l=>sentL.includes(l)));}}
