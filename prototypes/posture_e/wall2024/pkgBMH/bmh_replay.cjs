const fs=require('fs');
const get=(f,n)=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.nodes.find(x=>x.name===n).parameters.jsCode;};
const imp=s=>new Function(s.slice(s.indexOf('const IMP='),s.indexOf('const BAR='))+';return IMP;')();
const names=['C1B','C2B','C3B','C4B','D2B','D3B','D4B'].flatMap(p=>[p+' Build',p+' Extract']);
const rows=JSON.parse(fs.readFileSync('bmh_rounds.json','utf8'));
let tot={live:0,cand:0,lost:0,new:0};const NEW=[];
for(const n of names){
 const L=imp(get('/mnt/project-files/wall2024/fetchback_live_s179.json',n)),C=imp(get('/mnt/project-files/wall2024/parent_s179_BMH.json',n));
 for(const r of rows){const R={[r.k]:r.t};const a=L.harvest(R).map(h=>h.sentence),b=C.harvest(R).map(h=>h.sentence);
  const lost=a.filter(x=>!b.includes(x)),nw=b.filter(x=>!a.includes(x));
  if(n==='C2B Build'){tot.live+=a.length;tot.cand+=b.length;tot.new+=nw.length;nw.forEach(x=>NEW.push(r.id.slice(0,8)+' '+r.k+' | '+x));}
  tot.lost+=lost.length;}
}
console.log(JSON.stringify(tot));NEW.forEach(x=>console.log(x));
