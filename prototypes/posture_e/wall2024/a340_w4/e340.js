const __E340=(()=>{let P;try{const n=$('L2 Gloss Plan');if(!n.isExecuted)return null;P=n.all().map(i=>i.json);}catch(e){return null;}if(!P.length||P[0].none)return null; /* ASK 340: Part A decisions (read by check() here and in the judge paths) and the Part B trial (record-only; read by Build Save Body and Format Markdown) */
 const meta=P[0].meta||{};let R=[];try{const n=$('L2 Gloss Read');if(n.isExecuted)R=n.all().map(i=>i.json);}catch(e){R=[];}
 const out={version:'340',ok:false,eng:[],cand:meta.cand||[],blocked:[],not_kjv:[],no_answer:[],why:'',gloss:[]};
 try{const F=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]/g,'');
  const tot=r=>{const h=(r&&r.headers)||{};const m=String(h['content-range']||h['Content-Range']||'').match(/\/(\d+)\s*$/);return m?+m[1]:null;};
  const good=r=>!!r&&!r.error&&(r.statusCode===200||r.statusCode===206)&&Array.isArray(r.body);
  const pr=P.map((p,i)=>({p,r:R.length===P.length?R[i]:null}));if(R.length!==P.length)out.why='the gloss read returned '+R.length+' of '+P.length+' items';
  const col=pr.filter(x=>x.p.k==='col');let TF=null,TN=null;
  if(col.length){const ts=col.map(x=>good(x.r)?tot(x.r):null);const rows=[].concat(...col.map(x=>good(x.r)?x.r.body:[]));const ids=new Set(rows.map(r=>r&&r.id));
   if(col.every(x=>good(x.r))&&ts[0]!=null&&ts.every(v=>v===ts[0])&&rows.length===ts[0]&&ids.size===rows.length){TF=new Set();TN=new Set();for(const r of rows){TF.add(F(r.transliteration));try{TN.add(L2C.norm(r.transliteration));}catch(e){}}}
   else out.why=(out.why?out.why+'; ':'')+'the transliteration column read is not complete ('+rows.length+' rows'+(ts[0]!=null?', count '+ts[0]:', no count')+')';}
  for(const w of out.cand){const x=pr.find(y=>y.p.k==='kjv'&&y.p.word===w);const kj=x&&good(x.r)?x.r.body.length>0:null;
   if(kj===null){out.no_answer.push(w);continue;}if(!kj){out.not_kjv.push(w);continue;}if(!TF){out.no_answer.push(w);continue;}
   let tn=false;try{tn=TN.has(L2C.norm(w));}catch(e){tn=true;}if(TF.has(F(w))||tn){out.blocked.push(w);continue;}out.eng.push(w);}
  out.ok=!!TF;
  const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){const n=x.p.num;if(!good(x.r)){REN[n]={why:'the read failed'};continue;}const tt=tot(x.r);if(tt==null||x.r.body.length!==tt){REN[n]={why:'the read holds '+x.r.body.length+' of '+(tt==null?'an unknown number of':tt)+' rows (limit 1000)'};continue;}
   const rows=x.r.body.slice().sort((a,b)=>(a.book<b.book?-1:a.book>b.book?1:0)||(a.chapter-b.chapter)||(a.verse-b.verse)||(a.word_position-b.word_position));const W=new Set(),PH=new Set();let run=[],prev=null;
   const flush=()=>{if(run.length>1)PH.add(run.join(' '));run=[];};for(const r of rows){const wd=String(r.kjv_word||'').toLowerCase().replace(/[^a-z' -]/g,'');if(!wd)continue;W.add(wd);const key=r.book+'|'+r.chapter+'|'+r.verse;if(prev&&prev.key===key&&r.word_position===prev.pos+1)run.push(wd);else{flush();run=[wd];}prev={key,pos:r.word_position};}flush();REN[n]={W,PH};}
  const LG={};for(const r of lex||[]){const k=L2C.numOf(r&&r.strongs_number);if(k&&r.anchor_gloss)LG[k]=String(r.anchor_gloss).replace(/\s*\[source:[^\]]*\]\s*$/i,'').slice(0,160);}
  const forms=p=>{const o=new Set([p]);const ws=p.split(' ');const l=ws.pop();const pre=ws.length?ws.join(' ')+' ':'';for(const v of [l+'s',l+'es',l.replace(/y$/,'ies'),l.replace(/ies$/,'y'),l.replace(/es$/,''),l.replace(/s$/,'')])if(v)o.add(pre+v);return [...o];};
  const FW=new Set('a an the of to in on at by for from with into upon unto out up down over under was were is are be been being he she it they him her his its their one oneself self also therefore and or as that which who whom whose this these those own not no'.split(' '));const SEEN=new Set();
  const LT={};for(const r of lex||[]){const k=L2C.numOf(r&&r.strongs_number);if(k&&r.transliteration)LT[k]=F(r.transliteration);}
  const lexHas=(n,cw)=>{const g=String(LG[n]||'').toLowerCase();return !!g&&cw.every(w=>new RegExp('\\b'+w.replace(/[^a-z']/g,'')+'\\b').test(g));};
  for(const g of meta.gloss||[]){const own=F(g.word);if((g.nums||[]).length>1){for(const part of g.parts){const k='R|'+g.nums.join(',')+'|'+part;if(SEEN.has(k))continue;SEEN.add(k);out.gloss.push({side:g.side,round:g.round,word:g.word,num:g.nums.join(' or '),part,status:'REVIEW',why:'the word maps to '+g.nums.join(' and ')+' in its verses'});}continue;}
   const n=g.nums[0];const R0=REN[n];for(const part of g.parts){const fp=F(part),fq=fp.replace(/^h[ae]/,'');if(fp===own||fq===own||(LT[n]&&(fp===LT[n]||fq===LT[n]))||(TF&&(TF.has(fp)||TF.has(fq))))continue;const cw=part.split(' ').filter(w=>w&&!FW.has(w));if(!cw.length)continue;const k=n+'|'+part;if(SEEN.has(k))continue;SEEN.add(k);
    if(!R0||!R0.W){out.gloss.push({side:g.side,round:g.round,word:g.word,num:n,part,status:'NO ANSWER',why:R0?R0.why:'not read'});continue;}
    const hit=forms(part).some(f=>f.includes(' ')?R0.PH.has(f):R0.W.has(f))||cw.some(w=>forms(w).some(f=>R0.W.has(f)));
    const st=hit?'FOUND':lexHas(n,cw)?'LEXICON WORDING':'NOT IN THE KJV RENDERINGS';out.gloss.push({side:g.side,round:g.round,word:g.word,num:n,part,status:st,kjv:[...R0.W].sort().slice(0,24),...(!hit&&LG[n]?{lexicon:LG[n]}:{})});}}
 }catch(e){out.ok=false;out.eng=[];out.why=(out.why?out.why+'; ':'')+'error: '+String(e&&e.message||e).slice(0,160);}
 return out;})();
