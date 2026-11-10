// pkgKBG probe (W3). Run 33798, Send Back Record, terra's E-ANS item on Job 14:1 (flagged answer "I grant it is said of all men.", bare). Base = live s94 + pkgKVQ; candidate = parent_s94_KBG2.json (rev 2).
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const LV=g(__dirname+'/base_s94_KVQ.json'),PK=g(__dirname+'/parent_s94_KBG2.json'),S94=g('/mnt/project-files/wall2024/fetchback_live_s94.json');const code=(X,n)=>X.nodes.find(z=>z.name===n).parameters.jsCode;const cl=x=>JSON.parse(JSON.stringify(x));
const RUN='33798';const PCN=H.out(RUN,'Panel Cure Normalize 1'),CALL=H.out(RUN,'Send Back Call openrouter');const R0=PCN.flat()[0].json.cure.rounds;
const T0=CALL.flat()[2].json.choices[0].message.content;const a=T0.indexOf('SENDBACK: S3 ||'),b=T0.indexOf('\nSENDBACK: S4');
const call=line=>{const m=cl(CALL);m.flat()[2].json.choices[0].message.content=T0.slice(0,a)+line+T0.slice(b);return m;};
const pcn=R=>{const m=cl(PCN);m.forEach(x=>x&&x.forEach(it=>{if(it&&it.json&&it.json.cure&&it.json.cure.rounds)it.json.cure.rounds=R;}));return m;};
const all=async(X,R,line)=>(await H.run(code(X,'Send Back Record'),RUN,'Send Back Call openrouter',{'Panel Cure Normalize 1':pcn(R),'Send Back Call openrouter':call(line)}))[0].json.sb_rows;
const row=async(X,R,line)=>(await all(X,R,line)).find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));
const K=l=>'SENDBACK: S3 || KEEP || '+l;let ok=0,bad=0;const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const RD=Object.assign({},R0,{CR4:R0.CR4+'\nI answer it under LINK 2 of my chain.'});
const CASES=[ // [name, rounds, KEEP reason, base status, candidate status, candidate reason must match]
 ['another bare grant of the side (the Luke 2:4 grant)',R0,'"I grant it is said of Joseph."','CURED','UNCURED',/pkgKQG|pkgKBG/], // its first window lies in the flagged answer, so the reason printed is pkgKQG's; the window "grant it is said of joseph" is the one pkgKBG refuses
 ['another bare grant (Matthew 11:11 item)',R0,'"I grant it is a class phrase said of men with fathers."','CURED','UNCURED',/pkgKBG/],
 ['another bare grant, no quote marks, other case',R0,'the defender wrote I GRANT THE ESPOUSAL AND THE DATING in the same round','CURED','UNCURED',/pkgKBG/],
 ['straddle: tail of another bare grant running into the next own words',R0,'"the house is named. The verse\'s for gives"','CURED','UNCURED',/pkgKBG/],
 ['a deferral sentence of the side (planted in CR4)',RD,'"I answer it under LINK 2 of my chain."','CURED','UNCURED',/pkgKBG/],
 ['the side\'s own reasoned sentence after another grant (not bare)',R0,'"The verse\'s for gives the Holy Ghost as the reason."','CURED','CURED',/quotes the answering side/],
 ['the CR2 fuller answer',R0,'[CR2] says "I accept it as a phrase said of all men"','CURED','CURED',/quotes the answering side/],
 ['bare grant followed by a fuller answer in the same reason',R0,'"I grant it is said of Joseph." and "The verse\'s for gives the Holy Ghost as the reason."','CURED','CURED',/quotes the answering side/],
 ['pkgKQG stands: the flagged bare grant itself',R0,'"I grant it is said of all men."','UNCURED','UNCURED',/pkgKQG/],
 ['pkgKVQ stands: the verse the side quoted',R0,'"of few days, and full of trouble"','UNCURED','UNCURED',/pkgKVQ/],
 ['no six words of the rounds',R0,'the answer stands as I graded it','UNCURED','UNCURED',/quotes no 6 words/],
];
(async()=>{
 for(const [nm,R,why,b0,c0,re] of CASES){const l=await row(LV,R,K(why)),k=await row(PK,R,K(why));const cr=String(k.cure_reason);chk(l.cure_status===b0&&k.cure_status===c0&&re.test(cr),nm+': base '+l.cure_status+', candidate '+k.cure_status+' | '+cr.slice(cr.indexOf('KEEP whose')).slice(0,170));}
 // rev 2 (W1 3857): opening formatting before a grant; W1's plants M1 to M7
 {const addR=(k,line)=>Object.assign({},R0,{[k]:R0[k]+'\n'+line});const G='I grant the phrase covers Hezekiah and Josiah, kings named by their fathers.';const A2='"I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone."';
  const M=[['M1 the CR2 sentence as stored, under its bold heading (a grant joined to a further clause: left)',R0,A2,'CURED'],['M2 the same with the heading removed',Object.assign({},R0,{CR2:R0.CR2.replace('**On Job 14:1.** I accept','I accept')}),A2,'CURED'],
   ['M3 planted bare grant, plain line',addR('CR4',G),'"'+G+'"','UNCURED'],['M4 as a bullet',addR('CR4','- '+G),'"'+G+'"','UNCURED'],['M5 after a bold heading',addR('CR4','**On Job 14:1.** '+G),'"'+G+'"','UNCURED'],['M6 after a layer tag',addR('CR4','[L1] '+G),'"'+G+'"','UNCURED'],['M7 after a bullet and a bold verse label',addR('CR4','- **Job 14:1** '+G),'"'+G+'"','UNCURED'],
   ['M8 numbered, quoted block mark and plain verse label',addR('CR4','2. > Job 14:1: '+G),'"'+G+'"','UNCURED'],['M9 the stored CR line "- **Galatians 4:4.** I grant of a woman is a general phrase (Job 14:1)."',R0,'"I grant of a woman is a general phrase (Job 14:1)."','UNCURED'],
   ['M10 a label alone does not make a reasoned sentence bare',addR('CR4','- **Job 14:1** I grant the phrase, for it names the mother of every man and says nothing of a father.'),'"it names the mother of every man and says nothing of a father"','CURED']];
  for(const [nm,R,why,want] of M){const k=await row(PK,R,K(why));const cr=String(k.cure_reason);chk(k.cure_status===want,nm+': '+k.cure_status+' (want '+want+') | '+cr.slice(cr.indexOf('KEEP whose')).slice(0,110));}}
 // rev 2: the flagged answer quoted with its label is read as bare (pkgKQG's test, same strip)
 {const src=code(PK,'Send Back Record'),src0=code(LV,'Send Back Record');const fnOf=s=>{const i=s.indexOf('function enf428Cure'),j=s.indexOf('\nfunction ',i+10);return new Function('const __acm4=()=>null;'+s.slice(i,j)+'\nreturn enf428Cure;')();};
  const R={CR3:'- **Job 14:1.** I grant it is said of all men. The phrase names the mother of every man, and no father is denied by it.'};const line='ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "x y z" -- ANSWER: "**Job 14:1.** I grant it is said of all men." -- MEETS';
  const a0=fnOf(src0)({rule:'E-ANS',line},{ans:'KEEP',why:'"I grant it is said of all men."'},R),a1=fnOf(src)({rule:'E-ANS',line},{ans:'KEEP',why:'"I grant it is said of all men."'},R);
  chk(a0.status==='CURED'&&a1.status==='UNCURED'&&/pkgKQG/.test(a1.why),'flagged answer quoted with its label: base '+a0.status+' (not read as bare), rev 2 '+a1.status+' (pkgKQG reason)');
  const a2=fnOf(src)({rule:'E-ANS',line},{ans:'KEEP',why:'"The phrase names the mother of every man, and no father"'},R);chk(a2.status==='CURED','the same item, KEEP quoting the reasoned sentence: '+a2.status);}
 // the other rows of the node are equal in the first case
 {const A=await all(LV,R0,K(CASES[0][2])),B=await all(PK,R0,K(CASES[0][2]));const d=A.filter((r,i)=>JSON.stringify({...r,at:0})!==JSON.stringify({...B[i],at:0}));chk(A.length===B.length&&d.length===1&&/Job 14:1/.test(d[0].item),'case 1: '+A.length+' rows, only the Job 14:1 row differs');
  const k=B.find(r=>r.seat==='chatgpt'&&/Job 14:1/.test(r.item));chk(['panel','reserve','alternate','single','synthesis'].includes(k.seat_role)&&k.kind==='send_back'&&k.cure_status==='UNCURED','row passes the table CHECKs: seat_role '+k.seat_role+', kind '+k.kind);fs.writeFileSync(__dirname+'/kbg_row.json',JSON.stringify(k));}
 // a flagged answer that is NOT bare: the new cut does not apply. Every stored KEEP row with a non-bare flagged answer is covered by the replay; here the code path is shown on a planted item.
 {const src=code(PK,'Send Back Record');const i=src.indexOf('function enf428Cure'),j=src.indexOf('\nfunction ',i+10);const f=new Function('const __acm4=()=>null;'+src.slice(i,j)+'\nreturn enf428Cure;')();const R={CR3:'Luke 2:4 "because he was of the house and lineage of David" I grant the registration names Joseph of Nazareth. Job 14:1 I grant it is said of all men, for the phrase names the mother and not the father.'};
  const line='ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "x y z" -- ANSWER: "I grant it is said of all men, for the phrase names the mother and not the father." -- MEETS';
  const r=f({rule:'E-ANS',line},{ans:'KEEP',why:'"I grant the registration names Joseph of Nazareth."'},R);chk(r.status==='CURED','flagged answer not bare: a KEEP quoting a bare grant is read as before (CURED): '+r.why.slice(0,90));
  const line2='ANSWER CHECK: Job 14:1 -- [CR3] -- MEANS: "x y z" -- ANSWER: "I grant it is said of all men." -- MEETS';const R2={CR3:R.CR3.replace(', for the phrase names the mother and not the father','')};
  const r2=f({rule:'E-ANS',line:line2},{ans:'KEEP',why:'"I grant the registration names Joseph of Nazareth."'},R2);chk(r2.status==='UNCURED'&&/pkgKBG/.test(r2.why),'the same KEEP with a bare flagged answer: UNCURED (pkgKBG)');}
 // nodes changed against live s94 and against the pkgKVQ base
 {const ch=(A,B)=>A.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B.nodes.find(z=>z.name===n.name))).map(n=>n.name);chk(ch(PK,LV).length===3&&ch(PK,S94).length===3&&JSON.stringify(PK.connections)===JSON.stringify(S94.connections)&&PK.nodes.length===418,'418 nodes; 3 changed against the pkgKVQ base and against live s94 ('+ch(PK,S94).join(', ')+'); connections equal');
  const fn=X=>{const s=code(X,'Send Back Record');const i=s.indexOf('function enf428Cure');return s.slice(i,s.indexOf('\nfunction ',i+10));};chk(['Alt Send Back Record','R2 Alt Send Back Record'].every(n=>{const s=code(PK,n);const i=s.indexOf('function enf428Cure');return s.slice(i,s.indexOf('\nfunction ',i+10))===fn(PK);}),'enf428Cure is the same text in the 3 nodes');
  chk(['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'].every(n=>code(PK,n).replace(fn(PK),'')===code(LV,n).replace(fn(LV),'')),'outside enf428Cure the 3 nodes equal the base');}
 console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);})();
