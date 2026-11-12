// node scan.cjs : old vs new grants list on the 81 stored runs of /mnt/project-files/w3/grade_WVR/corpus2.json (defender rounds cr2-cr4)
const fs=require('fs');
const ogr=f=>{const c=JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='C4 Build').parameters.jsCode;const i=c.indexOf('const OGR=');const e=c.indexOf('})();',i)+5;return new Function(c.slice(i,e)+';return OGR;')();};
const A=ogr('/mnt/project-files/wall2024/fetchback_live_s160.json'),B=ogr('/mnt/project-files/wall2024/parent_s160_GAV2.json');
const rows=require('/mnt/project-files/w3/grade_WVR/corpus2.json');let same=0,diff=0,add=0,lost=0,dsize=0;
for(const F of rows){const R={CR2:F.cr2,CR3:F.cr3,CR4:F.cr4};const a=A.harvest(R),b=B.harvest(R);const ka=new Set(a.map(x=>x.text)),kb=new Set(b.map(x=>x.text));
 const plus=b.filter(x=>!ka.has(x.text)),minus=a.filter(x=>!kb.has(x.text));dsize+=B.block(b).length-A.block(a).length;
 if(!plus.length&&!minus.length&&B.block(b)===A.block(a)){same++;continue;}diff++;add+=plus.length;lost+=minus.length;
 console.log(F.run,'+'+plus.length,'-'+minus.length);for(const x of plus)console.log('  + ['+x.round+'] '+x.text);for(const x of minus)console.log('  - ['+x.round+'] '+x.text);}
console.log('runs',rows.length,'block equal',same,'changed',diff,'grants added',add,'lost',lost,'block chars change',dsize);
