// W1 pkgOWR scan: what the own-record block would list for each stored run, both sides. usage: node scan.cjs <live json>
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const l=L(process.argv[2]);
const c=l.code('C4 Build');const a=c.indexOf('const OGR=(()=>{'),b=c.indexOf('\nconst L2C=',a);const OGR=new Function(c.slice(a,b)+';return OGR;')();
const MK=/^(?:LINK\s+|[DC])(\d+)\s*(?:\[[^\]\n]*\]|\([^)\n]*\))?\s*:\s*(NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b/i;
const st=x=>String(x).replace(/[*_`]+/g,'').replace(/^[\s>#-]+/,'').trim();
function marks(R){const out=[];for(const [rk,t] of R)for(const ln of String(t||'').split('\n')){const s=st(ln);if(MK.test(s))out.push('['+rk+'] '+s.slice(0,260));}return out;}
const runs=fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f));let tot=0,n=0;
for(const f of runs){let d;try{d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));}catch(e){console.log(f,'unreadable');continue;}const rd=d.data.resultData.runData;
 const raw=k=>{try{return rd[k][0].data.main[0][0].json.raw||'';}catch(e){return '';}};
 const D=[['CR1',raw('D1 Extract')],['CR2',raw('D2B Extract')],['CR3',raw('D3B Extract')]],C=[['DR1',raw('C1B Extract')],['DR2',raw('C2B Extract')],['DR3',raw('C3B Extract')]];
 for(const [sd,R] of [['DEFENDER',D],['CHALLENGER',C]]){const m=marks(R);const g=OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]}).map(x=>'['+R[+x.round.slice(2)-1][0]+'] "'+x.text+'"');
  const len=m.join('\n').length+g.join('\n').length;tot+=len;n++;console.log(f.slice(2,7),sd,'marks',m.length,'grants',g.length,'chars',len);m.concat(g).forEach(x=>console.log('   ',x.slice(0,200)));}}
console.log('total',tot,'requests',n);
