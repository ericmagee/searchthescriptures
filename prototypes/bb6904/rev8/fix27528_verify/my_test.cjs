// Worker_A3 independent check of the option 1 cut fix: old (composed = 804b870a) vs new (Worker_E e50e24e) drvKinds
const fs=require('fs');
const load=(p)=>{const s=fs.readFileSync(p,'utf8');const a=s.indexOf('const DRV_REF=');const b=s.indexOf('return {items,marks};}',a)+'return {items,marks};}'.length;return new Function(s.slice(a,b)+';return {drvKinds};')();};
const O=load('../s6/composed/Panel_Payloads.js'),N=load('e/prototypes/bb6904/rev8/fix27528/patched/Panel_Payloads.js');
const L=[
['27528 gemini(removed)','D6 vs C6 (Isaiah 7:14): DEFENDER LINK BROKEN -- the challenger exhibited [L1] "a virgin espoused... the virgin\'s name was Mary" (Luke 1:27) with the Greek [L2] *parthenos*, and [L3] Isaiah 7:14 to prove the sign requires no man be the begetter, and the defender\'s link round left these witnesses unanswered.'],
['27528 single','D6 vs C3 (Matthew 1:16): DEFENDER LINK BROKEN -- [L1] “Jacob begat Joseph the husband of Mary, of whom was born Jesus”; [L2] *ex hēs egennēthē* is feminine singular + aorist passive, unlike the preceding *egennēsen* chain; [L3] Matthew 1:2–16; [CR3] quoted the verse but left the formula-change witness unanswered.'],
['27528 chatgpt','D6 vs C1 (Matthew 1:22-25; Luke 1:34-35): DEFENDER LINK BROKEN -- [L1] Matthew says, "Behold, a virgin shall be with child, and shall bring forth a son," and Joseph "knew her not till she had brought forth her firstborn son"; [L2] parthenos identifies the virgin, while andra ou ginōskō and dio kai connect Mary\'s no-man question with the Spirit-agency answer; [L3] Luke 1:34-35 supplies the answering conception narrative. [L4] Read together, these are positive conception witnesses against D6\'s required human begetter, not an argument from a missing begetter-verse; CR3 leaves the specifically pressed virgin-fulfilment witness unanswered.'],
['27528 deepseek','D6 vs C2 (Matthew 1:16, 1:18, 1:19-20, 1:25): DEFENDER LINK BROKEN -- [L1] \'before they came together\' (Matthew 1:18) and \'knew her not till\' (1:25), with [L2] egennēthē (G1080) passive and ex hēs feminine at 1:16 and [L3] Joseph\'s divorce intent in 1:19-20 with 1:20 gar, together exclude Joseph from the begetting; [CR3] left Matthew 1:19 unnamed and unanswered.'],
];
// five stored debates, from my own five.json
const D=JSON.parse(fs.readFileSync('../rev8v/five.json','utf8'));
const txt=(raw)=>{const h=String(raw||'').split('\n\n[AUDIT')[0];try{const j=JSON.parse(h.replace(/^```(?:json)?\s*|\s*```$/g,''));return j.reasoning||h;}catch(e){return h;}};
let fiveN=0;const walk=(o,w)=>{if(typeof o==='string'){for(const l of txt(o).split('\n'))if(/LINK BROKEN/.test(l)&&/vs\s+C\d/.test(l)&&!/^\[AUDIT/.test(l)){L.push([w,l]);fiveN++;}}else if(o&&typeof o==='object')for(const k in o)walk(o[k],w+'.'+k);};
walk(D,'five');
let ch=0,lost=0;for(const [w,l] of L){const a=JSON.stringify(O.drvKinds(l)),b=JSON.stringify(N.drvKinds(l));if(a!==b){ch++;console.log('CHANGED',w.slice(0,60),(l.match(/D\d+\s+vs\s+C\d+/)||[''])[0],a,'->',b);}if(N.drvKinds(l).length<O.drvKinds(l).length)lost++;}
console.log('lines',L.length,'(five.json',fiveN+')','changed',ch,'lost a kind',lost);
const p='D1 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- [L1] Luke 1:27. Then "a virgin espoused to a man" [L3] Isaiah 7:14.';
console.log('sentence end still cuts: old',JSON.stringify(O.drvKinds(p)),'new',JSON.stringify(N.drvKinds(p)));
