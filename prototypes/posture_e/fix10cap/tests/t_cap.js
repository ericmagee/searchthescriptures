const fs=require('fs');const S=process.argv[2],file=process.argv[3];
const L0=fs.readFileSync(file,'utf8').split('\n');const ln=(a,b)=>L0.slice(a-1,b).join('\n');
const find=(re,from)=>{for(let i=(from||1)-1;i<L0.length;i++)if(re.test(L0[i]))return i+1;throw new Error('anchor '+re);};
const libEnd=find(/end judge_fix9 libraries/),rA=find(/^const REFP=/),rB=find(/\}\)\(\);$/,rA),ci=find(/^const ciKeys=/),pA=find(/^const PW_CAP=/),pB=find(/^const PW_SEG=/);
const code=ln(1,libEnd)+'\n'+ln(rA,rB)+'\n'+ln(ci,ci)+'\n'+ln(pA,pB-1)+'\nreturn {pwList};';
const L=new Function('$',code)(()=>{throw new Error('no $')});
const d=JSON.parse(fs.readFileSync(S+'/row.json','utf8'))[0];
const R={CR1:d.claude_r1,DR1:d.engine_r1,CR2:d.claude_r2,DR2:d.engine_r2,CR3:d.engine_r3,DR3:d.challenger_r3,CR4:d.defender_r4,DR4:d.challenger_r4};
let fail=0;
for(const side of ['DEFENDER','CHALLENGER']){for(const p of (L.pwList(R,side)||[])){console.log(side,'premise',p.n,'| counted',p.all.size,'| over',JSON.stringify(p.over),'| witnesses',p.keys.size);if(p.over.length)fail++;}}
const D=L.pwList(R,'DEFENDER');
const must=['1 Chronicles 28:6','Acts 13:33','Luke 1:32'];const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9:]/g,'');
const p3=[...D[2].all].map(norm);const miss=must.filter(m=>!p3.some(k=>k.includes(norm(m).replace(/^(\d?[a-z]+)/,'$1'))));
console.log('premise 3 counted:',JSON.stringify([...D[2].all]));
if(D[2].all.size!==8){fail++;console.log('premise 3 counted',D[2].all.size,'not 8');}
if(D[0].all.size!==8){fail++;console.log('premise 1 counted',D[0].all.size,'not 8');}
if(miss.length){fail++;console.log('missing from premise 3:',miss.join(', '));}
console.log(fail?'FAIL ('+fail+')':'PASS');
