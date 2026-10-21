// Worker_E step 10 harness (BB-7357), falsifiers F1-F5, F7 of FALSIFIERS_FOLD.txt (git 84fe377). cureRounds, cureQ, cureFound run from each node's own source.
// Rounds: parsed by the node's own cureRounds from the sent Text 1 of the run 27613 Drive report (md5 83fe27dd). Quotations: the report's own rows, as printed.
const fs=require('fs'),path=require('path');
const cut=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw new Error('anchor '+a);return s.slice(i,j);};
const load=f=>{const s=fs.readFileSync(f,'utf8');return new Function(cut(s,'function cureRounds','// The rounds that press')+cut(s,'const cureQ=','const CURE_KEY=')+';return {cureRounds,cureQ,cureFound};')();};
const md=fs.readFileSync('report27613.md','utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const texts=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3]);
const rows=md.split('\n').filter(l=>/^\| .*\| \*\*UNCURED\*\* \|/.test(l)&&l.includes('no quotation found in the named round'));
const qs=[];for(const row of rows){const judge=row.split(' | ')[0].replace(/^\| /,''),item=row.split(' | ')[1];
 for(const m of row.matchAll(/PRESSED: (D\d+ vs C\d+) \\?\| \(([CD]R[1-3])\) \\?\| "(.*?)"(?= \/ | Not cured| \|)/g))qs.push({id:judge+' '+item,round:m[2],q:m[3].replace(/\\\|/g,'|')});}
const bold=(md.split('\n').find(l=>l.includes('SEAT: gemini')||(/Panel judge Gemini \| D5 vs C1/.test(l)))||'');
const gq=(bold.match(/PRESSED: D5 vs C1 \\?\| \(DR1\) \\?\| "(.*?)"(?= \/ | Not cured| \|)/)||[])[1];
let out=[];
for(const dir of process.argv.slice(2)){let t={F1:0,F1n:0,F2:0,F3:0,F4:0,F5:0,n:0};
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){t.n++;const F=load(path.join(dir,f));const R=F.cureRounds({messages:[{role:'user',content:texts[0]}]});
  for(const x of qs){const hit=F.cureFound(x.q,R[x.round]);if(/D6 vs C6/.test(x.id)){if(!hit)t.F2++;}else{t.F1n++;if(hit)t.F1++;}}
  if(gq&&F.cureFound(gq.replace(/\((L[1-4]|[CD]R[1-3])\)/g,"[$1]"),R.DR1))t.F3++; // F3: labels restored to the judge's own [..] form (the report prints [ as ( ), so the bold case is tested alone
  // F4: a DR1 passage that carries [L1], quoted with the label removed; F5: the same passage, one word changed.
  const i=R.DR1.indexOf(' [L1] ');const pass=R.DR1.slice(i-70,i+90);const noLab=R.DR1.slice(i-70,i)+' '+R.DR1.slice(i+6,i+90);const w=pass.split(' ');w[3]=w[3]+'x';
  if(F.cureFound(pass,R.DR1)&&!F.cureFound(noLab,R.DR1))t.F4++; // the passage with its mid-text [L1] is found; the same passage with [L1] dropped is refused
  if(!F.cureFound(w.join(' '),R.DR1))t.F5++;}
 console.log(dir,'nodes',t.n,'| quotes',qs.length,'| F1 found',t.F1+'/'+t.F1n,'| F2 7th refused',t.F2,'| F3 bold found',t.F3,'| F4 label-dropped refused',t.F4,'| F5 one word refused',t.F5);}
