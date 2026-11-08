// pkgEKN (W2, 11-08): DeepSeek RULE K-W names all four judge forms the engine accepts (pkgKW: NOT HELD quoting the flagged sentence; REASSERTED IN <round>),
// and says how to grade NOT HELD and REASSERTED. Before: the rule named only STANDS WITHOUT IT and CONCEDED, so DeepSeek wrote NO ANSWER on NOT HELD
// (33644 Alt: 16 of 16 NOT HELD rows; main Enforcer: 33371 32, 33389 17, 33411 11, 33430 20, 33442 12, 33461 21, 33627 19) while the engine CURED them.
// Nodes: Enforcer Build (main panel) and Alt Judge Enforcer Build (the EAK copy). Base: live s60 (219c6f95).
// Run from wall2024/: node pkgEKN/build_EKN.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s60.json','utf8'));const N=W.nodes||W.data.nodes;
const A="RULE K-W (a side withdrew or granted, in its own round, footing of a link it keeps). A judge answers STANDS WITHOUT IT because <a layer>, or CONCEDED. Decide FIRST";
const A2="RULE K-W (a side withdrew or granted, in its own round, footing of a link it keeps). A judge answers in one of four forms, and all four are in the rule\\'s form: STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> \"<quote>\"; or NOT HELD with a reason. Never write NO ANSWER because the judge wrote NOT HELD or REASSERTED: grade it (pkgEKN). Decide FIRST";
const B="A verse missing from the blocks given you is not, by that alone, a reason to disagree: read the meaning the side shows.\\n'\n +'RULE K-S3";
const B2="A verse missing from the blocks given you is not, by that alone, a reason to disagree: read the meaning the side shows. "
 +"NOT HELD says the flagged sentence gives up no footing this link needs. Grade it on the same decision, with its reason in place of the layer: AGREE when the sentence carried no footing of this link, or when the side no longer claims the fact and the reason supplies no footing the side never gave, or when the side still claims the fact and the reason, or the side\\'s own words it quotes, carry that same fact; DISAGREE when the right answer is CONCEDED (the side still claims the fact and neither the reason nor the words it quotes carry it), or when the reason supplies footing the side never gave. "
 +"REASSERTED IN <round> says a later round rests again on what was withdrawn: AGREE when the quoted words stand in that round and assert the withdrawn or granted fact again; DISAGREE when they do not (pkgEKN).\\n'\n +'RULE K-S3";
const plan=[];
for(const [name,file] of [['Enforcer Build','Enforcer_Build.js'],['Alt Judge Enforcer Build','Alt_Judge_Enforcer_Build.js']]){
 let t=N.find(n=>n.name===name).parameters.jsCode;const before=h(t);
 for(const [o,n] of [[A,A2],[B,B2]]){if(t.split(o).length!==2)throw new Error(name+': anchor count '+(t.split(o).length-1)+' for '+o.slice(0,60));t=t.replace(o,()=>n);}
 new Function('$','$input','$json','items',' return 0;'+'\n/*syntax check*/');try{new Function('return async function(){'+t+'\n}')}catch(e){throw new Error(name+' syntax: '+e.message)}
 fs.writeFileSync('pkgEKN/patched/'+file,t);plan.push({node:name,file,before,after:h(t)});console.log(name,before,'->',h(t));}
fs.writeFileSync('pkgEKN/plan_EKN.json',JSON.stringify({base:'s60 219c6f95',nodes:plan},null,1));
