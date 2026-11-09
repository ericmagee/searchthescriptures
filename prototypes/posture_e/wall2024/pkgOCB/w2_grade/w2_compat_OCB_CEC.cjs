// W2 grade of pkgOCB: does the Oracle's OPPONENT'S CONTRADICTIONS section, in the B2 form, reach item A (pkgCEC) as candidates,
// and does B4 (C4 Extract `contradictions`) agree with CEC's reading? Run 34108, written [DR4] tails.
//   node pkgOCB/w2_grade/w2_compat_OCB_CEC.cjs   (from wall2024/)
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const CEC=JSON.parse(fs.readFileSync(__dirname+'/../../pkgCEC/parent_s83_CEC.json','utf8'));
const OCB=JSON.parse(fs.readFileSync(__dirname+'/../parent_s83_OCB.json','utf8'));
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const FO0=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const D6E='I drop the wording "no biological father" as a bare statement.',D6C='Christ had no biological father.';
const G41E='I grant that this is the ordinary means.',G41C='Genesis 4:1 therefore cannot supply the sequence for Matthew';
const cands=async tail=>{const FO=cl(FO0);FO[0].json.dr4=FO0[0].json.dr4+'\n\n'+tail;
 return (await harness('34108',{'Final Output':FO})('return (async()=>{\n'+code(CEC,'Close Enforcer Build')+'\n})();','Quote Report'))[0].json.cands;};
(async()=>{
// 1. exact B2 form (straight quotes), as the Oracle is told to write it
let c=await cands("OPPONENT'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] \""+D6E+"\" | CLOSING [CR4] \""+D6C+"\" | the close says again what [CR3] dropped\nX2 LINK 1 | EARLIER [CR3] \""+G41E+"\" | CLOSING [CR4] \""+G41C+"\" | grant and denial");
T('1 B2 form, two X lines: CEC reads both as defender candidates with both quotes',c.length===2&&c[0].earlier_q===D6E&&c[1].closing_q===G41C,JSON.stringify(c.map(x=>x.id+' '+x.kind+' '+x.n)));
// 2. markdown bullets, bold ids, curly quotes
c=await cands("**OPPONENT’S CONTRADICTIONS:**\n- **X1** LINK 6 | EARLIER [CR3] “"+D6E.replace(/"/g,"'")+"” | CLOSING [CR4] “"+D6C+"” | why");
T('2 bullets, bold id, curly quotes and a curly apostrophe in the header are read',c.length===1&&c[0].n===6,JSON.stringify(c.map(x=>x.id)));
// 3. the B2 "(or PREMISE <n>)" variant
c=await cands("OPPONENT'S CONTRADICTIONS:\nX1 PREMISE 2 | EARLIER [CR2] \"some words here now\" | CLOSING [CR4] \""+D6C+"\" | why");
T('3 a PREMISE line is read as kind PREMISE',c.length===1&&c[0].kind==='PREMISE'&&c[0].n===2);
// 4. NONE
c=await cands("OPPONENT'S CONTRADICTIONS: NONE.");
T('4 NONE gives no candidate',c.length===0);
// 5. the Oracle writes the section before GRANTS (wrong order): still read
c=await cands("OPPONENT'S CONTRADICTIONS:\nX1 LINK 6 | EARLIER [CR3] \""+D6E+"\" | CLOSING [CR4] \""+D6C+"\" | why\n\nOPPONENT'S GRANTS:\nG1 something");
T('5 a section followed by another section: only the X line is a candidate',c.length===1);
console.log('\n'+ok+' OK, '+bad+' FAIL');})().catch(e=>{console.log('ERROR '+e.stack);});
