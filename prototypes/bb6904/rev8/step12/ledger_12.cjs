// Worker_E step 12 ledger test (L1-L5 of FALSIFIERS_12b.txt, git 8ad5c4e). PWL runs from each judge node's own source (from "const PWL=" to
// "const LEDGER="). Rounds: the fold node's own cureRounds over Text 1 of the run 27613 report.
const fs=require('fs'),path=require('path');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j);};
const pwl=f=>new Function(cut(fs.readFileSync(f,'utf8'),'const PWL=','const LEDGER=')+'\n;return PWL;')();
const cf=fs.readFileSync(path.join(__dirname,'base/Cure_Check.js'),'utf8');const cureRounds=new Function(cut(cf,'function cureRounds','// The rounds that press')+'\n;return cureRounds;')();
const md=fs.readFileSync(path.join(__dirname,'../fold/report27613.md'),'utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const text1=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3])[0];
const R=cureRounds({messages:[{role:'user',content:text1}]});const F={cr1:R.CR1,gr1:R.DR1,cr2:R.CR2,gr2:R.DR2,cr3:R.CR3,dr3:R.DR3};
const L=dir=>{const o={};for(const f of ['Build_Independent_Verdict.js','Panel_Build.js'])o[f]=pwl(path.join(dir,f));return o;};
const B=L('base'),N=L(process.argv[2]||'newb');
const line=(blk,who)=>blk.split('\n').find(l=>l.startsWith('cited in '+(who==='d'?'[DR1]':'[CR1]')))||'';
const list=l=>(l.split('): ')[1]||'').split(', ').filter(x=>x&&x!=='none');
for(const f of Object.keys(N)){const bb=B[f].judgeBlock(F),nb=N[f].judgeBlock(F);
 const bd=list(line(bb,'d')),nd=list(line(nb,'d')),bc=list(line(bb,'c')),nc=list(line(nb,"c"));
 const has=(a,x)=>a.includes(x);
 // a verse listed on base that is no longer listed must be named in a later round (CR2 for the defender, DR2 for the challenger)
 const droppedD=bd.filter(x=>!nd.includes(x)),droppedC=bc.filter(x=>!nc.includes(x)),addedD=nd.filter(x=>!bd.includes(x)),addedC=nc.filter(x=>!bc.includes(x));
 console.log(f);
 console.log('  L1 defender: Luke 3:23 listed new',has(nd,'Luke 3:23'),'| Matthew 1:25 listed new',has(nd,'Matthew 1:25'),'| Genesis 4:1 listed new',has(nd,'Genesis 4:1'));
 console.log('  L3 base lists Luke 3:23',has(bd,'Luke 3:23'),'| base defender count',bd.length,'new',nd.length,'| added (must be none):',addedD.join(', ')||'none');
 console.log('  dropped from defender list:',droppedD.join(', ')||'none');
 console.log('  L2 challenger: base',bc.length,'new',nc.length,'| added (must be none):',addedC.join(', ')||'none','| dropped:',droppedC.join(', ')||'none');
 console.log('  header line new: '+line(nb,'d').slice(0,140));}
const a=N['Build_Independent_Verdict.js'].judgeBlock(F),b=N['Panel_Build.js'].judgeBlock(F);console.log('L4 both nodes same ledger text:',a===b,'| L5 prose names later rounds:',/no later round of the side that holds the link names/.test(a));
// Every verse dropped is dropped only because the later round names it: blank the round 2 of the answering side and the list returns to base.
for(const f of Object.keys(N)){const d0=list(line(N[f].judgeBlock({...F,cr2:''}),'d')),b0=list(line(B[f].judgeBlock({...F,cr2:''}),'d'));
 const c0=list(line(N[f].judgeBlock({...F,gr2:''}),'c')),cb0=list(line(B[f].judgeBlock({...F,gr2:''}),'c'));
 console.log(f,'| defender list with CR2 blanked equals base:',JSON.stringify(d0)===JSON.stringify(b0),'| challenger list with DR2 blanked equals base:',JSON.stringify(c0)===JSON.stringify(cb0));}
