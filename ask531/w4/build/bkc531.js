// ASK 531 criterion 6, pkgBKC at function level (W4): bkcKeep2024 from the target Library, with acx fact 91 "Mary is of David's line" (CHALLENGER, both_not_stated, r2).
// Returns null = no K-UNX item kept back (exempt); returns ua = the K-UNX item stands. Also prints the two tests separately (W2 10629 item 2).
const fs=require('fs');const T=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=T.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));
const i461=L.findIndex(l=>l.startsWith('function bkcKeep2024('));const bk=L[i461].slice(0,L[i461].indexOf(' function kunxLines('));
const ACX={facts:[{side:'CHALLENGER',n:91,k:1,fact:"Mary is of David's line",r2:true,both_not_stated:true}]};
const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:ACX}})};throw new Error('no '+n);};
const f=new Function('$',L[3563]+'\n'+bk+'\nreturn {bkcKeep2024,acx531Same,acx531R2Charge};')($);
const SW=new Set('the and that this with from into unto upon for not are was were his her its their who whom which what when where than then also only both all any one there here have has had been being of to in on at by is be it as or an a he she they them him'.split(' '));
const ws=t=>{const o=new Map();for(const m of String(t||'').replace(/[’']s\b/g,'').matchAll(/[A-Za-z]+/g)){const w=m[0].toLowerCase();if(w.length<3||SW.has(w))continue;o.set(w,(o.get(w)||false)||/^[A-Z]/.test(m[0]));}return o;};
const ua={asm:true,a:'ASSUMES',why:'K-UNX item'};
for(const [name,cl,want] of [['K1 known good',"Mary is in David's line",'exempt'],['K2 known bad (under 2 shared content words)','the mother descends from Jesse','flagged'],['K3 sol62 41418 premise 3 text',"the woman through whom it is said to pass is in David's bodily line",'exempt'],['K4 names only (same-fact passes on Mary+David, word test needs a word not a name)',"Mary and David",'flagged']]){
 const all=[{seg:'Premise 3: UNEXHIBITED. STEP: x -- ASSUMES: '+cl+' -- ROWS GIVE: y'}];const r=f.bkcKeep2024('CHALLENGER',3,all,ua);
 const W=ws(ACX.facts[0].fact),C=ws(cl);const sh=[...W.keys()].filter(w=>C.has(w));const word=sh.length>=2&&sh.some(w=>!W.get(w)&&!C.get(w));
 const got=r===null?'exempt':'flagged';console.log((got===want?'PASS ':'FAIL ')+name+' | same-fact test '+f.acx531Same(ACX.facts[0].fact,cl)+' | word test '+word+' (shared '+sh.join(',')+') | K-UNX '+got);}
for(const [j,want] of [[91,true],[92,false],[7,false]])console.log((f.acx531R2Charge('CHALLENGER',j)===want?'PASS ':'FAIL ')+'RANGE acx531R2Charge CHALLENGER '+j+' -> '+f.acx531R2Charge('CHALLENGER',j)+' (true = not flagged by RANGE)');
console.log((f.acx531R2Charge('DEFENDER',91)===false?'PASS ':'FAIL ')+'RANGE acx531R2Charge DEFENDER 91 -> '+f.acx531R2Charge('DEFENDER',91));
