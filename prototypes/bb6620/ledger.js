// PRESSED-WITNESS LEDGER (draft, Worker_E): computed from the transcript, not by a model.
// Scope = the rulebook's counting unit: each numbered premise of the list that closes the pressing round
// ([DR2] against the defender; the CHALLENGER'S list closing [CR3] against the challenger). For every verse a premise
// carries, it reports whether the answering LINK ROUND names that verse anywhere (book and chapter:verse, or bare chapter:verse).
function ledger(F){
 const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
 const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',mic:'Micah',hab:'Habakkuk',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John',rev:'Revelation'});
 const verses=(c,v,tail)=>{const out=[+v];let last=+v;for(const m of String(tail||'').matchAll(/([–—-]|,)\s?(\d{1,3})(?!\d|:)/g)){const n=+m[2];if(m[1]===','){out.push(n);last=n;}else{for(let x=last+1;x<=n&&x-last<=12;x++)out.push(x);last=n;}}return out.map(x=>c+':'+x);};
 const TAIL='((?:\\s?[–—-]\\s?\\d{1,3}(?![\\d:])|\\s?,\\s?\\d{1,3}(?![\\d:]|\\s+[A-Z]))*)';
 // Every verse a text names. Book-named ("Luke 2:33, 41") carry their book; bare ("(1:34)", "2:41") inherit the nearest book named before them in the same text, if any.
 const refs=t=>{const T=String(t||'');const out=[];const RE=new RegExp('(?<![A-Za-z0-9:])(?:((?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})'+TAIL,'g');let lastBook=null;
  for(const m of T.matchAll(RE)){let b=m[1]?BK[key(m[1])]:null;if(m[1]&&!b){const w=m[1].split(/\s/).pop();b=BK[key(w)]||null;}
   if(b)lastBook=b;const tail=String(m[4]||'');const parts=tail.split(',');const rng=parts[0];
   const head=verses(m[2],m[3],rng);out.push({book:b,cv:head[0],cvs:head,label:m[2]+':'+m[3]+rng.replace(/\s/g,''),ctx:b||lastBook});
   for(const c of parts.slice(1)){const mm=c.match(/(\d{1,3})(\s?[–—-]\s?\d{1,3})?/);if(!mm)continue;const vv=verses(m[2],mm[1],mm[2]||'');out.push({book:b,cv:vv[0],cvs:vv,label:m[2]+':'+mm[1]+(mm[2]||'').replace(/\s/g,''),ctx:b||lastBook});}}return out;};
 const namedIn=t=>{const s=new Set();for(const r of refs(t))for(const cv of r.cvs){s.add(cv);if(r.book)s.add(r.book+' '+cv);}return s;};
 const lastHead=(t,re)=>{let i=-1;for(const m of String(t||'').matchAll(re))i=m.index;return i;};
 const items=t=>String(t||'').split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));
 const side=(pressing,answering,headRe)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};
  const list=String(pressing).slice(i);const N=namedIn(answering);
  const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\s+(\d+|none)\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;
   for(const r of refs(x)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);
    if(r.cvs.some(cv=>N.has(cv)||(r.book&&N.has(r.book+' '+cv))))named++;else notNamed.push(label);}
   return {n:k+1,link:lk,verses:seen.size,named,notNamed};});
  return {list:true,premises};};
 return {defender:side(F.gr2,F.cr3,/UNSUPPORTED-L4 PREMISES/gi),challenger:side(F.cr3,F.dr3,/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi)};
}
if(typeof module!=='undefined')module.exports={ledger};
