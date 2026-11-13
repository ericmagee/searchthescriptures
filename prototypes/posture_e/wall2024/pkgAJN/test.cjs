// pkgAJN tests: pkgABS's own unit sets (check units (1) and cure units (4), copied from pkgABS/test_ABS.cjs) on old and new,
// plus the mislink case and its neighbours. node test.cjs <parent json> <target json> [data dir]
const fs=require('fs');const {load}=require(__dirname+'/mods.cjs');
const [,,P,T0,DD]=process.argv;const D=(DD||'/mnt/project-files/wall2024/pkgAJN')+'/';
const wf=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return (W.nodes||W.workflow.nodes).find(n=>n.name==='Shared Library').parameters.jsCode;};
const V={old:{c:load(wf(P),'Send Back Build').ABS,r:load(wf(P),'Send Back Record').ABS},new:{c:load(wf(T0),'Send Back Build').ABS,r:load(wf(T0),'Send Back Record').ABS}};
const ctx={rows:JSON.parse(fs.readFileSync(D+'kjv_rows.json','utf8')),ow:[],lex:[]};
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d&&!c?'\n     '+d:''));c?ok++:bad++;};
const g13='ANSWER CHECK: Romans 1:3 -- [CR3] -- MEANS: "where the flesh-origin is meant" -- ANSWER: "*sperma* (G4690) states descent from David. The narrowed link does not deny that descent." -- MEETS -- "The narrowed link does not deny that descent"';
const u=[['E-ANS MEETS on "does not deny", no [L1]: raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13},true],
 ['the same answer with a counted [L1] positive fit (inside the answer): not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"made of the seed of David according to the flesh\\"" -- MEETS')},false],
 ['the same answer with an [L1] whose words are not in the verse: raised',{rule:'E-ANS',grade:'MEETS',flagged_line:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"born of the seed of Joseph after the flesh\\"" -- MEETS')},true],
 ['E-ANS MISSES: not read',{rule:'E-ANS',grade:'MISSES',flagged_line:g13.replace('-- MEETS --','-- MISSES --')},false],
 ['single-quoted ANSWER CHECK: the answer is read, not the MEANS',{rule:'E-ANS',grade:'MEETS',flagged_line:"ANSWER CHECK: Matthew 1:25 -- [DR3] -- MEANS: 'no row states a knowing' -- ANSWER: 'The knowing of my chain stands before the taking' -- MEETS -- the answer places it"},false],
 ['a withdrawal answer ("I drop that limb"): not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "x" -- ANSWER: "The phrase alone does not exclude a father, and I drop that limb." -- MEETS -- "x"'},false],
 ['E-HOLD UNDERDETERMINED "both retained": raised',{rule:'E-HOLD',grade:'UNDERDETERMINED',flagged_line:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- x -- GROUND: Attribution of conception and fleshly descent are both retained.'},true],
 ['E-HOLD STANDS "does not name": raised',{rule:'E-HOLD',grade:'STANDS',flagged_line:'D1: STANDS -- GROUND: the row does not name the father.'},true],
 ['E-HOLD STANDS with no absence: not raised',{rule:'E-HOLD',grade:'STANDS',flagged_line:'D1: STANDS -- GROUND: [CR3] answers each press.'},false],
 ['"rather than relying on silence": not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Matthew 1:25 -- [CR4] -- MEANS: "x" -- ANSWER: "The answer relates the finding to the source, rather than relying on silence about an earlier act." -- MEETS -- "x"'},false],
 // pkgAJN: the reason's [L1] fit after an answer that ends in a reference and a quote
 ['NEW: answer ends Luke 1:31 ... "therefore also", reason opens [L1] Luke 1:32 fit, absence in reason: not raised',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Luke 1:32 -- [CR3] -- MEANS: "x" -- ANSWER: "The title is given to the child of Mary\'s womb (Luke 1:31). Luke 1:35 then adds a new reason: \\"therefore also\\"." -- MEETS -- [L1] Luke 1:32 "the Lord God shall give unto him the throne of his father David" without denying the sequence'},'NEWFIX'],
 ['same with a wrong [L1] quote in the reason: raised on both',{rule:'E-ANS',grade:'MEETS',flagged_line:'ANSWER CHECK: Luke 1:32 -- [CR3] -- MEANS: "x" -- ANSWER: "The title is given (Luke 1:31). Luke 1:35 then adds a new reason: \\"therefore also\\"." -- MEETS -- [L1] Luke 1:32 "the throne of his father Joseph" without denying the sequence'},true]];
for(const [n,id,w] of u){const a=V.old.c.check(id,ctx),b=V.new.c.check(id,ctx);
 if(w==='NEWFIX')T('check unit: '+n+' (old raised '+!!a.raise+', new raised '+!!b.raise+')',!!b.raise===false);
 else T('check unit: '+n,!!a.raise===w&&!!b.raise===w,'old '+a.why+' | new '+b.why);}
const ita={rule:'E-ANS'},ith={rule:'E-HOLD'};
const sol='ANSWER CHECK: Luke 1:32 -- [CR3] -- MEANS: "the title and throne are given before Mary\'s question, and the \\\\"therefore also\\\\" of 1:35 joins back to them" -- ANSWER: "The title and throne are given there to the child of Mary\'s womb (Luke 1:31). Luke 1:35 then adds a new reason: \\\\"therefore also\\\\"." -- MEETS -- [L1] Luke 1:32 "the Lord God shall give unto him the throne of his father David" positively carries the earlier throne promise, and [L3] Luke 1:35 "therefore also that holy thing which shall be born of thee shall be called the Son of God" supplies the later explanation attached to the coming and overshadowing.';
const cu=[['E-ANS KEEP',ita,{ans:'KEEP',why:'x'},'UNCURED'],['E-ANS no answer',ita,{ans:'NO ANSWER'},'UNCURED'],
 ['E-ANS CHANGE TO MISSES',ita,{ans:'CHANGE',to:g13.replace('-- MEETS --','-- MISSES --')},'CURED'],
 ['E-ANS CHANGE TO MEETS on the same absence',ita,{ans:'CHANGE',to:g13},'UNCURED'],
 ['E-ANS CHANGE TO MEETS with a counted [L1] fit inside the answer',ita,{ans:'CHANGE',to:g13.replace('descent." -- MEETS','descent. [L1] Romans 1:3 \\"made of the seed of David according to the flesh\\"" -- MEETS')},'CURED'],
 ['E-HOLD KEEP',ith,{ans:'KEEP',why:'x'},'UNCURED'],['E-HOLD CHANGE TO RETRACTED',ith,{ans:'CHANGE',to:'RETRACTED: D2 vs C2'},'CURED'],
 ['E-HOLD CHANGE TO BROKEN with counted layers',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): CHALLENGER LINK BROKEN -- x -- GROUND: [L1] Matthew 1:20 "that which is conceived in her is of the Holy Ghost"'},'CURED'],
 ['E-HOLD CHANGE TO BROKEN without [L1]',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): CHALLENGER LINK BROKEN -- the answer cannot overcome it'},'UNCURED'],
 ['E-HOLD CHANGE TO UNDERDETERMINED with a counted [L1] fit',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- GROUND: [L1] Romans 1:3 "made of the seed of David according to the flesh"; the record leaves open the means'},'CURED'],
 ['E-HOLD CHANGE TO UNDERDETERMINED still "both retained"',ith,{ans:'CHANGE',to:'D2 vs C2 (Matthew 1:20): UNDERDETERMINED -- GROUND: both are retained'},'UNCURED']];
for(const [n,it,a,w] of cu){const o=V.old.r.cure(it,a,ctx),m=V.new.r.cure(it,a,ctx);T('cure unit: '+n+': '+w,o.status===w&&m.status===w,'old '+o.status+' '+o.why+' | new '+m.status+' '+m.why);}
{const o=V.old.r.cure(ita,{ans:'CHANGE',to:sol},ctx),m=V.new.r.cure(ita,{ans:'CHANGE',to:sol},ctx);T('sol 36677 S4 (enforcer_log 35636): old UNCURED, new CURED',o.status==='UNCURED'&&m.status==='CURED','old '+o.why+' | new '+m.why);}
{const bad=sol.replace('the Lord God shall give unto him the throne of his father David','the Lord God shall give him the seat of Joseph');const o=V.old.r.cure(ita,{ans:'CHANGE',to:bad},ctx),m=V.new.r.cure(ita,{ans:'CHANGE',to:bad},ctx);T('sol line with a reason [L1] not in the verse: UNCURED on both',o.status==='UNCURED'&&m.status==='UNCURED','old '+o.why+' | new '+m.why);}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
