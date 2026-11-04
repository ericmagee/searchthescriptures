const fs=require('fs');const c=fs.readFileSync(__dirname+'/new/Quote Compare.js','utf8');
const a=c.indexOf('const HYPHEN_JOIN');const b=c.indexOf('const idx=');const lib=c.slice(a,b);
const f=new Function(lib+';return {inMargin,contig};')();
const g4626="All the souls that came with Jacob into Egypt, which came out of his loins, besides Jacob's sons' wives, all the souls [were] threescore and six; [loins: Heb. thigh]";
const i714="Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel. [shall call: or, thou, O virgin, shalt call]";
for(const [q,v,want] of [['loins: Heb. thigh',g4626,true],['Heb. thigh',g4626,true],['loins: Gr. foot',g4626,false],['thou, O virgin, shalt call',i714,true],['shall call: or, thou, O virgin, shalt call',i714,true],['a virgin shall bear twins',i714,false]])
 console.log(f.inMargin({quote:q},v)===want?'OK  ':'FAIL',JSON.stringify(q),'->',f.inMargin({quote:q},v));
