// test_KGL: K-W items of kwLines421, live s163 vs pkgKGL, on (1) plants, checked against the live grants finder (OGR in C4 Build)
// so the two readers agree, and (2) the 81 stored runs of /mnt/project-files/w3/grade_WVR/corpus2.json.
// Usage: node test_KGL.cjs <parent json> <pkg json>
const fs=require('fs');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const lib=w=>{const T=w.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');if(i<0)throw new Error('no '+name);const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=S=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(S,'kwiCut2024')+'\n'+fn(S,'kwiSq2024')+'\n'+fn(S,'kwLines421')+'\nreturn kwLines421;')();
const ogr=w=>{const c=w.nodes.find(n=>n.name==='C4 Build').parameters.jsCode;const i=c.indexOf('const OGR=');const e=c.indexOf('})();',i)+5;return new Function(c.slice(i,e)+';return OGR;')();};
const P0=un(process.argv[2]),P1=un(process.argv[3]);const A=mk(lib(P0)),B=mk(lib(P1)),G=ogr(P1);
const kw=(f,R)=>f('',R).items.filter(x=>x.rule==='K-W');
// [text, expected K-W count new]; the grants finder count on the same text is shown (it differs only on headings, by the live pkgKWH rule)
const P=[
['I also concede that Mary\'s descent from David is not stated in a row. It stands only as an inference.',1],
['I now withdraw Galatians 4:4 as a witness for exclusion.',1],
['I also grant that the phrase "of a woman" alone does not exclude a father (Job 14:1; Matthew 11:11).',1],
['I readily grant that Joseph is called her husband in Matthew 1:19.',1],
['I also drop any claim that the seed reaches the child by a man\'s begetting.',1],
['I admit that no KJV verse says so in those words.',1],
['I no longer rest D4 on Jeremiah 31:22, and Luke 2:48-49 is only supporting.',1],
['I retract the claim that Luke 3:23 names Mary\'s father.',1],
['I give up the reading of "till" as an end point.',1],
['I also do not claim that John describes a second enclosure here.',1],
['I also therefore concede that the verb in Matthew 1:16 is passive here.',1],
['I concede that Heli as Mary\'s father is not stated in any row.',1],
['I set aside the Jeremiah 22:30 limb of D3 entirely.',0],
['I set aside the challenger\'s reading of Matthew 1:25 as unsupported by any row.',0],
['I never concede that Joseph begat the child of Mary.',0],
['I would grant that point only if a verse said so plainly.',0],
['I do not concede that Joseph begat him at any point.',0],
['I hardly need to grant that Joseph was of David.',0],
['I also concede nothing on Matthew 1:16, which says "of whom".',0],
['I admit, set aside, and give up nothing in this round.',0],
['I grant, withdraw, and drop nothing in this round.',0],
['The challenger says "I also concede the point" but I do not.',0],
['If I admit this, the chain falls, so I do not.',0],
['If I grant this, the chain falls, so I do not.',0],
['Do I also concede the point? No.',0],
['Do I concede the point? No.',0],
['Nor do I now concede that the seed is Joseph\'s.',0],
['If the challenger presses Luke 3:23, I grant that it reports a supposing.',1],
['If he shows a row, I readily concede the limb.',1],
['- [L4] If I admit this, the chain falls.',0],
['**What I grant**\n- The verse names Joseph.',1], // live pkgKWH rule: a heading is skipped only when a grant verb follows under it
['**What I also grant**\n- The verse names Joseph.',1],
['**What I also grant**\n- I grant that the verse names Joseph.',1],
['## What I no longer rest on',0],
['**What I grant and what I withdraw**',2],
['**What I admit and what I retract**',2],
['**What I admit and what I retract**\n- I admit that no row names Heli.',1],
];
let ok=0,agree=0;for(const [t,en] of P){const R={CR3:t};const n=kw(B,R).length,o=kw(A,R).length,g=G.harvest(R).length;const pass=n===en;if(pass)ok++;if(n===g)agree++;
 console.log((pass?'AS EXPECTED ':'NOT AS EXPECTED ')+'new '+n+' old '+o+' grants '+g+(n===g?'':' DIFFERS')+' | '+t.replace(/\n/g,' / '));}
console.log('plants '+ok+' of '+P.length+'; key-word reader equals grants finder on '+agree+' of '+P.length);
const rows=require('/mnt/project-files/w3/grade_WVR/corpus2.json');let same=0,ch=0,add=0,lost=0;
for(const F of rows){const R={CR2:F.cr2,CR3:F.cr3,CR4:F.cr4,DR3:F.dr3,DR4:F.dr4};const a=kw(A,R).map(x=>x.line),b=kw(B,R).map(x=>x.line);
 if(JSON.stringify(a)===JSON.stringify(b)){same++;continue;}ch++;const sa=new Set(a),sb=new Set(b);const p=b.filter(x=>!sa.has(x)),m=a.filter(x=>!sb.has(x));add+=p.length;lost+=m.length;
 console.log(F.run,'+'+p.length,'-'+m.length);p.forEach(x=>console.log('  + '+x.slice(0,200)));m.forEach(x=>console.log('  - '+x.slice(0,200)));}
console.log('stored runs',rows.length,'equal',same,'changed',ch,'K-W items added',add,'lost',lost);
// size: characters of K-W item lines and audit marks, new minus live, over the 81 runs
{let d=0;for(const F of rows){const R={CR2:F.cr2,CR3:F.cr3,CR4:F.cr4,DR3:F.dr3,DR4:F.dr4};const s=f=>{const o=f('',R);return o.items.filter(x=>x.rule==='K-W').reduce((a,x)=>a+x.line.length,0)+o.marks.filter(x=>/K-W;/.test(x)).reduce((a,x)=>a+x.length,0);};d+=s(B)-s(A);}console.log('K-W lines plus marks, characters added over 81 runs:',d);}
