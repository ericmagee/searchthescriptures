// pkgWLD (tracker D51, W2, 11-08): the PRESSED-WITNESS LEDGER says WHERE a proven witness is named:
//   NAMED IN AN ANSWER [round] "<words>"   (a MEANS [<round>] header or its block, or a bold label that opens with the verse)
//   NAMED ONLY IN OTHER TEXT [round] "<words>"
//   NOT NAMED (unchanged).
// A judge may not call a witness NAMED IN AN ANSWER unanswered (it may still grade MISSES / FORCED). Side-neutral: one rule for both sides.
// In an answer: a MEANS [<round>] header line, a bold label that opens with the verse, a press answered by id (pkgWLA), or a list item that
// opens with the verse under an "Answer ... press/witness" heading (to the next ---, LINK, markdown or italic heading).
// Nodes: Panel Build, Build Independent Verdict (identical PWL block). Base: argv[2] or fetchback_live_s68.
const fs=require('fs'),cr=require('crypto');const h=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s68.json';const OUT=process.argv[3]||'pkgWLD/patched';
const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const FN=` /* pkgWLD (D51): where a named witness is named. In an answer: a MEANS [<round>] header line; a bold label that opens with the verse; or a list
    item that opens with the verse under an "Answer ... press/witness" heading (to the next ---, LINK, markdown or italic heading). Never a line that
    restates a press. Otherwise other text. */
 const wldClean2024=s=>String(s==null?'':s).replace(/[*_\`#]+/g,'').replace(/["\\u201c\\u201d]/g,"'").replace(/\\s+/g,' ').trim();
 const wldInAns2024=(t,pos)=>{const ls=t.lastIndexOf('\\n',pos-1)+1;const le=t.indexOf('\\n',pos);const line=t.slice(ls,le<0?t.length:le);const before=t.slice(ls,pos);
  if(/press(?:ed)?\\s+with\\s*:|The press means|^\\s*\\*?Premise:/i.test(before)||/^\\s*[*_-]*\\s*PRESSED WITH/i.test(line))return false;
  if(/^\\s*[*_-]*\\s*MEANS\\s*\\[/i.test(line))return true;
  if(/^\\s*(?:[-*]\\s*)?\\*\\*\\s*(?:\\([a-z0-9]\\)\\s*)?(?:Press\\s+)?$/i.test(before))return true;
  if(!/^\\s*(?:[-*]|\\d+[.)])\\s+[*_]*\\s*(?:[*_]*(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?\\.?\\s+\\d+:\\d+(?:\\s?[-\\u2013\\u2014]\\s?\\d+)?[*_]*\\s*(?:,|;|and|&)?\\s*)*$/.test(before))return false;
  const U=t.slice(0,Math.max(0,ls-1)).split('\\n');for(let j=U.length-1;j>=0;j--){const x=U[j];
   if(/^\\s*[*_#]*\\s*Answers?\\b[^\\n]{0,60}\\b(?:press|witness)/i.test(x))return true;
   if(/^\\s*-{3,}\\s*$/.test(x)||/^\\s*[*#]*\\s*LINK\\s+(?:\\d+|none)\\b/i.test(x)||/^\\s*#{1,6}\\s/.test(x)||/^\\s*\\*[^*\\n]+\\*\\s*$/.test(x)||/^\\s*[*_-]*\\s*MEANS\\s*\\[/i.test(x)||/UNSUPPORTED-L4 PREMISES/i.test(x))return false;}
  return false;};
 const wldWords2024=(t,pos)=>{const ls=t.lastIndexOf('\\n',pos-1)+1;const le=t.indexOf('\\n',pos);const line=t.slice(ls,le<0?t.length:le);const p=pos-ls;
  let a=Math.max(0,p-40),b=Math.min(line.length,p+80);if(a>0){const s=line.indexOf(' ',a);if(s>=0&&s<p)a=s+1;}if(b<line.length){const s=line.lastIndexOf(' ',b);if(s>p)b=s;}
  return (a>0?'...':'')+wldClean2024(line.slice(a,b))+(b<line.length?'...':'');};
 const wldHits2024=(t,bk,cv)=>{const T=String(t||'');const out=[];if(!T)return out;const c=+String(cv).split(':')[0],v=+String(cv).split(':')[1];
  for(const r of REFP.parse(T,{scoped:true})){if(r.c!==c||v<r.v1||v>r.v2||(r.v2-r.v1)>12)continue;if(bk&&!(r.book===bk||(!r.book&&r.ctx===bk)))continue;const pos=typeof r.at==='number'?r.at:r.pos; /* the list head's start, book included */out.push({pos,ans:wldInAns2024(T,pos)});}
  return out;};
`;
const EDITS=[
 [" const side=(pressing,answering,headRe,early,earlier,early2,earlier2)=>{",FN+" const side=(pressing,answering,headRe,early,earlier,early2,earlier2,RN)=>{ /* pkgWLD: RN = the answering rounds by name */"],
 ["  const __wla=headRe===CH_RE?wlaById2024(answering):null; /* pkgWLA */",
  "  const __wla=headRe===CH_RE?wlaById2024(answering):null; /* pkgWLA */\n"+
  "  const __wldW=(label,r,P,n)=>{try{const ks=r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv);const bk=r.book||r.ctx||'';\n"+
  "    if(__wla&&P&&wlaNamed2024(__wla,n,P,ks)){const m=String(answering).split('\\n').find(l=>/^\\s*[*_-]*\\s*MEANS\\s*\\[CR3\\]\\s*P\\d+\\.\\d+/i.test(l)&&__wla.some(x=>x.n===n&&x.lay&&P.verses.some(z=>ks.includes(z.key)&&z.means&&wlaNorm2024(z.means)===x.means)&&wlaNorm2024(l).includes(x.means)));return {ans:true,rd:'DR3',w:wldClean2024(m||'MEANS [CR3] P'+n)};}\n"+
  "    const src=[];for(const [nm,tx] of (RN.ans||[]))src.push([nm,tx]);if(RN.early&&r.cvs.some(cv=>isNamed(PE,bk,cv)))src.push(RN.early);if(RN.early2&&r.cvs.some(cv=>isNamed(PE2,bk,cv)))src.push(RN.early2);\n"+
  "    let first=null;for(const [nm,tx] of src){if(typeof tx!=='string')continue;for(const cv of r.cvs){for(const x of wldHits2024(tx,bk,cv)){const z={ans:x.ans,rd:nm,w:wldWords2024(tx,x.pos)};if(x.ans)return z;if(!first)first=z;}}}\n"+
  "    return first||{ans:false,rd:'',w:''};}catch(e){return {ans:false,rd:'',w:''};}};"],
 ["const seen=new Set();const notNamed=[];let named=0;","const seen=new Set();const notNamed=[];let named=0;const wa=[],wo=[]; /* pkgWLD */"],
 ["named++;else notNamed.push(label);}","{named++;if(RN){const z=__wldW(label,r,PRSP,k+1);(z.ans?wa:wo).push(label+(z.rd?' ['+z.rd+']':'')+(z.w?' \"'+z.w+'\"':''));}}else notNamed.push(label);}"],
 ["return {n:k+1,link:lk,verses:seen.size,named,notNamed,","return {n:k+1,link:lk,verses:seen.size,named,notNamed,wa,wo,"],
 ["'; of the proven, '+p.named+' named'","'; of the proven, '+p.named+' named'+((p.wa&&p.wa.length)?' -- NAMED IN AN ANSWER: '+p.wa.join('; '):'')+((p.wo&&p.wo.length)?' -- NAMED ONLY IN OTHER TEXT: '+p.wo.join('; '):'')+(((p.wa&&p.wa.length)||(p.wo&&p.wo.length))?' --':'')"],
 ["['A verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.']",
  "['A verse marked NOT NAMED is unanswered by the rule. A verse NAMED IN AN ANSWER is named, in the round shown and with the words quoted, as an answer (a MEANS [<round>] header, a bold label that opens with the verse, a press answered by its id, or a list item that opens with the verse under an answer heading): you may still find that answer MISSES and grade the link BROKEN with a FORCED line that quotes it, but you may not write that this witness was unanswered or left unanswered. A verse NAMED ONLY IN OTHER TEXT may still be unanswered, and the judge decides that.']"],
 ["defender:side(F.gr2,String(F.cr3||'')+(F.cr4?LF+String(F.cr4):''),DEF_RE,F.cr2,F.gr1)",
  "defender:side(F.gr2,String(F.cr3||'')+(F.cr4?LF+String(F.cr4):''),DEF_RE,F.cr2,F.gr1,undefined,undefined,{ans:[['CR3',F.cr3]].concat(F.cr4?[['CR4',F.cr4]]:[]),early:['CR2',F.cr2]})"],
 ["challenger:side(F.cr3,F.dr3,CH_RE,F.gr2,String(F.cr1||'')+LF+String(F.cr2||''),F.gr1,F.cr1),",
  "challenger:side(F.cr3,F.dr3,CH_RE,F.gr2,String(F.cr1||'')+LF+String(F.cr2||''),F.gr1,F.cr1,{ans:[['DR3',F.dr3]],early:['DR2',F.gr2],early2:['DR1',F.gr1]}),"],
];
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});const plan={base:process.env.WLD_NODE_DIR||BASE,nodes:{}};
const NB=process.env.WLD_NODE_DIR||''; /* optional: node files to build on (e.g. pkgJGR/patched), in place of the fetchback's */
for(const nm of ['Panel Build','Build Independent Verdict']){const c0=NB?fs.readFileSync(NB+'/'+nm.replace(/ /g,'_')+'.js','utf8'):W.nodes.find(n=>n.name===nm).parameters.jsCode;let c=c0;
 for(const [a,b] of EDITS){const k=c.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times: '+a.slice(0,60));c=c.replace(a,()=>b);}
 new Function('$','$input','$execution','return (async()=>{\n'+c+'\n})();');fs.writeFileSync(OUT+'/'+nm.replace(/ /g,'_')+'.js',c);plan.nodes[nm]={before:h(c0),after:h(c),edits:EDITS.length};}
fs.writeFileSync(OUT.replace(/patched$/,'')+'plan_WLD.json',JSON.stringify(plan,null,1)+'\n');console.log(JSON.stringify(plan.nodes));
