const fs=require('fs');const [,,nodeFile,exf]=process.argv;let c=fs.readFileSync(nodeFile,'utf8');
c=c.slice(0,c.indexOf("const PP=$('Panel Payloads')"));
const X=new Function('$','$execution',c+';return {cureVerdicts};')(()=>{throw new Error('no $')},{id:1});
const ex=JSON.parse(fs.readFileSync(exf,'utf8'));const rd=ex.data.resultData.runData;
const PP=rd['Panel Payloads'][0].data.main[0][0].json;const rs=[];
for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3'])(rd[n]||[]).forEach(r=>r.data.main[0].forEach(x=>rs.push(x.json)));
(PP.summary||[]).forEach((s,i)=>{const all=s.drv||[];if(!all.length)return;const r=rs.find(x=>x.cure&&x.cure.idx===i)||null;
 const v=X.cureVerdicts(all,r?r.reply:{ok:false,why:'none'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
 v.filter(x=>x.rule==='K-G4').forEach(x=>console.log(s.seat,x.link,x.status,'|',String(x.why).slice(0,150)));});
