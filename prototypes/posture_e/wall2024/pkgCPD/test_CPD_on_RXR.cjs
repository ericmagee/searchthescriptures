// pkgCPD unit tests: cureRewrite (copied byte for byte from the patched node with everything it uses) on hand-made panel rows.
const fs=require('fs');const {closure}=require('../pkgEPK/lib_extract.cjs');
const NODE=process.argv[2]||'Panel_Cure_Check';const code=fs.readFileSync('pkgCPD/patched_on_RXR/'+NODE+'.js','utf8');
const lib=closure(code,['cureRewrite']);const cureRewrite=new Function(lib.text+'\nreturn cureRewrite;')();
let ok=0,bad=0;const t=(name,c)=>{if(c){ok++;console.log('OK  ',name);}else{bad++;console.log('FAIL',name);}};
const row=(o,lines)=>JSON.stringify(Object.assign({verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT',conceded_links:0,challenger_conceded_links:0,counted_premises_defender:[],counted_premises_challenger:[]},o,{reasoning:lines.join('\n')}),null,2);
const F=o=>Object.assign({verdict_tag:'HELD',defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT',conceded_links:0,challenger_conceded_links:0},o);
const R=(fields,rp,cpAdd)=>({rp:rp||[],fields,audit:'[AUDIT v25: RECOMPUTED AFTER CURE -- test]',cpAdd:cpAdd||null,tag:'HELD-1',retracted:[]});
const cp=(s,k)=>{const m=s.match(new RegExp('"counted_premises_'+k+'"\\s*:\\s*\\[([^\\]]*)\\]'));return m?'['+m[1].replace(/\s/g,'')+']':null;};
// 1. 33299 gemini shape: CHALLENGER count 1 -> 0 by CORRECTED COUNT; array [3] must become []
{const old='CHALLENGER CONCEDED LINKS: 1 -- Premise 3 UNEXHIBITED (pressed witness Matthew 1:25 left unanswered).';const nu='CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 0).';
 const s=cureRewrite(row({challenger_conceded_links:1,counted_premises_challenger:[3]},['HELD.','CONCEDED LINKS: 0',old]),true,R(F({}),[[old,nu]]),'gemini',null);
 t('1 count 1->0: array [3] -> []',cp(s,'challenger')==='[]');t('1 DERIVED mark',/\[AUDIT v50: COUNTED PREMISES DERIVED \(pkgCPD\) -- SEAT: gemini; SIDE: CHALLENGER; COUNT: 1 to 0; WAS: \[3\]; NOW: \[\]/.test(s));t('1 defender untouched',cp(s,'defender')==='[]');}
// 2. count 1 -> 2 with a line naming two counted premises: array [1] -> [1,5]
{const old='CHALLENGER CONCEDED LINKS: 1 -- Premise 1 UNEXHIBITED.';const nu='CHALLENGER CONCEDED LINKS: 2 -- Premises 1 and 5: UNEXHIBITED through failed answers; Premise 2: VOID.';
 const s=cureRewrite(row({challenger_conceded_links:1,counted_premises_challenger:[1]},[old]),true,R(F({challenger_conceded_links:2,challenge_standing:'PROP-DEPENDENT'}),[[old,nu]]),'sol',null);
 t('2 count 1->2: array [1] -> [1,5]',cp(s,'challenger')==='[1,5]');t('2 DERIVED mark names the line',/NOW: \[1,5\]; FROM: CHALLENGER CONCEDED LINKS: 2/.test(s));}
// 3. count 3 -> 1 with a recompute line naming no premise: array kept, NOT DERIVED mark
{const old='CHALLENGER CONCEDED LINKS: 3 -- Premises 1, 2 and 5 UNEXHIBITED.';const nu='CHALLENGER CONCEDED LINKS: 1 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 1).';
 const s=cureRewrite(row({challenger_conceded_links:3,counted_premises_challenger:[1,2,5]},[old]),true,R(F({challenger_conceded_links:1}),[[old,nu]]),'grok',null);
 t('3 array kept [1,2,5]',cp(s,'challenger')==='[1,2,5]');t('3 NOT DERIVED mark',/COUNTED PREMISES NOT DERIVED \(pkgCPD\) -- SEAT: grok; SIDE: CHALLENGER; COUNT: 3 to 1; ARRAY: \[1,2,5\] \(kept\)/.test(s));}
// 4. count unchanged, array already mismatched (K-G8 evidence): untouched, no mark
{const s=cureRewrite(row({conceded_links:2,counted_premises_defender:[5]},['CONCEDED LINKS: 2 -- Premises 5 and 6 UNEXHIBITED.']),true,R(F({conceded_links:2,defense_standing:'PROP-DEPENDENT'}),[]),'chatgpt',null);
 t('4 unchanged count keeps a K-G8 array [5]',cp(s,'defender')==='[5]');t('4 no v50 mark',!/AUDIT v50/.test(s));}
// 5. count changed and array already right (cpAdd made it right): no mark
{const old='CONCEDED LINKS: 0';const nu='CONCEDED LINKS: 1 -- Premise 4 UNEXHIBITED.';
 const s=cureRewrite(row({},[old]),true,R(F({conceded_links:1,defense_standing:'PROP-DEPENDENT'}),[[old,nu]],{DEFENDER:[4],CHALLENGER:[]}),'gemini',null);
 t('5 cpAdd [4] stands',cp(s,'defender')==='[4]');t('5 no v50 mark',!/AUDIT v50/.test(s));}
// 6. line count number differs from the field: NOT DERIVED
{const old='CONCEDED LINKS: 0';const nu='CONCEDED LINKS: 3 -- Premise 4 UNEXHIBITED.';
 const s=cureRewrite(row({},[old]),true,R(F({conceded_links:2,defense_standing:'PROP-DEPENDENT'}),[[old,nu]]),'gemini',null);
 t('6 line 3 vs field 2: array kept []',cp(s,'defender')==='[]');t('6 NOT DERIVED: line does not give the count',/NOT DERIVED.*?WHY: the count line does not give the count 2/.test(s));}
// 7. single-judge (non-panel) text: no JSON, nothing derived
{const s=cureRewrite('CONCEDED LINKS: 1 -- Premise 2 UNEXHIBITED.',false,R(F({conceded_links:0}),[['CONCEDED LINKS: 1 -- Premise 2 UNEXHIBITED.','CONCEDED LINKS: 0']]),null,null);t('7 non-panel: no v50 mark',!/AUDIT v50/.test(s));}
// 8. VOID premises on the line are not counted
{const old='CHALLENGER CONCEDED LINKS: 0';const nu='CHALLENGER CONCEDED LINKS: 2 -- Premise 1: UNEXHIBITED; Premise 5: UNEXHIBITED; Premise 2: VOID; Premise 3: VOID.';
 const s=cureRewrite(row({},[old]),true,R(F({challenger_conceded_links:2}),[[old,nu]]),'gemini',null);t('8 VOID left out: [1,5]',cp(s,'challenger')==='[1,5]');}
console.log(ok+' OK, '+bad+' FAIL ('+NODE+')');process.exit(bad?1:0);
