// ASK 654 read-only: [L3] check, chapter rule (b2) against W3's Wall 12215 rule. node b3/r654x.cjs
const fs=require('fs');const W4='/mnt/project-files/ask654/w4/';
const E=JSON.parse(fs.readFileSync(W4+'b2/tg/target_engine_654b2.json','utf8'));const nd=n=>E.nodes.find(k=>k.name===n);
const T=nd('Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const reb=p=>p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const src=reb(M['PRESS LAYERS'].p);const X0=new Function(src+'\n;return {PLY,PRESSL};')();const PLY=X0.PLY,PRESSL=X0.PRESSL;

const OLD="if(!tagged(lines,3).flatMap(refs).some(x=>chap(x)&&!same(x,r)))lacks.push('X');";
if(src.split(OLD).length!==2)throw new Error('X line not found once');
const NEW="if(!tagged(lines,3).flatMap(refs).some(x=>x!==r&&!l1.includes(x)))lacks.push('X');";
const PLY2=new Function(src.replace(OLD,NEW)+'\n;return PLY;')();
const R=JSON.parse(fs.readFileSync(W4+'rounds42528.json','utf8'));const runs={'42528':{o:{DR1:R.DR1,DR2:R.DR2,DR3:R.DR3},cr3:R.CR3,cr4:R.CR4}};
for(const x of ['42517','42373']){const r=JSON.parse(fs.readFileSync(W4+'r'+x+'.json','utf8'));runs[x]={o:{DR1:r['C1B Extract'].raw,DR2:r['C2B Extract'].raw,DR3:r['C3B Extract'].raw},cr3:r['D3 Extract'].raw,cr4:r['D4 Extract'].raw};}
const RF='((?:[1-3] )?[A-Z][a-z]+(?: (?:of )?[A-Z][a-z]+)* \\d+:\\d+)';
const RQ=new RegExp(RF+'[\\s:*_,]*["“`][^"”`\\n]{6,}','g'),QR=new RegExp('["“`][^"”`\\n]{6,}["”`][\\s*_]*\\(\\s*'+RF+'\\s*\\)','g');
const refs=l=>[...l.matchAll(RQ)].map(m=>m[1]).concat([...l.matchAll(QR)].map(m=>m[1]));
const tagged=(lines,k)=>lines.filter(l=>new RegExp('^[\\s>*_-]*\\[L'+k+'\\]').test(l));
const chap=r=>{const m=String(r).match(/^(.*) (\d+):(\d+)$/);return m?{b:m[1],c:+m[2],v:+m[3]}:null;};
let tot={blocks:0,oldX:0,newX:0,toUn:0,toLi:0,neigh:0};
for(const [k,v] of Object.entries(runs))for(const [rd,txt,pr] of [['CR3',v.cr3,[v.o.DR1,v.o.DR2]],['CR4',v.cr4,[v.o.DR1,v.o.DR2,v.o.DR3]]]){
 const a=PLY.check(pr,txt,v.o),b=PLY2.check(pr,txt,v.o);const P=PRESSL.pressed(pr);const B=PLY.blocks(txt);
 const xa=new Set(a.items.filter(i=>i.lacks.includes('X')).map(i=>i.ref)),xb=new Set(b.items.filter(i=>i.lacks.includes('X')).map(i=>i.ref));
 const withBlock=P.filter(r=>B.some(bl=>bl.ref===r));tot.blocks+=withBlock.length;tot.oldX+=xa.size;tot.newX+=xb.size;
 const un=[...xa].filter(r=>!xb.has(r)),li=[...xb].filter(r=>!xa.has(r));tot.toUn+=un.length;tot.toLi+=li.length;
 for(const r of un){const lines=B.filter(bl=>bl.ref===r).flatMap(bl=>bl.lines);const l3=tagged(lines,3).flatMap(refs),l1=tagged(lines,1).flatMap(refs);const pc=chap(r);
  const used=l3.filter(x=>x!==r&&!l1.includes(x));const nb=used.filter(x=>{const c=chap(x);return c&&c.b===pc.b&&c.c===pc.c;});if(nb.length&&!used.some(x=>{const c=chap(x);return c&&!(c.b===pc.b&&c.c===pc.c);}))tot.neigh++;
  console.log(k+' '+rd+' '+r+': X listed -> not listed; [L3] refs '+JSON.stringify(l3)+' [L1] refs '+JSON.stringify(l1)+(nb.length?' SAME-CHAPTER: '+nb.join('; '):''));}
 for(const r of li)console.log(k+' '+rd+' '+r+': X not listed -> listed');
 console.log(k+' '+rd+': pressed '+P.length+', with block '+withBlock.length+', X listed b2 '+xa.size+', W3 rule '+xb.size+'; items b2 '+a.items.length+', W3 rule '+b.items.length);}
console.log('TOTAL '+JSON.stringify(tot));
// ranges: what refs() takes from a range
for(const t of ['[L3] Obadiah 1:10-14 "For thy violence against thy brother Jacob"','[L3] Obadiah 1:9-14 "And thy mighty men, O Teman"'])console.log('range '+JSON.stringify(t)+' -> '+JSON.stringify(refs(t)));
// FORM block and variants through the changed check
const csrc=fs.readFileSync(W4+'c4form654.cjs','utf8');const blk=kk=>{const i=csrc.indexOf("'"+kk);const s=csrc.indexOf('`',i)+1;return csrc.slice(s,csrc.indexOf('`',s));};
for(const kk of ['A form block','B same, reference after the quote','C same','D same','E same']){const t=blk(kk);const o=runs['42528'].o;const a=PLY.check(['PRESSED WITH: Matthew 1:23'],t,o),b=PLY2.check(['PRESSED WITH: Matthew 1:23'],t,o);console.log('variant '+kk.slice(0,1)+': b2 '+JSON.stringify(a.items)+' | W3 rule '+JSON.stringify(b.items));}
