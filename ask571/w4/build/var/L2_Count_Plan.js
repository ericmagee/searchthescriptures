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

 const beta2lat=s=>String(s||'').toLowerCase().split('').map(c=>BETA[c]!=null?BETA[c]:c).join('');

 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};

 const grk2lat=s=>strip(s).toLowerCase().split('').map(c=>GRK[c]!=null?GRK[c]:c).join('');

 const isGrk=s=>/[Ͱ-Ͽἀ-῿]/.test(s),isHeb=s=>/[֐-׿]/.test(s);

 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');
return t;};

 const skel=t=>t.replace(/[aeiou]/g,'');

 
 const hebScript=s=>strip(s).replace(/[^א-ת]/g,'');

 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];

 const variants=w=>{const out=new Set();
const raw=String(w||'');
const parts=raw.split(/[-\/]/).filter(Boolean);

  const add=x=>{const n=norm(x);if(n.length>=2){out.add(n);if(/^h[aeiou]/.test(n))out.add(n.slice(1));}};add(raw);if(parts.length>1){add(parts[parts.length-1]);add(parts.join(''));}
  for(const n of [...out])for(const p of PREF)if(n.startsWith(p)&&n.length-p.length>=3)out.add(n.slice(p.length));
return [...out];};

 const ed1=(a,b)=>{if(a===b)return true;if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;

  return a.slice(i+1)===b.slice(i+1)||a.slice(i)===b.slice(i+1)||a.slice(i+1)===b.slice(i);};

 const vkey=(b,c,v)=>b+' '+c+':'+v;

 const refsIn=t=>{const out=[];try{for(const k of REFP.keys(String(t||''),{scoped:true,cap:12}))out.push(k.key);}catch(e){}return [...new Set(out)];};

 const apocIn=t=>{const out=[];APOC.lastIndex=0;let m;while((m=APOC.exec(String(t||''))))out.push(m[1].replace(/\s+/g,' ')+' '+m[2]+':'+m[3]);
return [...new Set(out)];};

 function blockAt(T,i){const t=String(T||'');
const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b[^\n]*|\**\s*\d+[.)]\s+(?:LINK\b)?[^\n]*|#{1,4}\s[^\n]*|UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES[^\n]*|CHALLENGER.{0,2}S\s+UNSUPPORTED[^\n]*)$/gmi)].map(m=>m.index);
  let a=0,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const linkHead=/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)/i.test(t.slice(a,a+40));
  if(!linkHead){const pa=t.lastIndexOf('\n\n',i);
const pb=t.indexOf('\n\n',i);
const A=Math.max(a,pa<0?0:pa),B=Math.min(b,pb<0?t.length:pb);
   let blk=t.slice(A,B);
const opens=/^[\s>*_#-]*(?:\d+[.)]\s*)?[*_]*\s*$/.test(t.slice(A,i));if((opens||(!refsIn(blk).length&&!apocIn(blk).length))&&A>0){const pp=t.lastIndexOf('\n\n',A-1);blk=t.slice(Math.max(a,pp<0?0:pp),B);}return blk;}
  return t.slice(a,b);}
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;

 function tagWords(seg){const s=String(seg||'');
const out=[];
const seen=new Set();
const add=(w,kind)=>{const k=kind+'|'+String(w).toLowerCase();if(seen.has(k))return;seen.add(k);out.push({w:String(w),kind});};
  for(const m of s.matchAll(/\b([GH])0*(\d{1,5})\b/g))add(m[1]+m[2],'strongs');
  for(const m of s.matchAll(/[Ͱ-Ͽἀ-῿]+/g))add(m[0],'greek');
  for(const m of s.matchAll(/[֐-׿\/]+/g)){const x=m[0].replace(/\//g,'');if(x)add(x,'hebrew');}
  const latin=w=>{const x=String(w).replace(/^[\s"“”'‘’(]+|[\s"“”'‘’),.;:!?]+$/g,'');if(!x||/\d/.test(x)||isGrk(x)||isHeb(x))return;
   for(const p of x.split(/\s+/)){const q=p.replace(/^[^A-Za-zÀ-ɏḀ-ỿʼʻ']+|[^A-Za-zÀ-ɏḀ-ỿʼʻ']+$/g,'');if(q.length<2||STOP.has(strip(q).toLowerCase()))continue;add(q,'latin');}};
  for(const m of s.matchAll(W_IT))latin(m[1]);

  const other=out.length>0||W_IT.test(s);W_IT.lastIndex=0;
  for(const m of s.matchAll(/\(\s*["“'‘]?[a-z]/g)){if(/[*_]\s*$/.test(s.slice(0,m.index)))continue;
const before=s.slice(0,m.index).replace(/[*_]+/g,'');
const toks=before.split(/(\s+)/);
const run=[];
   for(let k=toks.length-1;k>=0;k--){const tk=toks[k];if(/^\s+$/.test(tk)||tk==='')continue;
const c=tk.replace(/["“”'‘’]/g,'');
    if(/[,;:.!?)\]]$/.test(c)&&run.length)break;
const q=c.replace(/[,;:.!?)\]]+$/,'');if(!q||/^[A-Z]/.test(q)||/\d/.test(q)||isGrk(q)||isHeb(q)||STOP.has(strip(q).toLowerCase())||!/^[a-zà-ɏḀ-ỿʼʻ'’-]+$/.test(q))break;run.unshift(q);if(/[,;:.!?]$/.test(c))break;}
   if(run.length&&(!other||run.some(q=>/[à-ɏḀ-ỿʼʻ']/.test(q))))latin(run.join(' '));}
  for(const m of s.matchAll(/(?<![\wÀ-ɏḀ-ỿ])[a-z]*[āēīōūâêîôûáéíóúàèìòùʼʻ][a-zà-ɏḀ-ỿʼʻ']*/g))latin(m[0]);
  for(const m of s.matchAll(/(?<![\w-])(?:ha|he|ve|va|be|ba|le|la|ke|ka|mi|me|she|u)-[a-zà-ɏḀ-ỿʼʻ']{3,20}(?![\w-])/g))latin(m[0]);
  if(!out.length)for(const m of s.matchAll(/["“]([a-zà-ɏḀ-ỿʼʻ'-]{3,24})["”]/g))latin(m[1]);

  return out;}
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;

 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;

 function markRoots(seg,wds){const s=String(seg||'');
const lo=s.toLowerCase();
const R=new Set();

  const occ=w=>{const out=[];
const k=String(w.w).toLowerCase();
const sm=w.kind==='strongs'?k.match(/^([gh])(\d+)$/):null;
   if(sm){for(const x of s.matchAll(new RegExp('\\b'+sm[1]+'0*'+sm[2]+'\\b','gi')))out.push(x.index);
return out;}
   let i=-1;while((i=lo.indexOf(k,i+1))>=0){const b=i>0?lo[i-1]:'',a=lo[i+k.length]||'';if((b&&LETTER.test(b))||(a&&LETTER.test(a)))continue;out.push(i);}return out;};

  const pos=wds.map(occ);

  const rootAt=(i,pass)=>{const pre=s.slice(Math.max(0,i-60),i);if(ROOTPRE.test(pre))return true;if(!pass)return false;

   const m=pre.match(/([^\s(*_"\u201c\u201d]+)[*_"\u201d\u2019]*\s*\(\s*$/);if(!m)return false;
const j=i-pre.length+pre.lastIndexOf(m[1]);

   return wds.some((w,k)=>R.has(k)&&pos[k].includes(j));};
  for(let pass=0;pass<2;pass++)wds.forEach((w,k)=>{if(R.has(k)||!pos[k].length)return;if(pos[k].every(i=>rootAt(i,pass)))R.add(k);});

  return wds.map((w,k)=>R.has(k)?{...w,root:true}:w);}
 function __gLab(t){const S=new Set();for(const m of String(t||'').matchAll(/^[ \t]*(?:\*\*)?G0*(\d{1,5})(?:\*\*)?[ \t]*\[(?:CR|DR)/gm))S.add('G'+m[1]);
return S;}function __gCit(s,i){return /(?:[*_][^*_\n]{1,60}[*_]|[Ͱ-Ͽἀ-῿֐-׿])\s?\($/.test(String(s).slice(Math.max(0,i-80),i));}function __gSkip(s,w,GL){if(!GL||!GL.has(w))return false;
const mm=String(w).match(/^G(\d+)$/);if(!mm)return false;let any=false;for(const x of String(s).matchAll(new RegExp('\\bG0*'+mm[1]+'\\b','g'))){any=true;if(__gCit(s,x.index))return false;}return any;}function __gTw(s,GL){return tagWords(s).filter(w=>!(w.kind==='strongs'&&__gSkip(s,w.w,GL)));}function __gLast(pre,GL){let r=[];for(const x of String(pre).matchAll(/\b([GH])0*(\d{1,5})\b/g)){if(GL&&GL.has(x[1]+x[2])&&!__gCit(pre,x.index))continue;r=x;}return r;}  function __run336(t,i,press){ try{if(press)return [];
const SEP=/\n[ \t]*\n/g;let ps=0,m;while((m=SEP.exec(t))&&m.index<i)ps=m.index+m[0].length;{const PL=t.slice(ps,i).split('\n');if(!/^[\s>*_#-]*$/.test(PL[PL.length-1])||!PL.slice(0,-1).every(x=>/^[\s>*_-]*\[L2\]/.test(x)))return [];}const rest=t.slice(i).search(/\n[ \t]*\n/);
const para=t.slice(ps,rest<0?t.length:i+rest);if(refsIn(para).length)return [];
const __pz=para.replace(/\b[GH]\d+/g,'');
const __BL=[];try{for(const r of REFP.parse(__pz,{scoped:true}))if(!r.book&&!r.ctx)__BL.push(r);}catch(e){return [];}const __VV=[...__pz.matchAll(/(?<![\w.])(?:vv?\.|verses?\b)\s*(\d{1,3})(?:\s*[–—-]\s*(\d{1,3}))?(?![\d:])/gi)];
const P=t.slice(0,ps).split(/\n[ \t]*\n/);let k=P.length-1;while(k>=0&&!P[k].trim())k--;
const out=[];for(;k>=0;k--){const L=P[k].split('\n').filter(x=>x.trim());if(!L.length)break;
const hd=x=>{const h=x.match(/^[\s>*_-]*\[L1\]\s*[*_]*\s*([^"“]{0,200})/);
return h?refsIn(h[1]):null;};
const r0=hd(L[0]);if(!r0||!r0.length)break;
const got=[].concat(r0,...L.slice(1).map(x=>hd(x)||[]));out.unshift(...got);}if(!__BL.length&&!__VV.length)return [...new Set(out)];
const __bk=new Set(out.map(k=>k.replace(/\s\d+:\d+$/,'')));if(__bk.size!==1)return [];
const __B=[...__bk][0];
const __res=[];
const __runCh=new Set(out.map(k=>(k.match(/\s(\d+):\d+$/)||[])[1]));for(const r of __BL)if(!__runCh.has(String(r.c)))return [];for(const r of __BL){const z=r.v2-r.v1>12?r.v1:r.v2;for(let v=r.v1;v<=z;v++)__res.push(__B+' '+r.c+':'+v);}if(__VV.length){const __ch=new Set(out.map(k=>(k.match(/\s(\d+):\d+$/)||[])[1]));if(__ch.size!==1)return [];
const __C=[...__ch][0];for(const x of __VV){const a=+x[1],b=x[2]?+x[2]:a;
const z=(b<a||b-a>12)?a:b;for(let v=a;v<=z;v++)__res.push(__B+' '+__C+':'+v);}}return [...new Set(__res)];}catch(e){return [];}} function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;
const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   const __GL=__gLab(t);let wds=__gTw(seg,__GL);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);
const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));
const w2=__gTw(seg2,__GL);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);
const own=refsIn(seg);
const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));
const __line=t.slice(__ls,__le);
const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i));
  const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)).concat(__run336(t,i,__press)))];
const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   wds=markRoots(seg,wds);
   out.push({side,round,at:i,seg:seg.replace(/\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}
  return out;}
 function index(OW,LEX){const V={};for(const r of OW||[]){if(!r||!r.book)continue;
const k=vkey(r.book,r.chapter,r.verse);(V[k]=V[k]||[]).push(r);}
  const X={};for(const r of LEX||[])if(r&&r.strongs_number)X[r.strongs_number]=r;
return {V,X};}
 const numOf=s=>{const m=String(s||'').match(/^([GH])0*(\d+)/);
return m?m[1]+m[2]:null;};

 function matchWord(wd,cands,IX){const nums=new Set(cands.map(r=>numOf(r.strongs_number)).filter(Boolean));
  if(wd.kind==='strongs')return nums.has(wd.w)?{ok:true,num:wd.w,route:'number'}:{ok:false};
  if(wd.kind==='greek'){const g=norm(grk2lat(wd.w));for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;if(norm(beta2lat(r.transliteration))===g)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};

    const L=IX.X[numOf(r.strongs_number)];if(L&&norm(grk2lat(L.original_script))===g)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}
   for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;
const f=norm(beta2lat(r.transliteration));if(g.length>=5&&f.length>=5&&ed1(g,f))return {ok:true,num:numOf(r.strongs_number),route:'inflected (one letter)'};}return {ok:false};}
  if(wd.kind==='hebrew'){const h=hebScript(wd.w);if(h.length<2)return {ok:false};for(const r of cands){if(!/^H/.test(r.strongs_number||''))continue;
const segs=String(r.original_script||'').split('/').map(hebScript).filter(Boolean);
    if(segs.includes(h)||segs.join('')===h)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};
const L=IX.X[numOf(r.strongs_number)];if(L&&hebScript(L.original_script)===h)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}return {ok:false};}
  const V=variants(wd.w);if(!V.length)return {ok:false};

  const forms=[];for(const r of cands){const n=numOf(r.strongs_number);if(!n)continue;
const L=IX.X[n];
   if(L)for(const x of variants(L.transliteration))forms.push({f:x,n,route:'dictionary',heb:n[0]==='H'});

   const it=n[0]==='G'?beta2lat(r.transliteration):String(r.transliteration||'');for(const x of variants(it))forms.push({f:x,n,route:'inflected',heb:n[0]==='H'});}
  for(const v of V)for(const f of forms)if(f.f===v)return {ok:true,num:f.n,route:f.route};
  for(const v of V)for(const f of forms)if(f.heb&&skel(v).length>=3&&skel(v)===skel(f.f))return {ok:true,num:f.n,route:f.route+' (consonants)'};
  for(const v of V)for(const f of forms)if(v.length>=6&&f.f.length>=6&&ed1(v,f.f))return {ok:true,num:f.n,route:f.route+' (one letter)'};

  return {ok:false};}
 function check(TG,OW,LEX,READ,GD){const IX=index(OW,LEX);if(GD===undefined){GD=null;try{if(typeof $==='function'){const __n=$('L2 Count Plan');if(__n&&__n.isExecuted)GD=__n.first().json.e340||null;}}catch(e){GD=null;}}const __EN=new Set(GD&&GD.ok&&Array.isArray(GD.eng)?GD.eng:[]);
  const RD=new Set(READ||Object.keys(IX.V));

  return (TG||[]).map(t=>{const vs=t.verses||[];
const read=vs.filter(k=>RD.has(k));
const cands=[].concat(...read.map(k=>IX.V[k]||[]));

   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);
const at=m.ok?read.filter(k=>(IX.V[k]||[]).some(r=>numOf(r.strongs_number)===m.num)):[];

    return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null,...(wd.root?{root:true}:{}),...(at.length?{in:at.join(', ')}:{})};});

   const __e=__EN.size?ws.map(w=>(!w.ok&&w.kind==='latin'&&/^[A-Za-z]+$/.test(w.w)&&__EN.has(w.w.toLowerCase()))?{...w,english:true}:w):ws;
const __k=__e.some(w=>w.english)&&__e.some(w=>!w.english)?__e.filter(w=>!w.english):ws;
const __set=__k===ws?'':'; set aside as English: '+__e.filter(w=>w.english).map(w=>w.w).join(', ');
const core=__k.some(w=>!w.root)?__k.filter(w=>!w.root):__k;
   let status,why;
   if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length&&t.apoc&&t.apoc.length){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+'): the original-words table holds the 66 books only';}
   else if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length){status='NOT COUNTED';why='its block cites no verse';}
   else if(core.every(w=>w.ok)){status='COUNTED';why=(__k===ws?ws:__e).map(w=>w.w+' = '+(w.english?'English, set aside':w.ok?w.num:'root, not in the cited verse')).join(', ');}
   else if(read.length<vs.length){status='UNVERIFIABLE';why='the words of '+vs.filter(k=>!RD.has(k)).join(', ')+' were not read this run';}
   else if(t.apoc&&t.apoc.length&&!ws.some(w=>w.ok)){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+')';}
   else{status='NOT COUNTED';why='not in the cited verse: '+core.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')'+__set;}
   return {...t,words:__k===ws?ws:__e,status,why};});}
  
 
 
 
 
 
 function countsUrl(nums){const S=[...new Set((nums||[]).filter(Boolean))].slice(0,40);
return SB+'original_words?select=book,chapter,verse,strongs_number&limit=1000&strongs_number=in.('+(S.length?S.join(','):'NONE')+')';}
 
 
 return {tags,tagWords,check,countsUrl,norm,variants,beta2lat,grk2lat,blockAt,refsIn,apocIn,numOf,index,matchWord};})();