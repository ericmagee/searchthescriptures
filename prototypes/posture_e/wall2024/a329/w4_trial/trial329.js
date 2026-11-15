function __l2trial329(TAGS,RA,OW,LEX,KV){/* pkgL2T (ASK 329 TRIAL, record-only; Wall 6902, 6903, 6907, 6908): binds an [L2] tag that names no verse of its own to the verses its own line or paragraph gives, and reports where that differs from today's section binding. It reads a copy of the checked tags and changes nothing in them. Only Build Save Body and Format Markdown read its output. */
 const out={version:'329 TRIAL',items:[],n:{checked:0,same:0,not_counted:0,pair:0,review:0}};
 try{const IX=L2C.index(OW||[],LEX||[]);const KJ={};for(const r of KV||[])if(r&&r.book)KJ[r.book+' '+r.chapter+':'+r.verse]=String(r.text||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[\[\]]/g,'');
  const TX={};for(const [s,rd,t] of RA||[])TX[rd]=String(t||'');
  const BK=/((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+))\.?\s+(\d{1,3}):(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?/g;
  const keysOf=s=>{const o=[];for(const m of String(s||'').matchAll(BK)){const v1=+m[3],v2=+(m[4]||m[3]);for(let v=v1;v<=Math.min(v2,v1+40);v++){const k=L2C.refsIn(m[1]+' '+m[2]+':'+v)[0];if(k)o.push(k);}}return [...new Set(o)];};
  const bare=(s,ctx)=>{const o=[];let unk=false;const S=String(s||'');for(const m of S.matchAll(/(?<![\w:.])(\d{1,3}):(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?(?![\d:])/g)){const pre=S.slice(Math.max(0,m.index-40),m.index);if(/((?:[123] )?(?:Song of Solomon|[A-Z][a-z]+))\.?\s+$/.test(pre))continue;
    const before=(ctx.par.slice(0,ctx.parAt)+S.slice(0,m.index));let bk=null;for(const x of before.matchAll(BK))bk=x[1];if(!bk)for(const x of ctx.sec.slice(0,ctx.secAt).matchAll(BK))bk=x[1];
    if(!bk){unk=true;continue;}const v1=+m[2],v2=+(m[3]||m[2]);for(let v=v1;v<=Math.min(v2,v1+40);v++){const k=L2C.refsIn(bk+' '+m[1]+':'+v)[0];if(k)o.push(k);else unk=true;}}return {keys:o,unk};};
  const PAIR={H2029:'H2030',H2030:'H2029'};const nt=k=>(IX.V[k]||[]).some(r=>/^G/.test(r.strongs_number||''));const holds=(k,n)=>(IX.V[k]||[]).some(r=>L2C.numOf(r.strongs_number)===n);
  const nz=s=>String(s||'').toLowerCase().replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim();
  for(const t of TAGS||[]){if(!t||t.status!=='COUNTED')continue;const T=TX[t.round];if(typeof T!=='string'||typeof t.at!=='number')continue;if(L2C.refsIn(t.seg).length)continue; /* B1: its own text names a verse: today's binding stands */
   out.n.checked++;const i=t.at;const ls=T.lastIndexOf('\n',i-1)+1,le=(x=>x<0?T.length:x)(T.indexOf('\n',i));const line=T.slice(ls,le),before=T.slice(ls,i),after=T.slice(i+4,le);
   const pa=T.lastIndexOf('\n\n',i);const ps=pa<0?0:pa;const par=T.slice(ps,i);const blk=L2C.blockAt(T,i);const bi=T.indexOf(blk);const sec=bi>=0&&bi<=i?T.slice(bi,i):par;
   let mode='backward in its paragraph',unk=false;const fwd=[];const B={back:keysOf(par),pipe:[],foot:[],press:[],bare:[]}; /* B4: every reference before the marker in its paragraph (this holds the nearest one, so a tag that passes there keeps its status) */
   const pm=after.match(/^[^|\n]*\|\s*\[L3\]\s*([^|\n]*)/);if(pm){ /* B2 (6902): "[L2] <tag> | [L3] <ref>" binds the tag to that ref (team rule 6988) */B.pipe=keysOf(pm[1].split(/\s--\s|\s—\s/)[0]);if(B.pipe.length)mode='pipe form';} /* B2 */
   let L1K=[];{const j=before.lastIndexOf('[L1]');if(j>=0){const r1=before.slice(j+4).split(/\[L[1-4]\]/)[0];if(keysOf(r1).length>=2){L1K=keysOf(r1);B.foot=keysOf(line);mode='footing line';}}} /* B3 */
   let PK=[];if(/--\s*MEANS\s*:/.test(before)){B.press=keysOf(before);PK=keysOf(before.split(/--\s*MEANS\s*:/)[0]);} /* a press line: the verse it presses, before the marker (a later [L3] on that line is a cross-reference) */
   {const b1=bare(par,{par:'',parAt:0,sec,secAt:Math.max(0,sec.length-par.length)}),b2=bare(t.seg,{par,parAt:par.length,sec,secAt:sec.length});B.bare=b1.keys.concat(b2.keys);unk=b1.unk||b2.unk;} /* B5 */
   let bound=[...new Set([].concat(B.back,B.pipe,B.foot,B.press,B.bare))];
   for(const m of after.matchAll(/\[L3\]([^\[\n]*)/g))fwd.push(...keysOf(m[1]));
   if(!bound.length){out.n.same++;continue;} /* B6: no reference found: the section binding stands */
   const rd=bound.filter(k=>(IX.V[k]||[]).length);const unread=bound.filter(k=>!rd.includes(k)); /* W1 6976 point 3: an unread bound verse is never replaced by the whole block */
   const cands=[].concat(...rd.map(k=>IX.V[k]));const ws=t.words||[];
   const okIn=w=>w.route==='KJV English word'?String(w.in||'').split(', ').some(k=>rd.includes(k)):L2C.matchWord({w:w.w,kind:w.kind},cands,IX).ok;
   const core=(ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws).filter(w=>w.kind==='strongs');const bad=core.filter(w=>!okIn(w)); /* the trial tests Strong's numbers only, the population measured (Wall 6884, 6888) */let pre=null;for(const w of core){const n=w.num||w.w;if(!/^[GH]\d/.test(String(n)))continue;const g=/^G/.test(n);const rk=k=>(IX.V[k]||[]).length>0; /* team rule 6988: R2, R2b, R3 */
    if(PK.length){if(!PK.every(rk)){pre={w,n,cls:'NOT COUNTED',why:'the pressed verse '+PK.filter(k=>!rk(k)).join(', ')+' was not read this run, so its language cannot be told (R3)'};break;}
     if(PK.every(k=>nt(k)!==g)){pre={w,n,cls:'NOT COUNTED',why:'cross-language (operator ruling, 15 Nov 09:17 and 09:39 CST): '+n+' is '+(g?'Greek':'Hebrew')+' and the line presses '+PK.join(', ')+', '+(g?'Old':'New')+' Testament (R2)'};break;}}
    if(L1K.length>=2){if(!L1K.every(rk)){pre={w,n,cls:'NOT COUNTED',why:'the [L1] verse '+L1K.filter(k=>!rk(k)).join(', ')+' was not read this run, so its language cannot be told (R3)'};break;}
     if(L1K.some(k=>nt(k))&&L1K.some(k=>!nt(k))&&!L1K.filter(k=>nt(k)===g).some(k=>holds(k,n))){pre={w,n,cls:'NOT COUNTED',why:'mixed-testament footing line ([L1] '+L1K.join(', ')+'): '+n+' stands in no [L1] verse of its own language (R2b)'};break;}}}
   if(pre){out.n.not_counted++;out.items.push({side:t.side,round:t.round,at:t.at,seg:String(t.seg||'').slice(0,160),word:pre.w.w,num:pre.n,today:'COUNTED',trial:pre.cls,binding:mode,bound:rd,why:pre.why});continue;}
   if(!bad.length){out.n.same++;continue;}
   const holdSecX=n=>(t.verses||[]).filter(k=>n&&holds(k,n));const w0=bad[0];const n=w0.num||(w0.kind==='strongs'?w0.w:null);let cls,why;
   const uq=x=>String(x||'').replace(/["“][^"”]*["”]/g,' ');const holdSec=(t.verses||[]).filter(k=>n&&holds(k,n));const clause=before.split(/(?<=[.!?;])\s+/).pop()||'';
   if(n&&PAIR[n]&&rd.some(k=>holds(k,PAIR[n]))){cls='NUMBERING PAIR';why=n+' is tagged; '+rd.filter(k=>holds(k,PAIR[n])).join(', ')+' holds '+PAIR[n]+' (the fixed pair list holds only H2029/H2030)';}
   else if(unread.length){cls='NOT COUNTED';why=n+' is not in '+(rd.join(', ')||'any read verse')+'; the bound verse '+unread.join(', ')+' was not read this run, so its language and words cannot be told';}
   else if(n&&rd.length&&rd.every(k=>nt(k)!==/^G/.test(n))){cls='NOT COUNTED';why='cross-language (operator ruling, 15 Nov 09:17 and 09:39 CST): '+n+' is '+(/^G/.test(n)?'Greek':'Hebrew')+' and is tagged on '+rd.join(', ')+', '+(/^G/.test(n)?'Old':'New')+' Testament'+(holdSecX(n).length?'; it stands in '+holdSecX(n).join(', '):'');}
   else if(unk){cls='REVIEW';why='a bare chapter:verse whose book cannot be told';}
   else if(/\b(?:not|wrongly)\b/i.test(uq(t.seg))||(!/\bMEANS\b/.test(clause)&&/\b(?:not|wrongly)\b/i.test(uq(clause)))){cls='REVIEW';why='the tag or the clause before it says "not" or "wrongly" in its own words (quoted verse words, and a MEANS argument, are not read for this)';}
   else if([...(t.seg+' '+clause).matchAll(/["“]([^"”]{6,})["”]/g)].some(q=>holdSec.some(k=>KJ[k]&&nz(KJ[k]).includes(nz(q[1]))))){cls='REVIEW';why='the tag or the clause before it quotes words of a verse that holds '+n;}
   else{cls='NOT COUNTED';const cr=holdSec.filter(k=>fwd.includes(k)&&!rd.includes(k));why='not in '+rd.join(', ')+'; '+(holdSec.length?(cr.length?'stands only in the cross-reference '+cr.join(', ')+' after the tag':'stands only in '+holdSec.join(', ')):'stands in no verse of its section');}
   out.n[{'NOT COUNTED':'not_counted','NUMBERING PAIR':'pair','REVIEW':'review'}[cls]]++;
   out.items.push({side:t.side,round:t.round,at:t.at,seg:String(t.seg||'').slice(0,160),word:w0.w,num:n,today:'COUNTED',trial:cls,binding:mode,bound:rd,why});}
 }catch(e){out.error=String(e&&e.message||e).slice(0,200);}
 return out;}
