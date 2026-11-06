// pkgFC test. Run from wall2024/ after pkgFC/build_FC.py: node pkgFC/test_FC.cjs
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const plan=JSON.parse(rd('pkgFC/plan_FC.json'));
T('24 nodes: base and final shas match the plan',plan.nodes.length===24&&plan.nodes.every(n=>sha(rd(n.base+'/'+n.file))===n.base_sha&&sha(rd('pkgFC/patched/'+n.file))===n.final_sha));
T('every node parses as an n8n Code node body',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgFC/patched/'+n.file));return true;}catch(e){console.log('   '+n.file+': '+e.message);return false;}}));
const OLD='FORCED\\s*:',NEW='FORCED(?:\\s*\\(\\s*Commitment\\s+\\d+\\s*\\))?\\s*:';
T('each node differs from its base only at the FORCED sites',plan.nodes.every(n=>rd('pkgFC/patched/'+n.file).split(NEW).join(OLD)===rd(n.base+'/'+n.file)&&!rd('pkgFC/patched/'+n.file).includes(OLD)));
const cut=t=>t.slice(0,t.indexOf("const AM=$('Alternate Merge Seat')"));const lib=cut(rd('pkgFC/patched/Alternate_Merge.js'));
const M=new Function('$','$input',lib+'\nreturn {drvCheck,__kfHas,kfLines,gateForced2024,gateRead2024,KF_LINE,SB_FORM};')(()=>{throw new Error('offline');},null);
const B=new Function('$','$input',cut(rd('pkgCR/patched/Alternate_Merge.js'))+'\nreturn {KF_LINE,SB_FORM,kfLines};')(()=>{throw new Error('offline');},null);
const F='FORCED: D1 vs C2 -- MEANS [CR3]: "the pregnancy was found before the marital union" -- ANSWER [DR3]: "So 1:18 dates the finding before the taking into his house." -- FAILS: "So 1:18 dates the finding"';
const FT=F.replace('FORCED:','FORCED (Commitment 7):');
const R={CR3:'... the pregnancy was found before the marital union ...',DR3:'So 1:18 dates the finding before the taking into his house. That is it.'};
T('base: the tagged form fails KF_LINE and SB_FORM (33020 chatgpt S14)',!B.KF_LINE.test(FT)&&!B.SB_FORM.test(FT));
T('pkgFC: the tagged form passes KF_LINE and SB_FORM',M.KF_LINE.test(FT)&&M.SB_FORM.test(FT));
T('pkgFC: the untagged form reads as before',M.KF_LINE.test(F)&&M.SB_FORM.test(F)&&B.KF_LINE.test(F));
T('pkgFC: KF_LINE captures the same groups for tagged and untagged',JSON.stringify(FT.match(M.KF_LINE).slice(1))===JSON.stringify(F.match(B.KF_LINE).slice(1)));
T('kfLines: a correct tagged FORCED line raises no K-F item',M.kfLines(FT,R).items.filter(z=>z.rule==='K-F').length===0);
T('kfLines base: the tagged line was not even read as FORCED (no item, but no forced link either)',B.kfLines(FT,R).items.length===0);
T('__kfHas finds the tagged FORCED line for D1 vs C2',M.__kfHas(FT,'D1 vs C2'));
for(const bad of ['FORCED (Commitment): D1 vs C2 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "c"','FORCED (see below): D1 vs C2 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "c"'])T('not read: '+bad.slice(0,30),!M.KF_LINE.test(bad));
{const x={gid:'G1',kind:'RULE K-G4',key:'RULE|K-G4|CHALLENGER|D1 VS C2'};const a=M.gateRead2024('GATE: G1 || KEEP || '+FT).G1;const g=M.gateForced2024(x,a,{R});T('gateForced2024 reads a tagged FORCED line and cures',g&&g.cured,JSON.stringify(g));}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
