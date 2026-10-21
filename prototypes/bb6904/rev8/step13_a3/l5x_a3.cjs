// Worker_A3 step 13: my L5 fixtures (rev12_a3, git 654727f) run through the fetched draft's own cure code, every node in the dir.
const fs=require('fs'),path=require('path');
const load=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('\nfunction cureCorrected');return new Function(s.slice(0,i)+'\n;return {cureVerdicts,cureRounds};')();};
const md=fs.readFileSync(path.join(__dirname,'../fold/report27613.md'),'utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const text1=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3])[0];
const cells=l=>l.replace(/^\| /,'').replace(/ \|$/,'').split(/ (?<!\\)\| /).map(c=>c.replace(/\\\|/g,'|'));
const back=s=>s.replace(/\| \(([CD]R[1-3])\) \|/g,'| [$1] |');
const rows=md.split('\n').filter(l=>/^\| Panel judge (Gemini|Grok) \| D\d vs C\d \| Pressing sentence \(K-G4\)/.test(l)).map(l=>{const c=cells(l);
 return {id:c[0].replace('Panel judge ','')+' '+c[1],x:{rule:'K-G4',side:'DEFENDER',link:c[1],line:c[4]},cure:c[5].replace(/ Not cured:.*$/,'').split(' / ').map(back)};});
const ADD={good:{'Gemini D3 vs C4':'SHORT: D3 vs C4 | [CR2] | "It marks **public reckoning**; it is not a retraction" | custom is not a denial, and the link stands on the speaking registers.',
 'Grok D5 vs C1':'SHORT: D5 vs C1 | [CR2] | "Held as written. And notice the actor at the end: **Joseph names the child**" | the verse times the union and Joseph acts as father.',
 'Grok D6 vs C1':'SHORT: D6 vs C1 | [CR2] | "Held as written. And notice the actor at the end: **Joseph names the child**" | the verse times the union and Joseph acts as father.'},
 bad1:{'Gemini D3 vs C4':'SHORT: D3 vs C4 | [CR2] | "It marks **private reckoning**; it is not a retraction" | one word changed.',
 'Grok D5 vs C1':'SHORT: D5 vs C1 | [CR3] | "Matthew 1:18\'s clause states the womb\'s consecration and states no exclusion." | a CR3 quote where only CR2 names 1:25.'}};
const dir=process.argv[2];
for(const mode of ['stored','good','bad1']){const tally={};
 for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){const F=load(path.join(dir,f));const R=F.cureRounds({messages:[{role:'user',content:text1}]});
  for(const r of rows){const extra=mode==='stored'?[]:(ADD[mode][r.id]?[ADD[mode][r.id]]:[]);const v=F.cureVerdicts([r.x],{ok:true,text:r.cure.concat(extra).join('\n')},{DEFENDER:[r.x.link]},R)[0];
   const k=r.id+' '+v.status;tally[k]=(tally[k]||0)+1;}}
 console.log('==',mode);for(const k of Object.keys(tally))console.log('  ',k,tally[k]+'/14');}
