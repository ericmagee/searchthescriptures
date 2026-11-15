// ASK 329 plants: each is one round text; expected trial class for the planted tag.
const fs=require('fs');const W='target_329.json';const L2C=require('../a329/l2c_load.cjs')(W);const OD=JSON.parse(fs.readFileSync('../a329/data_ow.json'));
const TR=new Function('L2C',fs.readFileSync('../a329/trial329.js','utf8')+'\nreturn __l2trial329;')(L2C);
const P=[
 ['B3 footing, one testament (6907 pair)','1. The virgin premise.\n[L1] Luke 1:34; Matthew 1:25. [L2] *parthenos* (G3933). [L3] Luke 2:5; Matthew 1:23.','G3933','COUNTED'],
 ['B3 mirror, one-verse [L1]','1. The virgin premise.\n[L1] Luke 1:34. [L2] *parthenos* (G3933). [L3] Matthew 1:23.','G3933','NOT COUNTED'],
 ['bare 1:18 under the wrong book (W1 6895 cond. 2)','Matthew 1:18 "before they came together" is cited.\n\nLuke 1:34 is the question. At 1:18 they came together: [L2] synerchomai (G4905).','G4905','REVIEW'],
 ['en dash range','Matthew 1:22–23 gives the sign. [L2] parthenos (G3933).','G3933','COUNTED'],
 ['self-correction "wrongly gave"','Matthew 1:24 "did as the angel of the Lord had bidden him" is cited.\n\nMatthew 1:18 "before they came together" -- I wrongly gave [L2] poieō (G4160) for this.','G4160','REVIEW'],
 ['clause before the marker quotes verse words (W2 48)','Luke 1:35 is cited.\n\nMatthew 1:18 "she was found with child of the Holy Ghost". So "the power of the Highest shall overshadow thee" is [L2] episkiazō (G1982).','G1982','REVIEW'],
 ['grant label G5 (pkgGLB)','Matthew 1:23 "Behold, a virgin" -- MEANS: the sign -- [L2] G5 parthenos (G3933).','G5','never a number'],
 ['press Isaiah 7:14, pipe Matthew 1:23 (R2)','Isaiah 7:14 "Behold, a virgin shall conceive" -- MEANS: the sign is a virgin -- [L2] parthenos (G3933) | [L3] Matthew 1:23','G3933','NOT COUNTED'],
 ['press, same-language pipe (B2)','Luke 1:35 "The Holy Ghost shall come upon thee" -- MEANS: the manner is the Spirit -- [L2] ginōskō (G1097) | [L3] Luke 1:34','G1097','COUNTED'],
 ['mixed-testament footing (R2b)','3. The sign.\n[L1] Isaiah 7:14, Luke 1:34, Genesis 4:1; [L2] parthenos (G3933, virgin); [L3] Matthew 1:23, Luke 1:27.','G3933','NOT COUNTED'],
 ['pressed verse not read (R3)','Isaiah 7:14 "Behold, a virgin shall conceive" is cited.\n\nObadiah 1:1 "The vision of Obadiah" -- MEANS: a vision -- [L2] almah (H5959)','H5959','NOT COUNTED'],
];
const code=JSON.parse(fs.readFileSync(W)).nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const lexBy={};for(const l of OD.lex)lexBy[l.strongs_number]=l;
const runN=(ra)=>{const F={cr3:ra[0][2]};const tg=L2C.tags(ra);const keys=new Set(tg.flatMap(t=>t.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));const lex=[...new Set(ow.map(w=>w.strongs_number))].map(n=>lexBy[n]).filter(Boolean);const kv=OD.kjv.filter(v=>keys.has(v.book+' '+v.chapter+':'+v.verse));
 const M={'Citation Scan':[{l2_tags:tg,l2_claims:[]}],'L2 Words':ow,'L2 Lexicon':lex,'Cited Verses':kv,'Final Output':[F]};const $=n=>{const m=M[n];return m?{isExecuted:true,all:()=>m.map(j=>({json:JSON.parse(JSON.stringify(j))})),first:()=>({json:JSON.parse(JSON.stringify(m[0]))})}:{isExecuted:false,all:()=>[],first:()=>({json:{}})};};
 return new Function('$','$input',code)($,{all:()=>[],first:()=>({json:{}})})[0].json;};
let pass=0;const res=[];
for(const [name,txt,num,want] of P){const ra=[['DEFENDER','CR3',txt]];const J=runN(ra);const tg=J.tags;const tr=J.l2_trial;
 const t=tg.find(t=>(t.words||[]).some(w=>w.w===num||w.num===num));const it=tr.items.find(x=>x.num===num);
 let got;if(want==='never a number'){got=tr.items.some(x=>x.num==='G5'||x.word==='G5')?'G5 READ AS A NUMBER':'never a number';}
 else got=it?it.trial:(t?(t.status==='COUNTED'?'COUNTED':'(today '+t.status+')'):'NO TAG');
 const ok=got===want;if(ok)pass++;res.push((ok?'PASS ':'FAIL ')+name+' | want '+want+' | got '+got+(it?' | '+it.why.slice(0,140):(t?' | today: '+t.status+' '+String(t.why||'').slice(0,100):'')));}
console.log(res.join('\n'));console.log('plants',pass,'of',P.length);
