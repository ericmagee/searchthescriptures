// test_KWH: K-W items from kwLines421 on (1) planted forms and (2) every stored run in the close-enforcer prompts, parent vs pkgKWH.
// Usage: node test_KWH.cjs <parent json> <pkg json> <prompts file>...
const fs=require('fs');
// The functions are taken from the Panel Payloads node as the Shared Library map rebuilds it (the map adds the closing line of kwLines421).
const lib=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflow||j;const T=j.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
 return M['Panel Payloads'].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const fn=(S,name)=>{const i=S.indexOf('\nfunction '+name+'(');if(i<0)throw new Error('no '+name);const j=S.indexOf('\nfunction ',i+1);return S.slice(i+1,j);};
const mk=Lb=>new Function('const wpLines2024=()=>({items:[],marks:[]}),kconLines2024=()=>({items:[],marks:[]}),kcmtLines2024=()=>({items:[],marks:[]});\n'+fn(Lb,'kwiCut2024')+'\n'+fn(Lb,'kwiSq2024')+'\n'+fn(Lb,'kwLines421')+'\nreturn kwLines421;')();
const A=mk(lib(process.argv[2])),B=mk(lib(process.argv[3]));
const items=(f,R)=>f('',R).items.map(x=>x.line);
let fail=0;const plant=(name,txt,want)=>{const R={CR2:txt};const a=items(A,R),b=items(B,R);const ok=b.length===want;if(!ok)fail++;console.log((ok?'PASS':'FAIL'),name,'| parent',a.length,'pkg',b.length,'want',want);b.forEach(x=>console.log('     ',x.slice(0,140)));};
plant('heading bold, then real grant','**What I grant and what I withdraw.** I grant that "born of women" is said of men. I withdraw LINK 3.',2);
plant('heading line alone','What I grant and what I withdraw.\nI drop the limb that Mary is of the house of David.',1);
plant('heading with colon','What I concede:\n- I concede that the word can mean descent.',1);
plant('heading three verbs','What I grant, what I drop, and what I withdraw.\nNothing else.',0);
plant('real: What I withdraw is LINK 3','What I withdraw is LINK 3 and its ground.',1);
plant('real: which I withdraw','LINK 3, which I withdraw.',1);
plant('real: That is what I grant (mid-sentence)','That is what I grant.',1);
plant('real: plain withdrawal','I withdraw the claim that Mary is of the house of David.',1);
plant('real: what I grant here is limited','What I grant here is that seed may mean descent.',1);
plant('real: inline colon grant','What I grant: seed may mean descent.',1);
plant('KNOWN MISS: heading colon at line end, item has no K-W verb','What I withdraw:\n- LINK 3.',0);
plant('rev2: bold heading, no end punctuation, blank line, then real grant','**What I grant and what I withdraw**\n\nI grant that seed may mean descent.',1);
plant('rev2: plain heading, no end punctuation','What I grant and what I withdraw\n\nNothing here.',0);
plant('rev2: heading at end of text','Some words.\nWhat I concede',0);
const R0={};for(const f of process.argv.slice(4))Object.assign(R0,require('../pkgCNP/rounds.cjs')(f));const R={};const UP={cr1:'CR1',cr2:'CR2',cr3:'CR3',cr4:'CR4',gr1:'DR1',gr2:'DR2',dr3:'DR3',dr4:'DR4'};for(const k in R0){R[k]={};for(const f in R0[k])R[k][UP[f]]=R0[k][f];}let d=0;
for(const k in R){const a=items(A,R[k]),b=items(B,R[k]);const gone=a.filter(x=>!b.includes(x)),add=b.filter(x=>!a.includes(x));if(gone.length||add.length){d++;console.log('CHANGE',k,'parent',a.length,'pkg',b.length);gone.forEach(x=>console.log('   removed',x.slice(0,160)));add.forEach(x=>console.log('   added',x.slice(0,160)));}}
console.log('stored runs',Object.keys(R).length,'changed',d,'| planted fails',fail);
