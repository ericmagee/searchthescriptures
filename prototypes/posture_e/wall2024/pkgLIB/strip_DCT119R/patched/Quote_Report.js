const REFP=(()=>{const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',songofsongs:'Song of Solomon',canticles:'Song of Solomon',revelations:'Revelation',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles','1chron':'1 Chronicles','2chron':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
 
 const HEAD=/(?<![A-Za-z0-9:])(?:((?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
 const RNG=/^\s?[–—-]\s?(\d{1,3})(?!\d|:\d)/, FULL=/^\s?,\s?(\d{1,3}):(\d{1,3})(?!\d)/, BARE=/^\s?,\s?(\d{1,3})(?!\d|:\d|\s+[A-Z])/;
 const SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
 
 
 return {BK,BOOKS};})();
const L2C=(()=>{
 const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/';
 const APOC=/\b((?:1|2|I|II)\s+(?:Maccabees|Esdras)|Tobit|Judith|Wisdom(?:\s+of\s+Solomon)?|Sirach|Ecclesiasticus|Baruch|Susanna|Bel\s+and\s+the\s+Dragon|Prayer\s+of\s+Manass[eh]+s?|Letter\s+of\s+Jeremiah|Rest\s+of\s+Esther)\.?\s+(\d{1,3}):(\d{1,3})/g;
 const STOP=new Set(('the a an and or of in on at to for with by from as is are was were be been being this that these those it its his her their our your my thy thine '+
  'he she they we you i who whom which what when where how not no nor but if then than so here there same verb noun word words phrase form greek hebrew aramaic '+
  'means meaning mean root used use uses reads read says said gives give names name marks mark carries carry states state stated subject object active passive '+
  'participle tense present perfect aorist imperfect future indicative infinitive imperative genitive dative accusative nominative singular plural feminine '+
  'masculine neuter relative pronoun preposition article clause verse verses row rows also only just both each every one two three first last other another '+
  'same very more most much many some any all none whole lord god jesus christ joseph mary david holy ghost spirit son father man woman child do does did '+
  'not into upon unto under over before after till until has have had will would shall should can could may might must').split(' '));
 const strip=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g,'');
 const BETA={a:'a',b:'b',g:'g',d:'d',e:'e',z:'z',h:'e',q:'th',i:'i',k:'k',l:'l',m:'m',n:'n',x:'x',o:'o',p:'p',r:'r',s:'s',v:'s',t:'t',u:'u',f:'ph',c:'ch',y:'ps',w:'o'};
 
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 
 
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 
 
 
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 
 
 const vkey=(b,c,v)=>b+' '+c+':'+v;
 
 
 
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;
 
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;
 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;
 
 
 
 const numOf=s=>{const m=String(s||'').match(/^([GH])0*(\d+)/);return m?m[1]+m[2]:null;};
 
 
  
 function countCheck(CL,CR,capped,TGres){const by={};if(CR&&!Array.isArray(CR)){for(const [n,x] of Object.entries(CR))by[n]={v:{size:x.verses},t:x.tokens};}else for(const r of CR||[]){const n=numOf(r.strongs_number);if(!n)continue;(by[n]=by[n]||{v:new Set(),t:0});by[n].t++;by[n].v.add(vkey(r.book,r.chapter,r.verse));}
  const wordNum={};for(const t of TGres||[])for(const w of t.words||[])if(w.ok&&w.num)wordNum[norm(w.w)]=w.num;
  return (CL||[]).map(c=>{const n=c.subj||(c.word?wordNum[norm(c.word.w)]||null:null);if(!n)return {...c,num:null,status:'UNVERIFIABLE',why:'the word could not be matched to a Strong\'s number'};
   const b=by[n];if(!b)return {...c,num:n,status:capped?'UNVERIFIABLE':'DIFFERS FROM THE RECORD (0 verses, 0 tokens)',why:capped?'the count was not read':null};
   if(capped&&b.t>=1000)return {...c,num:n,status:'UNVERIFIABLE',why:'over the row cap'};
   const nv=b.v.size,nt=b.t;const ok=c.unit==='verses'?c.n===nv:c.unit==='tokens'?c.n===nt:(c.n===nv||c.n===nt);
   return {...c,num:n,verses:nv,tokens:nt,status:ok?(c.unit?'MATCHES THE RECORD':'MATCHES THE RECORD (unit not named)'):'DIFFERS FROM THE RECORD ('+nv+' verses, '+nt+' tokens)'+(c.unit?'':' (unit not named)')};});}
 
 
 
 
 
 
 
 return {countCheck,norm,numOf,};})();
const C=$('Quote Compare').first().json;const found=$('Find Words').all().map(i=>i.json).filter(r=>r&&r.book);
const words=s=>[...new Set((C.hyphen_join===true?String(s||'').replace(/([A-Za-z])-(?=[A-Za-z])/g,'$1'):String(s||'')).toLowerCase()  .replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>2))];
if(!C.read_ok)return [{json:{unavailable:true,items:[],...(()=>{try{const P=$('L2 Count Plan').first().json;return {l2:{tags:P.tags||[],counts:[],gloss:P.gloss||[]},l2_data:{ow:P.ow||[],lex:P.lex||[],read:P.read||[]}};}catch(e){return {};}})()}}];
const all=C.items.map(i=>{if(i.status!=='PENDING'){const {q,cited,...o}=i;return o;}
 let best=null,bs=0;for(const r of found){if(r.book!==i.book)continue;const tw=new Set(words(r.text));const s=i.q.filter(w=>tw.has(w)).length/i.q.length;if(s>bs){bs=s;best=r;}}
 if(i.cited&&i.score>=0.75&&i.score>=bs){bs=i.score;best={book:i.book,chapter:i.chapter,verse:i.v1};}
 const inRange=best&&best.book===i.book&&(Array.isArray(i.parts)&&i.parts.length?i.parts:[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).some(p=>+best.chapter===+p.chapter&&+best.verse>=+p.v1&&+best.verse<=+p.v2);
 const status=!i.cited?'CITED VERSE DOES NOT EXIST':(best&&bs>=0.75)?(inRange?'WORDING DIFFERS FROM '+i.ref:'WORDS ARE AT '+best.book+' '+best.chapter+':'+best.verse):'WORDING NOT FOUND IN '+i.book;
 const {q,cited,...o}=i;return {...o,status};});
const itemsAll=all.filter(i=>/^MATCHES\b/.test(i.status)||i.status==='SHORTENED'||i.status==='NOT CHECKED'||((i.cite_form!==false||i.load_bearing===true)&&!i.opp_words&&!(i.opp_short&&/^WORDING NOT FOUND IN /.test(i.status))));
const items=itemsAll.filter(i=>i.side!=='SYNTHESIS');const synth=itemsAll.filter(i=>i.side==='SYNTHESIS');
const SYN=(()=>{let v=[];try{v=$('Citation Scan').first().json.synth_verdict||[];}catch(e){v=[];}const bad=synth.filter(i=>!/^MATCHES\b/.test(i.status)&&i.status!=='NOT CHECKED');return {checked:synth.length,matches:synth.filter(i=>/^MATCHES\b/.test(i.status)).length,not_checked:synth.filter(i=>i.status==='NOT CHECKED').length,bad:bad.map(i=>({ref:i.ref,quote:String(i.quote).slice(0,200),status:i.status})),verdict_phrases:v};})();
const L2R=(()=>{try{const P=$('L2 Count Plan').first().json;let cr=[];try{cr=$('L2 Counts').all().map(i=>i.json).filter(r=>r&&r.strongs_number);}catch(e){cr=[];}
 const counts=L2C.countCheck(P.claims||[],cr,cr.length>=1000,P.tags||[]);return {l2:{tags:P.tags||[],counts,gloss:P.gloss||[]},l2_data:{ow:P.ow||[],lex:P.lex||[],read:P.read||[]}};}catch(e){return {l2:null,l2_data:null};}})();
const n=s=>items.filter(i=>s==='MATCHES'?/^MATCHES\b/.test(i.status):i.status===s).length;
return [{json:{scanned:C.scanned,item_cap:C.item_cap,checked:items.length,matches:n('MATCHES'),not_checked:n('NOT CHECKED'),mismatches:items.length-n('MATCHES')-n('NOT CHECKED'),items,synthesis:SYN,...L2R}}];