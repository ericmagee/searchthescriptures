// Every bare reference refs() reads (the ledger's reader), with the book it inherits from the whole text (ctx), the book it would inherit
// from the same sentence only (sentence ends at . ! ? or a line break), and the text just before it. For grading by hand.
const fs=require('fs'),path=require('path');const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const t=fs.readFileSync(path.join(__dirname,process.argv[3]||'base','Panel_Build.js'),'utf8');const a=t.indexOf('const PWL=(()=>{');const z=t.indexOf(' // 6643 (b)',a);
let body=t.slice(a+'const PWL=(()=>{'.length,z);const n0=body.split('ctx:b||lastBook}').length-1;body=body.split('ctx:b||lastBook}').join('ctx:b||lastBook,at:m.index}');
const refs=new Function(body+'\nreturn refs;')();
let tot=0;for(const k of ['cr1','gr1','cr2','gr2','cr3','dr3']){const T=String(R[k]||'');
 for(const r of refs(T)){if(r.book||!r.ctx)continue;tot++;const st=Math.max(T.lastIndexOf('\n',r.at),...['. ','! ','? '].map(s=>T.lastIndexOf(s,r.at)));
  const sent=T.slice(st+1,r.at);const bs=refs(sent).filter(x=>x.book).map(x=>x.book);const sb=bs.length?bs[bs.length-1]:null;
  console.log([k,r.ctx+' '+r.label,'sentence:'+(sb||'-'),(r.ctx===sb?'SAME':'DIFF'),T.slice(Math.max(0,r.at-90),r.at+r.label.length).replace(/\n/g,' / ')].join(' | '));}}
console.error('anchors',n0,'bare refs',tot);
