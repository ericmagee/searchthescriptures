// pkgCLR measure: on every stored panel judgment since 10-28 (data/count_chunks.json: each CONCEDED LINKS chunk of verdict_raw), the
// reader's named counted entries against the line's own count, per side. Run from wall2024/: node pkgCLR/measure.cjs
const C=require('./clr.cjs');const fs=require('fs');const KS=(()=>{const s=fs.readFileSync('pkgKSCL/patched/Send_Back_Build.js','utf8');const i=s.indexOf('const KSC=(()=>{');return new Function(s.slice(i,s.indexOf('})();',i)+5)+';return KSC;')();})();
const X=require('./data/count_chunks.json');let tot=0,agree=0,old=0;const diff=[];
for(const v of X){const t=(v.chunks||[]).map(c=>String(c).replace(/\\n/g,'\n')).filter(c=>!/^\s*\[AUDIT/.test(c)).join('\n');
 for(const side of ['DEFENDER','CHALLENGER']){const r=C.read(t,side);if(!r||r.count==null||r.count===0)continue;tot++;if(r.agrees)agree++;
  const ol=KS.entries(r.line.replace(/^\s*\**\s*CHALLENGER /i,''))||[];if(new Set(ol.map(x=>x.kind+x.num)).size===r.count)old++;
  if(!r.agrees)diff.push(v.run.slice(5,10)+' '+v.seat.padEnd(8)+' '+side.slice(0,4)+' count '+r.count+' named '+r.named+' ['+r.counted.map(x=>x.ref+x.num).join(',')+'] | '+r.body.slice(0,170));}}
const o='nonzero count lines '+tot+': pkgCLR names exactly the count in '+agree+' ('+Math.round(100*agree/tot)+'%); the KSC line reader in '+old+' ('+Math.round(100*old/tot)+'%)\nDIFFER:\n'+diff.join('\n');
fs.writeFileSync('pkgCLR/measure_out.txt',o+'\n');console.log(o);
