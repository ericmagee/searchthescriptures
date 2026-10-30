const fs=require('fs');const F=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const LF='\n';
eval(fs.readFileSync(process.env.PWLF||(__dirname+'/pwl_new.js'),'utf8').replace('const PWL=','globalThis.PWL=').replace('return {ledger,','return {refs,items,lastHead,ledger,'));
const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation";
const BRE=new RegExp('(?<![A-Za-z0-9])('+BOOKS+')(?![a-z])','g');
const norm=b=>b==='Psalm'?'Psalms':b;
// my own: list of (book,ch,v) a text names; ranges expanded up to 40; book = written before, else nearest earlier book mention
function mine(t){const bm=[...t.matchAll(BRE)].map(m=>({at:m.index,end:m.index+m[0].length,b:norm(m[1])}));const out=new Set();
 for(const m of t.matchAll(/(?<![\d:])(\d{1,3}):(\d{1,3})((?:\s?[-–—]\s?\d{1,3}(?!\d|:\d)|,\s?\d{1,3}(?!\d|:\d))*)/g)){
  let b=null;for(const x of bm){if(x.at<m.index)b=x.b;else break;}
  const c=+m[1];let vs=[+m[2]];let last=+m[2];for(const p of m[3].matchAll(/([-–—]|,)\s?(\d{1,3})/g)){const n=+p[2];if(p[1]===',')vs.push(n);else for(let x=last+1;x<=n&&x-last<=40;x++)vs.push(x);last=n;}
  for(const v of vs)out.add(b+' '+c+':'+v);}return out;}
const O=['[CR1]','[DR1]','[CR2]','[DR2]','[CR3]','[DR3]'];const T={'[CR1]':F.cr1,'[DR1]':F.gr1,'[CR2]':F.cr2,'[DR2]':F.gr2,'[CR3]':F.cr3,'[DR3]':F.dr3};
const M={};for(const k of O)M[k]=mine(String(T[k]||''));
const exp=lab=>{const m=lab.match(/^(.*) (\d+):(\d+)(?:-(\d+))?$/);const o=[];for(let v=+m[3];v<=+(m[4]||m[3]);v++)o.push(m[1]+' '+m[2]+':'+v);return o;};
let bad=0;
function side(cr,ans,listedLine){const blk=PWL.citedBlock(cr.map(k=>[k,T[k]]),'X').split(LF).slice(1);const listed=new Set(listedLine);
 for(const line of blk){const i=line.indexOf(': ');const rk=line.slice(0,i),rest=line.slice(i+2);if(rest==='none')continue;
  for(const lab of rest.split(', ')){const vv=exp(lab);
   // first citation round of any verse of lab, in my own reading
   let first=O.indexOf(rk);for(const k of cr)for(const v of vv)if(M[k].has(v))first=Math.min(first,O.indexOf(k));
   const named=ans.some(k=>O.indexOf(k)>first&&vv.some(v=>M[k].has(v)));
   if(named===listed.has(lab)){bad++;console.log('DISAGREE',rk,lab,'mine named=',named,'ledger listed=',listed.has(lab));}}}}
const out=PWL.judgeBlock(F).split(LF);const cl=out.filter(l=>l.startsWith('cited in'));const lst=l=>{const s=l.slice(l.indexOf('): ')+3);return s==='none'?[]:s.split(', ');};
side(['[DR1]','[DR2]'],['[CR2]','[CR3]'],lst(cl[0]));side(['[CR1]','[CR2]','[CR3]'],['[DR2]','[DR3]'],lst(cl[1]));
// premises: NOT NAMED vs mine
const prem=(pressing,re,ans,earlyAns,earlier)=>{const i=PWL.lastHead(pressing,re);if(i<0)return;PWL.items(String(pressing).slice(i)).forEach((x,k)=>{for(const r of PWL.refs(x)){const b=r.book||r.ctx;const vv=r.cvs.map(cv=>b+' '+cv);
  const n=vv.some(v=>M[ans].has(v))||(earlyAns&&vv.some(v=>M[earlyAns].has(v)&&earlier.some(e=>M[e].has(v))));console.log('  P'+(k+1),b+' '+r.label,n?'named':'NOT NAMED');}});};
console.log(' defender premises:');prem(F.gr2,/UNSUPPORTED-L4 PREMISES/gi,'[CR3]','[CR2]',['[DR1]']);
console.log(' challenger premises:');prem(F.cr3,/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi,'[DR3]','[DR2]',['[CR1]','[CR2]']);
console.log('cited-in disagreements:',bad);
