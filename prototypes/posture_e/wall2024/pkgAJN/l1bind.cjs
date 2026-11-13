// Replays ECL.l1 binding (Shared Library s184 lines 1851-1866) on sol's S4 CHANGE TO (enforcer_log 35636).
const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
const PAIR=new RegExp(REF.source+'[^"“”\\n\\[]{0,40}?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z])[\'‘](?!s\\b|\\s)((?:[^\'‘’\\n]|[\'’](?=[a-z])){6,400}?)[\'’](?![a-z]))','g');
const N=s=>String(s).replace(/\\+"/g,'"');
const AQ=/ANSWER:\s*["“'‘]([\s\S]*?)["”'’]\s*--\s*(MEETS|MISSES|FAILS)\b\s*(?:--\s*([\s\S]*))?$/i;
const variants={
 stored: 'ANSWER CHECK: Luke 1:32 -- [CR3] -- MEANS: "the title and throne are given before Mary\'s question, and the \\\\"therefore also\\\\" of 1:35 joins back to them" -- ANSWER: "The title and throne are given there to the child of Mary\'s womb (Luke 1:31). Luke 1:35 then adds a new reason: \\\\"therefore also\\\\"." -- MEETS -- [L1] Luke 1:32 "the Lord God shall give unto him the throne of his father David" positively carries the earlier throne promise, and [L3] Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God" supplies the later explanation attached to the coming and overshadowing.',
 control_noquote_in_answer: 'ANSWER CHECK: Luke 1:32 -- [CR3] -- MEANS: "x" -- ANSWER: "The title and throne are given there to the child of Mary\'s womb." -- MEETS -- [L1] Luke 1:32 "the Lord God shall give unto him the throne of his father David" positively carries it.'
};
for(const [k,v] of Object.entries(variants)){
 const to=N(v);const m=to.match(AQ);const t=m?(m[1]+' '+(m[3]||'')):to;
 const g='FORCED -- GROUND: '+t;
 const T=[...g.matchAll(/\[L([1-4])\]/g)];
 T.forEach((mm,kk)=>{if(mm[1]!=='1')return;const a=mm.index+4,b=kk+1<T.length?T[kk+1].index:g.length,pa=kk>0?T[kk-1].index+4:0;
  const before=g.slice(Math.max(pa,mm.index-600),mm.index);const bs=[...before.matchAll(PAIR)];let p=bs.length?bs[bs.length-1]:null;
  if(p&&before.slice(p.index+p[0].length).replace(/[\s;,.:)]+/g,'').length)p=null;
  let form='backward';
  if(!p){const as=[...g.slice(a,Math.min(b,a+700)).matchAll(PAIR)];p=as.length&&as[0].index<=6?as[0]:null;form='forward';}
  console.log(k,'| bound form:',p?form:'none','| ref:',p?p[1]+' '+p[2]+':'+p[3]:'-','| quote:',p?(p[5]||p[6]):'-');});
}
