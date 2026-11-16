/* ASK 340 (W1 7068 design; team marks 7145-7151): L2 Gloss Plan. Reads once per run, REST table reads only. Part A: the lexicon transliteration column (15 pages, exact count) and kjv_word_map for each English-word candidate. Part B (record-only trial): kjv_word_map renderings for each glossed number. No candidate and no gloss: one item {none:true}, and no read is made. */
const S=$('Citation Scan').first().json;let ow=[],lex=[];try{ow=$('L2 Words').all().map(i=>i.json).filter(r=>r&&r.book);}catch(e){ow=[];}try{lex=$('L2 Lexicon').all().map(i=>i.json).filter(r=>r&&r.strongs_number);}catch(e){lex=[];}
const read=new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse));const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/';
const __G340=(()=>{try{const T0=L2C.check(S.l2_tags||[],ow,lex,[...read],null);const IX=L2C.index(ow,lex);
 const cand=new Set();for(const t of T0){if(!t||(t.status!=='NOT COUNTED'&&t.status!=='UNVERIFIABLE'))continue;const ws=t.words||[];const c=ws.filter(w=>!w.ok&&w.kind==='latin'&&/^[A-Za-z]+$/.test(w.w));if(c.length&&c.length<ws.length)c.forEach(w=>cand.add(w.w.toLowerCase()));}
 const GR=/\b(?:active|passive|middle|aorist|perfect|imperfect|present|future|participle|infinitive|genitive|dative|accusative|nominative|vocative|singular|plural|feminine|masculine|neuter|verb|noun|adjective|adverb|preposition|conjunction|article|particle|pronoun|literally|lit|cf|see|from|root|strongs?|hebrew|greek|aramaic|word|form|tense|stem|qal|niphal|piel|pual|hiphil|hophal|hithpael|lxx|tr|margin|literal|figurative|sense|marking|source|kai)\b/i;
 const gl=[],seen=new Set();
 for(const t of T0){if(!t||t.status==='IGNORED')continue;const seg=String(t.seg||'');const cands=[].concat(...(t.verses||[]).filter(k=>read.has(k)).map(k=>IX.V[k]||[]));
  for(const m of seg.matchAll(/(\b[GH]0*\d{1,5}\b|[A-Za-zÀ-ɏḀ-ỿʻʼ][A-Za-zÀ-ɏḀ-ỿʻʼ'’-]{1,39})[*_]*\s*\(([^()]{2,160})\)/g)){
   const left=m[1];let body=m[2];let nums=[];const sn=left.match(/^([GH])0*(\d{1,5})$/);const b0=body.match(/^\s*([GH])0*(\d{1,5})\b\s*[,;:]?\s*/);
   if(b0){nums=[b0[1]+b0[2]];body=body.slice(b0[0].length);}
   else if(sn)nums=[sn[1]+sn[2]];
   else{const lw=left.toLowerCase();const w=(t.words||[]).find(x=>x.ok&&x.num&&x.kind!=='strongs'&&String(x.w).toLowerCase()===lw);if(!w)continue;
    const byN={};for(const r of cands){const n=L2C.numOf(r.strongs_number);if(n)(byN[n]=byN[n]||[]).push(r);}const all=new Set();for(const n of Object.keys(byN)){const mm=L2C.matchWord({w:w.w,kind:w.kind},byN[n],IX);if(mm.ok&&mm.num)all.add(mm.num);}nums=all.size?[...all]:[w.num];}
   const parts=[...new Set(body.split(/[,;\/]|\s+or\s+/).map(p=>p.replace(/["“”‘’*_]/g,'').replace(/\s+/g,' ').trim().toLowerCase().replace(/^(?:a|an|the|to)\s+(?=\S)/,'')).filter(p=>p&&/^[a-z][a-z' -]*[a-z]$|^[a-z]$/.test(p)&&p.split(' ').length<=4&&!GR.test(p)))];
   const FW=/^(?:a|an|the|of|to|in|on|at|by|for|from|with|into|upon|unto|out|up|down|over|under|was|were|is|are|be|been|being|he|she|it|they|him|her|his|its|their|one|oneself|self|also|therefore|and|or|as|that|which|who|whom|whose|this|these|those|own|not|no)$/;const P2=parts.filter(p=>p.split(' ').some(w=>!FW.test(w)));parts.length=0;parts.push(...P2);
   if(!parts.length||!nums.length)continue;const k=t.side+'|'+t.round+'|'+nums.join(',')+'|'+parts.join(',');if(seen.has(k))continue;seen.add(k);
   gl.push({side:t.side,round:t.round,word:left,nums,parts,seg:seg.slice(Math.max(0,m.index-20),m.index+m[0].length+10).slice(0,200)});}}
 return {cand:[...cand].slice(0,40),gloss:gl.slice(0,60)};}catch(e){return {cand:[],gloss:[],error:String(e&&e.message||e).slice(0,200)};}})();
const __U340=[];
if(__G340.cand.length){for(let o=0;o<15000;o+=1000)__U340.push({k:'col',url:SB+'lexicon_words?select=id,transliteration&order=id&offset='+o+'&limit=1000',prefer:'count=exact'});
 for(const w of __G340.cand)__U340.push({k:'kjv',word:w,url:SB+'kjv_word_map?select=kjv_word&kjv_word=in.('+w+','+w[0].toUpperCase()+w.slice(1)+')&limit=1',prefer:''});}
for(const n of [...new Set(__G340.gloss.flatMap(g=>g.nums))].slice(0,30))__U340.push({k:'ren',num:n,url:SB+'kjv_word_map?select=kjv_word,book,chapter,verse,word_position&strongs_number=eq.'+n+'&limit=1000',prefer:'count=exact'});
if(!__U340.length)return [{json:{none:true,...(__G340.error?{error:__G340.error}:{})}}];
__U340[0].meta=__G340;return __U340.map(j=>({json:j}));
