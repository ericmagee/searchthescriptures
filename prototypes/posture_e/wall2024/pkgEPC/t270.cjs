const load=f=>{const c=require(f).nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;
 const a=c.indexOf('const REFP=');let depth=0,i=a,end=-1;// take from 0 to the end of REFP IIFE: find "})();" after a at top-level by scanning for '\n' + 'const ' after a
 const nx=c.indexOf('let F=null;try{if($(',a);const body=c.slice(0,nx);return new Function(body+';return {L2C,REFP};')();};
const O=load('../k3/live.json'),Nn=load('./target.json');const d=require('./rounds.json');
let tags=0,diff=[];for(const r of d){const RA=[['DEFENDER','CR1',r.r1],['CHALLENGER','DR1',r.r1],['CHALLENGER','DR2',r.r2],['X','R3',r.r3]].filter(x=>x[2]);
 const a=O.L2C.tags(RA),b=Nn.L2C.tags(RA);tags+=a.length;a.forEach((x,k)=>{const y=b[k];if(JSON.stringify(x.verses)!==JSON.stringify(y.verses))diff.push(r.id.slice(0,8)+' '+x.round+' | '+x.seg.slice(0,90)+' | '+x.verses.join(',')+' => +'+y.verses.filter(v=>!x.verses.includes(v)).join(','));});}
console.log('tags',tags,'changed',diff.length);diff.forEach(x=>console.log(x));
const t='### X\n\n**[L1]** Luke 1:32: "He shall be great"\n\n**[L2]** The *dio kai* ("therefore") in v.35 binds.\n\n**[L3]** Psalms 2:7: "Thou art my Son"\n';
console.log('v.N:',JSON.stringify(Nn.L2C.tags([['C','DR3',t]]).map(x=>x.verses)));
const t2='### X\n\n**[L1]** Luke 1:32: "He shall be great" and John 3:16 "so loved"\n\n**[L2]** The *dio kai* in verse 35 binds.\n';
console.log('two chapters:',JSON.stringify(Nn.L2C.tags([['C','DR3',t2]]).map(x=>x.verses)));
