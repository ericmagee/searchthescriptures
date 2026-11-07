// pkgASM edits (E-ASM, W1 Wall 2724; W3 2726 (4): no objection, build it; one item with K-UNX-A when both raise, counted once). Applied on
// pkgUNXA's patched code. The judges' own instruction (Panel Build, live): "an inferred act, such as a begetting or a knowing, is never an ASSUMES."
// A premise counted UNEXHIBITED on an ASSUMES ground whose assumed fact (ASSUMES: up to ROWS GIVE) names such an act, while its block exhibits
// two or more layer kinds, raises the K-UNX item with asm set (a:'ASM' alone, or a:'ASSUMES' with asm when K-UNX-A raises too). TRIAL.
const E=[
// 1. the act test, in the library (before unxaCheck)
["function unxaCheck(all,blk,k,P){",
 "// pkgASM: the act an ASSUMES clause names, when it is a knowing, begetting or conceiving (the judges' instruction: never an ASSUMES); '' when none\n"+
 "function unxaAct(cl){const f=String(cl==null?'':cl).replace(/^[\\s\\S]*?\\bASSUMES\\b\\s*:?/,'').split(/--\\s*ROWS\\s+GIVE|\\bROWS\\s+GIVE\\b/i)[0];\n"+
 " const m=f.match(/\\b(?:knew|knows?|knoweth|known|knowing|begat|begot|begets?|begotten|begetting|conceived?|conceives|conceiving)\\b(?!\\s*(?:of|that|as)\\b)/i);return m?m[0]:'';}\n"+
 "function unxaCheck(all,blk,k,P){"],
// 2. unxaCheck: the ASSUMES branch also raises on an act (no [L1] needed), one result naming both
["if(A.length&&k.includes('L1')){const l1=unxaL1(blk);if(l1){const cl=A.map(z=>z.seg.slice(z.seg.search(UNXA_ASM))).join(' ');if(!UNX_MRUN(cl,l1.q,6))return {a:'ASSUMES',l1,seg:A[0].seg};}}",
 "if(A.length){const cl=A.map(z=>z.seg.slice(z.seg.search(UNXA_ASM))).join(' ');const asm=unxaAct(cl);const l1=k.includes('L1')?unxaL1(blk):null;const ua=!!(l1&&!UNX_MRUN(cl,l1.q,6)); /* pkgASM */\n"+
 "  if(ua||asm)return {a:ua?'ASSUMES':'ASM',asm,l1:l1||unxaL1(blk),seg:A[0].seg};}"],
// 3. the item's why names the act first
["const why=ua.a==='ASSUMES'?",
 "const why=(ua.asm?'counted UNEXHIBITED in '+lab+' on an ASSUMES ground that names an act the link infers (\"'+ua.asm+'\"); an inferred act, such as a begetting or a knowing, is never an ASSUMES'+(ua.a==='ASM'?'':'; and it is '):'')+(ua.a==='ASM'?'':ua.a==='ASSUMES'?"],
["answers it with '+k.join(' and ');","answers it with '+k.join(' and ')); /* pkgASM */"],
// 4. the item carries the act; its line asks for the given fact
["items.push({rule:'K-UNX',a:ua.a,","items.push({rule:'K-UNX',a:ua.a,asm:ua.asm||'',"],
["\n     marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+",
 "\n     if(ua.asm){const it=items[items.length-1];it.line=id+': '+why+'. In a STATEMENT for this item write ASSUMES: <the given fact the step takes for granted, not what the link infers>'+(ua.a==='ASSUMES'?' and quote the block\\'s [L1]'+(L1?' ('+L1+')':'')+', naming what that verse lacks for the step':'')+'; or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it. Your count: '+ua.seg.replace(/\\s+/g,' ').trim().slice(0,400);} /* pkgASM */"+
 "\n     marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+"],
];
// 5. the cure (only in the 19 nodes that hold the K-UNX-A cure branch)
const CUR=["if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);",
 "if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);\n"+
 "   // pkgASM (TRIAL): an item whose ASSUMES names an inferred act is cured by a CORRECTED COUNT below the count read, or by a STATEMENT whose ASSUMES: names a given fact\n"+
 "   // (no knowing, begetting or conceiving); with K-UNX-A on the same premise that STATEMENT must also meet the K-UNX-A cure below\n"+
 "   if(x.asm){const cs0=o.count.filter(c=>c.side===x.side);if(cs0.length&&cs0.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (E-ASM): CORRECTED COUNT '+cs0[0].n+' takes the premise out of the count',cs0.map(c=>c.line));\n"+
 "    const am=String(st||'').match(/\\bASSUMES\\b\\s*:?([\\s\\S]*)/i);const act=am?unxaAct('ASSUMES: '+am[1]):'';\n"+
 "    if(!am||act||!am[1].trim())return res('UNCURED','TRIAL rule (E-ASM): '+(!st?'no STATEMENT for the item':!am?'the STATEMENT names no ASSUMES: given fact':act?'the STATEMENT\\'s ASSUMES still names an inferred act (\"'+act+'\")':'the ASSUMES: is empty')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);\n"+
 "    if(x.a==='ASM')return res('CURED','TRIAL rule (E-ASM): the STATEMENT\\'s ASSUMES names a given fact, not an inferred act',['STATEMENT: '+st]);}"];
function patchASM(code,needCure){let s=code;for(const [a,b] of E){const n=s.split(a).length-1;if(n!==1)throw new Error('pkgASM anchor x'+n+': '+a.slice(0,60));s=s.replace(a,()=>b);}
 const c=s.split(CUR[0]).length-1;if(c>1)throw new Error('cure anchor x'+c);if(c===1)s=s.replace(CUR[0],()=>CUR[1]);if(needCure&&c!==1)throw new Error('cure anchor missing');return {code:s,cure:c===1};}
module.exports={patchASM,E,CUR};
