/* pkgBAR (Eric approved 17:21 CST 2026-11-06; W3 spec, Wall 2632, parts 1 and 2). Needs IMP (pkgIMP src_IMP.js) loaded before it.
   BAR.check(round,raw,R): the pkgIMP harvest on one debater round. Every harvested sentence is a barred move unless a NOT A REQUIREMENT
   line stands on its line or one of the next two lines and verifies (IMP.rebutOk: the quote, 6 words or more, stands word for word in a
   round of the other side). BAR.note: the one re-call's user turn. BAR.strike: each VOID sentence replaced in the round by the system's mark. */
const BAR=(()=>{
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const NAR=/NOT A REQUIREMENT\s*--\s*rebuts\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]/i;
 const MARK='[VOID (pkgBAR): a barred move struck by the system. The press this answered counts as unanswered.]';
 /* the sentence as it stands in the round: the harvest collapses spaces and trims markdown, so the words are matched with any run of
    spaces or markdown between them */
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 function loc(raw,s){const t=String(raw||'');const w=String(s||'').trim().split(/\s+/).filter(Boolean);if(!w.length)return null;
  const re=new RegExp(w.map(esc).join('[\\s*_]+'));const m=t.match(re);return m?{i:m.index,len:m[0].length}:null;}
 const move=s=>/\b(?:needs?|requires?|must|would\s+have\s+to|has\s+to)\b/i.test(s)
  ?{code:'b',name:'BARRED MOVE (b), a requirement the verse never sets'}:{code:'a',name:'BARRED MOVE (a), an answer from silence'};
 function check(round,raw,R){const out={applies:true,round,hits:[],rebutted:[]};const t=String(raw||'');if(!t){out.applies=false;return out;}
  const H=IMP.harvest({[round]:t});
  for(const h of H){const at=loc(t,h.sentence);let nar=null;
   if(at){const tail=t.slice(at.i).split('\n').slice(0,3).join('\n');const m=tail.match(NAR);
    if(m){const v=IMP.rebutOk({nar:true,rround:m[1].toUpperCase(),rquote:m[2]},round,R||{});nar={rround:m[1].toUpperCase(),rquote:m[2],ok:v.ok,why:v.why};}}
   const x={id:'B'+(out.hits.length+out.rebutted.length+1),round,sentence:h.sentence,phrase:h.phrase,block:h.block,move:move(h.sentence),found:!!at,nar};
   (nar&&nar.ok?out.rebutted:out.hits).push(x);}
  out.pass=!out.hits.length;return out;}
 function note(c){return "BARRED MOVES CHECK -- computed by the system from your round, not by a model. Each sentence below answers from what a verse does not name, state, say or deny. That is a barred move (BARRED MOVES, your instructions).\n"
  +"Write your whole round again, the same case in the same words, but replace each sentence below with a positive answer: quote the words a verse does state ([L1], with its reference) and say what they carry. "
  +"If a sentence only denies a requirement that the other side imposed, you may keep it and write directly under it the line NOT A REQUIREMENT -- rebuts [<the other side's round>] \"<their words, 6 or more, word for word>\". "
  +"A sentence that still answers from silence in the round you return is VOID: the system strikes it from the round, the press it answered counts as unanswered, and the offense is named in the run report. The sentences:\n"
  +c.hits.map(h=>h.id+' ['+h.round+'] "'+h.sentence+'" -- '+h.move.name+(h.nar&&!h.nar.ok?' (your NOT A REQUIREMENT line does not verify: '+h.nar.why+')':'')).join('\n')
  +"\nReturn the whole round; this is the only request of its kind. Repeated offenses will result in disqualification.";}
 function strike(raw,hits){let t=String(raw||'');const struck=[],unfound=[];
  for(const h of hits){const at=loc(t,h.sentence);if(!at){unfound.push(h.id);continue;}t=t.slice(0,at.i)+MARK+t.slice(at.i+at.len);struck.push(h.id);}
  return {raw:t,struck,unfound};}
 /* the rounds read so far, by label: a D node holds the defender's [CRn], a C node the challenger's [DRn] */
 const LABEL=n=>(n[0]==='D'?'CR':'DR')+n[1];
 return {check,note,strike,loc,move,LABEL,MARK,NAR};})();
