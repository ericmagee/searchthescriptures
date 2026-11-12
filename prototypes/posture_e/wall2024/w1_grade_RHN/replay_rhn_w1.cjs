const fs=require('fs');
const get=f=>{const w=JSON.parse(fs.readFileSync(f));const s=w.nodes.find(n=>n.name==='D4 Extract').parameters.jsCode;const a=s.indexOf('const __RFX=');const b=s.indexOf('})();',a)+5;return s.slice(a,b).replace('const n=4;','');};
const mk=src=>new Function('raw','n',src.replace('const __RFX=','return ')+'');
// wrap so we also return raw
const mk2=src=>new Function('raw','n',src.replace('const __RFX=','const __R=')+';return {fx:__R,raw};');
const O=mk2(get('/mnt/project-files/wall2024/fetchback_live_s156.json')),N=mk2(get('/mnt/project-files/wall2024/parent_s156_RHN.json'));
const T=[[2,"# CHALLENGER — ROUND 3: CLOSING — THE CHAIN BREAKS"],[2,"# CHALLENGER — ROUND 3 (FINAL)"],[2,"# ROUND 3 — FINAL CHALLENGE: The Record Closes Against the Defense"],
[2,"Noted; nothing is conceded here. Every demand is answered below, and each answer re-seats the term the challenger stripped from its chain. The chain declared in round 1 stands unbroken; I answer in his order."],
[2,"# Challenger, Round 3 (close): the oath runs through loins, and the defender's own rows turn against his channels"],
[4,"I defend D1 to D6 as numbered in my round 1 chain. Where a link has to narrow, I say so. C1 to C6 are the challenger's link blocks. Their presses are answered under the D-link they strike."],
[4,"**Status of my links, as my round 3 numbered them:**"],
[4,"Order: D1 to D5 are held as numbered in my round 1. C1 to C6 are the challenger's link blocks. Each ANSWER names the verse, the link it touches, and the C block it meets."],
[4,"I keep D1 through D6 as declared in my round 1, none narrowed and none conceded. The challenger's link round grants the following, and I rest on those grants:"],
// plants
[4,"Round 3 close"],[4,"DEFENDER ROUND 3: CLOSE"],[4,"Defender, Round 3 (close)"],[3,"### The Defender's Round 2 Link Round"],[4,"**Round 2 grants stand.**"],[4,"I keep D1 to D6. As shown in Round 2, the seed is flesh."],[4,"# My Round 3 close"],[4,"Round 3. Close."],[4,"Defender — Round 3 — Close"],
[4,"line one\n# Round 4 (close)\nI keep D1 as declared in my round 1."],
[4,"I said in my round 4 that D1 stands.\n# Round 3"],
];
for(const [n,t] of T){const o=O(t,n),w=N(t,n);console.log((o.raw===w.raw?'same':'DIFF'),n,JSON.stringify(t.slice(0,60)),'| old:',JSON.stringify(o.raw.slice(0,70)),'| new:',JSON.stringify(w.raw.slice(0,70)));}
