const L=require(__dirname+'/lib.cjs');const o=L('/mnt/project-files/wall2024/fetchback_live_s183.json'),n=L('/mnt/project-files/w1/pkgCGR/parent_s183_CGR2.json');
const rows=require('/mnt/project-files/w2_grades/cgr/ks3_kcon_rows.json');
const KN={old:o.fns.krulNorm,new:n.fns.krulNorm};
// K-S3 primary quote test (library line 1205), as written
const ks3=(K,line,rp)=>{const fl=String(line||'').replace(/^\s*\w+\s+[CD]R\d+\s*:\s*/i,''),fq=fl.match(/^\s*"(.*?)"\s*--/),fw=K(fq?fq[1]:fl).split(' ').filter(Boolean),fn=Math.min(6,fw.length),RN=' '+K(rp)+' ';let q=false;for(let i=0;fn&&i+fn<=fw.length&&!q;i++)q=RN.includes(' '+fw.slice(i,i+fn).join(' ')+' ');return q;};
let s3={n:0,nh:0,ch:[]};
for(const r of rows.filter(r=>r.rule==='K-S3')){s3.n++;const rp=String(r.rl||'');const mn=rp.match(/^\s*NOT\s+HELD\b\s*(?:as\b[^:]*)?:?\s*(.*)$/i);const a=ks3(KN.old,r.fl,rp),b=ks3(KN.new,r.fl,rp);if(mn&&mn[1].split(/\s+/).filter(Boolean).length>=5)s3.nh++;if(a!==b)s3.ch.push({id:r.id,old:a,new:b,nh:!!(mn&&mn[1].split(/\s+/).filter(Boolean).length>=5),cs:r.cs,cr:r.cr,fl:String(r.fl).slice(0,160),rl:rp.slice(0,200)});}
console.log('K-S3 rows',s3.n,'| NOT HELD with reason',s3.nh,'| primary quote test changes',s3.ch.length);s3.ch.forEach(x=>console.log(' ',JSON.stringify(x)));
// K-CON (lines 655-657) with the line's own quotes (nhqFull not loaded: fallback quotes not replayed)
let kc={n:0,ch:[]};
const kcon=(K,lib,line,reply)=>{const T=lib.fns.krulText(reply).T;const qs=[...String(line||'').matchAll(/"([^"]{12,})"/g)].map(m=>m[1]);const runs=[];for(const q of qs){const w=K(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));}
 return !!String(T||'').split('\n').find(l0=>{const l=lib.fns.kconUnlabel(l0);return /^\s*(?:[-•*]\s*)?\**(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+K(l)+' ').includes(' '+r+' '));});};
for(const r of rows.filter(r=>r.rule==='K-CON')){kc.n++;if(!r.fr)continue;let a,b;try{a=kcon(KN.old,o,r.fl,r.fr);b=kcon(KN.new,n,r.fl,r.fr);}catch(e){console.log('K-CON err',r.id,e.message);continue;}if(a!==b)kc.ch.push({id:r.id,old:a,new:b,cs:r.cs});}
console.log('K-CON rows',kc.n,'| with reply',rows.filter(r=>r.rule==='K-CON'&&r.fr).length,'| capture changes',kc.ch.length,JSON.stringify(kc.ch));
