/* pkgCLR: the count-line entry reader (W1 work item 1, Wall 2701). It reads a judge's last CONCEDED LINKS (DEFENDER) or CHALLENGER CONCEDED
   LINKS line together with its unlabelled continuation lines (gemini writes the premises on the next line: 33218), and returns the count the
   line states and each entry it names: {ref:'PREMISE'|'LINK'|'C'|'D', num, link (a "(LINK n" written beside a premise), tag}. COUNTED tags (in capitals):
   UNEXHIBITED, CONCEDED, WITHDRAWN; a line whose count is 0 counts none. Not counted: VOID, SPARED, SUPPORTED, NOT VOID, "spared". Numbers inside parentheses and quotes are read
   only as a premise's own "(LINK n". Side-neutral; one library for pkgKSC and the count checks. */
const CLR=(()=>{
 const LBL=/^\s*(?:[-\u2022>]\s*|\d+[.)]\s+)?\**\s*(?:[A-Z][A-Z0-9 '\/()-]{2,60}:|D\d+\s+vs\.?\s+C\d+|C\d+\s+vs\.?\s+D\d+|\[|FORCED\b|RESULT\b|KEYSTONE\b|CLAUSE\b|#)/;
 const COUNTED=/^(UNEXHIBITED|CONCEDED|WITHDRAWN)$/i,TAGS='UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED';
 const un=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/\\+"/g,'"');
 function block(text,side){const L=un(text).split('\n');const lab=side==='CHALLENGER'?/^\s*(?:[-\u2022>]\s*)?\**\s*CHALLENGER CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i:/^\s*(?:[-\u2022>]\s*)?\**\s*(?:DEFENDER )?CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i;
  let at=-1,cnt=null;L.forEach((l,i)=>{const m=l.match(lab);if(m){at=i;cnt=m[1]!=null?+m[1]:null;}});if(at<0)return null;
  const parts=[L[at].replace(lab,'')];for(let i=at+1;i<L.length&&i<at+12;i++){const l=L[i];if(!l.trim())break;if(LBL.test(l.replace(/[*_`]/g,'')))break;parts.push(l);}
  return {count:cnt,line:L[at].trim(),cont:parts.length-1,body:parts.join(' ').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim()};}
 // a "ref group": "Premise 2", "Premises 2, 4 and 5", "premise 6", "item 1", "LINK 5", "C1", "(1)", or a bare "2" after "--", ";" or ":"
 const REF=new RegExp('(?:\\b(premises?|items?|links?|counted:?)\\s+((?:\\d+(?:\\s*(?:,|and|&|–|-|to|through)\\s*)*)+)|\\b([CD])(\\d)\\b|\\((\\d)\\)|(?:^|--|;|:)\\s*(\\d)(?=\\s+(?:'+TAGS+')\\b))','gi');
 const nums=s=>{const o=[];const t=String(s).replace(/\s+/g,' ');for(const m of t.matchAll(/(\d+)\s*(?:[–-]|to|through)\s*(\d+)|(\d+)/g)){if(m[1]){for(let k=+m[1];k<=+m[2]&&k<=+m[1]+9;k++)o.push(k);}else o.push(+m[3]);}return o;};
 function entries(body){const out=[];if(!body)return out;
  // parentheses and quotes are masked (their numbers are verses), except a "(LINK n" right after a premise
  let b=body.replace(/"[^"]*"|\u201c[^\u201d]*\u201d|\u2018[^\u2019]*\u2019|(?<=[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,m=>' '.repeat(m.length));
  const own=[];b=b.replace(/\(([^()]*)\)/g,(m,c,off)=>{const k=c.match(/^\s*(?:\[?DR2\]?\s*)?LINK\s+(\d+|none)\b/i);if(k)own.push({at:off,link:/none/i.test(k[1])?'none':+k[1]});return /^\s*\d\s*$/.test(c)?m:' '.repeat(m.length);});
  for(const cl of splitClauses(b)){const lead=cl.text.match(new RegExp('^\\s*(?:--\\s*)?(?:counted\\s*:?\\s*)?('+TAGS+')\\b(?:\\s*\\(stated\\))?\\s*:','i'));
   const refs=[...cl.text.matchAll(REF)];
   for(let r=0;r<refs.length;r++){const m=refs[r];let ref,ns;
    if(m[1]){const w=m[1].toLowerCase();ref=/^link/.test(w)?'LINK':'PREMISE';ns=nums(m[2]);}else if(m[3]&&!new RegExp('^\\s*[:(\\-\\s]*('+TAGS+')\\b','i').test(cl.text.slice(m.index+m[0].length))){continue;}else if(m[3]){ref=m[3];ns=[+m[4]];}else if(m[5]){ref='PREMISE';ns=[+m[5]];}else{ref='PREMISE';ns=[+m[6]];}
    const from=m.index+m[0].length;let nx=r+1;let inl=null; /* "premise 1 LINK 5 CONCEDED": the LINK names the premise's link */
    if(ref==='PREMISE'&&ns.length===1&&refs[nx]&&/^link/i.test(refs[nx][1]||'')&&/^\s*$/.test(cl.text.slice(from,refs[nx].index))){const k=nums(refs[nx][2]);if(k.length===1){inl=k[0];r++;nx++;}}
    const from2=inl!=null?refs[r].index+refs[r][0].length:from;const to=nx<refs.length?refs[nx].index:cl.text.length;const seg=cl.text.slice(from2,to);
    let tg=(seg.match(new RegExp('\\b((?:NOT|not|none|no)\\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED|[Ss]pared|[Ss]upported)\\b'))||[]);let tag=tg[2]?(tg[1]?'NOT '+tg[2]:tg[2]).toUpperCase():null; /* counted tags are read in capitals only ("was conceded but" is prose); NOT/none/no negates */
    if(!tag&&lead)tag=lead[1].toUpperCase();if(!tag){const back=cl.text.slice(0,m.index).match(new RegExp('\\b('+TAGS+')\\b[^.;]*$','i'));if(back&&!/\b(spared|supported)\b/i.test(cl.text.slice(back.index,m.index)))tag=null;}
    if(!tag)continue;const ow=own.find(o=>o.at>=cl.off+m.index&&o.at<=cl.off+from+2);
    for(const n of ns)out.push({ref,num:n,link:inl!=null?inl:(ref==='PREMISE'&&ow?ow.link:null),tag,counted:COUNTED.test(tag)});}}
  return out;}
 function splitClauses(b){const o=[];let off=0;for(const p of b.split(/(?<=[.;])\s+(?=[A-Z(\d]|premise|item|counted)/)){o.push({text:p,off:b.indexOf(p,off)});off+=p.length;}return o;}
 function read(text,side){const B=block(text,side);if(!B)return null;const e=entries(B.body);const counted=B.count===0?[]:[...new Map(e.filter(x=>x.counted).map(x=>[x.ref+x.num,x])).values()];
  return {...B,entries:e,counted,named:counted.length,agrees:B.count==null?null:counted.length===B.count};}
 return {read,block,entries};})();
if(typeof module!=='undefined')module.exports=CLR;
