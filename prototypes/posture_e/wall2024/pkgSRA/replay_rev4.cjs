// pkgSRA rev 4 replay on run 36212's stored E-ANS items: old call vs new call of the live sraSame
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
const L=Lb.find(l=>l.includes('function sraSame('));const s0=L.indexOf('function sraSame(');const e0=L.indexOf('function olkOrder(');
const OLDF=process.argv[3];const sraSame=new Function((x=>x.slice(0,x.lastIndexOf('}')+1))(L.slice(s0,e0))+';return sraSame;')();
const Rr=JSON.parse(fs.readFileSync(process.argv[3]||'r36212.json','utf8'));const R={CR1:Rr.CR1,CR2:Rr.CR2,CR3:Rr.E3,CR4:Rr.CR4,DR1:Rr.DR1,DR2:Rr.DR2,DR3:Rr.CH3,DR4:Rr.DR4};
const P=JSON.parse(fs.readFileSync(process.argv[4]||'p36212.json','utf8'));
const q=(it,lab,end)=>{const re=new RegExp(lab+'[^\\n]*?: "([^]*?)"\\n'+end);const m=it.match(re);return m?m[1]:null;};
const unc=s=>s==null?null:s.replace(/ \[\.\.\.\]$/,'').replace(/ \.\.\.$/,'');
let ch0=0,ch1=0,n=0,same=0,diff=0,dropped=0,added=0,olds=0,rep=0;const out=[];
for(const p of P)for(const it of p.p.split('\nITEM ').slice(1)){if(!/^B\d+ \(E-ANS/.test(it)||!it.includes('LINES ELSEWHERE IN THE SAME ROUND'))continue;n++;
 const id=it.slice(0,it.indexOf(' '));const k0=(it.match(/LINES ELSEWHERE IN THE SAME ROUND \[([A-Z]{2}\d)\]/)||[])[1];
 const verse=(it.match(/\nPRESSED VERSE: ([^\n]*)/)||[])[1];const means=unc(q(it,'WHAT THE PRESS SAYS THE VERSE MEANS','THE ANSWER'));const ans=unc(q(it,'\\nTHE ANSWER','(?:THE ANSWER IN FULL|THE SIDE)'));
 const ol=unc(q(it,"THE SIDE'S OTHER LINES ON THIS VERSE",'THE SIDE'))||'';const eb=unc(q(it,'THE ANSWER IN FULL, FROM','THE SIDE'));
 const stored=unc(q(it,'LINES ELSEWHERE IN THE SAME ROUND','THE JUDGES'));
 const o=sraSame(R[k0],verse,means,ans,ol),nw=sraSame(R[k0],verse,means,ans,ol,eb||'');
 const ok=stored!=null&&o.replace(/\s+/g,' ').slice(0,300)===stored.replace(/\s+/g,' ').slice(0,300);if(ok)olds++;
 const ol_=o.split('\n'),nl=nw.split('\n');const NN=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const rp=ol_.filter(l=>eb&&NN(eb).includes(NN(l.replace(/ \.\.\.$/,'')))).length;rep+=rp;
 ch0+=o.length;ch1+=nw.length;if(o===nw)same++;else{diff++;const d=ol_.filter(x=>!nl.includes(x)),ad=nl.filter(x=>x&&!ol_.includes(x));dropped+=d.length;added+=ad.length;
  const bad=d.filter(l=>!(eb&&NN(eb).includes(NN(l.replace(/ \.\.\.$/,'')))));
  out.push(id+' ['+k0+'] dropped '+d.length+(bad.length?' (NOT IN ANSWER BLOCK: '+bad.length+')':'')+', new line in its place '+ad.length+(ad.length?': '+ad.map(x=>JSON.stringify(x.slice(0,90))).join(' | '):''));}
}
console.log('items',n,'old call reproduces stored section',olds+'/'+n,'| repeated lines in old output',rep);
console.log('unchanged',same,'changed',diff,'lines dropped',dropped,'lines added (next best line)',added);out.forEach(x=>console.log(' ',x));console.log('same-round text chars, old',ch0,'new',ch1,'change',ch1-ch0,'(before the 900 cut)');
