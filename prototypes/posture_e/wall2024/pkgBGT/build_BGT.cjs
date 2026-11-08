// pkgBGT (feedback_rulings 2026-11-07 item 8, begat tag split): an [L2] tag whose only failing words are quoted plain English words
// found in the KJV text of a cited verse is COUNTED (33345 CR1: '[L2], and Matthew 1:2's "begat" pattern'). One node: L2 Count Plan.
// Usage (from wall2024/): node pkgBGT/build_BGT.cjs
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const B='pkgBGT/base/L2_Count_Plan.js',P='pkgBGT/patched/L2_Count_Plan.js';let s=fs.readFileSync(B,'utf8');const base=sha(s);
const A="const tags=L2C.check(S.l2_tags||[],ow,lex,[...read]);";
if(s.split(A).length!==2)throw new Error('anchor not found exactly once');
const FN=String.raw`
// pkgBGT (ruling item 8, 11-07): a quoted plain English word ("begat") is read by tagWords as a transliteration and then fails against the
// original words. When it is a whole word of the KJV text of a cited verse that was read, it is the KJV English word, so it counts.
function l2EnglishPass2024(tags,read){let kv=[];try{kv=$('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book&&typeof r.text==='string');}catch(e){kv=[];}
 const K={};for(const r of kv)K[r.book+' '+r.chapter+':'+r.verse]=String(r.text).replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[\[\]]/g,'');
 return (tags||[]).map(t=>{if(!t||t.status!=='NOT COUNTED')return t;const seg=String(t.seg||'');const vs=(t.verses||[]).filter(k=>read.has(k)&&K[k]);if(!vs.length)return t;let ch=false;
  const ws=(t.words||[]).map(w=>{if(w.ok||w.kind!=='latin')return w;const lw=String(w.w).toLowerCase();if(!/^[a-z]{2,24}$/.test(lw))return w;
   if(!new RegExp('["“]'+lw+'["”]','i').test(seg))return w;const at=vs.filter(k=>new RegExp('\\b'+lw+'\\b','i').test(K[k]));if(!at.length)return w;
   ch=true;return {...w,ok:true,num:null,route:'KJV English word',in:at.join(', ')};});
  if(!ch)return t;const core=ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws;
  if(core.every(w=>w.ok))return {...t,words:ws,status:'COUNTED',why:ws.map(w=>w.w+' = '+(w.route==='KJV English word'?'the KJV English word of '+w.in:(w.ok?w.num:'root, not in the cited verse'))).join(', ')};
  return {...t,words:ws,why:'not in the cited verse: '+core.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+(t.verses||[]).join(', ')+')'};});}
const tags=l2EnglishPass2024(L2C.check(S.l2_tags||[],ow,lex,[...read]),read);`;
s=s.replace(A,FN.trim().replace(/^/,''));fs.writeFileSync(P,s);new Function('$','$input',s);
console.log({L2_Count_Plan:{base,patched:sha(s)}});
