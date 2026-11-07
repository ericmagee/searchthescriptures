// pkgL2R (W3 queue B4, hermes 3 #4): the [L2] check, two changes, side-neutral (debaters and judges use the one library L2C).
// 1. A word the tag names only as the ROOT of another word ("*enomizeto* (G3543), from *nomos*") is not a claim that the root stands in
//    the verse. A root that is not in a cited verse no longer refuses the tag; the tag's other words decide it. A tag of roots only is read
//    as before. 33175: DR1 enomizeto (G3543) at Luke 3:23 was refused only for "nomos".
// 2. Each word carries the verses its match was found in (in), so a refusal row can name the tag, the verses it was bound to and the
//    map verdict per word (the AUDIT v28 [L2] CHECK line, Build Save Body).
// The why strings keep their form ("not in the cited verse: ... (cited: ...)"), which Build Independent Verdict and Panel Build strip.
const L2C_PAIRS=[
[" function tags(rounds){",
` // pkgL2R: a word named only as the root of another ("from *nomos*", "from the root X", "derived from G3551") is marked root:true
 const ROOTPRE=/(?:\\bfrom|\\broot|\\bderived\\s+from|\\bcognate\\s+(?:of|with|to)|\\brelated\\s+to)(?:\\s+(?:the|a|an))?(?:\\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\\s*_"\\u201c\\u201d\\u2018\\u2019'(,:]*$/i;
 const LETTER=/[a-z\\u00e0-\\u024f\\u1e00-\\u1eff\\u0370-\\u03ff\\u1f00-\\u1fff\\u0590-\\u05ff\\u02bc\\u02bb]/i;
 function markRoots(seg,wds){const s=String(seg||'');const lo=s.toLowerCase();const R=new Set();
  const occ=w=>{const out=[];const k=String(w.w).toLowerCase();const sm=w.kind==='strongs'?k.match(/^([gh])(\\d+)$/):null;
   if(sm){for(const x of s.matchAll(new RegExp('\\\\b'+sm[1]+'0*'+sm[2]+'\\\\b','gi')))out.push(x.index);return out;}
   let i=-1;while((i=lo.indexOf(k,i+1))>=0){const b=i>0?lo[i-1]:'',a=lo[i+k.length]||'';if((b&&LETTER.test(b))||(a&&LETTER.test(a)))continue;out.push(i);}return out;};
  const pos=wds.map(occ);
  // pass 0: the root phrase stands just before the word; pass 1: a word in parentheses just after a root word ("from *nomos* (G3551)")
  const rootAt=(i,pass)=>{const pre=s.slice(Math.max(0,i-60),i);if(ROOTPRE.test(pre))return true;if(!pass)return false;
   const m=pre.match(/([^\\s(*_"\\u201c\\u201d]+)[*_"\\u201d\\u2019]*\\s*\\(\\s*$/);if(!m)return false;const j=i-pre.length+pre.lastIndexOf(m[1]);
   return wds.some((w,k)=>R.has(k)&&pos[k].includes(j));};
  for(let pass=0;pass<2;pass++)wds.forEach((w,k)=>{if(R.has(k)||!pos[k].length)return;if(pos[k].every(i=>rootAt(i,pass)))R.add(k);});
  return wds.map((w,k)=>R.has(k)?{...w,root:true}:w);}
 function tags(rounds){`],
["   out.push({side,round,at:i,seg:seg.replace(/\\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}",
 "   wds=markRoots(seg,wds); /* pkgL2R */\n   out.push({side,round,at:i,seg:seg.replace(/\\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}"],
["   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null};});\n",
 "   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);const at=m.ok?read.filter(k=>(IX.V[k]||[]).some(r=>numOf(r.strongs_number)===m.num)):[];\n    return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null,...(wd.root?{root:true}:{}),...(at.length?{in:at.join(', ')}:{})};});\n"+
 "   const core=ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws; /* pkgL2R: a root the tag names does not decide it */\n"],
["   else if(ws.every(w=>w.ok)){status='COUNTED';why=ws.map(w=>w.w+' = '+w.num).join(', ');}",
 "   else if(core.every(w=>w.ok)){status='COUNTED';why=ws.map(w=>w.w+' = '+(w.ok?w.num:'root, not in the cited verse')).join(', ');}"],
["   else{status='NOT COUNTED';why='not in the cited verse: '+ws.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')';}",
 "   else{status='NOT COUNTED';why='not in the cited verse: '+core.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')';}"],
];
// Build Save Body: the AUDIT v28 [L2] CHECK line names, for each refusal, the tag's words, the verses it was bound to, and each word's verdict
const BSB_OLD="(n('NOT COUNTED')?': '+T.filter(t=>t.status==='NOT COUNTED').slice(0,12).map(t=>t.round+' '+(t.words||[]).map(w=>w.w).join('/')).join(', '):'')+'.]');";
const BSB_NEW="(n('NOT COUNTED')?': '+T.filter(t=>t.status==='NOT COUNTED').slice(0,12).map(t=>t.round+' '+(t.words||[]).map(w=>w.w).join('/')+' (bound to '+((t.verses||[]).join(', ')||'no verse')+'; map: '+(t.words||[]).map(w=>w.w+(w.ok?' = '+w.num+(w.in?' in '+w.in:''):w.root?' root, not read':' in none of them')).join('; ')+')').join(' | '):'')+'.]'); /* pkgL2R */";
module.exports={L2C_PAIRS,BSB_OLD,BSB_NEW};
