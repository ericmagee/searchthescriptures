// pkgEWB (W1, 11-08; W3 lane 1 candidate after 33605): the DeepSeek E-ANS/E-HOLD "THE ANSWER IN FULL" finders match the answer's opening words as WHOLE words.
// 33605 B117 (grok, Acts 16:13): the answer opens "I grant that this is a true custom"; the finders took its first 6 words, "i grant that this is a",
// and tested them as a plain substring, so they matched "I grant that this is Adam's way of begetting" (the Genesis 4:1 bullet) and sent that block
// as THE ANSWER IN FULL. DeepSeek overruled grok's MEETS on the wrong text.
// Change, Judge Enforcer Build and Alt Judge Enforcer Build: the 4 opening-word tests in eawBlock, eawBlockMeans and eaiBlock become whole-word
// tests: the same substring, now only where it starts and ends at a word edge (no letter or digit on either side). Nothing else changes. Base: live s57. Run from wall2024/: node pkgEWB/build_EWB.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s57.json','utf8'));const plan={base:'live s57',nodes:{}};
const rep=(s,a,b,tag)=>{if(s.split(a).length!==2)throw new Error(tag+' anchor '+(s.split(a).length-1));return s.replace(a,()=>b);};
const WW="function __ww(hay,aw){hay=String(hay||'');aw=String(aw||'');if(!aw)return hay.includes(aw);let i=hay.indexOf(aw);while(i>=0){const a=hay[i-1],b=hay[i+aw.length];if(!(a&&/[a-z0-9]/.test(a))&&!(b&&/[a-z0-9]/.test(b)))return true;i=hay.indexOf(aw,i+1);}return false;} /* pkgEWB: the opening words must stand as whole words */\n";
for(const name of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const s0=W.nodes.find(z=>z.name===name).parameters.jsCode;let s=s0;
 s=rep(s,"function eawBlock(R,rks,verse,answer){",WW+"function eawBlock(R,rks,verse,answer){",'def');
 s=rep(s,"if(aw&&!NN(b).includes(aw))continue;return {rk,t:b};}}return null;}","if(aw&&!__ww(NN(b),aw))continue;return {rk,t:b};}}return null;}",'eaw');
 s=rep(s,"if(!NN(p).includes(aw))continue;","if(!__ww(NN(p),aw))continue;",'eai1');
 s=rep(s,"let k=L.findIndex(l=>NN(l).includes(aw))","let k=L.findIndex(l=>__ww(NN(l),aw))",'eai2');
 s=rep(s,"if(!b||(aw&&!NN(b).includes(aw)))continue;","if(!b||(aw&&!__ww(NN(b),aw)))continue;",'means');
 new Function('$','$input',s);fs.writeFileSync('pkgEWB/patched/'+name.replace(/ /g,'_')+'.js',s);plan.nodes[name]={base:h(s0),patched:h(s)};console.log(name,h(s0),'->',h(s));}
fs.writeFileSync('pkgEWB/plan_EWB.json',JSON.stringify(plan,null,1));
