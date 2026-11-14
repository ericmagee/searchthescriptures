// W2 6420 grade aid: jeb.js = rebuilt Judge Enforcer Build stub from pkgEAL target (build.cjs on s205), saved beside this file.
const s=require('fs').readFileSync(__dirname+'/jeb.js','utf8').split('\n');
// find end of __RL IIFE
let e=76;while(!/^\}\)\(\);?\s*$/.test(s[e])&&!/\}\)\(\);\s*$/.test(s[e]))e++;
const RL=s.slice(76,e+1).join('\n');
const loop=s.slice(18,26).join('\n');
const judges=[{seat:'sol',t:'ANSWER CHECK: Matthew 1:19 -- [CR3, defender Premise 1] -- MEANS: “his stated cause is public exposure, which fits a husband who is father” -- ANSWER: “I grant it would touch any woman found with child.” / “The angel answers with origin (1:20).” -- MEETS -- The answer admits exposure.'},
{seat:'luna',t:'ANSWER CHECK: Matthew 1:19 -- [CR3] -- MEANS: his stated cause is public exposure, which fits a husband who is father -- ANSWER: “I grant it would touch any woman found with child” and “the child’s origin was the open question for him.” -- MEETS -- the response grants the fit.'}];
const live=new Function('judges',loop+'\n'+RL+'\nreturn AG;');
const ctrl=new Function('judges',RL+'\n'+loop+'\nreturn AG;');
console.log('RL lines',77,'to',e+1);
console.log('STUB ORDER (loop line 23, __RL line 77): groups',live(judges).length);
console.log('RL FIRST (as t2.cjs): groups',JSON.stringify(ctrl(judges).map(g=>[g.rk,g.grades.map(x=>x.seat)])));
// show the swallowed error
const probe=new Function('judges',loop.replace('const __ac2=l=>{let r=null;try{r=__RL.readLine(String(l));}catch(e){return null;}','const __ac2=l=>{let r=null;try{r=__RL.readLine(String(l));}catch(e){console.log("caught:",e.constructor.name,e.message);return null;}')+'\n'+RL+'\nreturn AG;');probe(judges.slice(0,1));
