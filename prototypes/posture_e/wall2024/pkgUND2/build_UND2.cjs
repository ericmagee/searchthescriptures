// pkgUND2 (W1, pkgFCT finding, Wall 3177): the pkgUND E-HOLD option on an UNDERDETERMINED collision line offered two forms the engine never applies:
// bare "CHANGE TO: RETRACTED" ("the CHANGE TO line has no line form the engine reads"; a collision line is regraded, never retracted, ruling 411)
// and a parenthetical FORCED example that reads as the CHANGE TO ("the change has no line label and would replace the whole Dn VS Cm line").
// pkgFCT on s61, all saved runs: main 145/145 and alt 19/19 refused for each. Wording fix only. Nodes: Send Back Build, Alt Send Back Build
// (base pkgGRT/patched = live s61). Run from wall2024/: node pkgUND2/build_UND2.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R=[[' (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "...")',
          ', on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4)'],
         [', or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line',
          ', or keep UNDERDETERMINED by CHANGE TO the same line'],
         // pkgABS absence-check cure texts (W2 3178): bare RETRACTED has no line form sbApply reads on any line
         ['CHANGE TO: RETRACTED, or CHANGE TO the line regraded so it no longer charges','CHANGE TO the line regraded so it no longer charges'],
         ['CHANGE TO: RETRACTED, or a CHANGE TO line that no longer charges that press','a CHANGE TO line that no longer charges that press']];
const plan={base:'pkgGRT/patched (live s61)',nodes:{}};
for(const f of ['Send_Back_Build','Alt_Send_Back_Build']){const s0=fs.readFileSync('pkgGRT/patched/'+f+'.js','utf8');let s=s0;
 for(const [a,b] of R){const n=s.split(a).length-1;if(n!==1)throw new Error(f+' anchor count '+n+': '+a.slice(0,40));s=s.replace(a,()=>b);}
 new Function('$','$input',s);fs.writeFileSync('pkgUND2/patched/'+f+'.js',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgUND2/plan_UND2.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
