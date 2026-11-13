// pkgWVS rev 3 (W1, after the ASK 148 replay, report wall2024/replay_ASK148_CEW_WVS_w4.md). No limit is read in code (as rev 2).
// (a) The fixed sentence on every pkgWVR note now says what a named use is, and what is NOT one: a reason given for the withdrawal ("since ..."),
//     a time, "the case", weight, load-bearing, proof, or what the earlier line says it keeps; and that naming the verse again as a layer or
//     footing of the link it was withdrawn from is a rest, whatever point the close draws from it.
// (b) With pkgCEW present, its last clause "; a use for a purpose the withdrawal left open does not" is removed in both builders (W2 Wall 5512),
//     so one left-open test stays in the prompt.
module.exports=s=>{const R=(a,b,opt)=>{const k=s.split(a).length-1;if(opt&&k===0)return false;if(k!==1)throw 'anchor x'+k+': '+a.slice(0,80);s=s.replace(a,()=>b);return true;};
R("it does not apply to any other pair'","it does not apply to any other pair. By the operator\\'s ruling, a withdrawal covers only its named use: a link or purpose that the earlier line itself names as what '+w.ref+' is withdrawn from (\"for the exclusion\", \"from D1\"); a close that uses '+w.ref+' only under another link, for a purpose that line left open, does not rest again on it. A reason given for the withdrawal (\"since ...\"), a time, \"the case\", weight, load-bearing, proof, the link heading the earlier line sits under, or what the earlier line says it keeps is not a named use, and a withdrawal that names no use covers every use of '+w.ref+'; naming '+w.ref+' again as a layer or footing of the link it was withdrawn from is a rest, whatever point the close draws from it'");
return s;};
