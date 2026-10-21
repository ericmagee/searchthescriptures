// Worker_E step 12 negatives (C4 of FALSIFIERS_12.txt; C8 added after the first C3 run, see RUN_12.txt). Path: Grok D5 vs C1, pressed in
// [DR1], Matthew 1:25 named in [CR2]. Quotations are cut from the node's own parsed rounds, never typed.
const fs=require('fs'),path=require('path');
const load=f=>{const s=fs.readFileSync(f,'utf8');const i=s.indexOf('\nfunction cureCorrected');return new Function(s.slice(0,i)+'\n;return {cureVerdicts,cureRounds};')();};
const md=fs.readFileSync(path.join(__dirname,'../fold/report27613.md'),'utf8');const sent=md.slice(md.indexOf('## What the judges were sent'));
const text1=[...sent.matchAll(/### Text (\d+), md5 \w+\n\nSent to: ([^\n]*)[\s\S]*?\*\*user message\*\* \(\d+ characters\)\n\n```text\n([\s\S]*?)\n```/g)].map(m=>m[3])[0];
const LINE='D5 vs C1 (Matthew 1:25): DEFENDER LINK BROKEN -- (L1) "knew her not till she had brought forth her firstborn son" (Matthew 1:25); (L2) ginōskō (G1097); (L3) Genesis 4:1';
const x={rule:'K-G4',side:'DEFENDER',link:'D5 vs C1',line:LINE};
const dir=process.argv[2];let tot={},n=0;const inc=(k,c)=>{tot[k]=(tot[k]||0)+(c?1:0);};
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js')).sort()){n++;const F=load(path.join(dir,f));const R=F.cureRounds({messages:[{role:'user',content:text1}]});
 const di=R.DR1.indexOf('On the defender');const press=R.DR1.slice(di,di+95).replace(/\s+\S*$/,'');
 const ci=R.CR2.indexOf('Held as written');const ans=R.CR2.slice(ci,ci+70).replace(/\s+\S*$/,'');
 const w=ans.split(' ');w[2]=w[2]+'x';const changed=w.join(' ');
 const vi=R.CR2.indexOf('knew her not till');const verse=R.CR2.slice(vi,vi+40).replace(/\s+\S*$/,'');
 const d2=R.DR2.search(/1:25/);const d2q=R.DR2.slice(Math.max(0,d2-80),d2+5).replace(/^\S*\s+/,'');
 const V=(lines)=>F.cureVerdicts([x],{ok:true,text:lines.join('\n')},{DEFENDER:['D5 vs C1']},R)[0];
 const P='PRESSED: D5 vs C1 | [DR1] | "'+press+'"';
 inc('n0 press found, no SHORT: UNCURED',V([P]).status==='UNCURED');
 inc('n1 SHORT [CR2] quote not in CR2: UNCURED',V([P,'SHORT: D5 vs C1 | [CR2] | "the defender here concedes the whole point" | it does not answer the knowing-not witness at all'] ).status==='UNCURED');
 inc('n2 SHORT [CR2] real answer: CURED',V([P,'SHORT: D5 vs C1 | [CR2] | "'+ans+'" | the naming act does not answer the knowing-not order'] ).status==='CURED');
 inc('n3 SHORT [CR2] one word changed: UNCURED',V([P,'SHORT: D5 vs C1 | [CR2] | "'+changed+'" | the naming act does not answer the knowing-not order'] ).status==='UNCURED');
 inc('n4 pressed in [DR2]: CR2 not an answering round',(v=>!/\[CR2\]/.test(v.why||'')&&v.status==='CURED')(V(['PRESSED: D5 vs C1 | [DR2] | "'+d2q+'"'])));
 inc('n5 SHORT [CR2] quoting the verse words both sides quote: UNCURED',V([P,'SHORT: D5 vs C1 | [CR2] | "'+verse+'" | the verse itself is not an answer'] ).status==='UNCURED');
 inc('n6 SHORT [CR3] for a verse CR3 does not name: UNCURED',V([P,'SHORT: D5 vs C1 | [CR3] | "Matthew 1:18\'s clause states the womb\'s consecration and states no exclusion." | it names 1:18 only'] ).status==='UNCURED');
 if(n===1)console.log('  cut quotes: press="'+press+'" | ans="'+ans+'" | verse="'+verse+'" | dr2="'+d2q+'"');}
console.log(dir,'nodes',n,'|',Object.entries(tot).map(([k,v])=>k+' '+v+'/'+n).join(' | '));
