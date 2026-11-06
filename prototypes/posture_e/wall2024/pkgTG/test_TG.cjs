// pkgTG test (run from wall2024/): only the guard sentences differ from the base; each node's guard text is present once and parses
const fs=require('fs');const P=JSON.parse(fs.readFileSync('pkgTG/plan_TG.json','utf8'));let ok=0,bad=0;const t=(c,m)=>{if(c){ok++;console.log('OK  ',m);}else{bad++;console.log('FAIL',m);}};
const G=' A TRIAL item (its mark says TRIAL rule) asks only for its own form: write that form, or NOT HELD. A TRIAL item never asks you to retract or regrade a line, and it is not a reason to change any grade; retract or regrade a line only for a reason from the rounds. For a K-RUL item, write the card; a missing card is not a reason to change the grade. For a K-CON item, a NOT HELD line must quote the flagged sentence, at least six words in a row, or the item stays uncured.';
const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
t(P.nodes.length===14,'14 nodes carry the cure instructions');
for(const n of P.nodes){const b=fs.readFileSync(n.base,'utf8'),s=fs.readFileSync('pkgTG/patched/'+n.file,'utf8');
 t(sha(b)===n.base_sha&&sha(s)===n.final_sha,n.file+': shas match the plan');
 t(s.split(G).length===2&&s.split(G).join('')===b,n.file+': the guard appears once, and removing it gives the base byte for byte');
 let ok2=true;try{new Function(s);}catch(e){ok2=false;}t(ok2,n.file+': parses');}
// the guard reaches the prompt string: evaluate the cure-instruction constant in Panel Cure Build 1
{const s=fs.readFileSync('pkgTG/patched/Panel_Cure_Build_1.js','utf8');const i=s.indexOf(G);const j=s.lastIndexOf('\n',s.lastIndexOf('"RESPONSE: <the flagged item',i));t(i>0&&/K-RUL item, write the card/.test(s.slice(i,i+G.length+2))&&s.slice(i+G.length,i+G.length+2)==='";','Panel Cure Build 1: guard closes the instruction string');}
console.log(ok,'OK',bad,'FAIL');process.exit(bad?1:0);
