const load=f=>{const c=require(f).nodes.find(n=>n.name==='Citation Scan').parameters.jsCode;const nx=c.indexOf('let F=null;try{if($(');return new Function(c.slice(0,nx)+';return {L2C,REFP};')();};
const O=load(process.argv[2]),Nn=load('./target.json');const d=require('./rounds.json');
let tags=0,diff=[];for(const r of d){const RA=[['DEFENDER','CR1',r.r1],['CHALLENGER','DR1',r.r1],['CHALLENGER','DR2',r.r2],['X','R3',r.r3]].filter(x=>x[2]);
 const a=O.L2C.tags(RA),b=Nn.L2C.tags(RA);tags+=a.length;a.forEach((x,k)=>{const y=b[k];if(JSON.stringify(x.verses)!==JSON.stringify(y.verses))diff.push(r.id.slice(0,8)+' '+x.round+' | '+x.seg.slice(0,70)+' | +'+y.verses.filter(v=>!x.verses.includes(v)).join(',')+' | lost '+x.verses.filter(v=>!y.verses.includes(v)).join(','));});}
console.log('debates',d.length,'tags',tags,'changed',diff.length);diff.forEach(x=>console.log(x));
const T=(s)=>JSON.stringify(Nn.L2C.tags([['C','DR2',s]]).map(x=>x.verses));
console.log('two books ch1:',T('[L4] Matthew 1:16 names her, and Luke 1:13 names John. The *dio kai* of 1:35 binds. [L2] *dio kai*.'));
console.log('booked:',T('[L4] Luke 1:24 says so; Luke 1:35 too. [L2] *dio kai*.'));
console.log('chapter not named:',T('[L4] Luke 1:24 says so; see 2:7 also. [L2] *dio kai*.'));
