// pkgMNP scan: every raise per run and judge (rounds from the judge's prompt, judge text from Panel Cure Check). Run from wall2024/.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const sb=rd('pkgUNA/patched/Send_Back_Build.js');const i=sb.indexOf('const REFP=');const refp=sb.slice(i,sb.indexOf('})();',i)+5);
const ui=sb.indexOf('const UND=(()=>{');const ue=sb.indexOf('})();',sb.indexOf('return {rounds,pressed',ui))+5;const RO=new Function(sb.slice(ui,ue)+'\nreturn UND.rounds;')();
const MNP=new Function(refp+'\n'+rd('pkgMNP/src_MNP.js')+'\nreturn MNP;')();
const I=(run,n)=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;const r=JSON.parse(rd(f))[0];return ((r.main||(r.data&&r.data.main))[0]).map(x=>x.json);};
module.exports={MNP,RO,I};
if(require.main===module)for(const run of process.argv.slice(2)){const PB=JSON.parse(rd('corpus/raw/gate_'+run+'.json'))['Panel Build'].slice(-1)[0][0];console.log('== '+run);
 for(const b of I(run,'Panel_Cure_Check')[0].bodies){const p=(typeof b==='string'?JSON.parse(b):b).payload;const J=PB.judges.find(q=>q.seat===p.judge_seat);if(!J){console.log('  '+p.judge_seat+': no prompt');continue;}
  const pt=J.body.messages.map(m=>typeof m.content==='string'?m.content:(m.content||[]).map(c=>c&&c.text||'').join('\n')).join('\n');const R=RO(pt);
  const t=String(p.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"').split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');const cl=MNP.claims(t);const r=MNP.check(t,R);
  console.log('  '+p.judge_seat.padEnd(8)+' no-MEANS claims '+cl.length+' ['+cl.map(c=>c.ref+' ['+c.round+']').join('; ')+'] raised '+r.length);for(const x of r)console.log('     RAISE '+x.why.slice(0,330));}}
