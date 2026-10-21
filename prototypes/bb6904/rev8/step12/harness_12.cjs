// Worker_E step 12 harness (BB-6904 rev 12), falsifiers C2-C4, C6 of FALSIFIERS_12.txt (git b4692b9). cureRounds, cureVerdicts and their
// helpers run from each node's own source (cut at "function cureCorrected"). Rounds: the node's own cureRounds over Text 1 of the run 27613
// Drive report (fold/report27613.md, md5 83fe27dd). Cure replies: that report's own cure statements and judge statements, round marks ( ) read
// back as [ ] (the report prints [ as ( )).
const fs=require('fs'),path=require('path');
const load=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('\nfunction cureCorrected');if(i<0)throw new Error('cut '+f);return new Function(s.slice(0,i)+'\n;return {cureVerdicts,cureRounds,cureLines};')();};
const md=fs.readFileSync(path.join(__dirname,'../fold/report27613.md'),'utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const text1=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3])[0];
const cells=l=>l.replace(/^\| /,'').replace(/ \|$/,'').split(/ (?<!\\)\| /).map(c=>c.replace(/\\\|/g,'|'));
const back=s=>s.replace(/\| \(([CD]R[1-3])\) \|/g,'| [$1] |');
const rows=md.split('\n').filter(l=>/^\| Panel judge (Gemini|Grok) \| D\d vs C\d \| Pressing sentence \(K-G4\)/.test(l)).map(l=>{const c=cells(l);
 const cure=c[5].replace(/ Not cured:.*$/,'').split(' / ').map(back);const own=c[6]==='none written'?[]:['STATEMENT: K-G4 '+c[1]+' | '+back(c[6])];
 return {id:c[0].replace('Panel judge ','')+' '+c[1],x:{rule:'K-G4',side:'DEFENDER',link:c[1],line:c[4]},reply:cure.concat(own).join('\n'),cure};});
const WANT={'Gemini D3 vs C4':'UNCURED','Grok D5 vs C1':'UNCURED','Grok D6 vs C1':'UNCURED','Gemini D5 vs C1':'CURED'};
const run=(F,r,reply)=>F.cureVerdicts([r.x],{ok:true,text:reply},{DEFENDER:[r.x.link]},F.cureRounds({messages:[{role:'user',content:text1}]}))[0];
const mode=process.argv[2];const dirs=process.argv.slice(3);
for(const dir of dirs){let pass=0,n=0,lines=[];
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')&&!/Build_Independent|Panel_Build\.js/.test(x)).sort()){const F=load(path.join(dir,f));
  for(const r of rows){n++;const v=run(F,r,mode==='nostmt'?r.cure.join('\n'):r.reply);const ok=v.status===WANT[r.id];if(ok)pass++;if(f==='Cure_Check.js')lines.push(r.id+' -> '+v.status+' | '+v.why);}}
 console.log(dir,'mode',mode,'| expected status',pass+'/'+n);lines.forEach(l=>console.log('  Cure_Check '+l));}
