const fs=require('fs');const S=process.argv[2],file=process.argv[3],want=process.argv[4];
const L0=fs.readFileSync(file,'utf8').split('\n');const ln=(a,b)=>L0.slice(a-1,b).join('\n');
const find=(re,from)=>{for(let i=(from||1)-1;i<L0.length;i++)if(re.test(L0[i]))return i+1;throw new Error('anchor '+re);};
const libEnd=find(/end judge_fix9 libraries/),rA=find(/^const REFP=/),rB=find(/\}\)\(\);$/,rA),ci=find(/^const ciKeys=/),pA=find(/^const PW_CAP=/),pB=find(/^const PW_SEG=/);
const L=new Function('$',ln(1,libEnd)+'\n'+ln(rA,rB)+'\n'+ln(ci,ci)+'\n'+ln(pA,pB-1)+'\nreturn {pwList,PW_ROUND};')(()=>{throw 0});
const d=JSON.parse(fs.readFileSync(S+'/row.json','utf8'))[0];
const R={CR1:d.claude_r1,DR1:d.engine_r1,CR2:d.claude_r2,DR2:d.engine_r2,CR3:d.engine_r3,DR3:d.challenger_r3,CR4:d.defender_r4,DR4:d.challenger_r4};
console.log('PW_ROUND',JSON.stringify(L.PW_ROUND));
for(const p of L.pwList(R,want)){console.log('=== '+want+' premise '+p.n+' counted '+p.all.size+': '+JSON.stringify([...p.all]));console.log(p.seg.slice(0,3000));}
