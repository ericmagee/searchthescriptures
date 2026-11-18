// ASK 423 offline proof (DONE WHEN a-e). Takes the rewrite functions from the built C2B Extract node text, and vp4Block from the built Assume Check Build.
// Usage: node a423b/t423.cjs TARGET.json LIVE.json rows.json
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const [TG,LV,ROWS]=process.argv.slice(2);const ld=p=>{const d=JSON.parse(fs.readFileSync(p));return d.data||d;};const W=ld(TG),L=ld(LV);const nd=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const code=nd(W,'C2B Extract');const lb=code.slice(0,code.indexOf('\nconst __O423=(()=>{'));
for(const n of ['D3B Extract','C3B Extract'])if(!nd(W,n).startsWith(lb+'\nconst __O423=(()=>{'))throw new Error('copy differs in '+n);
console.log('the ASK 423 block is byte-identical in C2B, D3B and C3B Extract ('+lb.length+' chars)');
const mk=(d1,cr3)=>new Function('$',lb+';return {__LB423,__CC423,__LC423,__A423};')(n=>({first:()=>({json:{raw:n==='D1 Extract'?d1:cr3}})}));
const STOP=/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
// vp4Block old and new; blocksOf (E-PREM) from the library
const vb=s=>{const a=s.indexOf('const vp4Block=');const b=s.indexOf('const vp4Quotes=');return new Function(s.slice(a,b)+';return vp4Block;')();};
const vOld=vb(nd(L,'Assume Check Build')),vNew=vb(nd(W,'Assume Check Build'));
const U=unpack(L);const lsrc=U.L.slice(3080,3110).join('\n');const i0=U.L.findIndex(l=>l.startsWith('const blocksOf=t=>listCut(t)'));
const listCutLine=U.L.findIndex(l=>/const listCut=/.test(l));const BO=new Function(U.L[listCutLine].slice(U.L[listCutLine].indexOf('const listCut='))+'\n'+U.L[i0]+';return blocksOf;')();
const R=JSON.parse(fs.readFileSync(ROWS));let eq=0,changed=0;const forms={};
for(const r of R){const F=mk(r.d1,r.cr3);const chain=F.__CC423(r.d1);const lc=F.__LC423(r.cr3);
 const out={};for(const [k,side,stop,max] of [['gr2','D',null,chain],['cr3','D',STOP,chain],['dr3','C',null,lc]]){const t=r[k];if(typeof t!=='string')continue;const x=F.__LB423(t,side,max,stop);
  for(const y of x.rewritten)forms[y.as_written.replace(/\d+/g,'n')+' => rewritten']=(forms[y.as_written.replace(/\d+/g,'n')+' => rewritten']||0)+1;for(const y of x.left)forms[y.label.replace(/\d+/g,'n')+' => left ('+y.reason+')']=(forms[y.label.replace(/\d+/g,'n')+' => left ('+y.reason+')']||0)+1;
  if(x.text===t&&!x.rewritten.length)eq++;else changed++;out[k]=x;
  // the rewrite changes only the label text
  if(x.text.length!==t.length-x.rewritten.reduce((s,y)=>s+(y.as_written.length-y.as_kept.length),0))console.log('LENGTH CHECK FAIL',r.run,k);}
 const tag=r.run==='ODV1-39266-7g9lzgbr';if(tag){console.log('\nRUN 39266: defender chain',chain,'| defender list against the challenger',lc);
  for(const k of ['gr2','cr3'])if(out[k]){console.log(' '+k+' rewritten:',out[k].rewritten.map(y=>y.at+': '+y.as_written+' -> '+y.as_kept).join('; ')||'none');console.log(' '+k+' left:',out[k].left.map(y=>y.label+' ('+y.reason+')').join('; ')||'none');}
  const ng=out.gr2.text,nc=out.cr3.text;
  // (b) Assume Check: premises from the new gr2 list, blocks from the new cr3
  const lst=s=>{const i=s.search(/UNSUPPORTED-L4 PREMISES/i);let b=s.slice(s.indexOf('\n',i)+1);const e=b.search(/\n[ \t]*(?:#{1,3}\s|---[ \t]*\n|\*\*[A-Z][A-Z\x27 -]{4,}\*\*)/);if(e>=0)b=b.slice(0,e);const o=[];for(const p of b.split(/\n(?=[ \t]*\**[ \t]*\d+[.)]\s)/)){const m=p.match(/^\s*\**\s*(\d+)[.)]\s+([\s\S]*)$/);if(!m)continue;const lk=m[2].match(/^\s*\**\s*LINK\s+(\d+)/i);o.push({n:+m[1],link:lk?+lk[1]:+m[1]});}return o;};
  console.log(' (b) Assume Check, old texts:');for(const p of lst(r.gr2))console.log('   premise',p.n,'link',p.link,'block',(vOld(r.cr3,p.link)||'(none)').split('\n')[0].slice(0,60));
  console.log(' (b) Assume Check, new texts and new vp4Block:');for(const p of lst(ng))console.log('   premise',p.n,'link',p.link,'block',(vNew(nc,p.link,p.n)||'(none)').split('\n')[0].slice(0,60));
  const bo=BO(r.cr3),bn=BO(nc);console.log(' (c) E-PREM blocksOf on the defender round 3: old',bo.length,'blocks',JSON.stringify(bo.map(b=>[b.link,b.prem])),'| new',bn.length,'blocks',JSON.stringify(bn.map(b=>[b.link,b.prem])));
  const it=[{json:{raw:r.gr2,labelled:'HEAD\n\n'+r.gr2,round_fix:{heading:null,placeholder:0}}}];const A=F.__A423(it,{side:'D',stop:null});console.log(' node output (C2B): raw_labelled_as_written kept',A[0].json.raw_labelled_as_written===r.gr2,'| labelled rewritten',A[0].json.labelled==='HEAD\n\n'+ng,'| round_fix.labels',A[0].json.round_fix.labels.rewritten.length,'rewritten');}}
console.log('\n(d) stored rows with a candidate label:',R.length,'runs; texts unchanged',eq,'changed',changed);console.log('label forms met:');for(const [k,v] of Object.entries(forms))console.log('  '+v+' x '+k);
// (d) numbers-only texts: byte-equal
const F0=mk('','');let neq=0;for(const r of R)for(const k of ['gr2','cr3','dr3']){const t=r[k];if(typeof t!=='string')continue;const z=t.replace(/(LINK[ \t]*)[DC]([ \t]*\d)/gi,'$1$2');if(F0.__LB423(z,'D',99,null).text!==z||F0.__LB423(z,'C',99,null).text!==z)neq++;}
console.log('numbers-only copies of every text (labels made numeric first): not byte-equal',neq);
// (e) plants
const d1='DECLARED CHAIN\n1. a\n2. b\n3. c\n4. d\n5. e\n';const P=mk(d1,'');const ch=P.__CC423(d1);console.log('\n(e) plants, chain',ch);
for(const t of ['1. LINK D9: x','1. LINK D1 & D2: x','**LINK D3:** x','2. LINK D1-D2: x','3. LINK C2: x','### LINK D4 [premise 2]: x','LINK 3: numbers only','4. LINK **D2**: x']){const x=P.__LB423(t,'D',ch,null);console.log('  ',JSON.stringify(t),'->',JSON.stringify(x.text),'|',x.rewritten.map(y=>y.as_written+' -> '+y.as_kept).join(';')||'-','|',x.left.map(y=>y.label+' ('+y.reason+')').join(';')||'-');}
