// pkgRCK (W1, Wall 2741; scope W3 2742, 2747): a count an applied change (send-back or gate) writes is read by K-UNX / K-UNX-A / E-ASM,
// the same test the first count gets, through the gate's K re-read. No change is refused; the engine writes no count the judge did not write. Side-neutral.
// Base: live 5a710187 fetch-back + pkgUNXS/patched + pkgUNXW/patched (stack.cjs; W2 write order UNXS, UNXW, RCK). Each anchor asserted exactly once per node.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {stacked}=require('./stack.cjs');const SRC=process.argv[2];
const OUT=path.join(__dirname,'out');fs.mkdirSync(OUT,{recursive:true});const PAT=path.join(__dirname,'patched');fs.mkdirSync(PAT,{recursive:true}); /* patched/ is committed; out/ is the same files plus the workflow JSON */
const {W0,W,used}=stacked(SRC);console.log('base layers: '+JSON.stringify(used));
const K0="function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};let R;try{R=ciRounds(ptext);}catch(e){return {items,marks};}";
const K1="function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||!(typeof ptext==='string'||(ptext&&typeof ptext==='object')))return {items,marks};let R;try{R=typeof ptext==='string'?ciRounds(ptext):ptext;}catch(e){return {items,marks};} /* pkgRCK: also takes the rounds object */";
const A0="if(ctx.R&&Object.keys(ctx.R).length){const F9=kfLines(T,ctx.R);(F9.items||[]).forEach(x=>its.push(x));MK=MK.concat(F9.marks||[]);} /* pkgKF (W3 2347): the K-F test on the corrected judgment */";
// W3 2742/2747 scope: no change is refused. The K re-read (pkgGL's gateNewK2024: the text with and without the changes) also runs K-UNX, K-UNX-A and E-ASM.
// A new item after the send-back apply becomes a G item at the gate; after the gate it is a fresh item, recorded while TRIAL, and under pkgGL when LIVE.
const RCK=A0+" if(ctx.R&&Object.keys(ctx.R).length){const U9=kunxLines(T,ctx.R);(U9.items||[]).forEach(x=>its.push({...x,why:x.link+': '+x.why}));MK=MK.concat(U9.marks||[]);} /* pkgRCK (W1 2741; W3 2742, 2747): K-UNX, K-UNX-A and E-ASM read the count the changes wrote */";
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const cnt=(s,a)=>s.split(a).length-1;
let nk=0,na=0;const rep=[];
for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c!=='string')continue;let t=c;
 if(t.includes('function kunxLines(')){if(cnt(t,K0)!==1)throw new Error('K0 anchor x'+cnt(t,K0)+' in '+n.name);t=t.replace(K0,()=>K1);nk++;}
 if(t.includes('function gateNewK2024(')){if(cnt(t,A0)!==1)throw new Error('A0 anchor x'+cnt(t,A0)+' in '+n.name);t=t.replace(A0,()=>RCK);na++;}
 if(t!==c){rep.push(n.name+' '+sha(c)+' -> '+sha(t));n.parameters.jsCode=t;fs.writeFileSync(path.join(OUT,n.name.replace(/[^A-Za-z0-9]+/g,'_')+'.js'),t);fs.writeFileSync(path.join(PAT,n.name.replace(/[^A-Za-z0-9]+/g,'_')+'.js'),t);}}
if(nk!==22||na!==6)throw new Error('expected 22 kunxLines and 6 gateNewK2024 nodes, got '+nk+'/'+na);
fs.writeFileSync(path.join(OUT,'workflow_RCK.json'),JSON.stringify(W0));
console.log('pkgRCK: '+rep.length+' nodes changed ('+nk+' kunxLines, '+na+' gateNewK2024)');rep.forEach(r=>console.log('  '+r));
