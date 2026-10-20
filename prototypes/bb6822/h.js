const fs=require('fs');
const F={
 cr1:'1. **D1 — seed.** Footing: [L1] Romans 1:3 "made of the seed of David according to the flesh" + [L2] sperma.',
 gr1:'1. **C1.** [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost".',
 cr2:'x', gr2:'x',
 cr3:['# DEFENDER: LINK ROUND','## DECLARED CHAIN','**LINK 2 [premise 1]: SUPPORTED.**','Footing:','- [L1] The registers, quoted: "thy father and I have sought thee sorrowing" (Luke 2:48).',
      '- [L2] *nomizo*, "to deem or regard" (Luke 3:23).','**LINK 4: CONCEDED.**','- [L1] Romans 1:3 "made of the seed of David according to the flesh"',
      'LINK 5: SUPPORTED — Footing: [L1] the rows: Matthew 1:18 "before they came together she was found with child of the Holy Ghost"; 1:25 "knew her not till she had brought forth"','',
      '## CHALLENGER\'S UNSUPPORTED-L4 PREMISES','1. LINK 2: That x — "I rest the mother\'s flesh on" [L1] Luke 1:31 "thou shalt conceive in thy womb, and bring forth a son"'].join('\n'),
 dr3:['# CHALLENGER: LINK ROUND','## LINK 3: SUPPORTED','Footing: [L1], [L2].','- [L1] Luke 1:31, "thou shalt conceive in thy womb (*syllempse en gastri*)."',
      '- [L2] Luke 1:35: *dio kai*, "that holy thing which shall be born of thee"','## LINK 4: CONCEDED','- [L1] Luke 3:38 "which was the son of Adam, which was the son of God"',
      '## LINK 5: SUPPORTED','- [L1] Matthew 1:25: "knew her not (*ouk eginosken auten*) till she had brought forth her firstborn son."'].join('\n')};
function run(file){const code=fs.readFileSync(file,'utf8');
 const $=n=>({isExecuted:false,first:()=>({json:F})});
 return new Function('$',code)($)[0].json;}
const a=run('base/Citation_Scan.js'), b=run('Citation_Scan.new.js');
console.log('items base',a.items.length,'new',b.items.length,'url same',a.url_cited===b.url_cited);
let same=true;a.items.forEach((x,i)=>{const {link,load_bearing,...r}=b.items[i];if(JSON.stringify(r)!==JSON.stringify(x))same=false;});console.log('items equal except link/load_bearing:',same);
for(const i of b.items)console.log(i.side.padEnd(10),i.round,i.ref.padEnd(14),'link',String(i.link).padEnd(4),'LB',String(i.load_bearing).padEnd(5),JSON.stringify(i.quote.slice(0,50)));
fs.writeFileSync('cs_out.json',JSON.stringify(b));
