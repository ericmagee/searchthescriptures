// pkgRC unit test: the null-grade paths (spec 10: null is never STANDS or "not broken"), base pkgSBR against pkgRC. Run from wall2024/.
const fs=require('fs');let ok=0,bad=0;const T=(n,c,x)=>{console.log((c?'OK  ':'FAIL')+' '+n+(c?'':' :: '+x));c?ok++:bad++;};
const lib=(p,f)=>{const s=fs.readFileSync(p+'/patched/'+f,'utf8');const cut=s.indexOf("const AM=$('Alternate Merge Seat')");return new Function('$','$input',(cut>0?s.slice(0,cut):s.slice(0,s.indexOf('function cureRecompute(')+0)+s.slice(s.indexOf('function cureRecompute('),s.indexOf('\n}',s.indexOf('function cureRecompute('))+2))+'\nreturn {rcLines,sbBrokenWord2024:typeof sbBrokenWord2024==="function"?sbBrokenWord2024:null,cureRecompute};')(()=>{throw 0},null);};
const A=lib('pkgSBR','Alternate_Merge.js'),B=lib('pkgRC','Alternate_Merge.js');
const g=(L,l)=>{const c=L.rcLines(l).col[0];return c?[c.grade,c.unread||null]:null;};
T('STANDS and WITHDRAWN are read (base: null)',JSON.stringify([g(A,'D1 vs C1: STANDS -- x'),g(A,'D2 vs C1 (Luke 1:27): WITHDRAWN')])==='[[null,null],[null,null]]'&&JSON.stringify([g(B,'D1 vs C1: STANDS -- x'),g(B,'D2 vs C1 (Luke 1:27): WITHDRAWN')])==='[["STANDS",null],["WITHDRAWN",null]]');
T('a grade word in the reason is not the grade (base read it as broken)',g(A,'D1 vs C1: STANDS -- the DEFENDER LINK BROKEN claim fails')[0]==='DEFENDER LINK BROKEN'&&g(B,'D1 vs C1: STANDS -- the DEFENDER LINK BROKEN claim fails')[0]==='STANDS');
T('lower-case grade: refused (CP2), null with the code',JSON.stringify(g(B,'D1 vs C1: defender link broken -- x'))==='[null,"COLLISION_GRADE_NOT_UPPER_CASE_CP2"]',JSON.stringify(g(B,'D1 vs C1: defender link broken -- x')));
T('no colon: refused (CP2)',JSON.stringify(g(B,'D1 vs C1 DEFENDER LINK BROKEN -- x'))==='[null,"COLLISION_NO_COLON_AFTER_THE_PAIR_CP2"]',JSON.stringify(g(B,'D1 vs C1 DEFENDER LINK BROKEN -- x')));
T('pair note line ("not FORCED", 33040 grok): unread, not STANDS',JSON.stringify(g(B,'D2 vs C3 (Matthew 1:18): not FORCED -- the answer can agree'))==='[null,"COLLISION_NO_GRADE_WORD"]');
const NOTE='D2 vs C3 (Matthew 1:18): not FORCED -- the answer can agree';
{const c=B.rcLines('D2 vs C3 (Matthew 1:18): CHALLENGER LINK BROKEN -- x\n'+NOTE).col;T('spec 14.1: a note on a pair with a read COLLISION line is skipped',c.length===1&&c[0].grade==='CHALLENGER LINK BROKEN'&&!c.some(z=>z.unread),JSON.stringify(c));}
{const c=B.rcLines('D1 vs C1: STANDS -- x\n'+NOTE).col;T('spec 14.2: a note on a pair with no read COLLISION line stays UNREAD',c.length===2&&c[1].link==='D2 vs C3'&&c[1].grade===null&&c[1].unread==='COLLISION_NO_GRADE_WORD',JSON.stringify(c));}
const P=t=>B.rcLines(t);
T('sbBrokenWord2024: an unread line and none broken is null (unknown), not false',B.sbBrokenWord2024(P('D1 vs C1: defender link broken -- x\nD2 vs C1: STANDS'))===null&&B.sbBrokenWord2024(P('D1 vs C1: STANDS'))===false&&B.sbBrokenWord2024(P('D1 vs C1: DEFENDER LINK BROKEN -- x\nD2 vs C1: bad'))===true&&A.sbBrokenWord2024(A.rcLines('D2 vs C1: bad grade'))===false);
// cureRecompute: a RETRACTED trigger with an unread collision line left and none broken: the verdict, result and clause are the judge's own
const text='D1 vs C1: DEFENDER LINK BROKEN -- x\nD2 vs C2: BROKEN -- the defender link fails\nCLAUSE: BROKEN-1 N=2 W=0 k=1\nRESULT: CHALLENGER WINS -- z\nDEFENSE STANDING: PROP-DEPENDENT -- L=2 c=0 -- w\nCHALLENGE STANDING: SELF-SUPPORTED -- L=2 c=0 -- w';
const F={verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',conceded_links:0,challenge_standing:'SELF-SUPPORTED',challenger_conceded_links:0};
const reply={ok:true,text:'RETRACTED: D1 vs C1 -- the grant is not there\nRESTATED: D1 vs C1: UNDERDETERMINED -- the press is answered\nCORRECTED RESULT: HELD-1 -- retracted'};
const items=[{rule:'K-G4',link:'D1 vs C1',side:'DEFENDER',line:'D1 vs C1: DEFENDER LINK BROKEN -- x'}];const v=[{rule:'K-G4',link:'D1 vs C1',side:'DEFENDER',status:'CURED',why:'retracted'}];
let ra,rb;try{ra=A.cureRecompute('t',text,F,items,v,reply);rb=B.cureRecompute('t',text,F,items,v,reply);}catch(e){console.log('cureRecompute error',e.message);}
console.log('   base : '+(ra?JSON.stringify({f:ra.fields,res:ra.result,tag:ra.tag,trig:ra.trig}):'null'));console.log('   pkgRC: '+(rb?JSON.stringify({f:rb.fields,res:rb.result,tag:rb.tag,trig:rb.trig}):'null'));
T('cureRecompute: base derives HELD from the unread line (null read as not broken)',ra&&ra.fields.verdict_tag==='HELD',ra&&ra.fields.verdict_tag);
T('cureRecompute: pkgRC holds: verdict, result and clause are the judge\'s own, and the unread line is named',rb&&rb.fields.verdict_tag==='BROKEN'&&rb.result==='CHALLENGER WINS'&&rb.tag==='UNREAD'&&rb.trig.some(t=>/^UNREAD D2 vs C2 \(COLLISION_NO_GRADE_WORD\)/.test(t))&&!rb.rp.some(r=>/^CLAUSE/.test(r[0])),rb&&JSON.stringify(rb.rp));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
