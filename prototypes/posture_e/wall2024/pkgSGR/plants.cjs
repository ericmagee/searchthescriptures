// pkgSGR plants: giveUp old (live s141) vs new (parent) on planted paragraphs. Expected: listed or not, beside each.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const lib=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');return JSON.parse(T.slice(a+8,b));};
const mk=L=>new Function('N',L[3163]+L[3164]+';return giveUp;')(s=>String(s).toLowerCase());
const O=mk(lib(load(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s141.json'))),G=mk(lib(load(process.argv[2])));
const P=[ // [side whose text it is, paragraph, expected listed]
 ['D','It is granted that Luke 1:27 puts "of the house of David" on Joseph.',1],
 ['C','[L1] Luke 1:35: "The Holy Ghost shall come upon thee." This is granted: divine action upon Mary.',1],
 ['D','**Genesis 4:1** is granted as the stated means of begetting.',1],
 ['D','Luke 1:27 puts the house of David on Joseph, which I granted.',1],
 ['D','I keep my earlier grants: Luke 1:27 and Luke 2:4.',1],
 ['D','I keep what I granted: Luke 3:23-31 is a Davidic line.',1],
 ['D','I keep dropped the assertion that any row names Heli.',1],
 ['D','D4 as kept does not rest on that house, and that assertion stays dropped.',1],
 ['D','I have conceded the tense of Luke 1:34.',1],
 ['D','I grant that eperchomai alone is a word of coming.',1],
 ['D','I grant the challenger\'s reading of Luke 3:23.',1],
 ['D','**LINK 5: NARROWED TO:** the limb that the flesh is of David.',1],
 ['C','G3 [CR4] "I grant that eperchomai alone is a word of coming." -- SUPPORTS: C6.',0],
 ['C','G2 [CR3] “I drop the assertion that a row names Heli.” -- SUPPORTS: C1.',0],
 ['C','The defender wrote: ‘I grant that the idiom is said of men with fathers’ and it stands.',0],
 ['C','So the house is the house of Joseph, the man the defender grants it to.',0],
 ['C','The defender narrowed his fifth link to the Davidic line under Joseph\'s name.',0],
 ['C','The defender has conceded the house of David is on Joseph.',0],
 ['C','"of a woman" is said of men with fathers (Matthew 11:11, granted).',0],
 ['C','Luke 1:27 is granted by the defender.',0],
 ['D','Luke 1:27 was conceded by the challenger in round 3.',0],
 ['D','The challenger granted that Luke 1:35 names divine action.',0],
 ['D','**Grant.** [L2] *prin* with *synelthein* does govern *heurethe*. The clause dates the finding.',1],
 ['D','[L3] Luke 2:41: "his parents went". Granted: the household calls Joseph father.',1],
 ['C','**The defender\'s grant.** The defender wrote in round 2 that the idiom is said of men with fathers.',0],
 ['C','The defender\'s grant. It stands beside named fathers.',0],
 ['C','Granting that "his father" is Abraham confirms the chain.',0], // LIMIT: a gerund grant is not read (old and new alike)
];
let ok=0;for(const [sd,p,e] of P){const o=!!O(p,'',sd),n=!!G(p,'',sd);const r=n===!!e?'OK':'WRONG';if(r==='OK')ok++;console.log(r.padEnd(6),'old',o?'listed':'-     ','new',n?'listed':'-     ','want',e?'listed':'-     ',sd,'|',p.slice(0,90));}
console.log('plants',P.length,'right',ok);
