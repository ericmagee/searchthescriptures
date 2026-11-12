// node plants.cjs : runs the grants finder (OGR.harvest) cut from live s160 and from parent_s160_GAV3.json on fixed plants
const fs=require('fs');
const ogr=f=>{const c=JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='C4 Build').parameters.jsCode;const i=c.indexOf('const OGR=');const e=c.indexOf('})();',i)+5;return new Function(c.slice(i,e)+';return OGR;')();};
const A=ogr('/mnt/project-files/wall2024/fetchback_live_s160.json'),B=ogr('/mnt/project-files/wall2024/parent_s160_GAV3.json');
// [text, expected count new, expected count old]
const P=[
['I also concede that Mary\'s descent from David is not stated in a row. It stands only as an inference.',1,0],
['I concede that Heli as Mary\'s father is not stated in any row: it is a bare assumption and I do not rest on it.',1,1],
['I now withdraw Galatians 4:4 as a witness for exclusion.',1,0],
['I also grant that the phrase "of a woman" alone does not exclude a father (Job 14:1; Matthew 11:11).',1,0],
['I readily grant that Joseph is called her husband in Matthew 1:19.',1,0],
['I also drop any claim that the seed reaches the child by a man\'s begetting.',1,0],
['I admit that no KJV verse says so in those words.',1,0],
['I set aside the Jeremiah 22:30 limb of D3 entirely.',0,0], // rev 2: set aside left out (W3 FAIL 2)
['I no longer rest D4 on Jeremiah 31:22, and Luke 2:48-49 is only supporting.',1,0],
['I retract the claim that Luke 3:23 names Mary\'s father.',1,0],
['I give up the reading of "till" as an end point.',1,0],
['I also do not claim that John describes a second enclosure here.',1,0],
['I drop Galatians 4:4 as a witness for exclusion, since I granted Matthew 11:11 and Job 14:1. I concede that Heli as Mary\'s father is not stated in any row: it is a bare assumption and I do not rest on it. I also concede that Mary\'s descent from David is not stated in a row. It stands only as an inference.',3,2],
// must stay NOT named
['I never concede that Joseph begat the child of Mary.',0,0],
['I would grant that point only if a verse said so plainly.',0,0],
['I do not concede that Joseph begat him at any point.',0,0],
['I hardly need to grant that Joseph was of David.',0,0],
['I cannot withdraw Matthew 1:20 since it carries the whole link.',0,0],
['I also note that Luke 1:35 names the Holy Ghost as the cause.',0,0],
['I also concede nothing on Matthew 1:16, which says "of whom".',0,0],
['The challenger says "I also concede the point" but I do not.',0,0],
['## What I also grant',0,0],
// rev 2 (W3 Wall 5407, W1 5406, W4 5408)
['**What I also grant**\n- The verse names Joseph.',0,0],
['**What I admit and what I retract**',0,0],
['## What I no longer rest on',0,0],
['I set aside the challenger\'s reading of Matthew 1:25 as unsupported by any row.',0,0],
['I set aside the genealogy for the moment and turn to Luke 1:35.',0,0],
['If I admit this, the chain falls, so I do not.',0,0],
['If I grant this, the chain falls, so I do not.',0,1],
['If he shows a row, I readily concede the limb.',1,0], // rev 3: grant in the main clause after the comma is read (W4)
['If the challenger presses Luke 3:23, I grant that it reports a supposing.',1,1],
['Unless a row names him, I concede the point.',1,1],
['If I concede this limb the chain falls.',0,1],
['Nor do I now concede that the seed is Joseph\'s.',0,0],
['Do I also concede the point? No.',0,0],
['Do I concede the point? No.',0,1],
['I admit, set aside, and give up nothing in this round.',0,0],
['I grant, withdraw, and drop nothing in this round.',0,1],
['I also concede, and I say it plainly, that no row names Heli.',1,0],
['Granted, the verse names Joseph as husband in Matthew 1:19.',1,1],
];
let ok=0;for(const [t,en,eo] of P){const n=B.harvest({CR3:t}).length,o=A.harvest({CR3:t}).length;const g=n===en&&o===eo;if(g)ok++;console.log((g?'AS EXPECTED ':'NOT AS EXPECTED ')+'new '+n+' old '+o+' | '+t);}
console.log(ok+' of '+P.length);
