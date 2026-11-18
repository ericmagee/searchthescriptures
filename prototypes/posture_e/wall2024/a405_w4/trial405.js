function __l2t405(RA,ST,ow,lex,dec){/* ASK 405 TRIAL (record-only; Wall 8722, 8725): a line whose [L2] marks follow their claims (MARK-AFTER) is re-read with each mark reading back to the previous [L] mark or the line start, and every tag's word (Gnnnn) and word [Gnnnn] pairs are tested against the bound verses of the number's own language. Nothing counted changes. The re-read tag keeps the verses today's tag binds (Citation Scan). */
 const out={version:'405 TRIAL',lines:[],changes:[],pairs:[],n:{lines:0,marks:0,changed:0,reworded:0,pair_fail:0,pair_pass:0}};
 try{const TW=s=>L2C.tagWords(String(s||''));const nz=s=>String(s||'').replace(/\s+/g,' ').trim();
  const NT=new Set('Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation'.split('|'));
  const read=new Set(ow.map(r=>r.book+' '+r.chapter+':'+r.verse));const RW=[],SP=[];
  for(const [side,round,text] of RA){const t=String(text||'');const nl=[];const sp=[];
   for(const ln of t.split('\n')){const ms=[...ln.matchAll(/\[L([1-4])\]/g)];const l2=ms.filter(m=>m[1]==='2');
    if(!l2.length){nl.push(ln);continue;}const first=l2[0],last=l2[l2.length-1];const nx=ms.find(m=>m.index>last.index);
    const after=ln.slice(last.index+4,nx?nx.index:ln.length);const pv=ms.filter(m=>m.index<first.index&&m[1]!=='2').pop();const before=ln.slice(pv?pv.index+4:0,first.index);
    if(TW(after).length||!TW(before).length){for(const m of l2)sp.push(null);nl.push(ln);continue;}
    let s='',pos=0;for(const m of ms){if(m[1]!=='2'){s+=ln.slice(pos,m.index+4);pos=m.index+4;continue;}const span=ln.slice(pos,m.index);sp.push(span);s+='[L2] '+span+'\n';pos=m.index+4;}s+=ln.slice(pos);nl.push(s);
    out.n.lines++;out.n.marks+=l2.length;if(out.lines.length<20)out.lines.push({side,round,line:nz(ln).slice(0,200)});}
   RW.push([side,round,nl.join('\n')]);SP.push(...sp);}
  const T0=JSON.parse(JSON.stringify(ST||[])),T1=L2C.tags(RW);if(T0.length!==T1.length||T0.length!==SP.length)throw new Error('mark count differs ('+T0.length+', '+T1.length+', '+SP.length+')');
  const T2=T0.map((t,j)=>{if(SP[j]===null)return t;const r=T1[j];const widened=nz(r.seg)!==nz(SP[j]).slice(0,300);return {...r,verses:t.verses,apoc:t.apoc,words:widened?[]:r.words,t405:true};});
  const C0=L2C.check(JSON.parse(JSON.stringify(T0)),ow,lex,[...read],dec),C1=L2C.check(JSON.parse(JSON.stringify(T2)),ow,lex,[...read],dec);
  C1.forEach((t,j)=>{if(!T2[j].t405)return;const a=C0[j];if(a.status!==t.status||JSON.stringify((a.words||[]).map(w=>w.w))!==JSON.stringify((t.words||[]).map(w=>w.w))){if(a.status!==t.status)out.n.changed++;else out.n.reworded++;if(out.changes.length<40)out.changes.push({side:t.side,round:t.round,from:a.status,to:t.status,was:(a.words||[]).map(w=>w.w).join(', ').slice(0,120),now:(t.words||[]).map(w=>w.w).join(', ').slice(0,120)});}});
  const IX=L2C.index(ow,lex);const seen=new Set();
  for(const t of C1){if(!t||t.status==='IGNORED')continue;const seg=String(t.seg||'');
   for(const m of seg.matchAll(/(?:[*_]([^*_\s()\[\]]{1,40})[*_]|([A-Za-zÀ-ɏḀ-ỿʻʼ'’Ͱ-Ͽἀ-῿֐-׿-]{1,40}))\s*[\(\[]\s*([GH])0*(\d{1,5})\s*[\)\]]/g)){
    const word=m[1]||m[2];const num=m[3]+m[4];const k=t.side+'|'+t.round+'|'+word.toLowerCase()+'|'+num;if(seen.has(k))continue;seen.add(k);
    const own=(t.verses||[]).filter(v=>read.has(v)).filter(v=>NT.has(String(v).replace(/ \d+:\d+$/,''))===(m[3]==='G'));
    const rows=ow.filter(r=>own.includes(r.book+' '+r.chapter+':'+r.verse));if(!rows.length)continue;
    const kind=/[Ͱ-Ͽἀ-῿]/.test(word)?'greek':/[֐-׿]/.test(word)?'hebrew':'latin';
    const nr=rows.filter(r=>L2C.numOf(r.strongs_number)===num);const one=nr.length?L2C.matchWord({w:word,kind},nr,IX):{ok:false};
    if(one.ok){out.n.pair_pass++;continue;}const ws=L2C.matchWord({w:word,kind},rows,IX);
    if(!nr.length&&!ws.ok)continue;out.n.pair_fail++;if(out.pairs.length<40)out.pairs.push({side:t.side,round:t.round,word,num,verses:own.slice(0,6).join('; '),why:nr.length?num+' stands in the bound verses, not as this word':'the word stands as '+(ws.num||'another number')+', not '+num});}}
 }catch(e){out.error=String(e&&e.message||e).slice(0,200);}
 return out;}
