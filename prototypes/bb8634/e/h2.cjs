const fs=require('fs');
const rows={'30091':JSON.parse(fs.readFileSync('row_49774304-6140-4ac7-953d-e0577caf83a9.json'))[0],'runB':JSON.parse(fs.readFileSync('row_d1c76ad8-c1da-4790-ad19-9e62d6ea9f5d.json'))[0]};
const F=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3});
const s=fs.readFileSync('new/Panel_Build.js','utf8');const a=s.indexOf('const PWL=(()=>{');const b=s.indexOf('})();',s.indexOf('return {ledger',a))+5;
const src=s.slice(a,b).replace('const PWL=','').replace('return {ledger,','return {namedIn,isNamed,ledger,');const P=eval(src);
for(const [rk,r] of Object.entries(rows)){const f=F(r);const blk=P.judgeBlock(f);
 const line=k=>blk.split('\n').find(x=>x.startsWith(k));
 const parse=l=>(l.split('): ')[1]||'').split(', ').filter(x=>x&&x!=='none').map(x=>{const m=x.match(/^(.*) \[(..\d)\]$/);return {label:m[1],round:m[2]};});
 const ch=parse(line('BY THE CHALLENGER')), de=parse(line('BY THE DEFENDER'));
 // unanswered: not named in the other side's later rounds
 const later={'DR1':[f.cr2,f.cr3],'DR2':[f.cr3],'CR1':[f.gr1,f.gr2,f.dr3],'CR2':[f.gr2,f.dr3],'CR3':[f.dr3]};
 const un=list=>list.filter(x=>{const N=P.namedIn(later[x.round].join('\n'));const bk=x.label.replace(/ \d+:.*/,'');const cv=x.label.replace(/^.* (\d+:\d+).*/,'$1');return !P.isNamed(N,bk,cv);});
 const cu=un(ch), du=un(de);
 console.log(rk,'challenger unlisted',ch.length,'-> unlisted AND not named later by the defender',cu.length,':',cu.map(x=>x.label+' '+x.round).join(', '));
 console.log(rk,'defender unlisted',de.length,'-> unlisted AND not named later by the challenger',du.length,':',du.map(x=>x.label+' '+x.round).join(', '));}
