// W2 item 5d: measure pkgBRF rev 5 limits on live s119 over every stored F.
// (1) book-check line length and verse count; (2) listed earlier verses whose only earlier naming had a borrowed book (r.book null).
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const W=g('/mnt/project-files/wall2024/fetchback_live_s119.json');
const c=W.nodes.find(x=>x.name==='C4 Build').parameters.jsCode;const k=c.indexOf('const REFP=');const e=c.indexOf('})();',c.indexOf('const C4P='))+5;
const [REFP,C4P]=new Function(c.slice(k,e)+'\nreturn [REFP,C4P];')();
const Fs=[];const walk=(v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if((typeof v.dr4==='string'||typeof v.cr4==='string')&&typeof v.gr1==='string')Fs.push(v);for(const k in v)walk(v[k],d+1);};
const seen=new Set();let n=0,lines=0,maxL=0,maxV=0,borrowed=0;const ex=process.argv[2]||'33149 33371 33490 33497 34299 34626 34703 34726 34780';
const origin=(texts)=>{const M={};texts.forEach((t,ti)=>{for(const r of REFP.parse(t,{scoped:true})){const b=r.book||r.ctx;if(!b)continue;for(let v=r.v1;v<=Math.min(r.v2,r.v1+30);v++){const key=b+' '+r.c+':'+v;(M[key]=M[key]||[]).push({own:!!r.book,round:ti,txt:String(t).slice(Math.max(0,r.at-60),r.end+10).replace(/\s+/g,' ')});}}});return M;};
for(const id of ex.split(' ')){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+id+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;Fs.length=0;for(const kk in rd)walk(rd[kk],0);
 for(const F of Fs){const key=id+'|'+(F.dr4||'').length+'|'+(F.cr4||'').length;if(seen.has(key))continue;seen.add(key);n++;
  for(const [side,txt,earlier] of [['DR4',C4P.note(F),[F.gr1,F.gr2,F.dr3]],['CR4',C4P.noteD(F),[F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3]]]){
   const m=txt.match(/\[CLOSE-ROUND BOOK CHECK.*?read the sentence for its book\.\]/);if(!m)continue;lines++;maxL=Math.max(maxL,m[0].length);
   const listed=[...m[0].matchAll(/\(([^()]*) named earlier\)/g)].flatMap(z=>z[1].split(', '));maxV=Math.max(maxV,listed.length);
   console.log(id,side,'len',m[0].length,'verses',listed.length,'|',m[0]);
   const O=origin(earlier);for(const v of listed){const o=O[v]||[];const own=o.some(z=>z.own);if(!own){borrowed++;console.log('   BORROWED-ONLY:',v,JSON.stringify(o.map(z=>z.round+': '+z.txt)));}else console.log('   own book:',v,'in round',o.find(z=>z.own).round);}}}}
console.log('distinct stored F:',n,'book lines:',lines,'max line length:',maxL,'max verses listed:',maxV,'listed verses named earlier only under a borrowed book:',borrowed);
